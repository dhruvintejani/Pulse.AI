import json
from collections.abc import AsyncIterator
from typing import Any
from beanie import PydanticObjectId
from pymongo import ASCENDING, DESCENDING
from app.core.config import settings
from app.core.errors import AppError
from app.models.chat import Chat, ChatStatus
from app.models.message import Message, MessageRole, MessageStatus
from app.models.user import User
from app.providers import ProviderMessage, ProviderRequest, provider_registry
from app.schemas.chat import (
    ChatStreamRequest,
    ConversationCreate,
    ConversationDetailResponse,
    ConversationRename,
    ConversationResponse,
    ConversationToggleResponse,
    ConversationUpdate,
    MessageCreate,
    MessageReactionUpdate,
    MessageResponse,
    MessageUpdate,
    RegenerateMessageRequest,
    TypingStatusResponse,
    TypingStatusUpdate,
)
from app.schemas.common import Page, PageMeta, PaginationParams
from app.services.typing_status import typing_status_service
from app.utils.datetime import utc_now


class ChatService:
    async def list_conversations(
        self,
        *,
        current_user: User,
        params: PaginationParams,
        pinned: bool | None = None,
        favorite: bool | None = None,
        status: ChatStatus | None = None,
    ) -> Page[ConversationResponse]:
        query = self._conversation_query(current_user, search=params.search, pinned=pinned, favorite=favorite, status=status)
        sort_field = params.sort_by if params.sort_by in {"created_at", "updated_at", "last_message_at", "title"} else "updated_at"
        sort_direction = DESCENDING if params.sort_direction == "desc" else ASCENDING

        total = await Chat.find(query).count()
        items = await Chat.find(query).sort((sort_field, sort_direction)).skip(params.skip).limit(params.size).to_list()

        return Page[ConversationResponse](
            items=[self.to_conversation_response(chat) for chat in items],
            meta=PageMeta(page=params.page, size=params.size, total=total),
        )

    async def create_conversation(self, *, current_user: User, request: ConversationCreate) -> ConversationDetailResponse:
        title = request.title or self._title_from_message(request.initial_message) or "New conversation"
        chat = Chat(
            owner_id=current_user.id,
            folder_id=self._optional_object_id(request.folder_id),
            title=title,
            model=request.model or settings.AI_DEFAULT_MODEL,
            tags=request.tags,
            metadata={**request.metadata, "provider": request.provider} if request.provider else request.metadata,
        )
        chat = await chat.insert()

        messages: list[MessageResponse] = []
        if request.initial_message:
            message = await self.create_message(
                current_user=current_user,
                conversation_id=str(chat.id),
                request=MessageCreate(content=request.initial_message, model=request.model),
            )
            messages.append(message)
            chat = await self.get_owned_chat(current_user=current_user, conversation_id=str(chat.id))

        response = self.to_conversation_response(chat)
        return ConversationDetailResponse(**response.model_dump(), messages=messages)

    async def get_conversation(self, *, current_user: User, conversation_id: str, include_messages: bool = True) -> ConversationDetailResponse:
        chat = await self.get_owned_chat(current_user=current_user, conversation_id=conversation_id)
        messages = []
        if include_messages:
            message_docs = await Message.find({"chat_id": chat.id, "is_deleted": False}).sort("created_at").to_list()
            messages = [self.to_message_response(message) for message in message_docs]
        response = self.to_conversation_response(chat)
        return ConversationDetailResponse(**response.model_dump(), messages=messages)

    async def update_conversation(self, *, current_user: User, conversation_id: str, request: ConversationUpdate) -> ConversationResponse:
        chat = await self.get_owned_chat(current_user=current_user, conversation_id=conversation_id)
        payload = request.model_dump(exclude_unset=True)

        if "folder_id" in payload:
            chat.folder_id = self._optional_object_id(request.folder_id)
        if request.title is not None:
            chat.title = request.title
        if request.summary is not None:
            chat.summary = request.summary
        if request.model is not None:
            chat.model = request.model
        if request.tags is not None:
            chat.tags = request.tags
        if request.status is not None:
            chat.status = request.status
        if request.metadata is not None:
            chat.metadata = request.metadata

        await chat.save()
        return self.to_conversation_response(chat)

    async def rename_conversation(self, *, current_user: User, conversation_id: str, request: ConversationRename) -> ConversationResponse:
        chat = await self.get_owned_chat(current_user=current_user, conversation_id=conversation_id)
        chat.title = request.title
        await chat.save()
        return self.to_conversation_response(chat)

    async def delete_conversation(self, *, current_user: User, conversation_id: str) -> None:
        chat = await self.get_owned_chat(current_user=current_user, conversation_id=conversation_id)
        await chat.soft_delete()
        messages = await Message.find({"chat_id": chat.id, "is_deleted": False}).to_list()
        for message in messages:
            await message.soft_delete()

    async def toggle_pinned(self, *, current_user: User, conversation_id: str) -> ConversationToggleResponse:
        chat = await self.get_owned_chat(current_user=current_user, conversation_id=conversation_id)
        chat.is_pinned = not chat.is_pinned
        await chat.save()
        return ConversationToggleResponse(id=str(chat.id), is_pinned=chat.is_pinned, is_favorite=chat.is_favorite)

    async def toggle_favorite(self, *, current_user: User, conversation_id: str) -> ConversationToggleResponse:
        chat = await self.get_owned_chat(current_user=current_user, conversation_id=conversation_id)
        chat.is_favorite = not chat.is_favorite
        await chat.save()
        return ConversationToggleResponse(id=str(chat.id), is_pinned=chat.is_pinned, is_favorite=chat.is_favorite)

    async def list_messages(self, *, current_user: User, conversation_id: str, params: PaginationParams) -> Page[MessageResponse]:
        chat = await self.get_owned_chat(current_user=current_user, conversation_id=conversation_id)
        query: dict[str, Any] = {"chat_id": chat.id, "is_deleted": False}
        if params.search:
            query["$or"] = [
                {"content": {"$regex": params.search, "$options": "i"}},
                {"content_preview": {"$regex": params.search, "$options": "i"}},
            ]

        total = await Message.find(query).count()
        items = await Message.find(query).sort("created_at").skip(params.skip).limit(params.size).to_list()
        return Page[MessageResponse](
            items=[self.to_message_response(message) for message in items],
            meta=PageMeta(page=params.page, size=params.size, total=total),
        )

    async def create_message(self, *, current_user: User, conversation_id: str, request: MessageCreate) -> MessageResponse:
        chat = await self.get_owned_chat(current_user=current_user, conversation_id=conversation_id)
        message = Message(
            chat_id=chat.id,
            user_id=current_user.id if request.role == MessageRole.USER else None,
            parent_message_id=self._optional_object_id(request.parent_message_id),
            role=request.role,
            status=MessageStatus.COMPLETED,
            content=request.content,
            content_preview=self._preview(request.content),
            model=request.model or chat.model,
            token_count=self._estimate_tokens(request.content),
            attachments=request.attachments,
            metadata=request.metadata,
        )
        message = await message.insert()
        await self._touch_chat_after_message(chat)
        return self.to_message_response(message)

    async def get_message(self, *, current_user: User, conversation_id: str, message_id: str) -> MessageResponse:
        chat = await self.get_owned_chat(current_user=current_user, conversation_id=conversation_id)
        message = await self._get_message(chat_id=chat.id, message_id=message_id)
        return self.to_message_response(message)

    async def update_message(self, *, current_user: User, conversation_id: str, message_id: str, request: MessageUpdate) -> MessageResponse:
        chat = await self.get_owned_chat(current_user=current_user, conversation_id=conversation_id)
        message = await self._get_message(chat_id=chat.id, message_id=message_id)

        if request.content is not None:
            message.content = request.content
            message.content_preview = self._preview(request.content)
            message.token_count = self._estimate_tokens(request.content)
        if request.status is not None:
            message.status = request.status
        if request.reaction is not None:
            message.reaction = request.reaction
        if request.metadata is not None:
            message.metadata = request.metadata

        await message.save()
        return self.to_message_response(message)

    async def update_reaction(self, *, current_user: User, conversation_id: str, message_id: str, request: MessageReactionUpdate) -> MessageResponse:
        chat = await self.get_owned_chat(current_user=current_user, conversation_id=conversation_id)
        message = await self._get_message(chat_id=chat.id, message_id=message_id)
        message.reaction = request.reaction
        await message.save()
        return self.to_message_response(message)

    async def delete_message(self, *, current_user: User, conversation_id: str, message_id: str) -> None:
        chat = await self.get_owned_chat(current_user=current_user, conversation_id=conversation_id)
        message = await self._get_message(chat_id=chat.id, message_id=message_id)
        await message.soft_delete()
        chat.message_count = max(0, chat.message_count - 1)
        await chat.save()

    async def regenerate_message(
        self,
        *,
        current_user: User,
        conversation_id: str,
        message_id: str,
        request: RegenerateMessageRequest,
    ) -> MessageResponse:
        chat = await self.get_owned_chat(current_user=current_user, conversation_id=conversation_id)
        original = await self._get_message(chat_id=chat.id, message_id=message_id)
        history = await self._provider_history(chat)
        if request.instructions:
            history.append(ProviderMessage(role="user", content=request.instructions))

        provider = provider_registry.get(request.provider)
        content = ""
        async for chunk in provider.stream(ProviderRequest(messages=history, model=request.model or chat.model, metadata={"regenerate": True})):
            content += chunk

        message = Message(
            chat_id=chat.id,
            user_id=None,
            parent_message_id=original.id,
            role=MessageRole.ASSISTANT,
            status=MessageStatus.COMPLETED,
            content=content.strip(),
            content_preview=self._preview(content),
            model=request.model or chat.model,
            token_count=self._estimate_tokens(content),
            metadata={"provider": provider.name, "regenerated_from": str(original.id)},
        )
        message = await message.insert()
        await self._touch_chat_after_message(chat)
        return self.to_message_response(message)

    async def stream_chat_response(
        self,
        *,
        current_user: User,
        conversation_id: str,
        request: ChatStreamRequest,
    ) -> AsyncIterator[str]:
        chat = await self.get_owned_chat(current_user=current_user, conversation_id=conversation_id)
        user_message = Message(
            chat_id=chat.id,
            user_id=current_user.id,
            role=MessageRole.USER,
            status=MessageStatus.COMPLETED,
            content=request.content,
            content_preview=self._preview(request.content),
            model=request.model or chat.model,
            token_count=self._estimate_tokens(request.content),
            attachments=request.attachments,
            metadata=request.metadata,
        )
        user_message = await user_message.insert()

        assistant_message = Message(
            chat_id=chat.id,
            user_id=None,
            role=MessageRole.ASSISTANT,
            status=MessageStatus.STREAMING,
            content="",
            content_preview="",
            model=request.model or chat.model,
            token_count=0,
            metadata={"provider": request.provider or settings.AI_DEFAULT_PROVIDER},
        )
        assistant_message = await assistant_message.insert()
        await self._touch_chat_after_message(chat)

        yield self._sse("message", {"type": "message_created", "user_message_id": str(user_message.id), "assistant_message_id": str(assistant_message.id)})

        provider = provider_registry.get(request.provider)
        history = await self._provider_history(chat)
        history.append(ProviderMessage(role="user", content=request.content))

        collected = ""
        try:
            async for chunk in provider.stream(ProviderRequest(messages=history, model=request.model or chat.model, metadata=request.metadata)):
                collected += chunk
                yield self._sse("token", {"type": "token", "token": chunk})

            assistant_message.content = collected.strip()
            assistant_message.content_preview = self._preview(collected)
            assistant_message.token_count = self._estimate_tokens(collected)
            assistant_message.status = MessageStatus.COMPLETED
            assistant_message.metadata = {**assistant_message.metadata, "provider": provider.name}
            await assistant_message.save()
            await self._touch_chat_after_message(chat)
            yield self._sse("done", {"type": "done", "message_id": str(assistant_message.id)})
        except Exception as exc:
            assistant_message.status = MessageStatus.FAILED
            assistant_message.metadata = {**assistant_message.metadata, "error": str(exc)}
            await assistant_message.save()
            yield self._sse("error", {"type": "error", "message": str(exc)})

    async def set_typing_status(self, *, current_user: User, conversation_id: str, request: TypingStatusUpdate) -> TypingStatusResponse:
        await self.get_owned_chat(current_user=current_user, conversation_id=conversation_id)
        state = typing_status_service.set_status(
            conversation_id=conversation_id,
            user_id=str(current_user.id),
            source=request.source,
            is_typing=request.is_typing,
        )
        return TypingStatusResponse(**state.__dict__)

    async def get_typing_status(self, *, current_user: User, conversation_id: str, source: str = "user") -> TypingStatusResponse:
        await self.get_owned_chat(current_user=current_user, conversation_id=conversation_id)
        state = typing_status_service.get_status(conversation_id=conversation_id, user_id=str(current_user.id), source=source)
        return TypingStatusResponse(**state.__dict__)

    async def get_owned_chat(self, *, current_user: User, conversation_id: str) -> Chat:
        chat_id = self._object_id(conversation_id)
        chat = await Chat.find_one({"_id": chat_id, "owner_id": current_user.id, "is_deleted": False})
        if chat is None:
            raise AppError("Conversation not found", status_code=404, error_code="CONVERSATION_NOT_FOUND")
        return chat

    async def _get_message(self, *, chat_id: PydanticObjectId, message_id: str) -> Message:
        message = await Message.find_one({"_id": self._object_id(message_id), "chat_id": chat_id, "is_deleted": False})
        if message is None:
            raise AppError("Message not found", status_code=404, error_code="MESSAGE_NOT_FOUND")
        return message

    async def _provider_history(self, chat: Chat, limit: int = 30) -> list[ProviderMessage]:
        messages = await Message.find({"chat_id": chat.id, "is_deleted": False}).sort("-created_at").limit(limit).to_list()
        return [ProviderMessage(role=message.role.value, content=message.content) for message in reversed(messages) if message.content]

    async def _touch_chat_after_message(self, chat: Chat) -> None:
        chat.message_count = await Message.find({"chat_id": chat.id, "is_deleted": False}).count()
        chat.last_message_at = utc_now()
        chat.updated_at = utc_now()
        await chat.save()

    def _conversation_query(
        self,
        current_user: User,
        *,
        search: str | None = None,
        pinned: bool | None = None,
        favorite: bool | None = None,
        status: ChatStatus | None = None,
    ) -> dict[str, Any]:
        query: dict[str, Any] = {"owner_id": current_user.id, "is_deleted": False}
        if pinned is not None:
            query["is_pinned"] = pinned
        if favorite is not None:
            query["is_favorite"] = favorite
        if status is not None:
            query["status"] = status
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"summary": {"$regex": search, "$options": "i"}},
                {"tags": {"$regex": search, "$options": "i"}},
            ]
        return query

    def to_conversation_response(self, chat: Chat) -> ConversationResponse:
        return ConversationResponse(
            id=str(chat.id),
            owner_id=str(chat.owner_id),
            folder_id=str(chat.folder_id) if chat.folder_id else None,
            title=chat.title,
            summary=chat.summary,
            status=chat.status,
            model=chat.model,
            tags=chat.tags,
            is_pinned=chat.is_pinned,
            is_favorite=chat.is_favorite,
            message_count=chat.message_count,
            last_message_at=chat.last_message_at,
            created_at=chat.created_at,
            updated_at=chat.updated_at,
        )

    def to_message_response(self, message: Message) -> MessageResponse:
        return MessageResponse(
            id=str(message.id),
            chat_id=str(message.chat_id),
            user_id=str(message.user_id) if message.user_id else None,
            parent_message_id=str(message.parent_message_id) if message.parent_message_id else None,
            role=message.role,
            status=message.status,
            content=message.content,
            content_preview=message.content_preview,
            model=message.model,
            token_count=message.token_count,
            reaction=message.reaction,
            attachments=message.attachments,
            created_at=message.created_at,
            updated_at=message.updated_at,
        )

    @staticmethod
    def _object_id(value: str) -> PydanticObjectId:
        try:
            return PydanticObjectId(value)
        except Exception as exc:
            raise AppError("Invalid object id", status_code=422, error_code="INVALID_OBJECT_ID", details={"id": value}) from exc

    def _optional_object_id(self, value: str | None) -> PydanticObjectId | None:
        if value is None:
            return None
        return self._object_id(value)

    @staticmethod
    def _preview(content: str, limit: int = 500) -> str:
        normalized = " ".join(content.split())
        return normalized[:limit]

    @staticmethod
    def _title_from_message(content: str | None) -> str | None:
        if not content:
            return None
        title = " ".join(content.split())[:80]
        return title or None

    @staticmethod
    def _estimate_tokens(content: str) -> int:
        return max(1, len(content.split())) if content else 0

    @staticmethod
    def _sse(event: str, data: dict[str, Any]) -> str:
        return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"


chat_service = ChatService()

from fastapi import APIRouter, Depends, Query, Response, status
from fastapi.responses import StreamingResponse
from app.dependencies import get_current_user, get_pagination_params
from app.models.chat import ChatStatus
from app.models.user import User
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
from app.schemas.common import Page, PaginationParams, SuccessResponse
from app.services import chat_service

router = APIRouter(prefix="/conversations")


@router.get("", response_model=Page[ConversationResponse])
async def list_conversations(
    pinned: bool | None = Query(default=None),
    favorite: bool | None = Query(default=None),
    status_filter: ChatStatus | None = Query(default=None, alias="status"),
    params: PaginationParams = Depends(get_pagination_params),
    current_user: User = Depends(get_current_user),
) -> Page[ConversationResponse]:
    return await chat_service.list_conversations(
        current_user=current_user,
        params=params,
        pinned=pinned,
        favorite=favorite,
        status=status_filter,
    )


@router.post("", response_model=ConversationDetailResponse, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    request: ConversationCreate,
    current_user: User = Depends(get_current_user),
) -> ConversationDetailResponse:
    return await chat_service.create_conversation(current_user=current_user, request=request)


@router.get("/{conversation_id}", response_model=ConversationDetailResponse)
async def get_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user),
) -> ConversationDetailResponse:
    return await chat_service.get_conversation(current_user=current_user, conversation_id=conversation_id)


@router.patch("/{conversation_id}", response_model=ConversationResponse)
async def update_conversation(
    conversation_id: str,
    request: ConversationUpdate,
    current_user: User = Depends(get_current_user),
) -> ConversationResponse:
    return await chat_service.update_conversation(current_user=current_user, conversation_id=conversation_id, request=request)


@router.delete("/{conversation_id}", response_model=SuccessResponse)
async def delete_conversation(
    conversation_id: str,
    response: Response,
    current_user: User = Depends(get_current_user),
) -> SuccessResponse:
    await chat_service.delete_conversation(current_user=current_user, conversation_id=conversation_id)
    response.status_code = status.HTTP_200_OK
    return SuccessResponse(message="Conversation deleted")


@router.patch("/{conversation_id}/rename", response_model=ConversationResponse)
async def rename_conversation(
    conversation_id: str,
    request: ConversationRename,
    current_user: User = Depends(get_current_user),
) -> ConversationResponse:
    return await chat_service.rename_conversation(current_user=current_user, conversation_id=conversation_id, request=request)


@router.patch("/{conversation_id}/pin", response_model=ConversationToggleResponse)
async def toggle_pinned_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user),
) -> ConversationToggleResponse:
    return await chat_service.toggle_pinned(current_user=current_user, conversation_id=conversation_id)


@router.patch("/{conversation_id}/favorite", response_model=ConversationToggleResponse)
async def toggle_favorite_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user),
) -> ConversationToggleResponse:
    return await chat_service.toggle_favorite(current_user=current_user, conversation_id=conversation_id)


@router.get("/{conversation_id}/messages", response_model=Page[MessageResponse])
async def list_messages(
    conversation_id: str,
    params: PaginationParams = Depends(get_pagination_params),
    current_user: User = Depends(get_current_user),
) -> Page[MessageResponse]:
    return await chat_service.list_messages(current_user=current_user, conversation_id=conversation_id, params=params)


@router.post("/{conversation_id}/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def create_message(
    conversation_id: str,
    request: MessageCreate,
    current_user: User = Depends(get_current_user),
) -> MessageResponse:
    return await chat_service.create_message(current_user=current_user, conversation_id=conversation_id, request=request)


@router.get("/{conversation_id}/messages/{message_id}", response_model=MessageResponse)
async def get_message(
    conversation_id: str,
    message_id: str,
    current_user: User = Depends(get_current_user),
) -> MessageResponse:
    return await chat_service.get_message(current_user=current_user, conversation_id=conversation_id, message_id=message_id)


@router.patch("/{conversation_id}/messages/{message_id}", response_model=MessageResponse)
async def update_message(
    conversation_id: str,
    message_id: str,
    request: MessageUpdate,
    current_user: User = Depends(get_current_user),
) -> MessageResponse:
    return await chat_service.update_message(current_user=current_user, conversation_id=conversation_id, message_id=message_id, request=request)


@router.delete("/{conversation_id}/messages/{message_id}", response_model=SuccessResponse)
async def delete_message(
    conversation_id: str,
    message_id: str,
    current_user: User = Depends(get_current_user),
) -> SuccessResponse:
    await chat_service.delete_message(current_user=current_user, conversation_id=conversation_id, message_id=message_id)
    return SuccessResponse(message="Message deleted")


@router.patch("/{conversation_id}/messages/{message_id}/reaction", response_model=MessageResponse)
async def update_message_reaction(
    conversation_id: str,
    message_id: str,
    request: MessageReactionUpdate,
    current_user: User = Depends(get_current_user),
) -> MessageResponse:
    return await chat_service.update_reaction(current_user=current_user, conversation_id=conversation_id, message_id=message_id, request=request)


@router.post("/{conversation_id}/messages/{message_id}/regenerate", response_model=MessageResponse)
async def regenerate_message(
    conversation_id: str,
    message_id: str,
    request: RegenerateMessageRequest | None = None,
    current_user: User = Depends(get_current_user),
) -> MessageResponse:
    return await chat_service.regenerate_message(
        current_user=current_user,
        conversation_id=conversation_id,
        message_id=message_id,
        request=request or RegenerateMessageRequest(),
    )


@router.post("/{conversation_id}/stream")
async def stream_chat_response(
    conversation_id: str,
    request: ChatStreamRequest,
    current_user: User = Depends(get_current_user),
) -> StreamingResponse:
    async def event_stream():
        async for event in chat_service.stream_chat_response(current_user=current_user, conversation_id=conversation_id, request=request):
            yield event

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@router.get("/{conversation_id}/typing", response_model=TypingStatusResponse)
async def get_typing_status(
    conversation_id: str,
    source: str = Query(default="user", pattern="^(user|assistant)$"),
    current_user: User = Depends(get_current_user),
) -> TypingStatusResponse:
    return await chat_service.get_typing_status(current_user=current_user, conversation_id=conversation_id, source=source)


@router.post("/{conversation_id}/typing", response_model=TypingStatusResponse)
async def set_typing_status(
    conversation_id: str,
    request: TypingStatusUpdate,
    current_user: User = Depends(get_current_user),
) -> TypingStatusResponse:
    return await chat_service.set_typing_status(current_user=current_user, conversation_id=conversation_id, request=request)

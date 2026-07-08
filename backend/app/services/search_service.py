import re
from typing import Any
from app.models.chat import Chat
from app.models.document import Document
from app.models.message import Message
from app.models.settings import UserSettings
from app.models.user import User, UserRole
from app.schemas.search import GlobalSearchResponse, GlobalSearchResult, SearchEntityType, SearchHighlight
from app.services.settings_service import settings_service


SEARCH_FILTERS: list[SearchEntityType] = ["chat", "message", "document", "user", "setting"]


class GlobalSearchService:
    async def search(
        self,
        *,
        current_user: User,
        query: str,
        page: int = 1,
        size: int = 10,
        filters: list[SearchEntityType] | None = None,
    ) -> GlobalSearchResponse:
        normalized_query = " ".join(query.strip().split())
        active_filters = filters or SEARCH_FILTERS
        safe_page = max(page, 1)
        safe_size = min(max(size, 1), 50)

        if not normalized_query:
            recent = await settings_service.recent_searches(current_user=current_user)
            return GlobalSearchResponse(
                query="",
                filters=active_filters,
                items=[],
                page=safe_page,
                size=safe_size,
                total=0,
                has_next=False,
                recent_searches=recent.items,
            )

        escaped = re.escape(normalized_query)
        results: list[GlobalSearchResult] = []

        if "chat" in active_filters:
            results.extend(await self._search_chats(current_user=current_user, query=normalized_query, escaped=escaped))
        if "message" in active_filters:
            results.extend(await self._search_messages(current_user=current_user, query=normalized_query, escaped=escaped))
        if "document" in active_filters:
            results.extend(await self._search_documents(current_user=current_user, query=normalized_query, escaped=escaped))
        if "user" in active_filters:
            results.extend(await self._search_users(current_user=current_user, query=normalized_query, escaped=escaped))
        if "setting" in active_filters:
            results.extend(await self._search_settings(current_user=current_user, query=normalized_query))

        results.sort(key=lambda item: (item.score, item.updated_at or current_user.updated_at), reverse=True)
        total = len(results)
        start = (safe_page - 1) * safe_size
        end = start + safe_size
        recent = await settings_service.add_recent_search(current_user=current_user, query=normalized_query)

        return GlobalSearchResponse(
            query=normalized_query,
            filters=active_filters,
            items=results[start:end],
            page=safe_page,
            size=safe_size,
            total=total,
            has_next=end < total,
            recent_searches=recent.items,
        )

    async def _search_chats(self, *, current_user: User, query: str, escaped: str) -> list[GlobalSearchResult]:
        documents = await Chat.find({
            "owner_id": current_user.id,
            "is_deleted": False,
            "$or": [
                {"title": {"$regex": escaped, "$options": "i"}},
                {"summary": {"$regex": escaped, "$options": "i"}},
                {"tags": {"$regex": escaped, "$options": "i"}},
            ],
        }).limit(30).to_list()

        return [
            GlobalSearchResult(
                id=str(chat.id),
                type="chat",
                title=chat.title,
                description=chat.summary,
                url="/dashboard/chat",
                score=self._score(query, chat.title, chat.summary, " ".join(chat.tags)),
                highlights=self._highlights(query, {"title": chat.title, "summary": chat.summary or "", "tags": " ".join(chat.tags)}),
                metadata={"message_count": chat.message_count, "is_pinned": chat.is_pinned, "is_favorite": chat.is_favorite},
                updated_at=chat.updated_at,
            )
            for chat in documents
        ]

    async def _search_messages(self, *, current_user: User, query: str, escaped: str) -> list[GlobalSearchResult]:
        chats = await Chat.find({"owner_id": current_user.id, "is_deleted": False}).to_list()
        chat_ids = [chat.id for chat in chats]
        chat_titles = {chat.id: chat.title for chat in chats}
        if not chat_ids:
            return []

        messages = await Message.find({
            "chat_id": {"$in": chat_ids},
            "is_deleted": False,
            "$or": [
                {"content": {"$regex": escaped, "$options": "i"}},
                {"content_preview": {"$regex": escaped, "$options": "i"}},
            ],
        }).limit(40).to_list()

        return [
            GlobalSearchResult(
                id=str(message.id),
                type="message",
                title=chat_titles.get(message.chat_id, "Chat message"),
                description=message.content_preview or message.content[:240],
                url="/dashboard/chat",
                score=self._score(query, message.content_preview, message.content),
                highlights=self._highlights(query, {"message": message.content_preview or message.content}),
                metadata={"chat_id": str(message.chat_id), "role": message.role.value, "tokens": message.token_count},
                updated_at=message.updated_at,
            )
            for message in messages
        ]

    async def _search_documents(self, *, current_user: User, query: str, escaped: str) -> list[GlobalSearchResult]:
        documents = await Document.find({
            "owner_id": current_user.id,
            "is_deleted": False,
            "$or": [
                {"title": {"$regex": escaped, "$options": "i"}},
                {"file_name": {"$regex": escaped, "$options": "i"}},
                {"category": {"$regex": escaped, "$options": "i"}},
                {"tags": {"$regex": escaped, "$options": "i"}},
                {"preview_text": {"$regex": escaped, "$options": "i"}},
                {"extracted_text": {"$regex": escaped, "$options": "i"}},
            ],
        }).limit(30).to_list()

        return [
            GlobalSearchResult(
                id=str(document.id),
                type="document",
                title=document.title,
                description=document.preview_text or document.description or document.file_name,
                url="/dashboard/documents",
                score=self._score(query, document.title, document.file_name, document.category, " ".join(document.tags), document.preview_text),
                highlights=self._highlights(query, {"title": document.title, "file": document.file_name, "preview": document.preview_text or "", "tags": " ".join(document.tags)}),
                metadata={"kind": document.kind.value, "category": document.category, "status": document.status.value, "file_size": document.file_size},
                updated_at=document.updated_at,
            )
            for document in documents
        ]

    async def _search_users(self, *, current_user: User, query: str, escaped: str) -> list[GlobalSearchResult]:
        base_query: dict[str, Any] = {"is_deleted": False}
        if current_user.role not in {UserRole.OWNER, UserRole.ADMIN}:
            base_query["_id"] = current_user.id
        base_query["$or"] = [
            {"full_name": {"$regex": escaped, "$options": "i"}},
            {"email": {"$regex": escaped, "$options": "i"}},
            {"username": {"$regex": escaped, "$options": "i"}},
            {"company": {"$regex": escaped, "$options": "i"}},
            {"location": {"$regex": escaped, "$options": "i"}},
        ]
        users = await User.find(base_query).limit(25).to_list()

        return [
            GlobalSearchResult(
                id=str(user.id),
                type="user",
                title=user.full_name,
                description=user.email,
                url="/dashboard/profile" if user.id == current_user.id else "/dashboard/admin",
                score=self._score(query, user.full_name, user.email, user.username, user.company, user.location),
                highlights=self._highlights(query, {"name": user.full_name, "email": user.email or "", "company": user.company or "", "location": user.location or ""}),
                metadata={"role": user.role.value, "status": user.status.value},
                updated_at=user.updated_at,
            )
            for user in users
        ]

    async def _search_settings(self, *, current_user: User, query: str) -> list[GlobalSearchResult]:
        settings = await settings_service.get_or_create(current_user=current_user)
        searchable = {
            "theme": settings.theme.value,
            "language": settings.language,
            "timezone": settings.timezone,
            "notifications": settings.notification_preferences,
            "profile": settings.profile_settings,
            "privacy": settings.privacy_settings,
            "security": settings.security_settings,
            "appearance": settings.appearance_settings,
        }
        results: list[GlobalSearchResult] = []
        for field, value in searchable.items():
            value_text = self._flatten(value)
            if query.lower() not in value_text.lower() and query.lower() not in field.lower():
                continue
            results.append(
                GlobalSearchResult(
                    id=f"settings:{field}",
                    type="setting",
                    title=f"Settings · {field.title()}",
                    description=value_text[:240],
                    url="/dashboard/settings",
                    score=self._score(query, field, value_text),
                    highlights=self._highlights(query, {field: value_text}),
                    metadata={"field": field},
                    updated_at=settings.updated_at,
                )
            )
        return results

    @staticmethod
    def _flatten(value: Any) -> str:
        if isinstance(value, dict):
            return " ".join(f"{key} {GlobalSearchService._flatten(item)}" for key, item in value.items())
        if isinstance(value, list):
            return " ".join(GlobalSearchService._flatten(item) for item in value)
        return "" if value is None else str(value)

    @staticmethod
    def _score(query: str, *values: str | None) -> float:
        lowered_query = query.lower()
        score = 0.0
        for index, value in enumerate(values):
            text = (value or "").lower()
            if not text:
                continue
            if text == lowered_query:
                score += 100 - index
            elif text.startswith(lowered_query):
                score += 60 - index
            elif lowered_query in text:
                score += 30 - index
        return max(score, 1)

    @staticmethod
    def _highlights(query: str, fields: dict[str, str]) -> list[SearchHighlight]:
        highlights: list[SearchHighlight] = []
        pattern = re.compile(re.escape(query), re.IGNORECASE)
        for field, value in fields.items():
            if not value:
                continue
            match = pattern.search(value)
            if not match:
                continue
            start = max(match.start() - 48, 0)
            end = min(match.end() + 72, len(value))
            snippet = value[start:end]
            snippet = pattern.sub(lambda item: f"<mark>{item.group(0)}</mark>", snippet)
            highlights.append(SearchHighlight(field=field, snippet=snippet))
        return highlights[:3]


global_search_service = GlobalSearchService()

import re
from datetime import timedelta
from typing import Any
from app.models.chat import Chat
from app.models.document import Document, DocumentKind
from app.models.message import Message, MessageRole
from app.models.notification import Notification, NotificationStatus, NotificationType
from app.models.user import User
from app.schemas.common import Page, PageMeta, PaginationParams
from app.schemas.dashboard import (
    AIUsagePoint,
    AIUsageResponse,
    ActivityTimelineItem,
    ChartPoint,
    ChartSeriesResponse,
    DashboardChartsResponse,
    DashboardMetric,
    DashboardNotificationResponse,
    DashboardOverviewResponse,
    DashboardSearchResponse,
    DashboardSearchResult,
    RecentChatResponse,
    RecentDocumentResponse,
    UserStatisticsResponse,
)
from app.utils.datetime import utc_now


class DashboardService:
    async def overview(self, *, current_user: User) -> DashboardOverviewResponse:
        stats = await self.user_statistics(current_user=current_user)
        recent_chats = await self.recent_chats(current_user=current_user, limit=5)
        recent_documents = await self.recent_documents(current_user=current_user, limit=5)

        return DashboardOverviewResponse(
            metrics=[
                DashboardMetric(key="total_chats", label="Total chats", value=stats.total_chats),
                DashboardMetric(key="total_messages", label="Total messages", value=stats.total_messages),
                DashboardMetric(key="total_documents", label="Documents", value=stats.total_documents),
                DashboardMetric(key="total_tokens", label="AI tokens", value=stats.total_tokens),
            ],
            recent_chats=recent_chats,
            recent_documents=recent_documents,
            unread_notifications=stats.unread_notifications,
        )

    async def recent_chats(
        self,
        *,
        current_user: User,
        limit: int = 8,
        search: str | None = None,
        pinned: bool | None = None,
        favorite: bool | None = None,
    ) -> list[RecentChatResponse]:
        query = self._chat_query(current_user=current_user, search=search, pinned=pinned, favorite=favorite)
        safe_limit = min(max(limit, 1), 50)
        chats = await Chat.find(query).sort("-updated_at").limit(safe_limit).to_list()
        return [self.to_recent_chat(chat) for chat in chats]

    async def recent_documents(
        self,
        *,
        current_user: User,
        limit: int = 8,
        search: str | None = None,
        category: str | None = None,
        kind: DocumentKind | None = None,
        tags: list[str] | None = None,
    ) -> list[RecentDocumentResponse]:
        query = self._document_query(current_user=current_user, search=search, category=category, kind=kind, tags=tags)
        safe_limit = min(max(limit, 1), 50)
        documents = await Document.find(query).sort("-updated_at").limit(safe_limit).to_list()
        return [self.to_recent_document(document) for document in documents]

    async def user_statistics(self, *, current_user: User) -> UserStatisticsResponse:
        chats = await Chat.find({"owner_id": current_user.id, "is_deleted": False}).to_list()
        chat_ids = [chat.id for chat in chats]
        documents = await Document.find({"owner_id": current_user.id, "is_deleted": False}).to_list()
        notifications = await Notification.find({"user_id": current_user.id, "is_deleted": False}).to_list()
        messages = await self._messages_for_chat_ids(chat_ids)

        documents_by_kind: dict[str, int] = {}
        for document in documents:
            documents_by_kind[document.kind.value] = documents_by_kind.get(document.kind.value, 0) + 1

        return UserStatisticsResponse(
            user_id=str(current_user.id),
            total_chats=len(chats),
            total_messages=len(messages),
            total_documents=len(documents),
            total_notifications=len(notifications),
            unread_notifications=sum(1 for notification in notifications if notification.status == NotificationStatus.UNREAD),
            total_tokens=sum(message.token_count for message in messages),
            favorite_chats=sum(1 for chat in chats if chat.is_favorite),
            pinned_chats=sum(1 for chat in chats if chat.is_pinned),
            documents_by_kind=documents_by_kind,
        )

    async def ai_usage(self, *, current_user: User, days: int = 14) -> AIUsageResponse:
        safe_days = min(max(days, 1), 90)
        chats = await Chat.find({"owner_id": current_user.id, "is_deleted": False}).to_list()
        messages = await self._messages_for_chat_ids([chat.id for chat in chats])
        start_date = (utc_now() - timedelta(days=safe_days - 1)).date()
        buckets: dict[str, AIUsagePoint] = {}

        for offset in range(safe_days):
            label = (start_date + timedelta(days=offset)).isoformat()
            buckets[label] = AIUsagePoint(date=label, requests=0, tokens=0, user_messages=0, assistant_messages=0)

        for message in messages:
            label = message.created_at.date().isoformat()
            if label not in buckets:
                continue
            point = buckets[label]
            point.requests += 1
            point.tokens += message.token_count
            if message.role == MessageRole.USER:
                point.user_messages += 1
            elif message.role == MessageRole.ASSISTANT:
                point.assistant_messages += 1

        points = list(buckets.values())
        total_requests = sum(point.requests for point in points)
        total_tokens = sum(point.tokens for point in points)

        return AIUsageResponse(
            total_requests=total_requests,
            total_tokens=total_tokens,
            average_tokens_per_request=round(total_tokens / total_requests, 2) if total_requests else 0,
            points=points,
        )

    async def notifications(
        self,
        *,
        current_user: User,
        params: PaginationParams,
        status: NotificationStatus | None = None,
        type_filter: NotificationType | None = None,
    ) -> Page[DashboardNotificationResponse]:
        query = self._notification_query(current_user=current_user, search=params.search, status=status, type_filter=type_filter)
        sort_field = params.sort_by if params.sort_by in {"created_at", "updated_at", "status", "type"} else "created_at"
        sort_clause = f"-{sort_field}" if params.sort_direction == "desc" else sort_field
        total = await Notification.find(query).count()
        notifications = await Notification.find(query).sort(sort_clause).skip(params.skip).limit(params.size).to_list()

        return Page[DashboardNotificationResponse](
            items=[self.to_notification_response(notification) for notification in notifications],
            meta=PageMeta(page=params.page, size=params.size, total=total),
        )

    async def activity_timeline(
        self,
        *,
        current_user: User,
        params: PaginationParams,
        type_filter: str | None = None,
    ) -> Page[ActivityTimelineItem]:
        chats = await Chat.find({"owner_id": current_user.id, "is_deleted": False}).sort("-updated_at").limit(100).to_list()
        documents = await Document.find({"owner_id": current_user.id, "is_deleted": False}).sort("-updated_at").limit(100).to_list()
        notifications = await Notification.find({"user_id": current_user.id, "is_deleted": False}).sort("-created_at").limit(100).to_list()
        messages = await self._messages_for_chat_ids([chat.id for chat in chats], limit=100)

        items: list[ActivityTimelineItem] = []
        if type_filter in {None, "chat"}:
            items.extend(
                ActivityTimelineItem(
                    id=f"chat:{chat.id}",
                    type="chat",
                    title=chat.title,
                    description=chat.summary,
                    entity_id=str(chat.id),
                    entity_type="chat",
                    created_at=chat.updated_at,
                    metadata={"message_count": chat.message_count, "is_pinned": chat.is_pinned, "is_favorite": chat.is_favorite},
                )
                for chat in chats
            )
        if type_filter in {None, "document"}:
            items.extend(
                ActivityTimelineItem(
                    id=f"document:{document.id}",
                    type="document",
                    title=document.title,
                    description=document.file_name,
                    entity_id=str(document.id),
                    entity_type="document",
                    created_at=document.updated_at,
                    metadata={"kind": document.kind.value, "category": document.category, "file_size": document.file_size},
                )
                for document in documents
            )
        if type_filter in {None, "notification"}:
            items.extend(
                ActivityTimelineItem(
                    id=f"notification:{notification.id}",
                    type="notification",
                    title=notification.title,
                    description=notification.message,
                    entity_id=str(notification.id),
                    entity_type="notification",
                    created_at=notification.created_at,
                    metadata={"status": notification.status.value, "type": notification.type.value},
                )
                for notification in notifications
            )
        if type_filter in {None, "message"}:
            items.extend(
                ActivityTimelineItem(
                    id=f"message:{message.id}",
                    type="message",
                    title="Chat message",
                    description=message.content_preview or message.content[:160],
                    entity_id=str(message.id),
                    entity_type="message",
                    created_at=message.created_at,
                    metadata={"chat_id": str(message.chat_id), "role": message.role.value, "tokens": message.token_count},
                )
                for message in messages
            )

        if params.search:
            pattern = params.search.lower()
            items = [item for item in items if pattern in item.title.lower() or (item.description and pattern in item.description.lower())]

        items.sort(key=lambda item: item.created_at, reverse=params.sort_direction == "desc")
        return self._paginate(items, params)

    async def charts(self, *, current_user: User, days: int = 14) -> DashboardChartsResponse:
        usage = await self.ai_usage(current_user=current_user, days=days)
        documents = await Document.find({"owner_id": current_user.id, "is_deleted": False}).to_list()
        notifications = await Notification.find({"user_id": current_user.id, "is_deleted": False}).to_list()

        document_kind_counts: dict[str, int] = {}
        for document in documents:
            document_kind_counts[document.kind.value] = document_kind_counts.get(document.kind.value, 0) + 1

        notification_counts: dict[str, int] = {}
        for notification in notifications:
            notification_counts[notification.status.value] = notification_counts.get(notification.status.value, 0) + 1

        return DashboardChartsResponse(
            charts=[
                ChartSeriesResponse(
                    key="ai_requests",
                    title="AI requests",
                    type="line",
                    points=[ChartPoint(label=point.date, value=point.requests, extra={"tokens": point.tokens}) for point in usage.points],
                ),
                ChartSeriesResponse(
                    key="tokens_used",
                    title="Tokens used",
                    type="area",
                    points=[ChartPoint(label=point.date, value=point.tokens, extra={"requests": point.requests}) for point in usage.points],
                ),
                ChartSeriesResponse(
                    key="documents_by_kind",
                    title="Documents by type",
                    type="pie",
                    points=[ChartPoint(label=key, value=value) for key, value in sorted(document_kind_counts.items())],
                ),
                ChartSeriesResponse(
                    key="notifications_by_status",
                    title="Notifications by status",
                    type="bar",
                    points=[ChartPoint(label=key, value=value) for key, value in sorted(notification_counts.items())],
                ),
            ]
        )

    async def search(
        self,
        *,
        current_user: User,
        query: str,
        params: PaginationParams,
        type_filter: str | None = None,
    ) -> Page[DashboardSearchResult]:
        escaped = re.escape(query.strip())
        if not escaped:
            return Page[DashboardSearchResult](items=[], meta=PageMeta(page=params.page, size=params.size, total=0))

        results: list[DashboardSearchResult] = []

        if type_filter in {None, "chat"}:
            chats = await Chat.find(self._chat_query(current_user=current_user, search=escaped)).limit(50).to_list()
            results.extend(
                DashboardSearchResult(
                    id=str(chat.id),
                    type="chat",
                    title=chat.title,
                    description=chat.summary,
                    updated_at=chat.updated_at,
                    metadata={"message_count": chat.message_count},
                )
                for chat in chats
            )

        if type_filter in {None, "document"}:
            documents = await Document.find(self._document_query(current_user=current_user, search=escaped)).limit(50).to_list()
            results.extend(
                DashboardSearchResult(
                    id=str(document.id),
                    type="document",
                    title=document.title,
                    description=document.file_name,
                    updated_at=document.updated_at,
                    metadata={"kind": document.kind.value, "category": document.category, "tags": document.tags},
                )
                for document in documents
            )

        if type_filter in {None, "notification"}:
            notifications = await Notification.find(self._notification_query(current_user=current_user, search=escaped)).limit(50).to_list()
            results.extend(
                DashboardSearchResult(
                    id=str(notification.id),
                    type="notification",
                    title=notification.title,
                    description=notification.message,
                    updated_at=notification.updated_at,
                    metadata={"status": notification.status.value, "type": notification.type.value},
                )
                for notification in notifications
            )

        if type_filter in {None, "message"}:
            chats = await Chat.find({"owner_id": current_user.id, "is_deleted": False}).to_list()
            messages = await Message.find(
                {
                    "chat_id": {"$in": [chat.id for chat in chats]},
                    "is_deleted": False,
                    "$or": [
                        {"content": {"$regex": escaped, "$options": "i"}},
                        {"content_preview": {"$regex": escaped, "$options": "i"}},
                    ],
                }
            ).limit(50).to_list() if chats else []
            results.extend(
                DashboardSearchResult(
                    id=str(message.id),
                    type="message",
                    title="Chat message",
                    description=message.content_preview or message.content[:160],
                    updated_at=message.updated_at,
                    metadata={"chat_id": str(message.chat_id), "role": message.role.value},
                )
                for message in messages
            )

        results.sort(key=lambda item: item.updated_at, reverse=params.sort_direction == "desc")
        return self._paginate(results, params)

    async def _messages_for_chat_ids(self, chat_ids: list[Any], limit: int | None = None) -> list[Message]:
        if not chat_ids:
            return []
        query = Message.find({"chat_id": {"$in": chat_ids}, "is_deleted": False}).sort("-created_at")
        if limit is not None:
            query = query.limit(limit)
        return await query.to_list()

    @staticmethod
    def _chat_query(*, current_user: User, search: str | None = None, pinned: bool | None = None, favorite: bool | None = None) -> dict[str, Any]:
        query: dict[str, Any] = {"owner_id": current_user.id, "is_deleted": False}
        if pinned is not None:
            query["is_pinned"] = pinned
        if favorite is not None:
            query["is_favorite"] = favorite
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"summary": {"$regex": search, "$options": "i"}},
                {"tags": {"$regex": search, "$options": "i"}},
            ]
        return query

    @staticmethod
    def _document_query(
        *,
        current_user: User,
        search: str | None = None,
        category: str | None = None,
        kind: DocumentKind | None = None,
        tags: list[str] | None = None,
    ) -> dict[str, Any]:
        query: dict[str, Any] = {"owner_id": current_user.id, "is_deleted": False}
        if category:
            query["category"] = category
        if kind:
            query["kind"] = kind
        if tags:
            query["tags"] = {"$all": tags}
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"file_name": {"$regex": search, "$options": "i"}},
                {"category": {"$regex": search, "$options": "i"}},
                {"tags": {"$regex": search, "$options": "i"}},
                {"preview_text": {"$regex": search, "$options": "i"}},
            ]
        return query

    @staticmethod
    def _notification_query(
        *,
        current_user: User,
        search: str | None = None,
        status: NotificationStatus | None = None,
        type_filter: NotificationType | None = None,
    ) -> dict[str, Any]:
        query: dict[str, Any] = {"user_id": current_user.id, "is_deleted": False}
        if status:
            query["status"] = status
        if type_filter:
            query["type"] = type_filter
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"message": {"$regex": search, "$options": "i"}},
            ]
        return query

    @staticmethod
    def to_recent_chat(chat: Chat) -> RecentChatResponse:
        return RecentChatResponse(
            id=str(chat.id),
            title=chat.title,
            summary=chat.summary,
            message_count=chat.message_count,
            is_pinned=chat.is_pinned,
            is_favorite=chat.is_favorite,
            last_message_at=chat.last_message_at,
            updated_at=chat.updated_at,
        )

    @staticmethod
    def to_recent_document(document: Document) -> RecentDocumentResponse:
        return RecentDocumentResponse(
            id=str(document.id),
            title=document.title,
            file_name=document.file_name,
            mime_type=document.mime_type,
            kind=document.kind,
            category=document.category,
            tags=document.tags,
            file_size=document.file_size,
            updated_at=document.updated_at,
        )

    @staticmethod
    def to_notification_response(notification: Notification) -> DashboardNotificationResponse:
        return DashboardNotificationResponse(
            id=str(notification.id),
            type=notification.type,
            status=notification.status,
            title=notification.title,
            message=notification.message,
            action_url=notification.action_url,
            read_at=notification.read_at,
            created_at=notification.created_at,
        )

    @staticmethod
    def _paginate(items: list[Any], params: PaginationParams) -> Page[Any]:
        total = len(items)
        start = params.skip
        end = start + params.size
        return Page[Any](items=items[start:end], meta=PageMeta(page=params.page, size=params.size, total=total))


dashboard_service = DashboardService()

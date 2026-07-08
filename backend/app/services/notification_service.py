import asyncio
import json
from collections.abc import AsyncIterator
from beanie import PydanticObjectId
from app.core.errors import AppError
from app.models.notification import Notification, NotificationStatus, NotificationType
from app.models.settings import UserSettings
from app.models.user import User
from app.schemas.common import Page, PageMeta, PaginationParams
from app.schemas.notification import (
    NotificationBulkResult,
    NotificationCategoryResponse,
    NotificationCreate,
    NotificationPreferencesResponse,
    NotificationPreferencesUpdate,
    NotificationResponse,
    NotificationUnreadCountResponse,
    NotificationUpdate,
)
from app.utils.datetime import utc_now


DEFAULT_NOTIFICATION_PREFERENCES = {
    "email": True,
    "in_app": True,
    "push": False,
    "categories": {
        "info": True,
        "success": True,
        "warning": True,
        "error": True,
        "billing": True,
        "system": True,
    },
}


class NotificationService:
    async def list_notifications(
        self,
        *,
        current_user: User,
        params: PaginationParams,
        status: NotificationStatus | None = None,
        type_filter: NotificationType | None = None,
    ) -> Page[NotificationResponse]:
        query = self._query(current_user=current_user, search=params.search, status=status, type_filter=type_filter)
        sort_field = params.sort_by if params.sort_by in {"created_at", "updated_at", "status", "type"} else "created_at"
        sort_clause = f"-{sort_field}" if params.sort_direction == "desc" else sort_field
        total = await Notification.find(query).count()
        items = await Notification.find(query).sort(sort_clause).skip(params.skip).limit(params.size).to_list()
        return Page[NotificationResponse](
            items=[self.to_response(item) for item in items],
            meta=PageMeta(page=params.page, size=params.size, total=total),
        )

    async def create_notification(self, *, current_user: User, request: NotificationCreate) -> NotificationResponse:
        notification = Notification(
            user_id=current_user.id,
            type=request.type,
            title=request.title,
            message=request.message,
            action_url=request.action_url,
            metadata=request.metadata,
        )
        notification = await notification.insert()
        return self.to_response(notification)

    async def create_for_user_id(self, *, user_id: PydanticObjectId, request: NotificationCreate) -> NotificationResponse:
        notification = Notification(
            user_id=user_id,
            type=request.type,
            title=request.title,
            message=request.message,
            action_url=request.action_url,
            metadata=request.metadata,
        )
        notification = await notification.insert()
        return self.to_response(notification)

    async def get_unread_count(self, *, current_user: User) -> NotificationUnreadCountResponse:
        count = await Notification.find({"user_id": current_user.id, "status": NotificationStatus.UNREAD, "is_deleted": False}).count()
        return NotificationUnreadCountResponse(unread_count=count)

    async def mark_as_read(self, *, current_user: User, notification_id: str) -> NotificationResponse:
        notification = await self.get_owned_notification(current_user=current_user, notification_id=notification_id)
        notification.status = NotificationStatus.READ
        notification.read_at = utc_now()
        await notification.save()
        return self.to_response(notification)

    async def mark_as_unread(self, *, current_user: User, notification_id: str) -> NotificationResponse:
        notification = await self.get_owned_notification(current_user=current_user, notification_id=notification_id)
        notification.status = NotificationStatus.UNREAD
        notification.read_at = None
        await notification.save()
        return self.to_response(notification)

    async def update_notification(self, *, current_user: User, notification_id: str, request: NotificationUpdate) -> NotificationResponse:
        notification = await self.get_owned_notification(current_user=current_user, notification_id=notification_id)
        if request.type is not None:
            notification.type = request.type
        if request.status is not None:
            notification.status = request.status
            notification.read_at = utc_now() if request.status == NotificationStatus.READ else None
        if request.title is not None:
            notification.title = request.title
        if request.message is not None:
            notification.message = request.message
        if request.action_url is not None:
            notification.action_url = request.action_url
        if request.metadata is not None:
            notification.metadata = request.metadata
        await notification.save()
        return self.to_response(notification)

    async def delete_notification(self, *, current_user: User, notification_id: str) -> NotificationBulkResult:
        notification = await self.get_owned_notification(current_user=current_user, notification_id=notification_id)
        await notification.soft_delete()
        return NotificationBulkResult(affected=1, message="Notification deleted")

    async def clear_all(self, *, current_user: User) -> NotificationBulkResult:
        notifications = await Notification.find({"user_id": current_user.id, "is_deleted": False}).to_list()
        for notification in notifications:
            await notification.soft_delete()
        return NotificationBulkResult(affected=len(notifications), message="Notifications cleared")

    async def mark_all_as_read(self, *, current_user: User) -> NotificationBulkResult:
        notifications = await Notification.find({"user_id": current_user.id, "status": NotificationStatus.UNREAD, "is_deleted": False}).to_list()
        for notification in notifications:
            notification.status = NotificationStatus.READ
            notification.read_at = utc_now()
            await notification.save()
        return NotificationBulkResult(affected=len(notifications), message="Notifications marked as read")

    async def categories(self, *, current_user: User) -> list[NotificationCategoryResponse]:
        notifications = await Notification.find({"user_id": current_user.id, "is_deleted": False}).to_list()
        categories: dict[NotificationType, dict[str, int]] = {
            notification_type: {"count": 0, "unread_count": 0}
            for notification_type in NotificationType
        }
        for notification in notifications:
            categories[notification.type]["count"] += 1
            if notification.status == NotificationStatus.UNREAD:
                categories[notification.type]["unread_count"] += 1
        return [
            NotificationCategoryResponse(category=category, count=counts["count"], unread_count=counts["unread_count"])
            for category, counts in categories.items()
        ]

    async def get_preferences(self, *, current_user: User) -> NotificationPreferencesResponse:
        settings = await self._get_or_create_settings(current_user)
        prefs = {**DEFAULT_NOTIFICATION_PREFERENCES, **(settings.notification_preferences or {})}
        categories = {
            **DEFAULT_NOTIFICATION_PREFERENCES["categories"],
            **prefs.get("categories", {}),
        }
        return NotificationPreferencesResponse(
            user_id=str(current_user.id),
            email=bool(prefs.get("email", True)),
            in_app=bool(prefs.get("in_app", True)),
            push=bool(prefs.get("push", False)),
            categories=categories,
            updated_at=settings.updated_at,
        )

    async def update_preferences(self, *, current_user: User, request: NotificationPreferencesUpdate) -> NotificationPreferencesResponse:
        settings = await self._get_or_create_settings(current_user)
        prefs = {**DEFAULT_NOTIFICATION_PREFERENCES, **(settings.notification_preferences or {})}
        categories = {**DEFAULT_NOTIFICATION_PREFERENCES["categories"], **prefs.get("categories", {})}

        if request.email is not None:
            prefs["email"] = request.email
        if request.in_app is not None:
            prefs["in_app"] = request.in_app
        if request.push is not None:
            prefs["push"] = request.push
        if request.categories is not None:
            categories.update(request.categories)
        prefs["categories"] = categories
        settings.notification_preferences = prefs
        await settings.save()
        return await self.get_preferences(current_user=current_user)

    async def stream(self, *, current_user: User) -> AsyncIterator[str]:
        while True:
            unread = await self.get_unread_count(current_user=current_user)
            payload = {"type": "heartbeat", "unread_count": unread.unread_count, "timestamp": utc_now().isoformat()}
            yield f"event: notification\ndata: {json.dumps(payload)}\n\n"
            await asyncio.sleep(15)

    async def get_owned_notification(self, *, current_user: User, notification_id: str) -> Notification:
        notification = await Notification.find_one({"_id": self._object_id(notification_id), "user_id": current_user.id, "is_deleted": False})
        if notification is None:
            raise AppError("Notification not found", status_code=404, error_code="NOTIFICATION_NOT_FOUND")
        return notification

    async def _get_or_create_settings(self, current_user: User) -> UserSettings:
        settings = await UserSettings.find_one({"user_id": current_user.id, "is_deleted": False})
        if settings is None:
            settings = UserSettings(user_id=current_user.id, notification_preferences=DEFAULT_NOTIFICATION_PREFERENCES)
            settings = await settings.insert()
        return settings

    @staticmethod
    def _query(
        *,
        current_user: User,
        search: str | None = None,
        status: NotificationStatus | None = None,
        type_filter: NotificationType | None = None,
    ) -> dict:
        query: dict = {"user_id": current_user.id, "is_deleted": False}
        if status is not None:
            query["status"] = status
        if type_filter is not None:
            query["type"] = type_filter
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"message": {"$regex": search, "$options": "i"}},
            ]
        return query

    @staticmethod
    def _object_id(value: str) -> PydanticObjectId:
        try:
            return PydanticObjectId(value)
        except Exception as exc:
            raise AppError("Invalid object id", status_code=422, error_code="INVALID_OBJECT_ID", details={"id": value}) from exc

    @staticmethod
    def to_response(notification: Notification) -> NotificationResponse:
        return NotificationResponse(
            id=str(notification.id),
            user_id=str(notification.user_id),
            type=notification.type,
            status=notification.status,
            title=notification.title,
            message=notification.message,
            action_url=notification.action_url,
            read_at=notification.read_at,
            created_at=notification.created_at,
            updated_at=notification.updated_at,
            metadata=notification.metadata,
        )


notification_service = NotificationService()

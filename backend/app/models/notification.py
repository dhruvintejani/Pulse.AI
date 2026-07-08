from datetime import datetime
from enum import Enum
from typing import Any
from beanie import PydanticObjectId
from pydantic import Field
from pymongo import ASCENDING, DESCENDING, TEXT, IndexModel
from app.models.base import BASE_INDEXES, BaseDocument


class NotificationType(str, Enum):
    INFO = "info"
    SUCCESS = "success"
    WARNING = "warning"
    ERROR = "error"
    BILLING = "billing"
    SYSTEM = "system"


class NotificationStatus(str, Enum):
    UNREAD = "unread"
    READ = "read"
    ARCHIVED = "archived"


class Notification(BaseDocument):
    user_id: PydanticObjectId
    type: NotificationType = NotificationType.INFO
    status: NotificationStatus = NotificationStatus.UNREAD
    title: str = Field(..., min_length=1, max_length=160)
    message: str = Field(..., min_length=1, max_length=1000)
    action_url: str | None = Field(default=None, max_length=2000)
    read_at: datetime | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)

    class Settings:
        name = "notifications"
        use_revision = True
        validate_on_save = True
        indexes = [
            *BASE_INDEXES,
            IndexModel([("user_id", ASCENDING), ("status", ASCENDING), ("created_at", DESCENDING)], name="idx_notifications_user_status_created"),
            IndexModel([("user_id", ASCENDING), ("type", ASCENDING)], name="idx_notifications_user_type"),
            IndexModel([("title", TEXT), ("message", TEXT)], name="txt_notifications_search"),
        ]

from datetime import datetime
from typing import Any
from pydantic import BaseModel, Field
from app.models.notification import NotificationStatus, NotificationType


class NotificationCreate(BaseModel):
    user_id: str | None = None
    type: NotificationType = NotificationType.INFO
    title: str = Field(..., min_length=1, max_length=160)
    message: str = Field(..., min_length=1, max_length=1000)
    action_url: str | None = Field(default=None, max_length=2000)
    metadata: dict[str, Any] = Field(default_factory=dict)


class NotificationUpdate(BaseModel):
    type: NotificationType | None = None
    status: NotificationStatus | None = None
    title: str | None = Field(default=None, min_length=1, max_length=160)
    message: str | None = Field(default=None, min_length=1, max_length=1000)
    action_url: str | None = Field(default=None, max_length=2000)
    metadata: dict[str, Any] | None = None


class NotificationResponse(BaseModel):
    id: str
    user_id: str
    type: NotificationType
    status: NotificationStatus
    title: str
    message: str
    action_url: str | None = None
    read_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
    metadata: dict[str, Any] = Field(default_factory=dict)


class NotificationUnreadCountResponse(BaseModel):
    unread_count: int


class NotificationCategoryResponse(BaseModel):
    category: NotificationType
    count: int
    unread_count: int


class NotificationPreferencesResponse(BaseModel):
    user_id: str
    email: bool = True
    in_app: bool = True
    push: bool = False
    categories: dict[str, bool] = Field(default_factory=dict)
    updated_at: datetime | None = None


class NotificationPreferencesUpdate(BaseModel):
    email: bool | None = None
    in_app: bool | None = None
    push: bool | None = None
    categories: dict[str, bool] | None = None


class NotificationBulkResult(BaseModel):
    affected: int
    message: str

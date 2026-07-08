from datetime import datetime
from typing import Any, Literal
from pydantic import BaseModel, EmailStr, Field
from app.models.chat import ChatStatus
from app.models.document import DocumentKind, DocumentStatus
from app.models.feedback import FeedbackStatus, FeedbackType
from app.models.notification import NotificationStatus, NotificationType
from app.models.role import AdminPermission
from app.models.system_log import SystemLogLevel, SystemLogSource
from app.models.user import UserRole, UserStatus


class AdminMetric(BaseModel):
    key: str
    label: str
    value: int | float | str
    change: float | None = None
    trend: Literal["up", "down", "flat"] = "flat"


class AdminDashboardResponse(BaseModel):
    metrics: list[AdminMetric]
    system_health: dict[str, Any] = Field(default_factory=dict)
    recent_activity: list[dict[str, Any]] = Field(default_factory=list)


class AdminUserResponse(BaseModel):
    id: str
    clerk_user_id: str | None = None
    email: EmailStr | None = None
    full_name: str
    username: str | None = None
    avatar_url: str | None = None
    role: UserRole
    status: UserStatus
    company: str | None = None
    location: str | None = None
    last_login_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


class AdminUserUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=1, max_length=120)
    role: UserRole | None = None
    status: UserStatus | None = None
    company: str | None = Field(default=None, max_length=120)
    location: str | None = Field(default=None, max_length=120)
    metadata: dict[str, Any] | None = None


class AdminChatResponse(BaseModel):
    id: str
    owner_id: str
    title: str
    status: ChatStatus
    model: str | None = None
    is_pinned: bool
    is_favorite: bool
    message_count: int
    last_message_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


class AdminDocumentResponse(BaseModel):
    id: str
    owner_id: str
    title: str
    file_name: str
    mime_type: str
    kind: DocumentKind
    status: DocumentStatus
    category: str | None = None
    tags: list[str]
    file_size: int
    storage_provider: str
    created_at: datetime
    updated_at: datetime


class AdminAnalyticsResponse(BaseModel):
    users: dict[str, int]
    chats: dict[str, int]
    documents: dict[str, int]
    notifications: dict[str, int]
    feedback: dict[str, int]
    ai_usage: dict[str, int | float]


class AdminSystemLogResponse(BaseModel):
    id: str
    level: SystemLogLevel
    source: SystemLogSource
    message: str
    actor_user_id: str | None = None
    request_id: str | None = None
    ip_address: str | None = None
    user_agent: str | None = None
    created_at: datetime
    metadata: dict[str, Any] = Field(default_factory=dict)


class AdminSystemLogCreate(BaseModel):
    level: SystemLogLevel = SystemLogLevel.INFO
    source: SystemLogSource = SystemLogSource.ADMIN
    message: str = Field(..., min_length=1, max_length=1000)
    metadata: dict[str, Any] = Field(default_factory=dict)


class AdminFeedbackResponse(BaseModel):
    id: str
    user_id: str | None = None
    type: FeedbackType
    status: FeedbackStatus
    rating: int | None = None
    message: str
    page_url: str | None = None
    created_at: datetime
    updated_at: datetime


class AdminFeedbackUpdate(BaseModel):
    status: FeedbackStatus | None = None
    metadata: dict[str, Any] | None = None


class AdminRoleResponse(BaseModel):
    id: str | None = None
    name: str
    display_name: str
    description: str | None = None
    permissions: list[AdminPermission]
    is_system: bool = True
    created_at: datetime | None = None
    updated_at: datetime | None = None


class AdminRoleUpsert(BaseModel):
    name: str = Field(..., min_length=2, max_length=80)
    display_name: str = Field(..., min_length=2, max_length=120)
    description: str | None = Field(default=None, max_length=500)
    permissions: list[AdminPermission] = Field(default_factory=list)
    is_system: bool = False
    metadata: dict[str, Any] = Field(default_factory=dict)


class AdminSettingsResponse(BaseModel):
    app_name: str
    app_version: str
    environment: str
    api_prefix: str
    cors_origins: list[str]
    document_storage_provider: str
    ai_default_provider: str
    ai_enabled_providers: list[str]
    admin_emails: list[str]


class AdminNotificationBroadcast(BaseModel):
    user_ids: list[str] | None = None
    type: NotificationType = NotificationType.INFO
    title: str = Field(..., min_length=1, max_length=160)
    message: str = Field(..., min_length=1, max_length=1000)
    action_url: str | None = Field(default=None, max_length=2000)
    metadata: dict[str, Any] = Field(default_factory=dict)


class AdminNotificationResponse(BaseModel):
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

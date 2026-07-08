from datetime import datetime
from typing import Any, Literal
from pydantic import BaseModel, Field
from app.models.document import DocumentKind
from app.models.notification import NotificationStatus, NotificationType


class DashboardMetric(BaseModel):
    key: str
    label: str
    value: int | float | str
    change: float | None = None
    trend: Literal["up", "down", "flat"] = "flat"


class RecentChatResponse(BaseModel):
    id: str
    title: str
    summary: str | None = None
    message_count: int
    is_pinned: bool
    is_favorite: bool
    last_message_at: datetime | None = None
    updated_at: datetime


class RecentDocumentResponse(BaseModel):
    id: str
    title: str
    file_name: str
    mime_type: str
    kind: DocumentKind
    category: str | None = None
    tags: list[str] = Field(default_factory=list)
    file_size: int
    updated_at: datetime


class DashboardOverviewResponse(BaseModel):
    metrics: list[DashboardMetric]
    recent_chats: list[RecentChatResponse]
    recent_documents: list[RecentDocumentResponse]
    unread_notifications: int


class UserStatisticsResponse(BaseModel):
    user_id: str
    total_chats: int
    total_messages: int
    total_documents: int
    total_notifications: int
    unread_notifications: int
    total_tokens: int
    favorite_chats: int
    pinned_chats: int
    documents_by_kind: dict[str, int]


class AIUsagePoint(BaseModel):
    date: str
    requests: int
    tokens: int
    user_messages: int
    assistant_messages: int


class AIUsageResponse(BaseModel):
    total_requests: int
    total_tokens: int
    average_tokens_per_request: float
    points: list[AIUsagePoint]


class DashboardNotificationResponse(BaseModel):
    id: str
    type: NotificationType
    status: NotificationStatus
    title: str
    message: str
    action_url: str | None = None
    read_at: datetime | None = None
    created_at: datetime


class ActivityTimelineItem(BaseModel):
    id: str
    type: Literal["chat", "message", "document", "notification"]
    title: str
    description: str | None = None
    entity_id: str
    entity_type: str
    created_at: datetime
    metadata: dict[str, Any] = Field(default_factory=dict)


class ChartPoint(BaseModel):
    label: str
    value: int | float
    extra: dict[str, Any] = Field(default_factory=dict)


class ChartSeriesResponse(BaseModel):
    key: str
    title: str
    type: Literal["line", "bar", "pie", "area"]
    points: list[ChartPoint]


class DashboardChartsResponse(BaseModel):
    charts: list[ChartSeriesResponse]


class DashboardSearchResult(BaseModel):
    id: str
    type: Literal["chat", "document", "notification", "message"]
    title: str
    description: str | None = None
    updated_at: datetime
    metadata: dict[str, Any] = Field(default_factory=dict)


class DashboardSearchResponse(BaseModel):
    query: str
    results: list[DashboardSearchResult]

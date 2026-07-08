from datetime import datetime
from typing import Any
from pydantic import BaseModel, Field
from app.models.settings import ThemeMode


class UserSettingsResponse(BaseModel):
    id: str
    user_id: str
    theme: ThemeMode
    language: str
    timezone: str
    notification_preferences: dict[str, Any] = Field(default_factory=dict)
    profile_settings: dict[str, Any] = Field(default_factory=dict)
    privacy_settings: dict[str, Any] = Field(default_factory=dict)
    security_settings: dict[str, Any] = Field(default_factory=dict)
    appearance_settings: dict[str, Any] = Field(default_factory=dict)
    ai_preferences: dict[str, Any] = Field(default_factory=dict)
    recent_searches: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime
    updated_at: datetime


class UserSettingsUpdate(BaseModel):
    theme: ThemeMode | None = None
    language: str | None = Field(default=None, min_length=2, max_length=16)
    timezone: str | None = Field(default=None, min_length=1, max_length=80)
    notification_preferences: dict[str, Any] | None = None
    profile_settings: dict[str, Any] | None = None
    privacy_settings: dict[str, Any] | None = None
    security_settings: dict[str, Any] | None = None
    appearance_settings: dict[str, Any] | None = None
    ai_preferences: dict[str, Any] | None = None
    metadata: dict[str, Any] | None = None


class RecentSearchesResponse(BaseModel):
    items: list[str] = Field(default_factory=list)


class RecentSearchesUpdate(BaseModel):
    query: str = Field(..., min_length=1, max_length=120)

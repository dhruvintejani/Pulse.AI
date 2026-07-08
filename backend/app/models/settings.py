from enum import Enum
from typing import Any
from beanie import PydanticObjectId
from pydantic import Field
from pymongo import ASCENDING, IndexModel
from app.models.base import BASE_INDEXES, BaseDocument


class ThemeMode(str, Enum):
    LIGHT = "light"
    DARK = "dark"
    SYSTEM = "system"


class UserSettings(BaseDocument):
    user_id: PydanticObjectId
    theme: ThemeMode = ThemeMode.SYSTEM
    language: str = Field(default="en", min_length=2, max_length=16)
    timezone: str = Field(default="UTC", min_length=1, max_length=80)
    notification_preferences: dict[str, Any] = Field(default_factory=dict)
    profile_settings: dict[str, Any] = Field(default_factory=dict)
    privacy_settings: dict[str, Any] = Field(default_factory=dict)
    security_settings: dict[str, Any] = Field(default_factory=dict)
    appearance_settings: dict[str, Any] = Field(default_factory=dict)
    ai_preferences: dict[str, Any] = Field(default_factory=dict)
    recent_searches: list[str] = Field(default_factory=list, max_length=20)
    metadata: dict[str, Any] = Field(default_factory=dict)

    class Settings:
        name = "settings"
        use_revision = True
        validate_on_save = True
        indexes = [
            *BASE_INDEXES,
            IndexModel([("user_id", ASCENDING)], unique=True, name="uq_settings_user_id", partialFilterExpression={"is_deleted": False}),
            IndexModel([("theme", ASCENDING), ("language", ASCENDING)], name="idx_settings_theme_language"),
            IndexModel([("language", ASCENDING), ("timezone", ASCENDING)], name="idx_settings_language_timezone"),
        ]

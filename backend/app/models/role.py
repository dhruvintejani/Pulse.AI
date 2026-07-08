from enum import Enum
from typing import Any
from pydantic import Field
from pymongo import ASCENDING, TEXT, IndexModel
from app.models.base import BASE_INDEXES, BaseDocument


class AdminPermission(str, Enum):
    ADMIN_ACCESS = "admin.access"
    DASHBOARD_READ = "dashboard.read"
    USERS_READ = "users.read"
    USERS_WRITE = "users.write"
    CHATS_READ = "chats.read"
    DOCUMENTS_READ = "documents.read"
    ANALYTICS_READ = "analytics.read"
    LOGS_READ = "logs.read"
    FEEDBACK_READ = "feedback.read"
    FEEDBACK_WRITE = "feedback.write"
    NOTIFICATIONS_READ = "notifications.read"
    NOTIFICATIONS_WRITE = "notifications.write"
    ROLES_READ = "roles.read"
    ROLES_WRITE = "roles.write"
    SETTINGS_READ = "settings.read"
    SETTINGS_WRITE = "settings.write"


class RolePermission(BaseDocument):
    name: str = Field(..., min_length=2, max_length=80)
    display_name: str = Field(..., min_length=2, max_length=120)
    description: str | None = Field(default=None, max_length=500)
    permissions: list[AdminPermission] = Field(default_factory=list)
    is_system: bool = True
    metadata: dict[str, Any] = Field(default_factory=dict)

    class Settings:
        name = "roles"
        use_revision = True
        validate_on_save = True
        indexes = [
            *BASE_INDEXES,
            IndexModel([("name", ASCENDING)], unique=True, name="uq_roles_name"),
            IndexModel([("is_system", ASCENDING)], name="idx_roles_is_system"),
            IndexModel([("name", TEXT), ("display_name", TEXT), ("description", TEXT)], name="txt_roles_search"),
        ]

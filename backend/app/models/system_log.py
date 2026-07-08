from enum import Enum
from typing import Any
from beanie import PydanticObjectId
from pydantic import Field
from pymongo import ASCENDING, DESCENDING, TEXT, IndexModel
from app.models.base import BASE_INDEXES, BaseDocument


class SystemLogLevel(str, Enum):
    DEBUG = "debug"
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


class SystemLogSource(str, Enum):
    API = "api"
    AUTH = "auth"
    ADMIN = "admin"
    CHAT = "chat"
    DOCUMENTS = "documents"
    NOTIFICATIONS = "notifications"
    SYSTEM = "system"


class SystemLog(BaseDocument):
    level: SystemLogLevel = SystemLogLevel.INFO
    source: SystemLogSource = SystemLogSource.SYSTEM
    message: str = Field(..., min_length=1, max_length=1000)
    actor_user_id: PydanticObjectId | None = None
    request_id: str | None = Field(default=None, max_length=120)
    ip_address: str | None = Field(default=None, max_length=80)
    user_agent: str | None = Field(default=None, max_length=500)
    metadata: dict[str, Any] = Field(default_factory=dict)

    class Settings:
        name = "system_logs"
        use_revision = True
        validate_on_save = True
        indexes = [
            *BASE_INDEXES,
            IndexModel([("level", ASCENDING), ("created_at", DESCENDING)], name="idx_logs_level_created"),
            IndexModel([("source", ASCENDING), ("created_at", DESCENDING)], name="idx_logs_source_created"),
            IndexModel([("actor_user_id", ASCENDING), ("created_at", DESCENDING)], name="idx_logs_actor_created"),
            IndexModel([("message", TEXT), ("source", TEXT)], name="txt_logs_search"),
        ]

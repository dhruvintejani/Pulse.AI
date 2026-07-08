from datetime import datetime
from enum import Enum
from typing import Any
from beanie import PydanticObjectId
from pydantic import Field
from pymongo import ASCENDING, DESCENDING, TEXT, IndexModel
from app.models.base import BASE_INDEXES, BaseDocument


class ChatStatus(str, Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"


class Chat(BaseDocument):
    owner_id: PydanticObjectId
    folder_id: PydanticObjectId | None = None
    title: str = Field(..., min_length=1, max_length=200)
    summary: str | None = Field(default=None, max_length=1000)
    status: ChatStatus = ChatStatus.ACTIVE
    model: str | None = Field(default=None, max_length=80)
    tags: list[str] = Field(default_factory=list, max_length=20)
    is_pinned: bool = False
    is_favorite: bool = False
    message_count: int = Field(default=0, ge=0)
    last_message_at: datetime | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)

    class Settings:
        name = "chats"
        use_revision = True
        validate_on_save = True
        indexes = [
            *BASE_INDEXES,
            IndexModel([("owner_id", ASCENDING), ("updated_at", DESCENDING)], name="idx_chats_owner_updated"),
            IndexModel([("owner_id", ASCENDING), ("folder_id", ASCENDING)], name="idx_chats_owner_folder"),
            IndexModel([("owner_id", ASCENDING), ("status", ASCENDING)], name="idx_chats_owner_status"),
            IndexModel([("owner_id", ASCENDING), ("is_pinned", DESCENDING), ("updated_at", DESCENDING)], name="idx_chats_owner_pinned"),
            IndexModel([("owner_id", ASCENDING), ("is_favorite", DESCENDING), ("updated_at", DESCENDING)], name="idx_chats_owner_favorite"),
            IndexModel([("title", TEXT), ("summary", TEXT), ("tags", TEXT)], name="txt_chats_search"),
        ]

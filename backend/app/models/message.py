from enum import Enum
from typing import Any
from beanie import PydanticObjectId
from pydantic import BaseModel, Field
from pymongo import ASCENDING, DESCENDING, TEXT, IndexModel
from app.models.base import BASE_INDEXES, BaseDocument


class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"
    TOOL = "tool"


class MessageStatus(str, Enum):
    COMPLETED = "completed"
    STREAMING = "streaming"
    FAILED = "failed"


class MessageReaction(str, Enum):
    LIKE = "like"
    DISLIKE = "dislike"


class MessageAttachment(BaseModel):
    document_id: PydanticObjectId | None = None
    file_name: str = Field(..., min_length=1, max_length=255)
    mime_type: str = Field(..., min_length=1, max_length=120)
    size_bytes: int = Field(default=0, ge=0)
    url: str | None = Field(default=None, max_length=2000)


class Message(BaseDocument):
    chat_id: PydanticObjectId
    user_id: PydanticObjectId | None = None
    parent_message_id: PydanticObjectId | None = None
    role: MessageRole
    status: MessageStatus = MessageStatus.COMPLETED
    content: str = Field(default="", max_length=50000)
    content_preview: str | None = Field(default=None, max_length=500)
    model: str | None = Field(default=None, max_length=80)
    token_count: int = Field(default=0, ge=0)
    reaction: MessageReaction | None = None
    attachments: list[MessageAttachment] = Field(default_factory=list, max_length=10)
    metadata: dict[str, Any] = Field(default_factory=dict)

    class Settings:
        name = "messages"
        use_revision = True
        validate_on_save = True
        indexes = [
            *BASE_INDEXES,
            IndexModel([("chat_id", ASCENDING), ("created_at", ASCENDING)], name="idx_messages_chat_created"),
            IndexModel([("user_id", ASCENDING), ("created_at", DESCENDING)], name="idx_messages_user_created"),
            IndexModel([("chat_id", ASCENDING), ("role", ASCENDING)], name="idx_messages_chat_role"),
            IndexModel([("content", TEXT), ("content_preview", TEXT)], name="txt_messages_search"),
        ]

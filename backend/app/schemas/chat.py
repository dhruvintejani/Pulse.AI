from datetime import datetime
from typing import Any, Literal
from pydantic import BaseModel, Field
from app.models.chat import ChatStatus
from app.models.message import MessageAttachment, MessageReaction, MessageRole, MessageStatus


class ConversationCreate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    initial_message: str | None = Field(default=None, max_length=50000)
    model: str | None = Field(default=None, max_length=80)
    folder_id: str | None = None
    tags: list[str] = Field(default_factory=list, max_length=20)
    metadata: dict[str, Any] = Field(default_factory=dict)


class ConversationUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    summary: str | None = Field(default=None, max_length=1000)
    model: str | None = Field(default=None, max_length=80)
    folder_id: str | None = None
    tags: list[str] | None = Field(default=None, max_length=20)
    status: ChatStatus | None = None
    metadata: dict[str, Any] | None = None


class ConversationRename(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)


class ConversationToggleResponse(BaseModel):
    id: str
    is_pinned: bool
    is_favorite: bool


class ConversationResponse(BaseModel):
    id: str
    owner_id: str
    folder_id: str | None = None
    title: str
    summary: str | None = None
    status: ChatStatus
    model: str | None = None
    tags: list[str]
    is_pinned: bool
    is_favorite: bool
    message_count: int
    last_message_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


class MessageCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=50000)
    role: MessageRole = MessageRole.USER
    model: str | None = Field(default=None, max_length=80)
    parent_message_id: str | None = None
    attachments: list[MessageAttachment] = Field(default_factory=list, max_length=10)
    metadata: dict[str, Any] = Field(default_factory=dict)


class MessageUpdate(BaseModel):
    content: str | None = Field(default=None, min_length=1, max_length=50000)
    status: MessageStatus | None = None
    reaction: MessageReaction | None = None
    metadata: dict[str, Any] | None = None


class MessageReactionUpdate(BaseModel):
    reaction: MessageReaction | None = None


class MessageResponse(BaseModel):
    id: str
    chat_id: str
    user_id: str | None = None
    parent_message_id: str | None = None
    role: MessageRole
    status: MessageStatus
    content: str
    content_preview: str | None = None
    model: str | None = None
    token_count: int
    reaction: MessageReaction | None = None
    attachments: list[MessageAttachment]
    created_at: datetime
    updated_at: datetime


class ConversationDetailResponse(ConversationResponse):
    messages: list[MessageResponse] = Field(default_factory=list)


class ChatStreamRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=50000)
    model: str | None = Field(default=None, max_length=80)
    attachments: list[MessageAttachment] = Field(default_factory=list, max_length=10)
    metadata: dict[str, Any] = Field(default_factory=dict)


class RegenerateMessageRequest(BaseModel):
    model: str | None = Field(default=None, max_length=80)
    instructions: str | None = Field(default=None, max_length=5000)


class TypingStatusUpdate(BaseModel):
    is_typing: bool
    source: Literal["user", "assistant"] = "user"


class TypingStatusResponse(BaseModel):
    conversation_id: str
    user_id: str
    is_typing: bool
    source: str
    expires_at: datetime | None = None

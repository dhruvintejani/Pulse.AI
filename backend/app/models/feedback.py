from enum import Enum
from typing import Any
from beanie import PydanticObjectId
from pydantic import Field
from pymongo import ASCENDING, DESCENDING, TEXT, IndexModel
from app.models.base import BASE_INDEXES, BaseDocument


class FeedbackType(str, Enum):
    BUG = "bug"
    FEATURE = "feature"
    RATING = "rating"
    GENERAL = "general"


class FeedbackStatus(str, Enum):
    OPEN = "open"
    REVIEWED = "reviewed"
    CLOSED = "closed"


class Feedback(BaseDocument):
    user_id: PydanticObjectId | None = None
    related_chat_id: PydanticObjectId | None = None
    related_document_id: PydanticObjectId | None = None
    type: FeedbackType = FeedbackType.GENERAL
    status: FeedbackStatus = FeedbackStatus.OPEN
    rating: int | None = Field(default=None, ge=1, le=5)
    message: str = Field(..., min_length=1, max_length=5000)
    page_url: str | None = Field(default=None, max_length=2000)
    user_agent: str | None = Field(default=None, max_length=500)
    metadata: dict[str, Any] = Field(default_factory=dict)

    class Settings:
        name = "feedback"
        use_revision = True
        validate_on_save = True
        indexes = [
            *BASE_INDEXES,
            IndexModel([("user_id", ASCENDING), ("created_at", DESCENDING)], name="idx_feedback_user_created"),
            IndexModel([("status", ASCENDING), ("created_at", DESCENDING)], name="idx_feedback_status_created"),
            IndexModel([("type", ASCENDING), ("rating", DESCENDING)], name="idx_feedback_type_rating"),
            IndexModel([("related_chat_id", ASCENDING)], sparse=True, name="idx_feedback_related_chat"),
            IndexModel([("related_document_id", ASCENDING)], sparse=True, name="idx_feedback_related_document"),
            IndexModel([("message", TEXT), ("page_url", TEXT)], name="txt_feedback_search"),
        ]

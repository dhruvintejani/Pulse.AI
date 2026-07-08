from datetime import datetime
from enum import Enum
from typing import Any
from beanie import PydanticObjectId
from pydantic import Field
from pymongo import ASCENDING, DESCENDING, TEXT, IndexModel
from app.models.base import BASE_INDEXES, BaseDocument


class DocumentStatus(str, Enum):
    UPLOADING = "uploading"
    PROCESSING = "processing"
    READY = "ready"
    FAILED = "failed"
    ARCHIVED = "archived"


class DocumentKind(str, Enum):
    PDF = "pdf"
    DOC = "doc"
    MARKDOWN = "markdown"
    TEXT = "text"
    IMAGE = "image"
    SPREADSHEET = "spreadsheet"
    PRESENTATION = "presentation"
    OTHER = "other"


class Document(BaseDocument):
    owner_id: PydanticObjectId
    folder_id: PydanticObjectId | None = None
    title: str = Field(..., min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=1000)
    category: str | None = Field(default=None, max_length=80)
    file_name: str = Field(..., min_length=1, max_length=255)
    original_file_name: str | None = Field(default=None, max_length=255)
    mime_type: str = Field(..., min_length=1, max_length=120)
    kind: DocumentKind = DocumentKind.OTHER
    status: DocumentStatus = DocumentStatus.UPLOADING
    file_size: int = Field(default=0, ge=0)
    storage_provider: str = Field(default="metadata", max_length=80)
    storage_key: str | None = Field(default=None, max_length=500)
    storage_resource_type: str | None = Field(default=None, max_length=80)
    public_url: str | None = Field(default=None, max_length=2000)
    secure_url: str | None = Field(default=None, max_length=2000)
    checksum: str | None = Field(default=None, max_length=128)
    tags: list[str] = Field(default_factory=list, max_length=30)
    extracted_text: str | None = Field(default=None, max_length=200000)
    preview_text: str | None = Field(default=None, max_length=10000)
    preview_url: str | None = Field(default=None, max_length=2000)
    processed_at: datetime | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)

    class Settings:
        name = "documents"
        use_revision = True
        validate_on_save = True
        indexes = [
            *BASE_INDEXES,
            IndexModel([("owner_id", ASCENDING), ("updated_at", DESCENDING)], name="idx_documents_owner_updated"),
            IndexModel([("owner_id", ASCENDING), ("folder_id", ASCENDING)], name="idx_documents_owner_folder"),
            IndexModel([("owner_id", ASCENDING), ("status", ASCENDING)], name="idx_documents_owner_status"),
            IndexModel([("owner_id", ASCENDING), ("kind", ASCENDING)], name="idx_documents_owner_kind"),
            IndexModel([("owner_id", ASCENDING), ("category", ASCENDING), ("updated_at", DESCENDING)], name="idx_documents_owner_category"),
            IndexModel([("owner_id", ASCENDING), ("tags", ASCENDING), ("updated_at", DESCENDING)], name="idx_documents_owner_tags"),
            IndexModel([("checksum", ASCENDING)], sparse=True, name="idx_documents_checksum"),
            IndexModel([("tags", ASCENDING), ("created_at", DESCENDING)], name="idx_documents_tags_created"),
            IndexModel([("title", TEXT), ("file_name", TEXT), ("category", TEXT), ("tags", TEXT), ("extracted_text", TEXT), ("preview_text", TEXT)], name="txt_documents_search"),
        ]

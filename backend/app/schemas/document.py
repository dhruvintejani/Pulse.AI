from datetime import datetime
from typing import Any, Literal
from pydantic import BaseModel, Field
from app.models.document import DocumentKind, DocumentStatus


class DocumentResponse(BaseModel):
    id: str
    owner_id: str
    folder_id: str | None = None
    title: str
    description: str | None = None
    category: str | None = None
    file_name: str
    original_file_name: str | None = None
    mime_type: str
    kind: DocumentKind
    status: DocumentStatus
    file_size: int
    storage_provider: str
    storage_key: str | None = None
    storage_resource_type: str | None = None
    public_url: str | None = None
    secure_url: str | None = None
    preview_url: str | None = None
    checksum: str | None = None
    tags: list[str]
    created_at: datetime
    updated_at: datetime
    processed_at: datetime | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class DocumentDetailResponse(DocumentResponse):
    extracted_text: str | None = None
    preview_text: str | None = None


class DocumentUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=1000)
    category: str | None = Field(default=None, max_length=80)
    folder_id: str | None = None
    tags: list[str] | None = Field(default=None, max_length=30)
    status: DocumentStatus | None = None
    metadata: dict[str, Any] | None = None


class DocumentRename(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)


class DocumentMove(BaseModel):
    folder_id: str | None = None


class DocumentPreviewResponse(BaseModel):
    id: str
    title: str
    mime_type: str
    kind: DocumentKind
    preview_text: str | None = None
    extracted_text: str | None = None
    preview_url: str | None = None
    public_url: str | None = None
    secure_url: str | None = None


class DocumentFacetResponse(BaseModel):
    value: str
    count: int


class DocumentUploadResult(BaseModel):
    document: DocumentDetailResponse
    upload_mode: Literal["metadata", "cloudinary"] = "metadata"

from datetime import datetime
from typing import Any
from pydantic import BaseModel, Field
from app.models.document import DocumentKind, DocumentStatus


class UploadValidationResponse(BaseModel):
    valid: bool
    file_name: str
    mime_type: str
    extension: str
    file_size: int
    max_size: int
    kind: DocumentKind
    checksum: str | None = None
    message: str = "File is valid"


class UploadMetadataResponse(BaseModel):
    upload_id: str
    document_id: str
    owner_id: str
    title: str
    file_name: str
    original_file_name: str | None = None
    mime_type: str
    extension: str
    kind: DocumentKind
    status: DocumentStatus
    file_size: int
    max_size: int
    checksum: str
    storage_provider: str
    storage_key: str | None = None
    storage_resource_type: str | None = None
    public_url: str | None = None
    secure_url: str | None = None
    preview_url: str | None = None
    category: str | None = None
    tags: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)
    progress_supported: bool = True
    uploaded_bytes: int
    total_bytes: int
    progress: int = Field(default=100, ge=0, le=100)
    created_at: datetime


class UploadProgressResponse(BaseModel):
    upload_id: str
    document_id: str | None = None
    file_name: str | None = None
    uploaded_bytes: int = 0
    total_bytes: int = 0
    progress: int = Field(default=0, ge=0, le=100)
    status: str = "pending"
    updated_at: datetime

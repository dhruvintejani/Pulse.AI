import hashlib
import json
import mimetypes
import re
from pathlib import Path
from typing import Any
from beanie import PydanticObjectId
from fastapi import UploadFile
from app.core.config import settings
from app.core.errors import AppError
from app.models.document import Document, DocumentKind, DocumentStatus
from app.models.folder import Folder
from app.models.user import User
from app.schemas.common import Page, PageMeta, PaginationParams
from app.schemas.document import (
    DocumentDetailResponse,
    DocumentFacetResponse,
    DocumentMove,
    DocumentPreviewResponse,
    DocumentRename,
    DocumentResponse,
    DocumentUpdate,
    DocumentUploadResult,
)
from app.storage import DocumentUploadPayload, document_storage_registry
from app.utils.datetime import utc_now


class DocumentService:
    async def upload_document(
        self,
        *,
        current_user: User,
        file: UploadFile,
        title: str | None = None,
        description: str | None = None,
        category: str | None = None,
        folder_id: str | None = None,
        tags: str | list[str] | None = None,
        metadata_json: str | None = None,
        extracted_text: str | None = None,
    ) -> DocumentUploadResult:
        content = await file.read()
        if not content:
            raise AppError("Uploaded file is empty", status_code=422, error_code="DOCUMENT_EMPTY_FILE")
        if len(content) > settings.document_max_upload_size_bytes:
            raise AppError(
                "Uploaded file is too large",
                status_code=413,
                error_code="DOCUMENT_FILE_TOO_LARGE",
                details={"max_size_mb": settings.DOCUMENT_MAX_UPLOAD_SIZE_MB},
            )

        folder_object_id = await self._validate_folder(current_user=current_user, folder_id=folder_id)
        original_file_name = file.filename or "document"
        safe_file_name = self._safe_file_name(original_file_name)
        mime_type = file.content_type or mimetypes.guess_type(safe_file_name)[0] or "application/octet-stream"
        checksum = hashlib.sha256(content).hexdigest()
        kind = self._document_kind(mime_type=mime_type, file_name=safe_file_name)
        metadata = self._parse_metadata(metadata_json)
        preview_text = self._build_preview_text(content=content, mime_type=mime_type, extracted_text=extracted_text)

        provider = document_storage_registry.get()
        stored = await provider.upload(
            DocumentUploadPayload(
                owner_id=str(current_user.id),
                file_name=safe_file_name,
                mime_type=mime_type,
                content=content,
                checksum=checksum,
                folder=settings.CLOUDINARY_FOLDER,
                metadata=metadata,
            )
        )

        document = Document(
            owner_id=current_user.id,
            folder_id=folder_object_id,
            title=title or self._title_from_filename(original_file_name),
            description=description,
            category=self._normalize_optional(category),
            file_name=safe_file_name,
            original_file_name=original_file_name,
            mime_type=mime_type,
            kind=kind,
            status=DocumentStatus.READY,
            file_size=len(content),
            storage_provider=stored.provider,
            storage_key=stored.storage_key,
            storage_resource_type=stored.resource_type,
            public_url=stored.public_url,
            secure_url=stored.secure_url,
            preview_url=stored.preview_url,
            checksum=checksum,
            tags=self._normalize_tags(tags),
            extracted_text=extracted_text,
            preview_text=preview_text,
            processed_at=utc_now(),
            metadata={**metadata, **(stored.metadata or {})},
        )
        document = await document.insert()
        return DocumentUploadResult(document=self.to_detail_response(document), upload_mode=stored.provider)  # type: ignore[arg-type]

    async def list_documents(
        self,
        *,
        current_user: User,
        params: PaginationParams,
        category: str | None = None,
        kind: DocumentKind | None = None,
        folder_id: str | None = None,
        tags: list[str] | None = None,
    ) -> Page[DocumentResponse]:
        query = await self._build_query(
            current_user=current_user,
            search=params.search,
            category=category,
            kind=kind,
            folder_id=folder_id,
            tags=tags,
        )
        sort_field = params.sort_by if params.sort_by in {"title", "created_at", "updated_at", "file_size", "category"} else "updated_at"
        sort_clause = f"-{sort_field}" if params.sort_direction == "desc" else sort_field

        total = await Document.find(query).count()
        documents = await Document.find(query).sort(sort_clause).skip(params.skip).limit(params.size).to_list()

        return Page[DocumentResponse](
            items=[self.to_response(document) for document in documents],
            meta=PageMeta(page=params.page, size=params.size, total=total),
        )

    async def recent_documents(self, *, current_user: User, limit: int = 8) -> list[DocumentResponse]:
        safe_limit = min(max(limit, 1), 30)
        documents = await Document.find({"owner_id": current_user.id, "is_deleted": False}).sort("-updated_at").limit(safe_limit).to_list()
        return [self.to_response(document) for document in documents]

    async def get_document(self, *, current_user: User, document_id: str) -> DocumentDetailResponse:
        document = await self.get_owned_document(current_user=current_user, document_id=document_id)
        return self.to_detail_response(document)

    async def preview_document(self, *, current_user: User, document_id: str) -> DocumentPreviewResponse:
        document = await self.get_owned_document(current_user=current_user, document_id=document_id)
        return DocumentPreviewResponse(
            id=str(document.id),
            title=document.title,
            mime_type=document.mime_type,
            kind=document.kind,
            preview_text=document.preview_text,
            extracted_text=document.extracted_text,
            preview_url=document.preview_url,
            public_url=document.public_url,
            secure_url=document.secure_url,
        )

    async def update_document(self, *, current_user: User, document_id: str, request: DocumentUpdate) -> DocumentDetailResponse:
        document = await self.get_owned_document(current_user=current_user, document_id=document_id)
        payload = request.model_dump(exclude_unset=True)

        if "folder_id" in payload:
            document.folder_id = await self._validate_folder(current_user=current_user, folder_id=request.folder_id)
        if request.title is not None:
            document.title = request.title
        if request.description is not None:
            document.description = request.description
        if request.category is not None:
            document.category = self._normalize_optional(request.category)
        if request.tags is not None:
            document.tags = self._normalize_tags(request.tags)
        if request.status is not None:
            document.status = request.status
        if request.metadata is not None:
            document.metadata = request.metadata

        await document.save()
        return self.to_detail_response(document)

    async def rename_document(self, *, current_user: User, document_id: str, request: DocumentRename) -> DocumentDetailResponse:
        document = await self.get_owned_document(current_user=current_user, document_id=document_id)
        document.title = request.title
        await document.save()
        return self.to_detail_response(document)

    async def move_document(self, *, current_user: User, document_id: str, request: DocumentMove) -> DocumentDetailResponse:
        document = await self.get_owned_document(current_user=current_user, document_id=document_id)
        document.folder_id = await self._validate_folder(current_user=current_user, folder_id=request.folder_id)
        await document.save()
        return self.to_detail_response(document)

    async def delete_document(self, *, current_user: User, document_id: str) -> None:
        document = await self.get_owned_document(current_user=current_user, document_id=document_id)
        provider = document_storage_registry.get(document.storage_provider)
        await provider.delete(document.storage_key)
        await document.soft_delete()

    async def list_categories(self, *, current_user: User) -> list[DocumentFacetResponse]:
        documents = await Document.find({"owner_id": current_user.id, "is_deleted": False}).to_list()
        counts: dict[str, int] = {}
        for document in documents:
            if document.category:
                counts[document.category] = counts.get(document.category, 0) + 1
        return [DocumentFacetResponse(value=value, count=count) for value, count in sorted(counts.items(), key=lambda item: item[0].lower())]

    async def list_tags(self, *, current_user: User) -> list[DocumentFacetResponse]:
        documents = await Document.find({"owner_id": current_user.id, "is_deleted": False}).to_list()
        counts: dict[str, int] = {}
        for document in documents:
            for tag in document.tags:
                counts[tag] = counts.get(tag, 0) + 1
        return [DocumentFacetResponse(value=value, count=count) for value, count in sorted(counts.items(), key=lambda item: item[0].lower())]

    async def get_owned_document(self, *, current_user: User, document_id: str) -> Document:
        document = await Document.find_one({"_id": self._object_id(document_id), "owner_id": current_user.id, "is_deleted": False})
        if document is None:
            raise AppError("Document not found", status_code=404, error_code="DOCUMENT_NOT_FOUND")
        return document

    async def _build_query(
        self,
        *,
        current_user: User,
        search: str | None = None,
        category: str | None = None,
        kind: DocumentKind | None = None,
        folder_id: str | None = None,
        tags: list[str] | None = None,
    ) -> dict[str, Any]:
        query: dict[str, Any] = {"owner_id": current_user.id, "is_deleted": False}

        if category:
            query["category"] = self._normalize_optional(category)
        if kind:
            query["kind"] = kind
        if folder_id is not None:
            query["folder_id"] = await self._validate_folder(current_user=current_user, folder_id=folder_id)
        if tags:
            query["tags"] = {"$all": self._normalize_tags(tags)}
        if search:
            escaped = re.escape(search.strip())
            if escaped:
                query["$or"] = [
                    {"title": {"$regex": escaped, "$options": "i"}},
                    {"file_name": {"$regex": escaped, "$options": "i"}},
                    {"category": {"$regex": escaped, "$options": "i"}},
                    {"tags": {"$regex": escaped, "$options": "i"}},
                    {"preview_text": {"$regex": escaped, "$options": "i"}},
                    {"extracted_text": {"$regex": escaped, "$options": "i"}},
                ]

        return query

    async def _validate_folder(self, *, current_user: User, folder_id: str | None) -> PydanticObjectId | None:
        if folder_id is None or folder_id == "":
            return None
        object_id = self._object_id(folder_id)
        folder = await Folder.find_one({"_id": object_id, "owner_id": current_user.id, "is_deleted": False})
        if folder is None:
            raise AppError("Folder not found", status_code=404, error_code="FOLDER_NOT_FOUND")
        return object_id

    def to_response(self, document: Document) -> DocumentResponse:
        return DocumentResponse(
            id=str(document.id),
            owner_id=str(document.owner_id),
            folder_id=str(document.folder_id) if document.folder_id else None,
            title=document.title,
            description=document.description,
            category=document.category,
            file_name=document.file_name,
            original_file_name=document.original_file_name,
            mime_type=document.mime_type,
            kind=document.kind,
            status=document.status,
            file_size=document.file_size,
            storage_provider=document.storage_provider,
            storage_key=document.storage_key,
            storage_resource_type=document.storage_resource_type,
            public_url=document.public_url,
            secure_url=document.secure_url,
            preview_url=document.preview_url,
            checksum=document.checksum,
            tags=document.tags,
            created_at=document.created_at,
            updated_at=document.updated_at,
            processed_at=document.processed_at,
            metadata=document.metadata,
        )

    def to_detail_response(self, document: Document) -> DocumentDetailResponse:
        response = self.to_response(document)
        return DocumentDetailResponse(**response.model_dump(), extracted_text=document.extracted_text, preview_text=document.preview_text)

    @staticmethod
    def _object_id(value: str) -> PydanticObjectId:
        try:
            return PydanticObjectId(value)
        except Exception as exc:
            raise AppError("Invalid object id", status_code=422, error_code="INVALID_OBJECT_ID", details={"id": value}) from exc

    @staticmethod
    def _safe_file_name(file_name: str) -> str:
        name = Path(file_name).name.strip() or "document"
        return re.sub(r"[^A-Za-z0-9._-]+", "-", name)[:255]

    @staticmethod
    def _title_from_filename(file_name: str) -> str:
        return Path(file_name).stem.replace("-", " ").replace("_", " ").strip().title() or "Untitled document"

    @staticmethod
    def _normalize_optional(value: str | None) -> str | None:
        if value is None:
            return None
        normalized = " ".join(value.strip().split())
        return normalized or None

    @staticmethod
    def _normalize_tags(tags: str | list[str] | None) -> list[str]:
        if tags is None:
            return []
        raw_tags = tags.split(",") if isinstance(tags, str) else tags
        normalized: list[str] = []
        for tag in raw_tags:
            value = " ".join(str(tag).strip().split())
            if value and value not in normalized:
                normalized.append(value)
        return normalized[:30]

    @staticmethod
    def _parse_metadata(metadata_json: str | None) -> dict[str, Any]:
        if not metadata_json:
            return {}
        try:
            parsed = json.loads(metadata_json)
        except json.JSONDecodeError as exc:
            raise AppError("Invalid metadata JSON", status_code=422, error_code="INVALID_METADATA_JSON") from exc
        if not isinstance(parsed, dict):
            raise AppError("Metadata must be a JSON object", status_code=422, error_code="INVALID_METADATA_TYPE")
        return parsed

    @staticmethod
    def _document_kind(*, mime_type: str, file_name: str) -> DocumentKind:
        extension = Path(file_name).suffix.lower()
        if mime_type == "application/pdf" or extension == ".pdf":
            return DocumentKind.PDF
        if mime_type.startswith("image/"):
            return DocumentKind.IMAGE
        if mime_type in {"text/markdown", "text/x-markdown"} or extension in {".md", ".markdown"}:
            return DocumentKind.MARKDOWN
        if mime_type.startswith("text/") or extension in {".txt", ".json", ".csv"}:
            return DocumentKind.TEXT
        if extension in {".doc", ".docx", ".rtf"}:
            return DocumentKind.DOC
        if extension in {".xls", ".xlsx", ".ods"}:
            return DocumentKind.SPREADSHEET
        if extension in {".ppt", ".pptx", ".odp"}:
            return DocumentKind.PRESENTATION
        return DocumentKind.OTHER

    @staticmethod
    def _build_preview_text(*, content: bytes, mime_type: str, extracted_text: str | None) -> str | None:
        if extracted_text:
            return extracted_text[: settings.DOCUMENT_PREVIEW_MAX_CHARS]
        if mime_type.startswith("text/") or mime_type in {"application/json", "application/xml"}:
            try:
                return content.decode("utf-8", errors="ignore")[: settings.DOCUMENT_PREVIEW_MAX_CHARS]
            except Exception:
                return None
        return None


document_service = DocumentService()

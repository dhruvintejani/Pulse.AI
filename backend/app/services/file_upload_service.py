import hashlib
import json
import mimetypes
import re
from pathlib import Path
from uuid import uuid4
from beanie import PydanticObjectId
from fastapi import UploadFile
from app.core.config import settings
from app.core.errors import AppError
from app.models.document import Document, DocumentKind, DocumentStatus
from app.models.folder import Folder
from app.models.user import User
from app.schemas.upload import UploadMetadataResponse, UploadProgressResponse, UploadValidationResponse
from app.storage import DocumentUploadPayload, document_storage_registry
from app.utils.datetime import utc_now


class FileUploadService:
    allowed_extensions: dict[str, DocumentKind] = {
        ".pdf": DocumentKind.PDF,
        ".docx": DocumentKind.DOC,
        ".txt": DocumentKind.TEXT,
        ".csv": DocumentKind.TEXT,
        ".jpg": DocumentKind.IMAGE,
        ".jpeg": DocumentKind.IMAGE,
        ".png": DocumentKind.IMAGE,
        ".gif": DocumentKind.IMAGE,
        ".webp": DocumentKind.IMAGE,
    }

    allowed_mime_types: dict[str, DocumentKind] = {
        "application/pdf": DocumentKind.PDF,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": DocumentKind.DOC,
        "text/plain": DocumentKind.TEXT,
        "text/csv": DocumentKind.TEXT,
        "application/csv": DocumentKind.TEXT,
        "image/jpeg": DocumentKind.IMAGE,
        "image/png": DocumentKind.IMAGE,
        "image/gif": DocumentKind.IMAGE,
        "image/webp": DocumentKind.IMAGE,
    }

    blocked_extensions = {
        ".bat",
        ".cmd",
        ".com",
        ".dll",
        ".dmg",
        ".exe",
        ".js",
        ".msi",
        ".php",
        ".ps1",
        ".sh",
        ".vb",
        ".vbs",
    }

    def __init__(self) -> None:
        self._progress: dict[str, UploadProgressResponse] = {}

    async def upload_metadata_only(
        self,
        *,
        current_user: User,
        file: UploadFile,
        title: str | None = None,
        category: str | None = None,
        folder_id: str | None = None,
        tags: str | list[str] | None = None,
        metadata_json: str | None = None,
    ) -> UploadMetadataResponse:
        upload_id = uuid4().hex
        original_file_name = file.filename or "document"
        safe_file_name = self._safe_file_name(original_file_name)
        self._set_progress(upload_id, status="reading", file_name=safe_file_name)

        content = await file.read()
        validation = self.validate_bytes(file_name=safe_file_name, content=content, provided_mime_type=file.content_type)
        folder_object_id = await self._validate_folder(current_user=current_user, folder_id=folder_id)
        metadata = self._parse_metadata(metadata_json)
        provider = document_storage_registry.get()

        self._set_progress(
            upload_id,
            status="storing_metadata",
            file_name=safe_file_name,
            uploaded_bytes=len(content),
            total_bytes=len(content),
            progress=90,
        )

        stored = await provider.upload(
            DocumentUploadPayload(
                owner_id=str(current_user.id),
                file_name=safe_file_name,
                mime_type=validation.mime_type,
                content=content,
                checksum=validation.checksum or hashlib.sha256(content).hexdigest(),
                folder=settings.CLOUDINARY_FOLDER,
                metadata={**metadata, "upload_id": upload_id},
            )
        )

        document = Document(
            owner_id=current_user.id,
            folder_id=folder_object_id,
            title=title or self._title_from_filename(original_file_name),
            category=self._normalize_optional(category),
            file_name=safe_file_name,
            original_file_name=original_file_name,
            mime_type=validation.mime_type,
            kind=validation.kind,
            status=DocumentStatus.READY,
            file_size=len(content),
            storage_provider=stored.provider,
            storage_key=stored.storage_key,
            storage_resource_type=stored.resource_type,
            public_url=stored.public_url,
            secure_url=stored.secure_url,
            preview_url=stored.preview_url,
            checksum=validation.checksum,
            tags=self._normalize_tags(tags),
            processed_at=utc_now(),
            metadata={
                **metadata,
                **(stored.metadata or {}),
                "upload_id": upload_id,
                "secure_upload": True,
                "metadata_only": True,
                "progress_supported": True,
            },
        )
        document = await document.insert()

        self._set_progress(
            upload_id,
            document_id=str(document.id),
            status="completed",
            file_name=safe_file_name,
            uploaded_bytes=len(content),
            total_bytes=len(content),
            progress=100,
        )

        return UploadMetadataResponse(
            upload_id=upload_id,
            document_id=str(document.id),
            owner_id=str(document.owner_id),
            title=document.title,
            file_name=document.file_name,
            original_file_name=document.original_file_name,
            mime_type=document.mime_type,
            extension=Path(document.file_name).suffix.lower(),
            kind=document.kind,
            status=document.status,
            file_size=document.file_size,
            max_size=settings.document_max_upload_size_bytes,
            checksum=document.checksum or "",
            storage_provider=document.storage_provider,
            storage_key=document.storage_key,
            storage_resource_type=document.storage_resource_type,
            public_url=document.public_url,
            secure_url=document.secure_url,
            preview_url=document.preview_url,
            category=document.category,
            tags=document.tags,
            metadata=document.metadata,
            uploaded_bytes=document.file_size,
            total_bytes=document.file_size,
            progress=100,
            created_at=document.created_at,
        )

    async def validate_upload_file(self, *, file: UploadFile) -> UploadValidationResponse:
        content = await file.read()
        return self.validate_bytes(file_name=file.filename or "document", content=content, provided_mime_type=file.content_type)

    def validate_bytes(self, *, file_name: str, content: bytes, provided_mime_type: str | None = None) -> UploadValidationResponse:
        if not content:
            raise AppError("Uploaded file is empty", status_code=422, error_code="UPLOAD_EMPTY_FILE")
        if len(content) > settings.document_max_upload_size_bytes:
            raise AppError(
                "Uploaded file is too large",
                status_code=413,
                error_code="UPLOAD_FILE_TOO_LARGE",
                details={"max_size_mb": settings.DOCUMENT_MAX_UPLOAD_SIZE_MB},
            )

        safe_file_name = self._safe_file_name(file_name)
        extension = Path(safe_file_name).suffix.lower()
        mime_type = provided_mime_type or mimetypes.guess_type(safe_file_name)[0] or "application/octet-stream"

        self._validate_name_security(safe_file_name)

        if extension not in self.allowed_extensions:
            raise AppError(
                "File type is not supported",
                status_code=415,
                error_code="UPLOAD_UNSUPPORTED_EXTENSION",
                details={"extension": extension, "allowed": sorted(self.allowed_extensions.keys())},
            )

        if mime_type not in self.allowed_mime_types:
            guessed_mime = mimetypes.guess_type(safe_file_name)[0]
            if guessed_mime not in self.allowed_mime_types:
                raise AppError(
                    "File MIME type is not supported",
                    status_code=415,
                    error_code="UPLOAD_UNSUPPORTED_MIME_TYPE",
                    details={"mime_type": mime_type, "allowed": sorted(self.allowed_mime_types.keys())},
                )
            mime_type = guessed_mime

        kind_by_extension = self.allowed_extensions[extension]
        kind_by_mime = self.allowed_mime_types[mime_type]
        if kind_by_extension != kind_by_mime and not (extension == ".csv" and kind_by_mime == DocumentKind.TEXT):
            raise AppError(
                "File extension and MIME type do not match",
                status_code=422,
                error_code="UPLOAD_TYPE_MISMATCH",
                details={"extension": extension, "mime_type": mime_type},
            )

        self._validate_signature(extension=extension, mime_type=mime_type, content=content)

        return UploadValidationResponse(
            valid=True,
            file_name=safe_file_name,
            mime_type=mime_type,
            extension=extension,
            file_size=len(content),
            max_size=settings.document_max_upload_size_bytes,
            kind=kind_by_extension,
            checksum=hashlib.sha256(content).hexdigest(),
        )

    def get_progress(self, upload_id: str) -> UploadProgressResponse:
        progress = self._progress.get(upload_id)
        if progress is None:
            raise AppError("Upload progress not found", status_code=404, error_code="UPLOAD_PROGRESS_NOT_FOUND")
        return progress

    def _set_progress(
        self,
        upload_id: str,
        *,
        document_id: str | None = None,
        status: str,
        file_name: str | None = None,
        uploaded_bytes: int = 0,
        total_bytes: int = 0,
        progress: int = 0,
    ) -> None:
        self._progress[upload_id] = UploadProgressResponse(
            upload_id=upload_id,
            document_id=document_id,
            file_name=file_name,
            uploaded_bytes=uploaded_bytes,
            total_bytes=total_bytes,
            progress=progress,
            status=status,
            updated_at=utc_now(),
        )

    async def _validate_folder(self, *, current_user: User, folder_id: str | None) -> PydanticObjectId | None:
        if folder_id is None or folder_id == "":
            return None
        object_id = self._object_id(folder_id)
        folder = await Folder.find_one({"_id": object_id, "owner_id": current_user.id, "is_deleted": False})
        if folder is None:
            raise AppError("Folder not found", status_code=404, error_code="FOLDER_NOT_FOUND")
        return object_id

    def _validate_name_security(self, file_name: str) -> None:
        path = Path(file_name)
        suffixes = [suffix.lower() for suffix in path.suffixes]
        if not path.name or path.name in {".", ".."}:
            raise AppError("Invalid file name", status_code=422, error_code="UPLOAD_INVALID_FILE_NAME")
        if any(suffix in self.blocked_extensions for suffix in suffixes):
            raise AppError("Potentially unsafe file name", status_code=422, error_code="UPLOAD_UNSAFE_FILE_NAME")
        if len(suffixes) > 2:
            raise AppError("Too many file extensions", status_code=422, error_code="UPLOAD_SUSPICIOUS_FILE_NAME")

    @staticmethod
    def _validate_signature(*, extension: str, mime_type: str, content: bytes) -> None:
        if extension == ".pdf" and not content.startswith(b"%PDF"):
            raise AppError("Invalid PDF signature", status_code=422, error_code="UPLOAD_INVALID_SIGNATURE")
        if extension == ".docx" and not content.startswith(b"PK"):
            raise AppError("Invalid DOCX signature", status_code=422, error_code="UPLOAD_INVALID_SIGNATURE")
        if mime_type == "image/png" and not content.startswith(b"\x89PNG\r\n\x1a\n"):
            raise AppError("Invalid PNG signature", status_code=422, error_code="UPLOAD_INVALID_SIGNATURE")
        if mime_type == "image/jpeg" and not content.startswith(b"\xff\xd8\xff"):
            raise AppError("Invalid JPEG signature", status_code=422, error_code="UPLOAD_INVALID_SIGNATURE")
        if mime_type == "image/gif" and not (content.startswith(b"GIF87a") or content.startswith(b"GIF89a")):
            raise AppError("Invalid GIF signature", status_code=422, error_code="UPLOAD_INVALID_SIGNATURE")
        if mime_type == "image/webp" and not (content.startswith(b"RIFF") and b"WEBP" in content[:16]):
            raise AppError("Invalid WEBP signature", status_code=422, error_code="UPLOAD_INVALID_SIGNATURE")
        if extension in {".txt", ".csv"}:
            try:
                content[:4096].decode("utf-8")
            except UnicodeDecodeError as exc:
                raise AppError("Text file must be UTF-8 compatible", status_code=422, error_code="UPLOAD_INVALID_TEXT_ENCODING") from exc

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
    def _parse_metadata(metadata_json: str | None) -> dict[str, object]:
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
    def _object_id(value: str) -> PydanticObjectId:
        try:
            return PydanticObjectId(value)
        except Exception as exc:
            raise AppError("Invalid object id", status_code=422, error_code="INVALID_OBJECT_ID", details={"id": value}) from exc


file_upload_service = FileUploadService()

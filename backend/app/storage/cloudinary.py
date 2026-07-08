from app.core.config import settings
from app.core.errors import AppError
from app.storage.base import DocumentStorageProvider, DocumentUploadPayload, StoredDocument


class CloudinaryStorageProvider(DocumentStorageProvider):
    name = "cloudinary"

    async def upload(self, payload: DocumentUploadPayload) -> StoredDocument:
        if not settings.CLOUDINARY_CLOUD_NAME or not settings.CLOUDINARY_API_KEY or not settings.CLOUDINARY_API_SECRET:
            raise AppError(
                "Cloudinary storage is not configured",
                status_code=503,
                error_code="CLOUDINARY_NOT_CONFIGURED",
            )

        raise AppError(
            "Cloudinary upload transport is not implemented yet",
            status_code=501,
            error_code="CLOUDINARY_TRANSPORT_NOT_IMPLEMENTED",
        )

    async def delete(self, storage_key: str | None) -> None:
        if not storage_key:
            return None
        if not settings.CLOUDINARY_CLOUD_NAME or not settings.CLOUDINARY_API_KEY or not settings.CLOUDINARY_API_SECRET:
            return None
        return None

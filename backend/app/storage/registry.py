from app.core.config import settings
from app.core.errors import AppError
from app.storage.base import DocumentStorageProvider
from app.storage.cloudinary import CloudinaryStorageProvider
from app.storage.metadata import MetadataOnlyStorageProvider


class DocumentStorageRegistry:
    def __init__(self) -> None:
        self._providers: dict[str, DocumentStorageProvider] = {}

    def register(self, provider: DocumentStorageProvider) -> None:
        self._providers[provider.name.lower()] = provider

    def get(self, provider_name: str | None = None) -> DocumentStorageProvider:
        name = (provider_name or settings.DOCUMENT_STORAGE_PROVIDER).lower()
        provider = self._providers.get(name)
        if provider is None:
            raise AppError(
                "Document storage provider is not available",
                status_code=400,
                error_code="DOCUMENT_STORAGE_PROVIDER_NOT_AVAILABLE",
                details={"provider": name, "available": sorted(self._providers.keys())},
            )
        return provider

    def available(self) -> list[str]:
        return sorted(self._providers.keys())


def build_document_storage_registry() -> DocumentStorageRegistry:
    registry = DocumentStorageRegistry()
    registry.register(MetadataOnlyStorageProvider())
    registry.register(CloudinaryStorageProvider())
    return registry


document_storage_registry = build_document_storage_registry()

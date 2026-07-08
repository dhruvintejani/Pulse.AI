from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class StoredDocument:
    provider: str
    storage_key: str | None
    resource_type: str | None = None
    public_url: str | None = None
    secure_url: str | None = None
    preview_url: str | None = None
    metadata: dict[str, Any] | None = None


@dataclass(frozen=True)
class DocumentUploadPayload:
    owner_id: str
    file_name: str
    mime_type: str
    content: bytes
    checksum: str
    folder: str | None = None
    metadata: dict[str, Any] | None = None


class DocumentStorageProvider(ABC):
    name: str

    @abstractmethod
    async def upload(self, payload: DocumentUploadPayload) -> StoredDocument:
        raise NotImplementedError

    @abstractmethod
    async def delete(self, storage_key: str | None) -> None:
        raise NotImplementedError

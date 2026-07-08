from app.storage.base import DocumentStorageProvider, DocumentUploadPayload, StoredDocument


class MetadataOnlyStorageProvider(DocumentStorageProvider):
    name = "metadata"

    async def upload(self, payload: DocumentUploadPayload) -> StoredDocument:
        return StoredDocument(
            provider=self.name,
            storage_key=f"metadata://{payload.owner_id}/{payload.checksum}/{payload.file_name}",
            resource_type="metadata",
            metadata={
                "file_name": payload.file_name,
                "mime_type": payload.mime_type,
                "checksum": payload.checksum,
                "size_bytes": len(payload.content),
                "storage_mode": "metadata_only",
            },
        )

    async def delete(self, storage_key: str | None) -> None:
        return None

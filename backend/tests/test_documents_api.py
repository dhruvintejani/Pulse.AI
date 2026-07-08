from datetime import UTC, datetime
from app.api.v1.endpoints import documents
from app.models.document import DocumentKind, DocumentStatus
from app.schemas.common import Page, PageMeta
from app.schemas.document import DocumentDetailResponse, DocumentFacetResponse, DocumentPreviewResponse, DocumentResponse


def document_payload(now: datetime, title: str = "Roadmap") -> DocumentResponse:
    return DocumentResponse(
        id="doc_1",
        owner_id="user_1",
        title=title,
        description="Product roadmap",
        category="Strategy",
        file_name="roadmap.pdf",
        mime_type="application/pdf",
        kind=DocumentKind.PDF,
        status=DocumentStatus.READY,
        file_size=1024,
        storage_provider="metadata",
        tags=["strategy"],
        created_at=now,
        updated_at=now,
        metadata={},
    )


class MockDocumentService:
    async def list_documents(self, **kwargs):
        now = datetime.now(UTC)
        return Page(items=[document_payload(now)], meta=PageMeta(page=1, size=20, total=1))

    async def get_document(self, **kwargs):
        base = document_payload(datetime.now(UTC))
        return DocumentDetailResponse(**base.model_dump(), extracted_text="Roadmap text", preview_text="Roadmap preview")

    async def preview_document(self, **kwargs):
        return DocumentPreviewResponse(
            id=kwargs["document_id"],
            title="Roadmap",
            mime_type="application/pdf",
            kind=DocumentKind.PDF,
            preview_text="Roadmap preview",
        )

    async def list_categories(self, **kwargs):
        return [DocumentFacetResponse(value="Strategy", count=1)]

    async def delete_document(self, **kwargs):
        return None


def test_list_documents(client, monkeypatch):
    monkeypatch.setattr(documents, "document_service", MockDocumentService())

    response = client.get("/api/v1/documents?search=roadmap")

    assert response.status_code == 200
    assert response.json()["items"][0]["file_name"] == "roadmap.pdf"


def test_preview_document(client, monkeypatch):
    monkeypatch.setattr(documents, "document_service", MockDocumentService())

    response = client.get("/api/v1/documents/doc_1/preview")

    assert response.status_code == 200
    assert response.json()["preview_text"] == "Roadmap preview"


def test_document_categories_and_delete(client, monkeypatch):
    monkeypatch.setattr(documents, "document_service", MockDocumentService())

    categories_response = client.get("/api/v1/documents/categories")
    delete_response = client.delete("/api/v1/documents/doc_1")

    assert categories_response.status_code == 200
    assert categories_response.json()[0]["value"] == "Strategy"
    assert delete_response.status_code == 200
    assert delete_response.json()["success"] is True

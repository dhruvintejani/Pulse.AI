from datetime import UTC, datetime
from app.api.v1.endpoints import search
from app.schemas.search import GlobalSearchResponse, GlobalSearchResult, SearchHighlight


class MockSearchService:
    async def search(self, **kwargs):
        return GlobalSearchResponse(
            query=kwargs["query"],
            filters=kwargs["filters"] or ["chat", "message", "document", "user", "setting"],
            items=[
                GlobalSearchResult(
                    id="doc_1",
                    type="document",
                    title="Product Roadmap.pdf",
                    description="Roadmap planning document",
                    url="/dashboard/documents",
                    score=99,
                    highlights=[SearchHighlight(field="title", snippet="Product <mark>Roadmap</mark>.pdf")],
                    metadata={"kind": "pdf"},
                    updated_at=datetime.now(UTC),
                )
            ],
            page=kwargs["page"],
            size=kwargs["size"],
            total=1,
            has_next=False,
            recent_searches=[kwargs["query"]],
        )


def test_global_search_returns_highlights_and_pagination(client, monkeypatch):
    monkeypatch.setattr(search, "global_search_service", MockSearchService())

    response = client.get("/api/v1/search?q=roadmap&page=1&size=8&filters=document")

    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 1
    assert body["items"][0]["type"] == "document"
    assert "<mark>Roadmap</mark>" in body["items"][0]["highlights"][0]["snippet"]
    assert body["recent_searches"] == ["roadmap"]


def test_search_filter_metadata(client):
    response = client.get("/api/v1/search/filters")

    assert response.status_code == 200
    assert {item["value"] for item in response.json()["items"]} >= {"chat", "message", "document", "user", "setting"}

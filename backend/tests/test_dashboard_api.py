from datetime import UTC, datetime
from app.api.v1.endpoints import dashboard
from app.models.document import DocumentKind
from app.schemas.dashboard import DashboardMetric, DashboardOverviewResponse, RecentChatResponse, RecentDocumentResponse, UserStatisticsResponse


class MockDashboardService:
    async def overview(self, **kwargs):
        now = datetime.now(UTC)
        return DashboardOverviewResponse(
            metrics=[DashboardMetric(key="chats", label="Chats", value=10, change=5, trend="up")],
            recent_chats=[
                RecentChatResponse(
                    id="chat_1",
                    title="Market Research",
                    message_count=5,
                    is_pinned=True,
                    is_favorite=False,
                    updated_at=now,
                )
            ],
            recent_documents=[
                RecentDocumentResponse(
                    id="doc_1",
                    title="Roadmap",
                    file_name="roadmap.pdf",
                    mime_type="application/pdf",
                    kind=DocumentKind.PDF,
                    category="Strategy",
                    tags=["strategy"],
                    file_size=1024,
                    updated_at=now,
                )
            ],
            unread_notifications=2,
        )

    async def user_statistics(self, **kwargs):
        return UserStatisticsResponse(
            user_id="user_1",
            total_chats=10,
            total_messages=25,
            total_documents=5,
            total_notifications=3,
            unread_notifications=1,
            total_tokens=1000,
            favorite_chats=2,
            pinned_chats=1,
            documents_by_kind={"pdf": 5},
        )


def test_dashboard_overview(client, monkeypatch):
    monkeypatch.setattr(dashboard, "dashboard_service", MockDashboardService())

    response = client.get("/api/v1/dashboard/overview")

    assert response.status_code == 200
    assert response.json()["metrics"][0]["key"] == "chats"
    assert response.json()["unread_notifications"] == 2


def test_dashboard_user_statistics(client, monkeypatch):
    monkeypatch.setattr(dashboard, "dashboard_service", MockDashboardService())

    response = client.get("/api/v1/dashboard/user-statistics")

    assert response.status_code == 200
    assert response.json()["total_tokens"] == 1000

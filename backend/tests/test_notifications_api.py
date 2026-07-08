from datetime import UTC, datetime
from app.api.v1.endpoints import notifications
from app.models.notification import NotificationStatus, NotificationType
from app.schemas.common import Page, PageMeta
from app.schemas.notification import NotificationBulkResult, NotificationResponse, NotificationUnreadCountResponse


def notification_payload(status: NotificationStatus = NotificationStatus.UNREAD) -> NotificationResponse:
    now = datetime.now(UTC)
    return NotificationResponse(
        id="notification_1",
        user_id="user_1",
        type=NotificationType.INFO,
        status=status,
        title="Document ready",
        message="Your document is ready.",
        created_at=now,
        updated_at=now,
        metadata={},
    )


class MockNotificationService:
    async def list_notifications(self, **kwargs):
        return Page(items=[notification_payload()], meta=PageMeta(page=1, size=20, total=1))

    async def get_unread_count(self, **kwargs):
        return NotificationUnreadCountResponse(unread_count=1)

    async def mark_as_read(self, **kwargs):
        return notification_payload(NotificationStatus.READ)

    async def delete_notification(self, **kwargs):
        return NotificationBulkResult(affected=1, message="Notification deleted")

    async def clear_all(self, **kwargs):
        return NotificationBulkResult(affected=1, message="Notifications cleared")


def test_list_notifications_and_unread_count(client, monkeypatch):
    monkeypatch.setattr(notifications, "notification_service", MockNotificationService())

    list_response = client.get("/api/v1/notifications")
    unread_response = client.get("/api/v1/notifications/unread-count")

    assert list_response.status_code == 200
    assert list_response.json()["items"][0]["status"] == "unread"
    assert unread_response.status_code == 200
    assert unread_response.json()["unread_count"] == 1


def test_mark_read_delete_and_clear_notifications(client, monkeypatch):
    monkeypatch.setattr(notifications, "notification_service", MockNotificationService())

    read_response = client.patch("/api/v1/notifications/notification_1/read")
    delete_response = client.delete("/api/v1/notifications/notification_1")
    clear_response = client.delete("/api/v1/notifications/clear-all")

    assert read_response.status_code == 200
    assert read_response.json()["status"] == "read"
    assert delete_response.status_code == 200
    assert delete_response.json()["affected"] == 1
    assert clear_response.status_code == 200
    assert clear_response.json()["affected"] == 1

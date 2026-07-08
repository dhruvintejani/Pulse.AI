from app.api.v1.endpoints import conversations
from app.core.errors import AppError


class FailingChatService:
    async def get_conversation(self, **kwargs):
        raise AppError("Conversation not found", status_code=404, error_code="CONVERSATION_NOT_FOUND")


def test_app_error_response_shape(client, monkeypatch):
    monkeypatch.setattr(conversations, "chat_service", FailingChatService())

    response = client.get("/api/v1/conversations/missing")

    assert response.status_code == 404
    body = response.json()
    assert body["success"] is False
    assert body["error_code"] == "CONVERSATION_NOT_FOUND"
    assert body["message"] == "Conversation not found"

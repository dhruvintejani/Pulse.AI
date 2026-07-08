from datetime import UTC, datetime
from app.api.v1.endpoints import conversations
from app.models.chat import ChatStatus
from app.models.message import MessageRole, MessageStatus
from app.schemas.chat import ConversationDetailResponse, ConversationResponse, ConversationToggleResponse, MessageResponse
from app.schemas.common import Page, PageMeta


def conversation_payload(now: datetime, title: str = "Test Chat") -> ConversationResponse:
    return ConversationResponse(
        id="chat_1",
        owner_id="user_1",
        title=title,
        summary="A test conversation",
        status=ChatStatus.ACTIVE,
        model="mock-model",
        tags=["test"],
        is_pinned=False,
        is_favorite=False,
        message_count=1,
        last_message_at=now,
        created_at=now,
        updated_at=now,
    )


def message_payload(now: datetime) -> MessageResponse:
    return MessageResponse(
        id="msg_1",
        chat_id="chat_1",
        user_id="user_1",
        role=MessageRole.USER,
        status=MessageStatus.COMPLETED,
        content="Hello Pulse AI",
        content_preview="Hello Pulse AI",
        model="mock-model",
        token_count=4,
        attachments=[],
        created_at=now,
        updated_at=now,
    )


class MockChatService:
    async def list_conversations(self, **kwargs):
        now = datetime.now(UTC)
        return Page(items=[conversation_payload(now)], meta=PageMeta(page=1, size=20, total=1))

    async def create_conversation(self, **kwargs):
        now = datetime.now(UTC)
        conversation = conversation_payload(now, title="Created Chat")
        return ConversationDetailResponse(**conversation.model_dump(), messages=[message_payload(now)])

    async def rename_conversation(self, **kwargs):
        return conversation_payload(datetime.now(UTC), title=kwargs["request"].title)

    async def toggle_pinned(self, **kwargs):
        return ConversationToggleResponse(id=kwargs["conversation_id"], is_pinned=True, is_favorite=False)

    async def list_messages(self, **kwargs):
        now = datetime.now(UTC)
        return Page(items=[message_payload(now)], meta=PageMeta(page=1, size=20, total=1))


def test_list_conversations(client, monkeypatch):
    monkeypatch.setattr(conversations, "chat_service", MockChatService())

    response = client.get("/api/v1/conversations")

    assert response.status_code == 200
    assert response.json()["items"][0]["title"] == "Test Chat"


def test_create_conversation(client, monkeypatch):
    monkeypatch.setattr(conversations, "chat_service", MockChatService())

    response = client.post("/api/v1/conversations", json={"title": "Created Chat", "initial_message": "Hello"})

    assert response.status_code == 201
    assert response.json()["messages"][0]["content"] == "Hello Pulse AI"


def test_rename_and_pin_conversation(client, monkeypatch):
    monkeypatch.setattr(conversations, "chat_service", MockChatService())

    rename_response = client.patch("/api/v1/conversations/chat_1/rename", json={"title": "Renamed"})
    pin_response = client.patch("/api/v1/conversations/chat_1/pin")

    assert rename_response.status_code == 200
    assert rename_response.json()["title"] == "Renamed"
    assert pin_response.status_code == 200
    assert pin_response.json()["is_pinned"] is True


def test_list_messages(client, monkeypatch):
    monkeypatch.setattr(conversations, "chat_service", MockChatService())

    response = client.get("/api/v1/conversations/chat_1/messages")

    assert response.status_code == 200
    assert response.json()["items"][0]["content"] == "Hello Pulse AI"

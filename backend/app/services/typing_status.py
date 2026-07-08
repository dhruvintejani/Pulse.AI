from dataclasses import dataclass
from datetime import datetime, timedelta
from app.utils.datetime import utc_now


@dataclass
class TypingState:
    conversation_id: str
    user_id: str
    source: str
    is_typing: bool
    expires_at: datetime | None = None


class TypingStatusService:
    def __init__(self) -> None:
        self._states: dict[str, TypingState] = {}

    def set_status(self, *, conversation_id: str, user_id: str, source: str, is_typing: bool, ttl_seconds: int = 10) -> TypingState:
        expires_at = utc_now() + timedelta(seconds=ttl_seconds) if is_typing else None
        key = self._key(conversation_id, user_id, source)
        state = TypingState(
            conversation_id=conversation_id,
            user_id=user_id,
            source=source,
            is_typing=is_typing,
            expires_at=expires_at,
        )
        self._states[key] = state
        return state

    def get_status(self, *, conversation_id: str, user_id: str, source: str = "user") -> TypingState:
        key = self._key(conversation_id, user_id, source)
        state = self._states.get(key)
        if state is None:
            return TypingState(conversation_id=conversation_id, user_id=user_id, source=source, is_typing=False)
        if state.expires_at and state.expires_at <= utc_now():
            self._states.pop(key, None)
            return TypingState(conversation_id=conversation_id, user_id=user_id, source=source, is_typing=False)
        return state

    @staticmethod
    def _key(conversation_id: str, user_id: str, source: str) -> str:
        return f"{conversation_id}:{user_id}:{source}"


typing_status_service = TypingStatusService()

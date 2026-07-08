import json
import re
from collections.abc import Mapping, Sequence
from datetime import UTC, datetime, timedelta
from typing import Any
from urllib.parse import unquote_plus
from jose import JWTError, jwt
from app.core.config import settings
from app.core.errors import AppError

CONTROL_CHARS = re.compile(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]")
SUSPICIOUS_PATTERNS = [
    re.compile(pattern, re.IGNORECASE)
    for pattern in (
        r"<\s*script\b",
        r"javascript\s*:",
        r"\bon\w+\s*=",
        r"\bunion\s+select\b",
        r"\bselect\b.+\bfrom\b",
        r"\binsert\b.+\binto\b",
        r"\bdrop\s+table\b",
        r"\bdelete\s+from\b",
        r"\$where\b",
        r"\$ne\b",
        r"\$gt\b",
        r"\$lt\b",
        r"\$regex\b",
        r"\{\s*\$",
    )
]
SAFE_CONTENT_TYPES = (
    "application/json",
    "application/merge-patch+json",
    "application/x-www-form-urlencoded",
    "text/plain",
)


def create_internal_access_token(
    subject: str,
    *,
    scopes: list[str] | None = None,
    expires_delta: timedelta | None = None,
) -> str:
    expires_at = datetime.now(UTC) + (expires_delta or timedelta(minutes=settings.INTERNAL_JWT_EXPIRES_MINUTES))
    payload: dict[str, Any] = {
        "sub": subject,
        "scopes": scopes or [],
        "exp": expires_at,
        "iat": datetime.now(UTC),
        "typ": "internal",
    }
    return jwt.encode(payload, settings.INTERNAL_JWT_SECRET, algorithm=settings.INTERNAL_JWT_ALGORITHM)


def decode_internal_access_token(token: str) -> dict[str, Any]:
    try:
        payload = jwt.decode(token, settings.INTERNAL_JWT_SECRET, algorithms=[settings.INTERNAL_JWT_ALGORITHM])
    except JWTError as exc:
        raise AppError("Invalid internal token", status_code=401, error_code="INVALID_INTERNAL_TOKEN") from exc

    if payload.get("typ") != "internal":
        raise AppError("Invalid token type", status_code=401, error_code="INVALID_TOKEN_TYPE")

    return payload


def normalize_string(value: str, *, max_length: int = 50000) -> str:
    normalized = CONTROL_CHARS.sub("", value)
    normalized = " ".join(normalized.split()) if len(normalized) <= 1000 else normalized.strip()
    return normalized[:max_length]


def has_suspicious_input(value: str) -> bool:
    decoded = unquote_plus(value)
    normalized = CONTROL_CHARS.sub("", decoded)
    return any(pattern.search(normalized) for pattern in SUSPICIOUS_PATTERNS)


def ensure_safe_input(value: Any, *, location: str = "body") -> None:
    if isinstance(value, str):
        if settings.SECURITY_BLOCK_SUSPICIOUS_INPUT and has_suspicious_input(value):
            raise AppError(
                "Suspicious input was rejected",
                status_code=400,
                error_code="SUSPICIOUS_INPUT",
                details={"location": location},
            )
        return

    if isinstance(value, Mapping):
        for key, item in value.items():
            ensure_safe_input(str(key), location=location)
            ensure_safe_input(item, location=location)
        return

    if isinstance(value, Sequence) and not isinstance(value, (bytes, bytearray)):
        for item in value:
            ensure_safe_input(item, location=location)


def parse_json_body(body: bytes) -> Any | None:
    if not body:
        return None
    try:
        return json.loads(body)
    except json.JSONDecodeError:
        return None


def is_sanitizable_content_type(content_type: str | None) -> bool:
    if not content_type:
        return False
    base_type = content_type.split(";", 1)[0].strip().lower()
    return base_type in SAFE_CONTENT_TYPES

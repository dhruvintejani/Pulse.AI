from datetime import UTC, datetime, timedelta
from typing import Any
from jose import JWTError, jwt
from app.core.config import settings
from app.core.errors import AppError


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

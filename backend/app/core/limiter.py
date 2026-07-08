from fastapi import Request
from slowapi import Limiter
from app.core.config import settings


def get_rate_limit_key(request: Request) -> str:
    authorization = request.headers.get("Authorization", "")
    forwarded_for = request.headers.get("X-Forwarded-For", "")
    client_ip = forwarded_for.split(",")[0].strip() or (request.client.host if request.client else "anonymous")

    if authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1]
        return f"bearer:{token[-24:]}:{client_ip}"

    return client_ip


limiter = Limiter(
    key_func=get_rate_limit_key,
    default_limits=[settings.RATE_LIMIT_DEFAULT],
    storage_uri=settings.RATE_LIMIT_STORAGE_URI,
    headers_enabled=True,
)

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from loguru import logger
from app.core.errors import AppError
from app.models.user import User
from app.services import clerk_auth_service, user_sync_service

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> User:
    if credentials is None or credentials.scheme.lower() != "bearer" or not credentials.credentials:
        logger.bind(category="auth").warning("Authentication missing or invalid scheme")
        raise AppError("Authentication required", status_code=401, error_code="AUTH_REQUIRED")

    try:
        claims = await clerk_auth_service.verify_token(credentials.credentials)
        user = await user_sync_service.get_or_create_user(claims)
    except Exception:
        logger.bind(category="auth").exception("Authentication failed")
        raise

    logger.bind(category="auth").info(
        "Authentication succeeded",
        user_id=str(user.id),
        clerk_user_id=user.clerk_user_id or user.external_auth_id,
        role=user.role.value,
    )
    return user

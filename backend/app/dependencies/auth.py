from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.core.errors import AppError
from app.models.user import User
from app.services import clerk_auth_service, user_sync_service

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> User:
    if credentials is None or credentials.scheme.lower() != "bearer" or not credentials.credentials:
        raise AppError("Authentication required", status_code=401, error_code="AUTH_REQUIRED")

    claims = await clerk_auth_service.verify_token(credentials.credentials)
    return await user_sync_service.get_or_create_user(claims)

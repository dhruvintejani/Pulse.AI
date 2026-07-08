from fastapi import Depends
from app.core.errors import AppError
from app.dependencies.auth import get_current_user
from app.models.user import User, UserRole, UserStatus


ADMIN_ROLES = {UserRole.OWNER, UserRole.ADMIN}


async def require_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.status != UserStatus.ACTIVE:
        raise AppError("User account is not active", status_code=403, error_code="USER_NOT_ACTIVE")

    if current_user.role not in ADMIN_ROLES:
        raise AppError("Admin access required", status_code=403, error_code="ADMIN_ACCESS_REQUIRED")

    return current_user

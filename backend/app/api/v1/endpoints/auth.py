from fastapi import APIRouter, Depends
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import AuthenticatedUserResponse
from app.services import user_sync_service

router = APIRouter(prefix="/auth")


@router.get("/me", response_model=AuthenticatedUserResponse)
async def get_authenticated_user(current_user: User = Depends(get_current_user)) -> AuthenticatedUserResponse:
    return user_sync_service.to_response(current_user)

from fastapi import APIRouter, Depends
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.settings import RecentSearchesResponse, RecentSearchesUpdate, UserSettingsResponse, UserSettingsUpdate
from app.services import settings_service

router = APIRouter(prefix="/settings")


@router.get("/me", response_model=UserSettingsResponse)
async def get_my_settings(current_user: User = Depends(get_current_user)) -> UserSettingsResponse:
    return await settings_service.get_settings(current_user=current_user)


@router.patch("/me", response_model=UserSettingsResponse)
async def update_my_settings(
    request: UserSettingsUpdate,
    current_user: User = Depends(get_current_user),
) -> UserSettingsResponse:
    return await settings_service.update_settings(current_user=current_user, request=request)


@router.get("/me/recent-searches", response_model=RecentSearchesResponse)
async def get_recent_searches(current_user: User = Depends(get_current_user)) -> RecentSearchesResponse:
    return await settings_service.recent_searches(current_user=current_user)


@router.post("/me/recent-searches", response_model=RecentSearchesResponse)
async def add_recent_search(
    request: RecentSearchesUpdate,
    current_user: User = Depends(get_current_user),
) -> RecentSearchesResponse:
    return await settings_service.add_recent_search(current_user=current_user, query=request.query)


@router.delete("/me/recent-searches", response_model=RecentSearchesResponse)
async def clear_recent_searches(current_user: User = Depends(get_current_user)) -> RecentSearchesResponse:
    return await settings_service.clear_recent_searches(current_user=current_user)

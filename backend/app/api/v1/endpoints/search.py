from fastapi import APIRouter, Depends, Query
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.search import GlobalSearchFiltersResponse, GlobalSearchResponse, SearchEntityType
from app.services import global_search_service
from app.services.search_service import SEARCH_FILTERS

router = APIRouter(prefix="/search")


@router.get("", response_model=GlobalSearchResponse)
async def global_search(
    q: str = Query(default="", max_length=120),
    page: int = Query(default=1, ge=1),
    size: int = Query(default=10, ge=1, le=50),
    filters: list[SearchEntityType] | None = Query(default=None),
    current_user: User = Depends(get_current_user),
) -> GlobalSearchResponse:
    return await global_search_service.search(
        current_user=current_user,
        query=q,
        page=page,
        size=size,
        filters=filters,
    )


@router.get("/filters", response_model=GlobalSearchFiltersResponse)
async def global_search_filters(current_user: User = Depends(get_current_user)) -> GlobalSearchFiltersResponse:
    return GlobalSearchFiltersResponse(
        items=[{"value": item, "label": item.title()} for item in SEARCH_FILTERS]
    )

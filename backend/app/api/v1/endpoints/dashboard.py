from fastapi import APIRouter, Depends, Query
from app.dependencies import get_current_user, get_pagination_params
from app.models.document import DocumentKind
from app.models.notification import NotificationStatus, NotificationType
from app.models.user import User
from app.schemas.common import Page, PaginationParams
from app.schemas.dashboard import (
    AIUsageResponse,
    ActivityTimelineItem,
    DashboardChartsResponse,
    DashboardNotificationResponse,
    DashboardOverviewResponse,
    DashboardSearchResult,
    RecentChatResponse,
    RecentDocumentResponse,
    UserStatisticsResponse,
)
from app.services import dashboard_service

router = APIRouter(prefix="/dashboard")


@router.get("/overview", response_model=DashboardOverviewResponse)
async def dashboard_overview(current_user: User = Depends(get_current_user)) -> DashboardOverviewResponse:
    return await dashboard_service.overview(current_user=current_user)


@router.get("/recent-chats", response_model=list[RecentChatResponse])
async def recent_chats(
    limit: int = Query(default=8, ge=1, le=50),
    search: str | None = Query(default=None, max_length=120),
    pinned: bool | None = Query(default=None),
    favorite: bool | None = Query(default=None),
    current_user: User = Depends(get_current_user),
) -> list[RecentChatResponse]:
    return await dashboard_service.recent_chats(
        current_user=current_user,
        limit=limit,
        search=search,
        pinned=pinned,
        favorite=favorite,
    )


@router.get("/recent-documents", response_model=list[RecentDocumentResponse])
async def recent_documents(
    limit: int = Query(default=8, ge=1, le=50),
    search: str | None = Query(default=None, max_length=120),
    category: str | None = Query(default=None, max_length=80),
    kind: DocumentKind | None = Query(default=None),
    tags: list[str] | None = Query(default=None),
    current_user: User = Depends(get_current_user),
) -> list[RecentDocumentResponse]:
    return await dashboard_service.recent_documents(
        current_user=current_user,
        limit=limit,
        search=search,
        category=category,
        kind=kind,
        tags=tags,
    )


@router.get("/user-statistics", response_model=UserStatisticsResponse)
async def user_statistics(current_user: User = Depends(get_current_user)) -> UserStatisticsResponse:
    return await dashboard_service.user_statistics(current_user=current_user)


@router.get("/ai-usage", response_model=AIUsageResponse)
async def ai_usage(
    days: int = Query(default=14, ge=1, le=90),
    current_user: User = Depends(get_current_user),
) -> AIUsageResponse:
    return await dashboard_service.ai_usage(current_user=current_user, days=days)


@router.get("/notifications", response_model=Page[DashboardNotificationResponse])
async def dashboard_notifications(
    status: NotificationStatus | None = Query(default=None),
    type_filter: NotificationType | None = Query(default=None, alias="type"),
    params: PaginationParams = Depends(get_pagination_params),
    current_user: User = Depends(get_current_user),
) -> Page[DashboardNotificationResponse]:
    return await dashboard_service.notifications(
        current_user=current_user,
        params=params,
        status=status,
        type_filter=type_filter,
    )


@router.get("/activity-timeline", response_model=Page[ActivityTimelineItem])
async def activity_timeline(
    type_filter: str | None = Query(default=None, alias="type", pattern="^(chat|message|document|notification)$"),
    params: PaginationParams = Depends(get_pagination_params),
    current_user: User = Depends(get_current_user),
) -> Page[ActivityTimelineItem]:
    return await dashboard_service.activity_timeline(current_user=current_user, params=params, type_filter=type_filter)


@router.get("/charts", response_model=DashboardChartsResponse)
async def dashboard_charts(
    days: int = Query(default=14, ge=1, le=90),
    current_user: User = Depends(get_current_user),
) -> DashboardChartsResponse:
    return await dashboard_service.charts(current_user=current_user, days=days)


@router.get("/search", response_model=Page[DashboardSearchResult])
async def dashboard_search(
    q: str = Query(..., min_length=1, max_length=120),
    type_filter: str | None = Query(default=None, alias="type", pattern="^(chat|message|document|notification)$"),
    params: PaginationParams = Depends(get_pagination_params),
    current_user: User = Depends(get_current_user),
) -> Page[DashboardSearchResult]:
    return await dashboard_service.search(current_user=current_user, query=q, params=params, type_filter=type_filter)

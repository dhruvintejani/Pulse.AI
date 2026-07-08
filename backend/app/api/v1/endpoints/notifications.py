from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from app.dependencies import get_current_user, get_pagination_params
from app.models.notification import NotificationStatus, NotificationType
from app.models.user import User
from app.schemas.common import Page
from app.schemas.common import PaginationParams
from app.schemas.notification import (
    NotificationBulkResult,
    NotificationCategoryResponse,
    NotificationCreate,
    NotificationPreferencesResponse,
    NotificationPreferencesUpdate,
    NotificationResponse,
    NotificationUnreadCountResponse,
    NotificationUpdate,
)
from app.services import notification_service

router = APIRouter(prefix="/notifications")


@router.get("", response_model=Page[NotificationResponse])
async def list_notifications(
    status: NotificationStatus | None = Query(default=None),
    type_filter: NotificationType | None = Query(default=None, alias="type"),
    params: PaginationParams = Depends(get_pagination_params),
    current_user: User = Depends(get_current_user),
) -> Page[NotificationResponse]:
    return await notification_service.list_notifications(
        current_user=current_user,
        params=params,
        status=status,
        type_filter=type_filter,
    )


@router.post("", response_model=NotificationResponse)
async def create_notification(
    request: NotificationCreate,
    current_user: User = Depends(get_current_user),
) -> NotificationResponse:
    return await notification_service.create_notification(current_user=current_user, request=request)


@router.get("/unread-count", response_model=NotificationUnreadCountResponse)
async def unread_count(current_user: User = Depends(get_current_user)) -> NotificationUnreadCountResponse:
    return await notification_service.get_unread_count(current_user=current_user)


@router.get("/categories", response_model=list[NotificationCategoryResponse])
async def notification_categories(current_user: User = Depends(get_current_user)) -> list[NotificationCategoryResponse]:
    return await notification_service.categories(current_user=current_user)


@router.get("/preferences", response_model=NotificationPreferencesResponse)
async def get_notification_preferences(current_user: User = Depends(get_current_user)) -> NotificationPreferencesResponse:
    return await notification_service.get_preferences(current_user=current_user)


@router.patch("/preferences", response_model=NotificationPreferencesResponse)
async def update_notification_preferences(
    request: NotificationPreferencesUpdate,
    current_user: User = Depends(get_current_user),
) -> NotificationPreferencesResponse:
    return await notification_service.update_preferences(current_user=current_user, request=request)


@router.post("/mark-all-read", response_model=NotificationBulkResult)
async def mark_all_notifications_read(current_user: User = Depends(get_current_user)) -> NotificationBulkResult:
    return await notification_service.mark_all_as_read(current_user=current_user)


@router.delete("/clear-all", response_model=NotificationBulkResult)
async def clear_all_notifications(current_user: User = Depends(get_current_user)) -> NotificationBulkResult:
    return await notification_service.clear_all(current_user=current_user)


@router.get("/stream")
async def stream_notifications(current_user: User = Depends(get_current_user)) -> StreamingResponse:
    async def event_stream():
        async for event in notification_service.stream(current_user=current_user):
            yield event

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@router.patch("/{notification_id}", response_model=NotificationResponse)
async def update_notification(
    notification_id: str,
    request: NotificationUpdate,
    current_user: User = Depends(get_current_user),
) -> NotificationResponse:
    return await notification_service.update_notification(current_user=current_user, notification_id=notification_id, request=request)


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_read(
    notification_id: str,
    current_user: User = Depends(get_current_user),
) -> NotificationResponse:
    return await notification_service.mark_as_read(current_user=current_user, notification_id=notification_id)


@router.patch("/{notification_id}/unread", response_model=NotificationResponse)
async def mark_notification_unread(
    notification_id: str,
    current_user: User = Depends(get_current_user),
) -> NotificationResponse:
    return await notification_service.mark_as_unread(current_user=current_user, notification_id=notification_id)


@router.delete("/{notification_id}", response_model=NotificationBulkResult)
async def delete_notification(
    notification_id: str,
    current_user: User = Depends(get_current_user),
) -> NotificationBulkResult:
    return await notification_service.delete_notification(current_user=current_user, notification_id=notification_id)

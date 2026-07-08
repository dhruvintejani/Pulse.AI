from fastapi import APIRouter, Depends, Query
from app.dependencies import get_pagination_params, require_admin_user
from app.models.feedback import FeedbackStatus, FeedbackType
from app.models.notification import NotificationStatus, NotificationType
from app.models.system_log import SystemLogLevel, SystemLogSource
from app.models.user import User, UserRole, UserStatus
from app.schemas.admin import (
    AdminAnalyticsResponse,
    AdminChatResponse,
    AdminDashboardResponse,
    AdminDocumentResponse,
    AdminFeedbackResponse,
    AdminFeedbackUpdate,
    AdminNotificationBroadcast,
    AdminNotificationResponse,
    AdminRoleResponse,
    AdminRoleUpsert,
    AdminSettingsResponse,
    AdminSystemLogCreate,
    AdminSystemLogResponse,
    AdminUserResponse,
    AdminUserUpdate,
)
from app.schemas.common import Page, PaginationParams
from app.schemas.notification import NotificationBulkResult
from app.services import admin_service

router = APIRouter(prefix="/admin")


@router.get("/dashboard", response_model=AdminDashboardResponse)
async def admin_dashboard(admin_user: User = Depends(require_admin_user)) -> AdminDashboardResponse:
    return await admin_service.dashboard()


@router.get("/users", response_model=Page[AdminUserResponse])
async def admin_users(
    role: UserRole | None = Query(default=None),
    status: UserStatus | None = Query(default=None),
    params: PaginationParams = Depends(get_pagination_params),
    admin_user: User = Depends(require_admin_user),
) -> Page[AdminUserResponse]:
    return await admin_service.list_users(params=params, role=role, status=status)


@router.patch("/users/{user_id}", response_model=AdminUserResponse)
async def admin_update_user(
    user_id: str,
    request: AdminUserUpdate,
    admin_user: User = Depends(require_admin_user),
) -> AdminUserResponse:
    return await admin_service.update_user(user_id=user_id, request=request)


@router.delete("/users/{user_id}", response_model=NotificationBulkResult)
async def admin_delete_user(
    user_id: str,
    admin_user: User = Depends(require_admin_user),
) -> NotificationBulkResult:
    return await admin_service.delete_user(user_id=user_id)


@router.get("/chats", response_model=Page[AdminChatResponse])
async def admin_chats(
    status: str | None = Query(default=None),
    params: PaginationParams = Depends(get_pagination_params),
    admin_user: User = Depends(require_admin_user),
) -> Page[AdminChatResponse]:
    return await admin_service.list_chats(params=params, status=status)


@router.get("/documents", response_model=Page[AdminDocumentResponse])
async def admin_documents(
    kind: str | None = Query(default=None),
    status: str | None = Query(default=None),
    params: PaginationParams = Depends(get_pagination_params),
    admin_user: User = Depends(require_admin_user),
) -> Page[AdminDocumentResponse]:
    return await admin_service.list_documents(params=params, kind=kind, status=status)


@router.get("/analytics", response_model=AdminAnalyticsResponse)
async def admin_analytics(admin_user: User = Depends(require_admin_user)) -> AdminAnalyticsResponse:
    return await admin_service.analytics()


@router.get("/system-logs", response_model=Page[AdminSystemLogResponse])
async def admin_system_logs(
    level: SystemLogLevel | None = Query(default=None),
    source: SystemLogSource | None = Query(default=None),
    params: PaginationParams = Depends(get_pagination_params),
    admin_user: User = Depends(require_admin_user),
) -> Page[AdminSystemLogResponse]:
    return await admin_service.list_logs(params=params, level=level, source=source)


@router.post("/system-logs", response_model=AdminSystemLogResponse)
async def admin_create_system_log(
    request: AdminSystemLogCreate,
    admin_user: User = Depends(require_admin_user),
) -> AdminSystemLogResponse:
    return await admin_service.create_log(actor=admin_user, request=request)


@router.get("/feedback", response_model=Page[AdminFeedbackResponse])
async def admin_feedback(
    status: FeedbackStatus | None = Query(default=None),
    type_filter: FeedbackType | None = Query(default=None, alias="type"),
    params: PaginationParams = Depends(get_pagination_params),
    admin_user: User = Depends(require_admin_user),
) -> Page[AdminFeedbackResponse]:
    return await admin_service.list_feedback(params=params, status=status, type_filter=type_filter)


@router.patch("/feedback/{feedback_id}", response_model=AdminFeedbackResponse)
async def admin_update_feedback(
    feedback_id: str,
    request: AdminFeedbackUpdate,
    admin_user: User = Depends(require_admin_user),
) -> AdminFeedbackResponse:
    return await admin_service.update_feedback(feedback_id=feedback_id, request=request)


@router.get("/notifications", response_model=Page[AdminNotificationResponse])
async def admin_notifications(
    status: NotificationStatus | None = Query(default=None),
    type_filter: NotificationType | None = Query(default=None, alias="type"),
    params: PaginationParams = Depends(get_pagination_params),
    admin_user: User = Depends(require_admin_user),
) -> Page[AdminNotificationResponse]:
    return await admin_service.list_notifications(params=params, status=status, type_filter=type_filter)


@router.post("/notifications/broadcast", response_model=NotificationBulkResult)
async def admin_broadcast_notification(
    request: AdminNotificationBroadcast,
    admin_user: User = Depends(require_admin_user),
) -> NotificationBulkResult:
    return await admin_service.broadcast_notification(request=request)


@router.get("/roles", response_model=list[AdminRoleResponse])
async def admin_roles(admin_user: User = Depends(require_admin_user)) -> list[AdminRoleResponse]:
    return await admin_service.roles()


@router.post("/roles", response_model=AdminRoleResponse)
async def admin_upsert_role(
    request: AdminRoleUpsert,
    admin_user: User = Depends(require_admin_user),
) -> AdminRoleResponse:
    return await admin_service.upsert_role(request=request)


@router.get("/permissions", response_model=list[dict[str, str]])
async def admin_permissions(admin_user: User = Depends(require_admin_user)) -> list[dict[str, str]]:
    return await admin_service.permissions()


@router.get("/settings", response_model=AdminSettingsResponse)
async def admin_settings(admin_user: User = Depends(require_admin_user)) -> AdminSettingsResponse:
    return await admin_service.settings()

from typing import Any
from beanie import PydanticObjectId
from app.core.config import settings
from app.core.errors import AppError
from app.models.chat import Chat
from app.models.document import Document
from app.models.feedback import Feedback, FeedbackStatus, FeedbackType
from app.models.message import Message
from app.models.notification import Notification, NotificationStatus, NotificationType
from app.models.role import AdminPermission, RolePermission
from app.models.system_log import SystemLog, SystemLogLevel, SystemLogSource
from app.models.user import User, UserRole, UserStatus
from app.schemas.admin import (
    AdminAnalyticsResponse,
    AdminChatResponse,
    AdminDashboardResponse,
    AdminDocumentResponse,
    AdminFeedbackResponse,
    AdminFeedbackUpdate,
    AdminMetric,
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
from app.schemas.common import Page, PageMeta, PaginationParams
from app.schemas.notification import NotificationCreate, NotificationBulkResult
from app.services.notification_service import notification_service


DEFAULT_ADMIN_ROLES = [
    {
        "name": "owner",
        "display_name": "Owner",
        "description": "Full platform access, billing, roles, settings, and destructive actions.",
        "permissions": list(AdminPermission),
    },
    {
        "name": "admin",
        "display_name": "Admin",
        "description": "Operational admin access for users, content, analytics, logs, feedback, and notifications.",
        "permissions": [
            AdminPermission.ADMIN_ACCESS,
            AdminPermission.DASHBOARD_READ,
            AdminPermission.USERS_READ,
            AdminPermission.USERS_WRITE,
            AdminPermission.CHATS_READ,
            AdminPermission.DOCUMENTS_READ,
            AdminPermission.ANALYTICS_READ,
            AdminPermission.LOGS_READ,
            AdminPermission.FEEDBACK_READ,
            AdminPermission.FEEDBACK_WRITE,
            AdminPermission.NOTIFICATIONS_READ,
            AdminPermission.NOTIFICATIONS_WRITE,
            AdminPermission.ROLES_READ,
            AdminPermission.SETTINGS_READ,
        ],
    },
    {
        "name": "viewer",
        "display_name": "Viewer",
        "description": "Read-only admin visibility for dashboard, analytics, users, chats, documents, and feedback.",
        "permissions": [
            AdminPermission.ADMIN_ACCESS,
            AdminPermission.DASHBOARD_READ,
            AdminPermission.USERS_READ,
            AdminPermission.CHATS_READ,
            AdminPermission.DOCUMENTS_READ,
            AdminPermission.ANALYTICS_READ,
            AdminPermission.FEEDBACK_READ,
            AdminPermission.NOTIFICATIONS_READ,
            AdminPermission.ROLES_READ,
            AdminPermission.SETTINGS_READ,
        ],
    },
]


class AdminService:
    async def dashboard(self) -> AdminDashboardResponse:
        users_count = await User.find({"is_deleted": False}).count()
        chats_count = await Chat.find({"is_deleted": False}).count()
        documents_count = await Document.find({"is_deleted": False}).count()
        feedback_count = await Feedback.find({"is_deleted": False}).count()
        unread_notifications = await Notification.find({"status": NotificationStatus.UNREAD, "is_deleted": False}).count()
        error_logs = await SystemLog.find({"level": {"$in": [SystemLogLevel.ERROR, SystemLogLevel.CRITICAL]}, "is_deleted": False}).count()

        recent_logs = await SystemLog.find({"is_deleted": False}).sort("-created_at").limit(5).to_list()
        recent_activity = [
            {
                "id": str(log.id),
                "type": "system_log",
                "title": log.message,
                "level": log.level.value,
                "source": log.source.value,
                "created_at": log.created_at.isoformat(),
            }
            for log in recent_logs
        ]

        return AdminDashboardResponse(
            metrics=[
                AdminMetric(key="users", label="Users", value=users_count),
                AdminMetric(key="chats", label="Chats", value=chats_count),
                AdminMetric(key="documents", label="Documents", value=documents_count),
                AdminMetric(key="feedback", label="Feedback", value=feedback_count),
                AdminMetric(key="unread_notifications", label="Unread notifications", value=unread_notifications),
                AdminMetric(key="error_logs", label="Error logs", value=error_logs),
            ],
            system_health={
                "environment": settings.ENVIRONMENT,
                "database": settings.MONGODB_DB_NAME,
                "storage_provider": settings.DOCUMENT_STORAGE_PROVIDER,
                "ai_default_provider": settings.AI_DEFAULT_PROVIDER,
            },
            recent_activity=recent_activity,
        )

    async def list_users(
        self,
        *,
        params: PaginationParams,
        role: UserRole | None = None,
        status: UserStatus | None = None,
    ) -> Page[AdminUserResponse]:
        query: dict[str, Any] = {"is_deleted": False}
        if role:
            query["role"] = role
        if status:
            query["status"] = status
        if params.search:
            query["$or"] = [
                {"full_name": {"$regex": params.search, "$options": "i"}},
                {"email": {"$regex": params.search, "$options": "i"}},
                {"username": {"$regex": params.search, "$options": "i"}},
            ]
        return await self._find_page(User, query, params, self.to_user_response, allowed_sorts={"created_at", "updated_at", "email", "full_name", "role", "status"})

    async def update_user(self, *, user_id: str, request: AdminUserUpdate) -> AdminUserResponse:
        user = await self._get_user(user_id)
        if request.full_name is not None:
            user.full_name = request.full_name
        if request.role is not None:
            user.role = request.role
        if request.status is not None:
            user.status = request.status
        if request.company is not None:
            user.company = request.company
        if request.location is not None:
            user.location = request.location
        if request.metadata is not None:
            user.metadata = request.metadata
        await user.save()
        return self.to_user_response(user)

    async def delete_user(self, *, user_id: str) -> NotificationBulkResult:
        user = await self._get_user(user_id)
        await user.soft_delete()
        return NotificationBulkResult(affected=1, message="User deleted")

    async def list_chats(self, *, params: PaginationParams, status: str | None = None) -> Page[AdminChatResponse]:
        query: dict[str, Any] = {"is_deleted": False}
        if status:
            query["status"] = status
        if params.search:
            query["$or"] = [
                {"title": {"$regex": params.search, "$options": "i"}},
                {"summary": {"$regex": params.search, "$options": "i"}},
                {"tags": {"$regex": params.search, "$options": "i"}},
            ]
        return await self._find_page(Chat, query, params, self.to_chat_response, allowed_sorts={"created_at", "updated_at", "title", "message_count"})

    async def list_documents(self, *, params: PaginationParams, kind: str | None = None, status: str | None = None) -> Page[AdminDocumentResponse]:
        query: dict[str, Any] = {"is_deleted": False}
        if kind:
            query["kind"] = kind
        if status:
            query["status"] = status
        if params.search:
            query["$or"] = [
                {"title": {"$regex": params.search, "$options": "i"}},
                {"file_name": {"$regex": params.search, "$options": "i"}},
                {"category": {"$regex": params.search, "$options": "i"}},
                {"tags": {"$regex": params.search, "$options": "i"}},
            ]
        return await self._find_page(Document, query, params, self.to_document_response, allowed_sorts={"created_at", "updated_at", "title", "file_size", "kind", "status"})

    async def analytics(self) -> AdminAnalyticsResponse:
        users = await User.find({"is_deleted": False}).to_list()
        chats = await Chat.find({"is_deleted": False}).to_list()
        documents = await Document.find({"is_deleted": False}).to_list()
        notifications = await Notification.find({"is_deleted": False}).to_list()
        feedback = await Feedback.find({"is_deleted": False}).to_list()
        messages = await Message.find({"is_deleted": False}).to_list()

        return AdminAnalyticsResponse(
            users={
                "total": len(users),
                "active": sum(1 for user in users if user.status == UserStatus.ACTIVE),
                "admins": sum(1 for user in users if user.role in {UserRole.ADMIN, UserRole.OWNER}),
            },
            chats={
                "total": len(chats),
                "pinned": sum(1 for chat in chats if chat.is_pinned),
                "favorite": sum(1 for chat in chats if chat.is_favorite),
            },
            documents={
                "total": len(documents),
                "ready": sum(1 for document in documents if document.status.value == "ready"),
                "total_size": sum(document.file_size for document in documents),
            },
            notifications={
                "total": len(notifications),
                "unread": sum(1 for notification in notifications if notification.status == NotificationStatus.UNREAD),
                "read": sum(1 for notification in notifications if notification.status == NotificationStatus.READ),
            },
            feedback={
                "total": len(feedback),
                "open": sum(1 for item in feedback if item.status == FeedbackStatus.OPEN),
                "closed": sum(1 for item in feedback if item.status == FeedbackStatus.CLOSED),
            },
            ai_usage={
                "messages": len(messages),
                "tokens": sum(message.token_count for message in messages),
                "average_tokens": round(sum(message.token_count for message in messages) / len(messages), 2) if messages else 0,
            },
        )

    async def list_logs(self, *, params: PaginationParams, level: SystemLogLevel | None = None, source: SystemLogSource | None = None) -> Page[AdminSystemLogResponse]:
        query: dict[str, Any] = {"is_deleted": False}
        if level:
            query["level"] = level
        if source:
            query["source"] = source
        if params.search:
            query["message"] = {"$regex": params.search, "$options": "i"}
        return await self._find_page(SystemLog, query, params, self.to_system_log_response, allowed_sorts={"created_at", "updated_at", "level", "source"})

    async def create_log(self, *, actor: User, request: AdminSystemLogCreate) -> AdminSystemLogResponse:
        log = SystemLog(
            level=request.level,
            source=request.source,
            message=request.message,
            actor_user_id=actor.id,
            metadata=request.metadata,
        )
        log = await log.insert()
        return self.to_system_log_response(log)

    async def list_feedback(self, *, params: PaginationParams, status: FeedbackStatus | None = None, type_filter: FeedbackType | None = None) -> Page[AdminFeedbackResponse]:
        query: dict[str, Any] = {"is_deleted": False}
        if status:
            query["status"] = status
        if type_filter:
            query["type"] = type_filter
        if params.search:
            query["$or"] = [
                {"message": {"$regex": params.search, "$options": "i"}},
                {"page_url": {"$regex": params.search, "$options": "i"}},
            ]
        return await self._find_page(Feedback, query, params, self.to_feedback_response, allowed_sorts={"created_at", "updated_at", "status", "type", "rating"})

    async def update_feedback(self, *, feedback_id: str, request: AdminFeedbackUpdate) -> AdminFeedbackResponse:
        feedback = await Feedback.find_one({"_id": self._object_id(feedback_id), "is_deleted": False})
        if feedback is None:
            raise AppError("Feedback not found", status_code=404, error_code="FEEDBACK_NOT_FOUND")
        if request.status is not None:
            feedback.status = request.status
        if request.metadata is not None:
            feedback.metadata = request.metadata
        await feedback.save()
        return self.to_feedback_response(feedback)

    async def list_notifications(self, *, params: PaginationParams, status: NotificationStatus | None = None, type_filter: NotificationType | None = None) -> Page[AdminNotificationResponse]:
        query: dict[str, Any] = {"is_deleted": False}
        if status:
            query["status"] = status
        if type_filter:
            query["type"] = type_filter
        if params.search:
            query["$or"] = [
                {"title": {"$regex": params.search, "$options": "i"}},
                {"message": {"$regex": params.search, "$options": "i"}},
            ]
        return await self._find_page(Notification, query, params, self.to_notification_response, allowed_sorts={"created_at", "updated_at", "status", "type"})

    async def broadcast_notification(self, *, request: AdminNotificationBroadcast) -> NotificationBulkResult:
        if request.user_ids:
            user_ids = [self._object_id(user_id) for user_id in request.user_ids]
            users = await User.find({"_id": {"$in": user_ids}, "is_deleted": False}).to_list()
        else:
            users = await User.find({"is_deleted": False, "status": UserStatus.ACTIVE}).to_list()

        for user in users:
            await notification_service.create_for_user_id(
                user_id=user.id,
                request=NotificationCreate(
                    type=request.type,
                    title=request.title,
                    message=request.message,
                    action_url=request.action_url,
                    metadata=request.metadata,
                ),
            )
        return NotificationBulkResult(affected=len(users), message="Notification broadcast created")

    async def roles(self) -> list[AdminRoleResponse]:
        await self.ensure_default_roles()
        roles = await RolePermission.find({"is_deleted": False}).sort("name").to_list()
        return [self.to_role_response(role) for role in roles]

    async def upsert_role(self, *, request: AdminRoleUpsert) -> AdminRoleResponse:
        role = await RolePermission.find_one({"name": request.name, "is_deleted": False})
        if role is None:
            role = RolePermission(
                name=request.name,
                display_name=request.display_name,
                description=request.description,
                permissions=request.permissions,
                is_system=request.is_system,
                metadata=request.metadata,
            )
            role = await role.insert()
        else:
            role.display_name = request.display_name
            role.description = request.description
            role.permissions = request.permissions
            role.is_system = request.is_system
            role.metadata = request.metadata
            await role.save()
        return self.to_role_response(role)

    async def permissions(self) -> list[dict[str, str]]:
        return [{"key": permission.value, "label": permission.value.replace(".", " ").title()} for permission in AdminPermission]

    async def settings(self) -> AdminSettingsResponse:
        return AdminSettingsResponse(
            app_name=settings.APP_NAME,
            app_version=settings.APP_VERSION,
            environment=settings.ENVIRONMENT,
            api_prefix=settings.API_V1_PREFIX,
            cors_origins=settings.BACKEND_CORS_ORIGINS,
            document_storage_provider=settings.DOCUMENT_STORAGE_PROVIDER,
            ai_default_provider=settings.AI_DEFAULT_PROVIDER,
            ai_enabled_providers=settings.AI_ENABLED_PROVIDERS,
            admin_emails=settings.ADMIN_EMAILS,
        )

    async def ensure_default_roles(self) -> None:
        for role_data in DEFAULT_ADMIN_ROLES:
            existing = await RolePermission.find_one({"name": role_data["name"], "is_deleted": False})
            if existing is None:
                await RolePermission(**role_data).insert()

    async def _get_user(self, user_id: str) -> User:
        user = await User.find_one({"_id": self._object_id(user_id), "is_deleted": False})
        if user is None:
            raise AppError("User not found", status_code=404, error_code="USER_NOT_FOUND")
        return user

    async def _find_page(self, model: Any, query: dict[str, Any], params: PaginationParams, mapper: Any, *, allowed_sorts: set[str]) -> Page[Any]:
        sort_field = params.sort_by if params.sort_by in allowed_sorts else "created_at"
        sort_clause = f"-{sort_field}" if params.sort_direction == "desc" else sort_field
        total = await model.find(query).count()
        items = await model.find(query).sort(sort_clause).skip(params.skip).limit(params.size).to_list()
        return Page[Any](items=[mapper(item) for item in items], meta=PageMeta(page=params.page, size=params.size, total=total))

    @staticmethod
    def _object_id(value: str) -> PydanticObjectId:
        try:
            return PydanticObjectId(value)
        except Exception as exc:
            raise AppError("Invalid object id", status_code=422, error_code="INVALID_OBJECT_ID", details={"id": value}) from exc

    @staticmethod
    def to_user_response(user: User) -> AdminUserResponse:
        return AdminUserResponse(
            id=str(user.id),
            clerk_user_id=user.clerk_user_id,
            email=user.email,
            full_name=user.full_name,
            username=user.username,
            avatar_url=user.avatar_url,
            role=user.role,
            status=user.status,
            company=user.company,
            location=user.location,
            last_login_at=user.last_login_at,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )

    @staticmethod
    def to_chat_response(chat: Chat) -> AdminChatResponse:
        return AdminChatResponse(
            id=str(chat.id),
            owner_id=str(chat.owner_id),
            title=chat.title,
            status=chat.status,
            model=chat.model,
            is_pinned=chat.is_pinned,
            is_favorite=chat.is_favorite,
            message_count=chat.message_count,
            last_message_at=chat.last_message_at,
            created_at=chat.created_at,
            updated_at=chat.updated_at,
        )

    @staticmethod
    def to_document_response(document: Document) -> AdminDocumentResponse:
        return AdminDocumentResponse(
            id=str(document.id),
            owner_id=str(document.owner_id),
            title=document.title,
            file_name=document.file_name,
            mime_type=document.mime_type,
            kind=document.kind,
            status=document.status,
            category=document.category,
            tags=document.tags,
            file_size=document.file_size,
            storage_provider=document.storage_provider,
            created_at=document.created_at,
            updated_at=document.updated_at,
        )

    @staticmethod
    def to_system_log_response(log: SystemLog) -> AdminSystemLogResponse:
        return AdminSystemLogResponse(
            id=str(log.id),
            level=log.level,
            source=log.source,
            message=log.message,
            actor_user_id=str(log.actor_user_id) if log.actor_user_id else None,
            request_id=log.request_id,
            ip_address=log.ip_address,
            user_agent=log.user_agent,
            created_at=log.created_at,
            metadata=log.metadata,
        )

    @staticmethod
    def to_feedback_response(feedback: Feedback) -> AdminFeedbackResponse:
        return AdminFeedbackResponse(
            id=str(feedback.id),
            user_id=str(feedback.user_id) if feedback.user_id else None,
            type=feedback.type,
            status=feedback.status,
            rating=feedback.rating,
            message=feedback.message,
            page_url=feedback.page_url,
            created_at=feedback.created_at,
            updated_at=feedback.updated_at,
        )

    @staticmethod
    def to_notification_response(notification: Notification) -> AdminNotificationResponse:
        return AdminNotificationResponse(
            id=str(notification.id),
            user_id=str(notification.user_id),
            type=notification.type,
            status=notification.status,
            title=notification.title,
            message=notification.message,
            action_url=notification.action_url,
            read_at=notification.read_at,
            created_at=notification.created_at,
            updated_at=notification.updated_at,
            metadata=notification.metadata,
        )

    @staticmethod
    def to_role_response(role: RolePermission) -> AdminRoleResponse:
        return AdminRoleResponse(
            id=str(role.id),
            name=role.name,
            display_name=role.display_name,
            description=role.description,
            permissions=role.permissions,
            is_system=role.is_system,
            created_at=role.created_at,
            updated_at=role.updated_at,
        )


admin_service = AdminService()

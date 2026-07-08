from datetime import datetime
from enum import Enum
from typing import Any
from pydantic import EmailStr, Field
from pymongo import ASCENDING, TEXT, IndexModel
from app.models.base import BASE_INDEXES, BaseDocument


class UserRole(str, Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"
    VIEWER = "viewer"


class UserStatus(str, Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    DELETED = "deleted"


class User(BaseDocument):
    external_auth_id: str | None = Field(default=None, max_length=128)
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=120)
    username: str | None = Field(default=None, min_length=2, max_length=60)
    avatar_url: str | None = Field(default=None, max_length=2000)
    role: UserRole = UserRole.MEMBER
    status: UserStatus = UserStatus.ACTIVE
    company: str | None = Field(default=None, max_length=120)
    location: str | None = Field(default=None, max_length=120)
    last_login_at: datetime | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)

    class Settings:
        name = "users"
        use_revision = True
        validate_on_save = True
        indexes = [
            *BASE_INDEXES,
            IndexModel([("email", ASCENDING)], unique=True, name="uq_users_email", partialFilterExpression={"is_deleted": False}),
            IndexModel([("external_auth_id", ASCENDING)], unique=True, sparse=True, name="uq_users_external_auth_id"),
            IndexModel([("username", ASCENDING)], unique=True, sparse=True, name="uq_users_username"),
            IndexModel([("status", ASCENDING), ("role", ASCENDING)], name="idx_users_status_role"),
            IndexModel([("full_name", TEXT), ("email", TEXT), ("username", TEXT)], name="txt_users_search"),
        ]

from datetime import datetime
from typing import Any
from pydantic import BaseModel, EmailStr, Field


class ClerkTokenClaims(BaseModel):
    sub: str = Field(..., min_length=1)
    iss: str | None = None
    aud: str | list[str] | None = None
    azp: str | None = None
    exp: int | None = None
    iat: int | None = None
    nbf: int | None = None
    sid: str | None = None
    email: EmailStr | None = None
    email_address: EmailStr | None = None
    first_name: str | None = None
    last_name: str | None = None
    full_name: str | None = None
    name: str | None = None
    username: str | None = None
    image_url: str | None = None
    picture: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)

    model_config = {"extra": "allow"}

    @property
    def primary_email(self) -> EmailStr | None:
        return self.email or self.email_address

    @property
    def display_name(self) -> str:
        if self.full_name:
            return self.full_name
        if self.name:
            return self.name
        if self.first_name or self.last_name:
            return " ".join(part for part in [self.first_name, self.last_name] if part).strip()
        if self.username:
            return self.username
        return "Pulse AI User"

    @property
    def avatar(self) -> str | None:
        return self.image_url or self.picture


class AuthenticatedUserResponse(BaseModel):
    id: str
    clerk_user_id: str
    email: EmailStr | None = None
    full_name: str
    username: str | None = None
    avatar_url: str | None = None
    role: str
    status: str
    last_login_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

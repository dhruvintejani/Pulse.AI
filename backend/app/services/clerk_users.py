from dataclasses import dataclass
from typing import Any
import httpx
from loguru import logger
from app.core.config import settings


@dataclass(frozen=True)
class ClerkUserProfile:
    email: str | None = None
    full_name: str | None = None
    username: str | None = None
    image_url: str | None = None


class ClerkUsersClient:
    async def get_user_profile(self, clerk_user_id: str) -> ClerkUserProfile | None:
        if not settings.CLERK_SECRET_KEY:
            return None

        url = f"{settings.CLERK_API_BASE_URL.rstrip('/')}/users/{clerk_user_id}"
        headers = {"Authorization": f"Bearer {settings.CLERK_SECRET_KEY}"}

        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(url, headers=headers)
                response.raise_for_status()
        except httpx.HTTPError as exc:
            logger.warning("Unable to fetch Clerk user profile", clerk_user_id=clerk_user_id, error=str(exc))
            return None

        payload = response.json()
        return self._parse_profile(payload)

    def _parse_profile(self, payload: dict[str, Any]) -> ClerkUserProfile:
        first_name = payload.get("first_name") or ""
        last_name = payload.get("last_name") or ""
        full_name = " ".join(part for part in [first_name, last_name] if part).strip() or None
        username = payload.get("username")
        image_url = payload.get("image_url") or payload.get("profile_image_url")
        email = self._primary_email(payload)

        return ClerkUserProfile(
            email=email,
            full_name=full_name or username,
            username=username,
            image_url=image_url,
        )

    @staticmethod
    def _primary_email(payload: dict[str, Any]) -> str | None:
        primary_email_id = payload.get("primary_email_address_id")
        email_addresses = payload.get("email_addresses") or []

        if primary_email_id:
            for item in email_addresses:
                if item.get("id") == primary_email_id:
                    return item.get("email_address")

        for item in email_addresses:
            email = item.get("email_address")
            if email:
                return email

        return None


clerk_users_client = ClerkUsersClient()

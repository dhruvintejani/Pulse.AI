from app.models.user import User, UserStatus
from app.schemas.auth import AuthenticatedUserResponse, ClerkTokenClaims
from app.services.clerk_users import clerk_users_client
from app.utils.datetime import utc_now


class UserSyncService:
    async def get_or_create_user(self, claims: ClerkTokenClaims) -> User:
        profile = await clerk_users_client.get_user_profile(claims.sub) if self._needs_profile_enrichment(claims) else None
        email = claims.primary_email or (profile.email if profile else None)
        full_name = (profile.full_name if profile and profile.full_name else claims.display_name)
        username = claims.username or (profile.username if profile else None)
        avatar_url = claims.avatar or (profile.image_url if profile else None)

        user = await User.find_one({"clerk_user_id": claims.sub, "is_deleted": False})

        if user is None:
            user = await User.find_one({"external_auth_id": claims.sub, "is_deleted": False})

        if user is None and email:
            user = await User.find_one({"email": email, "is_deleted": False})

        if user is None:
            user = User(
                clerk_user_id=claims.sub,
                external_auth_id=claims.sub,
                email=email,
                full_name=full_name,
                username=username,
                avatar_url=avatar_url,
                status=UserStatus.ACTIVE,
                last_login_at=utc_now(),
                metadata={"clerk_session_id": claims.sid} if claims.sid else {},
            )
            return await user.insert()

        user.clerk_user_id = claims.sub
        user.external_auth_id = claims.sub
        user.last_login_at = utc_now()
        user.status = UserStatus.ACTIVE

        if email:
            user.email = email
        if full_name:
            user.full_name = full_name
        if username:
            user.username = username
        if avatar_url:
            user.avatar_url = avatar_url

        metadata = dict(user.metadata or {})
        if claims.sid:
            metadata["clerk_session_id"] = claims.sid
        user.metadata = metadata
        await user.save()
        return user

    def to_response(self, user: User) -> AuthenticatedUserResponse:
        return AuthenticatedUserResponse(
            id=str(user.id),
            clerk_user_id=user.clerk_user_id or user.external_auth_id or "",
            email=user.email,
            full_name=user.full_name,
            username=user.username,
            avatar_url=user.avatar_url,
            role=user.role.value,
            status=user.status.value,
            last_login_at=user.last_login_at,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )

    @staticmethod
    def _needs_profile_enrichment(claims: ClerkTokenClaims) -> bool:
        return not claims.primary_email or claims.display_name == "Pulse AI User" or not claims.avatar


user_sync_service = UserSyncService()

from app.models.user import User, UserStatus
from app.schemas.auth import AuthenticatedUserResponse, ClerkTokenClaims
from app.utils.datetime import utc_now


class UserSyncService:
    async def get_or_create_user(self, claims: ClerkTokenClaims) -> User:
        user = await User.find_one({"clerk_user_id": claims.sub, "is_deleted": False})

        if user is None:
            user = await User.find_one({"external_auth_id": claims.sub, "is_deleted": False})

        if user is None and claims.primary_email:
            user = await User.find_one({"email": claims.primary_email, "is_deleted": False})

        if user is None:
            user = User(
                clerk_user_id=claims.sub,
                external_auth_id=claims.sub,
                email=claims.primary_email,
                full_name=claims.display_name,
                username=claims.username,
                avatar_url=claims.avatar,
                status=UserStatus.ACTIVE,
                last_login_at=utc_now(),
                metadata={"clerk_session_id": claims.sid} if claims.sid else {},
            )
            return await user.insert()

        user.clerk_user_id = claims.sub
        user.external_auth_id = claims.sub
        user.last_login_at = utc_now()
        user.status = UserStatus.ACTIVE

        if claims.primary_email:
            user.email = claims.primary_email
        if claims.display_name:
            user.full_name = claims.display_name
        if claims.username:
            user.username = claims.username
        if claims.avatar:
            user.avatar_url = claims.avatar

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


user_sync_service = UserSyncService()

from app.models.settings import UserSettings
from app.models.user import User
from app.schemas.settings import RecentSearchesResponse, UserSettingsResponse, UserSettingsUpdate


class SettingsService:
    async def get_or_create(self, *, current_user: User) -> UserSettings:
        existing = await UserSettings.find_one({"user_id": current_user.id, "is_deleted": False})
        if existing is not None:
            return existing

        document = UserSettings(
            user_id=current_user.id,
            profile_settings={"name": current_user.full_name, "email": current_user.email},
            notification_preferences={"email": True, "in_app": True, "push": False, "weekly_digest": True},
            privacy_settings={"data_sharing": False, "profile_visibility": "workspace"},
            security_settings={"session_alerts": True, "device_review": True},
            appearance_settings={"density": "comfortable", "animations": True, "glass_effects": True},
        )
        return await document.insert()

    async def get_settings(self, *, current_user: User) -> UserSettingsResponse:
        return self.to_response(await self.get_or_create(current_user=current_user))

    async def update_settings(self, *, current_user: User, request: UserSettingsUpdate) -> UserSettingsResponse:
        document = await self.get_or_create(current_user=current_user)

        if request.theme is not None:
            document.theme = request.theme
        if request.language is not None:
            document.language = request.language
        if request.timezone is not None:
            document.timezone = request.timezone
        if request.notification_preferences is not None:
            document.notification_preferences = request.notification_preferences
        if request.profile_settings is not None:
            document.profile_settings = request.profile_settings
        if request.privacy_settings is not None:
            document.privacy_settings = request.privacy_settings
        if request.security_settings is not None:
            document.security_settings = request.security_settings
        if request.appearance_settings is not None:
            document.appearance_settings = request.appearance_settings
        if request.ai_preferences is not None:
            document.ai_preferences = request.ai_preferences
        if request.metadata is not None:
            document.metadata = request.metadata

        await document.save()
        return self.to_response(document)

    async def add_recent_search(self, *, current_user: User, query: str) -> RecentSearchesResponse:
        document = await self.get_or_create(current_user=current_user)
        normalized_query = " ".join(query.strip().split())
        recent_searches = [item for item in document.recent_searches if item.lower() != normalized_query.lower()]
        recent_searches.insert(0, normalized_query)
        document.recent_searches = recent_searches[:20]
        await document.save()
        return RecentSearchesResponse(items=document.recent_searches)

    async def recent_searches(self, *, current_user: User) -> RecentSearchesResponse:
        document = await self.get_or_create(current_user=current_user)
        return RecentSearchesResponse(items=document.recent_searches)

    async def clear_recent_searches(self, *, current_user: User) -> RecentSearchesResponse:
        document = await self.get_or_create(current_user=current_user)
        document.recent_searches = []
        await document.save()
        return RecentSearchesResponse(items=[])

    @staticmethod
    def to_response(document: UserSettings) -> UserSettingsResponse:
        return UserSettingsResponse(
            id=str(document.id),
            user_id=str(document.user_id),
            theme=document.theme,
            language=document.language,
            timezone=document.timezone,
            notification_preferences=document.notification_preferences,
            profile_settings=document.profile_settings,
            privacy_settings=document.privacy_settings,
            security_settings=document.security_settings,
            appearance_settings=document.appearance_settings,
            ai_preferences=document.ai_preferences,
            recent_searches=document.recent_searches,
            metadata=document.metadata,
            created_at=document.created_at,
            updated_at=document.updated_at,
        )


settings_service = SettingsService()

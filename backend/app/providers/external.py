from collections.abc import AsyncIterator
from app.core.errors import AppError
from app.providers.base import AIProvider, ProviderRequest


class ConfigurableExternalProvider(AIProvider):
    name = "external"

    def __init__(self, *, name: str, api_key: str | None) -> None:
        self.name = name
        self.api_key = api_key

    async def stream(self, request: ProviderRequest) -> AsyncIterator[str]:
        if not self.api_key:
            raise AppError(
                f"AI provider '{self.name}' is not configured",
                status_code=503,
                error_code="AI_PROVIDER_NOT_CONFIGURED",
                details={"provider": self.name},
            )

        raise AppError(
            f"AI provider '{self.name}' transport is not implemented yet",
            status_code=501,
            error_code="AI_PROVIDER_TRANSPORT_NOT_IMPLEMENTED",
            details={"provider": self.name},
        )
        yield ""

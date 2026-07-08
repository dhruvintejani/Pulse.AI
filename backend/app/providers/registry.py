from app.core.config import settings
from app.core.errors import AppError
from app.providers.base import AIProvider
from app.providers.external import ConfigurableExternalProvider
from app.providers.mock import MockAIProvider


class AIProviderRegistry:
    def __init__(self) -> None:
        self._providers: dict[str, AIProvider] = {}

    def register(self, provider: AIProvider) -> None:
        self._providers[provider.name.lower()] = provider

    def get(self, name: str | None = None) -> AIProvider:
        provider_name = (name or settings.AI_DEFAULT_PROVIDER).lower()
        provider = self._providers.get(provider_name)
        if provider is None:
            raise AppError(
                "AI provider is not available",
                status_code=400,
                error_code="AI_PROVIDER_NOT_AVAILABLE",
                details={"provider": provider_name, "available": sorted(self._providers.keys())},
            )
        return provider

    def available(self) -> list[str]:
        return sorted(self._providers.keys())


def build_provider_registry() -> AIProviderRegistry:
    registry = AIProviderRegistry()
    enabled = {provider.lower() for provider in settings.AI_ENABLED_PROVIDERS}

    if "mock" in enabled:
        registry.register(MockAIProvider())

    for provider_name, api_key in settings.ai_provider_api_keys.items():
        if provider_name in enabled:
            registry.register(ConfigurableExternalProvider(name=provider_name, api_key=api_key))

    return registry


provider_registry = build_provider_registry()

import asyncio
from collections.abc import AsyncIterator
from app.core.config import settings
from app.providers.base import AIProvider, ProviderRequest


class MockAIProvider(AIProvider):
    name = "mock"

    async def stream(self, request: ProviderRequest) -> AsyncIterator[str]:
        user_message = next((message.content for message in reversed(request.messages) if message.role == "user"), "")
        response = (
            "Pulse AI backend streaming is ready. "
            "Connect a real provider through the provider registry to replace this mock response."
        )
        if user_message:
            response += f" Received: {user_message[:220]}"

        delay = max(settings.AI_STREAM_PLACEHOLDER_DELAY_MS, 0) / 1000
        for token in response.split(" "):
            if delay:
                await asyncio.sleep(delay)
            yield f"{token} "

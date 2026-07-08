from abc import ABC, abstractmethod
from collections.abc import AsyncIterator
from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class ProviderMessage:
    role: str
    content: str


@dataclass(frozen=True)
class ProviderRequest:
    messages: list[ProviderMessage]
    model: str | None = None
    metadata: dict[str, Any] | None = None


class AIProvider(ABC):
    name: str

    @abstractmethod
    async def stream(self, request: ProviderRequest) -> AsyncIterator[str]:
        raise NotImplementedError

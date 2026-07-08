from datetime import datetime
from typing import Any, Literal
from pydantic import BaseModel, Field

SearchEntityType = Literal["chat", "message", "document", "user", "setting"]


class SearchHighlight(BaseModel):
    field: str
    snippet: str


class GlobalSearchResult(BaseModel):
    id: str
    type: SearchEntityType
    title: str
    description: str | None = None
    url: str | None = None
    score: float = 1
    highlights: list[SearchHighlight] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)
    updated_at: datetime | None = None


class GlobalSearchResponse(BaseModel):
    query: str
    filters: list[SearchEntityType]
    items: list[GlobalSearchResult]
    page: int
    size: int
    total: int
    has_next: bool
    recent_searches: list[str] = Field(default_factory=list)


class GlobalSearchFiltersResponse(BaseModel):
    items: list[dict[str, str]]

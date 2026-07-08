from math import ceil
from typing import Any, Generic, Literal, TypeVar
from pydantic import BaseModel, Field, computed_field

T = TypeVar("T")


class PaginationParams(BaseModel):
    page: int = Field(default=1, ge=1)
    size: int = Field(default=20, ge=1, le=100)
    search: str | None = Field(default=None, max_length=120)
    sort_by: str = Field(default="created_at", max_length=80)
    sort_direction: Literal["asc", "desc"] = "desc"

    @property
    def skip(self) -> int:
        return (self.page - 1) * self.size


class PageMeta(BaseModel):
    page: int
    size: int
    total: int

    @computed_field
    @property
    def pages(self) -> int:
        return max(1, ceil(self.total / self.size)) if self.size else 1

    @computed_field
    @property
    def has_next(self) -> bool:
        return self.page < self.pages

    @computed_field
    @property
    def has_previous(self) -> bool:
        return self.page > 1


class Page(BaseModel, Generic[T]):
    items: list[T]
    meta: PageMeta


class ErrorResponse(BaseModel):
    success: bool = False
    error_code: str
    message: str
    details: Any | None = None
    request_id: str | None = None


class SuccessResponse(BaseModel):
    success: bool = True
    message: str = "OK"
    data: Any | None = None

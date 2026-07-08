from typing import Literal
from fastapi import Query
from app.schemas.common import PaginationParams


def get_pagination_params(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None, max_length=120),
    sort_by: str = Query(default="created_at", max_length=80),
    sort_direction: Literal["asc", "desc"] = Query(default="desc"),
) -> PaginationParams:
    return PaginationParams(
        page=page,
        size=size,
        search=search,
        sort_by=sort_by,
        sort_direction=sort_direction,
    )

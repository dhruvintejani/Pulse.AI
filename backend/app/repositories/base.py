import re
from collections.abc import Sequence
from typing import Any, Generic, TypeVar
from beanie import PydanticObjectId
from app.models.base import BaseDocument
from app.schemas.common import Page, PageMeta, PaginationParams

ModelT = TypeVar("ModelT", bound=BaseDocument)


class BaseRepository(Generic[ModelT]):
    def __init__(self, model: type[ModelT], search_fields: Sequence[str] = ()) -> None:
        self.model = model
        self.search_fields = tuple(search_fields)

    async def get_by_id(self, document_id: PydanticObjectId, *, include_deleted: bool = False) -> ModelT | None:
        query: dict[str, Any] = {"_id": document_id}
        if not include_deleted:
            query["is_deleted"] = False
        return await self.model.find_one(query)

    async def list_paginated(
        self,
        params: PaginationParams,
        *,
        filters: dict[str, Any] | None = None,
        include_deleted: bool = False,
    ) -> Page[ModelT]:
        query = self._build_query(params.search, filters=filters, include_deleted=include_deleted)
        sort_clause = f"-{params.sort_by}" if params.sort_direction == "desc" else params.sort_by

        total = await self.model.find(query).count()
        items = await self.model.find(query).sort(sort_clause).skip(params.skip).limit(params.size).to_list()

        return Page[ModelT](items=items, meta=PageMeta(page=params.page, size=params.size, total=total))

    async def create(self, document: ModelT) -> ModelT:
        return await document.insert()

    async def save(self, document: ModelT) -> ModelT:
        await document.save()
        return document

    async def soft_delete(self, document: ModelT) -> None:
        await document.soft_delete()

    def _build_query(
        self,
        search: str | None,
        *,
        filters: dict[str, Any] | None,
        include_deleted: bool,
    ) -> dict[str, Any]:
        clauses: list[dict[str, Any]] = []

        if not include_deleted:
            clauses.append({"is_deleted": False})

        if filters:
            clauses.append(filters)

        if search and self.search_fields:
            escaped_search = re.escape(search.strip())
            if escaped_search:
                clauses.append(
                    {
                        "$or": [
                            {field: {"$regex": escaped_search, "$options": "i"}}
                            for field in self.search_fields
                        ]
                    }
                )

        if not clauses:
            return {}
        if len(clauses) == 1:
            return clauses[0]
        return {"$and": clauses}

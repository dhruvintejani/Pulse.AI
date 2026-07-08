from datetime import datetime
from beanie import Document, Insert, Replace, SaveChanges, before_event
from pydantic import Field
from pymongo import ASCENDING, DESCENDING, IndexModel
from app.utils.datetime import utc_now


BASE_INDEXES = [
    IndexModel([("is_deleted", ASCENDING)], name="idx_is_deleted"),
    IndexModel([("created_at", DESCENDING)], name="idx_created_at_desc"),
    IndexModel([("updated_at", DESCENDING)], name="idx_updated_at_desc"),
]


class BaseDocument(Document):
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)
    deleted_at: datetime | None = None
    is_deleted: bool = False

    @before_event(Insert)
    def set_created_timestamp(self) -> None:
        now = utc_now()
        self.created_at = now
        self.updated_at = now

    @before_event(Replace, SaveChanges)
    def set_updated_timestamp(self) -> None:
        self.updated_at = utc_now()

    async def soft_delete(self) -> None:
        self.is_deleted = True
        self.deleted_at = utc_now()
        self.updated_at = utc_now()
        await self.save()

    async def restore(self) -> None:
        self.is_deleted = False
        self.deleted_at = None
        self.updated_at = utc_now()
        await self.save()

    class Settings:
        use_revision = True
        validate_on_save = True
        indexes = BASE_INDEXES

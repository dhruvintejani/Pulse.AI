from typing import Any
from beanie import PydanticObjectId
from pydantic import Field
from pymongo import ASCENDING, TEXT, IndexModel
from app.models.base import BASE_INDEXES, BaseDocument


class Folder(BaseDocument):
    owner_id: PydanticObjectId
    parent_folder_id: PydanticObjectId | None = None
    name: str = Field(..., min_length=1, max_length=120)
    path: str = Field(default="/", max_length=500)
    color: str | None = Field(default=None, max_length=32)
    sort_order: int = Field(default=0, ge=0)
    metadata: dict[str, Any] = Field(default_factory=dict)

    class Settings:
        name = "folders"
        use_revision = True
        validate_on_save = True
        indexes = [
            *BASE_INDEXES,
            IndexModel([("owner_id", ASCENDING), ("parent_folder_id", ASCENDING)], name="idx_folders_owner_parent"),
            IndexModel(
                [("owner_id", ASCENDING), ("parent_folder_id", ASCENDING), ("name", ASCENDING)],
                unique=True,
                name="uq_folders_owner_parent_name",
                partialFilterExpression={"is_deleted": False},
            ),
            IndexModel([("name", TEXT), ("path", TEXT)], name="txt_folders_search"),
        ]

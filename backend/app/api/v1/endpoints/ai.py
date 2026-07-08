from fastapi import APIRouter, Depends
from app.dependencies import get_current_user
from app.models.user import User
from app.providers import provider_registry

router = APIRouter(prefix="/ai")


@router.get("/providers")
async def list_ai_providers(current_user: User = Depends(get_current_user)) -> dict[str, list[str]]:
    return {"providers": provider_registry.available()}

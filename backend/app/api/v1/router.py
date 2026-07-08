from fastapi import APIRouter
from app.api.v1.endpoints import auth, conversations, dashboard, documents, health, uploads, users

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, tags=["Auth"])
api_router.include_router(users.router, tags=["Users"])
api_router.include_router(conversations.router, tags=["Conversations"])
api_router.include_router(documents.router, tags=["Documents"])
api_router.include_router(uploads.router, tags=["Uploads"])
api_router.include_router(dashboard.router, tags=["Dashboard"])

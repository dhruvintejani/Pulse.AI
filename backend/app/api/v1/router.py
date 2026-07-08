from fastapi import APIRouter
from app.api.v1.endpoints import ai, auth, conversations, documents, health, users

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, tags=["Auth"])
api_router.include_router(users.router, tags=["Users"])
api_router.include_router(ai.router, tags=["AI Providers"])
api_router.include_router(conversations.router, tags=["Conversations"])
api_router.include_router(documents.router, tags=["Documents"])

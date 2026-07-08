from fastapi import APIRouter, Request, status
from fastapi.responses import ORJSONResponse
from app.core.config import settings
from app.core.limiter import limiter
from app.db.database import ping_database
from app.schemas.health import HealthResponse
from app.utils.datetime import utc_now

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
@limiter.limit(settings.RATE_LIMIT_HEALTH)
async def health_check(request: Request) -> HealthResponse:
    return HealthResponse(
        status="ok",
        service=settings.APP_NAME,
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
        timestamp=utc_now(),
    )


@router.get("/health/ready", response_model=HealthResponse)
@limiter.limit(settings.RATE_LIMIT_HEALTH)
async def readiness_check(request: Request) -> HealthResponse | ORJSONResponse:
    database_ready = await ping_database()

    if not database_ready:
        return ORJSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unavailable",
                "service": settings.APP_NAME,
                "version": settings.APP_VERSION,
                "environment": settings.ENVIRONMENT,
                "timestamp": utc_now().isoformat(),
                "database": "unavailable",
            },
        )

    return HealthResponse(
        status="ready",
        service=settings.APP_NAME,
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
        timestamp=utc_now(),
        database="connected",
    )

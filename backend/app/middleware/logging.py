import time
from uuid import uuid4
from fastapi import Request, Response
from loguru import logger
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from app.core.config import settings


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        request_id = request.headers.get("X-Request-ID", uuid4().hex)
        start_time = time.perf_counter()
        client_ip = request.headers.get("X-Forwarded-For", "").split(",")[0].strip() or (request.client.host if request.client else None)
        user_agent = request.headers.get("User-Agent")

        with logger.contextualize(request_id=request_id):
            logger.bind(category="request").info(
                "Request started",
                method=request.method,
                path=request.url.path,
                query=str(request.url.query),
                client=client_ip,
                user_agent=user_agent,
            )

            try:
                response = await call_next(request)
            except Exception:
                process_time_ms = round((time.perf_counter() - start_time) * 1000, 2)
                logger.bind(category="request").exception(
                    "Unhandled request error",
                    method=request.method,
                    path=request.url.path,
                    client=client_ip,
                    duration_ms=process_time_ms,
                )
                raise

            process_time_ms = round((time.perf_counter() - start_time) * 1000, 2)
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time-Ms"] = str(process_time_ms)

            request_logger = logger.bind(category="request")
            if response.status_code >= 500:
                request_logger.error(
                    "Request failed",
                    method=request.method,
                    path=request.url.path,
                    status_code=response.status_code,
                    duration_ms=process_time_ms,
                    client=client_ip,
                )
            elif response.status_code >= 400:
                request_logger.warning(
                    "Request warning",
                    method=request.method,
                    path=request.url.path,
                    status_code=response.status_code,
                    duration_ms=process_time_ms,
                    client=client_ip,
                )
            else:
                request_logger.info(
                    "Request completed",
                    method=request.method,
                    path=request.url.path,
                    status_code=response.status_code,
                    duration_ms=process_time_ms,
                    client=client_ip,
                )

            if process_time_ms >= settings.LOG_PERFORMANCE_THRESHOLD_MS:
                logger.bind(category="performance").warning(
                    "Slow request detected",
                    method=request.method,
                    path=request.url.path,
                    status_code=response.status_code,
                    duration_ms=process_time_ms,
                    threshold_ms=settings.LOG_PERFORMANCE_THRESHOLD_MS,
                )

            return response

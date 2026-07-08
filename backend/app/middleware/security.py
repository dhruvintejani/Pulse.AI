from collections.abc import Awaitable, Callable
from typing import Any
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import JSONResponse
from starlette.types import ASGIApp, Message, Receive, Scope, Send
from app.core.config import settings
from app.core.errors import AppError
from app.core.security import ensure_safe_input, is_sanitizable_content_type, parse_json_body


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        response = await call_next(request)
        if not settings.SECURITY_HEADERS_ENABLED:
            return response

        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        response.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()")
        response.headers.setdefault("X-Permitted-Cross-Domain-Policies", "none")
        response.headers.setdefault("Cross-Origin-Opener-Policy", "same-origin")
        response.headers.setdefault("X-Download-Options", "noopen")
        response.headers.setdefault("Content-Security-Policy", settings.SECURITY_CONTENT_SECURITY_POLICY)

        if settings.SECURITY_ENABLE_HSTS:
            response.headers.setdefault(
                "Strict-Transport-Security",
                f"max-age={settings.SECURITY_HSTS_MAX_AGE_SECONDS}; includeSubDomains; preload",
            )

        return response


class RequestSizeLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        content_length = request.headers.get("Content-Length")
        if content_length and content_length.isdigit() and int(content_length) > settings.SECURITY_MAX_REQUEST_SIZE_BYTES:
            return JSONResponse(
                status_code=413,
                content={
                    "success": False,
                    "error_code": "REQUEST_TOO_LARGE",
                    "message": "Request body is too large",
                    "details": {"max_size_bytes": settings.SECURITY_MAX_REQUEST_SIZE_BYTES},
                    "request_id": request.headers.get("X-Request-ID"),
                },
            )
        return await call_next(request)


class InputSanitizationMiddleware:
    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http" or not settings.SECURITY_INPUT_SANITIZATION_ENABLED:
            await self.app(scope, receive, send)
            return

        headers = {key.decode("latin-1").lower(): value.decode("latin-1") for key, value in scope.get("headers", [])}
        content_type = headers.get("content-type")
        path = scope.get("path", "")
        query_string = scope.get("query_string", b"").decode("latin-1", errors="ignore")

        try:
            ensure_safe_input(path, location="path")
            ensure_safe_input(query_string, location="query")

            if is_sanitizable_content_type(content_type):
                body = await self._read_body(receive)
                if len(body) > settings.SECURITY_MAX_REQUEST_SIZE_BYTES:
                    await self._send_error(scope, send, status_code=413, error_code="REQUEST_TOO_LARGE", message="Request body is too large")
                    return

                if body:
                    parsed = parse_json_body(body)
                    if parsed is not None:
                        ensure_safe_input(parsed, location="body")
                    else:
                        ensure_safe_input(body.decode("utf-8", errors="ignore"), location="body")

                await self.app(scope, self._replay_body(body), send)
                return

            await self.app(scope, receive, send)
        except AppError as exc:
            await self._send_error(scope, send, status_code=exc.status_code, error_code=exc.error_code, message=exc.message, details=exc.details)

    async def _read_body(self, receive: Receive) -> bytes:
        body = b""
        more_body = True
        while more_body:
            message = await receive()
            body += message.get("body", b"")
            more_body = bool(message.get("more_body", False))
            if len(body) > settings.SECURITY_MAX_REQUEST_SIZE_BYTES:
                break
        return body

    @staticmethod
    def _replay_body(body: bytes) -> Callable[[], Awaitable[Message]]:
        sent = False

        async def receive() -> Message:
            nonlocal sent
            if sent:
                return {"type": "http.request", "body": b"", "more_body": False}
            sent = True
            return {"type": "http.request", "body": body, "more_body": False}

        return receive

    @staticmethod
    async def _send_error(
        scope: Scope,
        send: Send,
        *,
        status_code: int,
        error_code: str,
        message: str,
        details: dict[str, Any] | None = None,
    ) -> None:
        response = JSONResponse(
            status_code=status_code,
            content={
                "success": False,
                "error_code": error_code,
                "message": message,
                "details": details,
                "request_id": None,
            },
        )
        async def receive() -> Message:
            return {"type": "http.request", "body": b"", "more_body": False}
        await response(scope, receive, send)

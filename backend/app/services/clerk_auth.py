import time
from typing import Any
import httpx
from jose import JWTError, jwt
from loguru import logger
from app.core.config import settings
from app.core.errors import AppError
from app.schemas.auth import ClerkTokenClaims

MAX_AUTH_TOKEN_LENGTH = 8192


class ClerkAuthService:
    def __init__(self) -> None:
        self._jwks: dict[str, Any] | None = None
        self._jwks_expires_at = 0.0

    async def verify_token(self, token: str) -> ClerkTokenClaims:
        if not settings.CLERK_ISSUER or not settings.CLERK_JWKS_URL:
            raise AppError(
                "Clerk authentication is not configured",
                status_code=500,
                error_code="CLERK_NOT_CONFIGURED",
            )

        if not token or len(token) > MAX_AUTH_TOKEN_LENGTH or token.count(".") != 2:
            raise AppError("Invalid authorization token", status_code=401, error_code="INVALID_AUTH_TOKEN")

        try:
            header = jwt.get_unverified_header(token)
        except JWTError as exc:
            raise AppError("Invalid authorization token", status_code=401, error_code="INVALID_AUTH_TOKEN") from exc

        if header.get("alg") != "RS256" or header.get("typ") not in {None, "JWT"}:
            raise AppError("Unsupported authorization token", status_code=401, error_code="UNSUPPORTED_AUTH_TOKEN")

        key = await self._get_signing_key(header.get("kid"))

        try:
            if settings.CLERK_AUDIENCE:
                payload = jwt.decode(
                    token,
                    key,
                    algorithms=["RS256"],
                    issuer=settings.CLERK_ISSUER,
                    audience=settings.CLERK_AUDIENCE,
                )
            else:
                payload = jwt.decode(
                    token,
                    key,
                    algorithms=["RS256"],
                    issuer=settings.CLERK_ISSUER,
                    options={"verify_aud": False},
                )
        except JWTError as exc:
            raise AppError("Invalid or expired Clerk token", status_code=401, error_code="CLERK_TOKEN_INVALID") from exc

        claims = ClerkTokenClaims.model_validate(payload)
        self._validate_authorized_party(claims)
        return claims

    async def _get_signing_key(self, kid: str | None) -> dict[str, Any]:
        if not kid:
            raise AppError("Missing Clerk token key id", status_code=401, error_code="CLERK_KID_MISSING")

        jwks = await self._get_jwks()
        for key in jwks.get("keys", []):
            if key.get("kid") == kid:
                return key

        self._jwks = None
        jwks = await self._get_jwks(force_refresh=True)
        for key in jwks.get("keys", []):
            if key.get("kid") == kid:
                return key

        raise AppError("Unable to resolve Clerk signing key", status_code=401, error_code="CLERK_SIGNING_KEY_NOT_FOUND")

    async def _get_jwks(self, *, force_refresh: bool = False) -> dict[str, Any]:
        now = time.time()
        if not force_refresh and self._jwks and now < self._jwks_expires_at:
            return self._jwks

        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(settings.CLERK_JWKS_URL)
                response.raise_for_status()
        except httpx.HTTPError as exc:
            raise AppError(
                "Unable to fetch Clerk signing keys",
                status_code=503,
                error_code="CLERK_JWKS_UNAVAILABLE",
            ) from exc

        self._jwks = response.json()
        self._jwks_expires_at = now + settings.CLERK_JWKS_CACHE_SECONDS
        logger.bind(category="auth").info("Clerk JWKS refreshed")
        return self._jwks

    def _validate_authorized_party(self, claims: ClerkTokenClaims) -> None:
        if not settings.CLERK_AUTHORIZED_PARTIES:
            return
        if claims.azp and claims.azp in settings.CLERK_AUTHORIZED_PARTIES:
            return
        raise AppError("Clerk authorized party is not allowed", status_code=401, error_code="CLERK_AZP_NOT_ALLOWED")


clerk_auth_service = ClerkAuthService()

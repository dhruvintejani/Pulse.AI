from functools import lru_cache
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    APP_NAME: str = "Pulse AI API"
    APP_VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"

    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "pulse_ai"
    MONGODB_SERVER_SELECTION_TIMEOUT_MS: int = 5000

    BACKEND_CORS_ORIGINS: list[str] = Field(default_factory=lambda: ["http://localhost:5173"])
    BACKEND_CORS_ALLOW_CREDENTIALS: bool = True

    INTERNAL_JWT_SECRET: str = "change-this-in-production"
    INTERNAL_JWT_ALGORITHM: str = "HS256"
    INTERNAL_JWT_EXPIRES_MINUTES: int = 15

    RATE_LIMIT_DEFAULT: str = "120/minute"
    RATE_LIMIT_HEALTH: str = "60/minute"

    LOG_LEVEL: str = "INFO"
    LOG_JSON: bool = False

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

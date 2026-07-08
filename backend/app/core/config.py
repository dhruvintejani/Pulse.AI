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

    CLERK_ISSUER: str = ""
    CLERK_JWKS_URL: str = ""
    CLERK_AUDIENCE: str | None = None
    CLERK_AUTHORIZED_PARTIES: list[str] = Field(default_factory=list)
    CLERK_JWKS_CACHE_SECONDS: int = 300
    CLERK_SECRET_KEY: str | None = None
    CLERK_API_BASE_URL: str = "https://api.clerk.com/v1"

    INTERNAL_JWT_SECRET: str = "change-this-in-production"
    INTERNAL_JWT_ALGORITHM: str = "HS256"
    INTERNAL_JWT_EXPIRES_MINUTES: int = 15

    RATE_LIMIT_DEFAULT: str = "120/minute"
    RATE_LIMIT_HEALTH: str = "60/minute"

    AI_DEFAULT_PROVIDER: str = "mock"
    AI_ENABLED_PROVIDERS: list[str] = Field(default_factory=lambda: ["mock"])
    AI_DEFAULT_MODEL: str = "pulse-ai-default"
    AI_STREAM_PLACEHOLDER_DELAY_MS: int = 35
    OPENAI_API_KEY: str | None = None
    GEMINI_API_KEY: str | None = None
    CLAUDE_API_KEY: str | None = None
    GROQ_API_KEY: str | None = None
    DEEPSEEK_API_KEY: str | None = None

    LOG_LEVEL: str = "INFO"
    LOG_JSON: bool = False

    @field_validator("BACKEND_CORS_ORIGINS", "CLERK_AUTHORIZED_PARTIES", "AI_ENABLED_PROVIDERS", mode="before")
    @classmethod
    def parse_csv_list(cls, value: str | list[str] | None) -> list[str]:
        if value is None:
            return []
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return value

    @field_validator(
        "CLERK_AUDIENCE",
        "CLERK_SECRET_KEY",
        "OPENAI_API_KEY",
        "GEMINI_API_KEY",
        "CLAUDE_API_KEY",
        "GROQ_API_KEY",
        "DEEPSEEK_API_KEY",
        mode="before",
    )
    @classmethod
    def empty_string_to_none(cls, value: str | None) -> str | None:
        if value == "":
            return None
        return value

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"

    @property
    def ai_provider_api_keys(self) -> dict[str, str | None]:
        return {
            "openai": self.OPENAI_API_KEY,
            "gemini": self.GEMINI_API_KEY,
            "claude": self.CLAUDE_API_KEY,
            "groq": self.GROQ_API_KEY,
            "deepseek": self.DEEPSEEK_API_KEY,
        }


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

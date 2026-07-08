from collections.abc import Generator
from datetime import UTC, datetime
from beanie import PydanticObjectId
from fastapi.testclient import TestClient
import pytest
from app.dependencies import get_current_user
from app.main import create_application
from app.models.user import User, UserRole, UserStatus


@pytest.fixture
def now() -> datetime:
    return datetime.now(UTC)


@pytest.fixture
def mock_user() -> User:
    return User(
        id=PydanticObjectId(),
        clerk_user_id="user_test_123",
        email="test@pulse.ai",
        full_name="Test User",
        role=UserRole.MEMBER,
        status=UserStatus.ACTIVE,
    )


@pytest.fixture
def client(mock_user: User) -> Generator[TestClient, None, None]:
    app = create_application()

    async def override_current_user() -> User:
        return mock_user

    app.dependency_overrides[get_current_user] = override_current_user
    test_client = TestClient(app)
    yield test_client
    app.dependency_overrides.clear()
    test_client.close()


@pytest.fixture
def public_client() -> Generator[TestClient, None, None]:
    app = create_application()
    test_client = TestClient(app)
    yield test_client
    test_client.close()

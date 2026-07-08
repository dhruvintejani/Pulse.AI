from app.api.v1.endpoints import health


async def mock_database_ready() -> bool:
    return True


async def mock_database_down() -> bool:
    return False


def test_health_check(public_client):
    response = public_client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_readiness_uses_mock_database(public_client, monkeypatch):
    monkeypatch.setattr(health, "ping_database", mock_database_ready)

    response = public_client.get("/api/v1/health/ready")

    assert response.status_code == 200
    assert response.json()["database"] == "connected"


def test_readiness_database_failure(public_client, monkeypatch):
    monkeypatch.setattr(health, "ping_database", mock_database_down)

    response = public_client.get("/api/v1/health/ready")

    assert response.status_code == 503
    assert response.json()["database"] == "unavailable"

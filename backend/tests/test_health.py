from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root_endpoint_returns_service_metadata():
    response = client.get("/")

    assert response.status_code == 200
    payload = response.json()
    assert payload["service"] == "Pulse AI API"
    assert payload["status"] == "ok"
    assert "version" in payload


def test_health_endpoint_returns_ok_status():
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert payload["service"] == "Pulse AI API"
    assert payload["environment"] in {"development", "test", "ci", "production"}

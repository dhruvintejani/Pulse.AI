def test_protected_route_requires_clerk_bearer_token(public_client):
    response = public_client.get("/api/v1/users/me")

    assert response.status_code == 401
    assert response.json()["error_code"] == "AUTH_REQUIRED"


def test_security_headers_are_added(public_client):
    response = public_client.get("/")

    assert response.status_code == 200
    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.headers["x-frame-options"] == "DENY"
    assert "content-security-policy" in response.headers


def test_suspicious_query_input_is_rejected(public_client):
    response = public_client.get("/api/v1/search?q=%3Cscript%3Ealert(1)%3C/script%3E")

    assert response.status_code == 400
    assert response.json()["error_code"] == "SUSPICIOUS_INPUT"


def test_request_validation_error_shape(client):
    response = client.get("/api/v1/dashboard/recent-chats?limit=0")

    assert response.status_code == 422
    body = response.json()
    assert body["success"] is False
    assert body["error_code"] == "VALIDATION_ERROR"

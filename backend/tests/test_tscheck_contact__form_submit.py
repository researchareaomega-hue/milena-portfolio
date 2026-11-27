"""Contact form validation and submit (POST /api/inquiries)."""

import uuid


def test_invalid_payload_returns_422(client):
    resp = client.post("/inquiries", json={"name": "a", "email": "not-an-email", "subject": "x", "message": "short"})
    assert resp.status_code == 422, resp.text


def test_valid_payload_creates_inquiry_201(client):
    suffix = uuid.uuid4().hex[:8]
    payload = {
        "name": f"tscheck-contact-{suffix}",
        "email": f"tscheck-{suffix}@example.com",
        "subject": "Business inquiry regarding asset management",
        "message": "This is a tscheck generated test message with enough length.",
    }
    resp = client.post("/inquiries", json=payload)
    assert resp.status_code == 201, resp.text
    body = resp.json()
    assert body["status"] == "received"
    assert "id" in body

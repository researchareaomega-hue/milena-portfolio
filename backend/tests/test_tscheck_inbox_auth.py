"""PIN-gated inbox: login, session, messages auth, logout."""

import os

import httpx

DEFAULT_PIN = os.environ.get("INBOX_DEFAULT_PIN", "350026")


def test_messages_without_session_returns_401(client):
    resp = client.get("/inbox/messages")
    assert resp.status_code == 401, resp.text


def test_wrong_pin_returns_401(client):
    resp = client.post("/inbox/login", json={"pin": "000000"})
    assert resp.status_code == 401, resp.text


def test_correct_pin_logs_in_and_lists_messages(backend_url):
    # The session cookie is set with the `Secure` attribute, so a plain-http
    # httpx client (correctly) won't re-send it automatically. We extract the
    # token from Set-Cookie and forward it manually - the browser does this
    # for real over https in production where Secure cookies work normally.
    with httpx.Client(base_url=f"{backend_url}/api", timeout=30.0) as c:
        login = c.post("/inbox/login", json={"pin": DEFAULT_PIN})
        assert login.status_code == 200, login.text
        token = login.cookies.get("vda_inbox_session")
        assert token, "login did not set vda_inbox_session cookie"

        cookies = {"vda_inbox_session": token}

        session = c.get("/inbox/session", cookies=cookies)
        assert session.status_code == 200
        assert session.json()["authenticated"] is True

        messages = c.get("/inbox/messages", cookies=cookies)
        assert messages.status_code == 200, messages.text
        body = messages.json()
        assert "items" in body and "unread" in body and "total" in body

        logout = c.post("/inbox/logout", cookies=cookies)
        assert logout.status_code == 200

        # after logout, session should no longer be authenticated for messages
        after = c.get("/inbox/messages", cookies=cookies)
        assert after.status_code == 401

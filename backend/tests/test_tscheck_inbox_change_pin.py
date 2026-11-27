"""Change PIN: rejects wrong current PIN; valid change then reverted back to default."""

import os

import httpx

DEFAULT_PIN = os.environ.get("INBOX_DEFAULT_PIN", "350026")


def test_change_pin_wrong_current_rejected_and_roundtrip(backend_url):
    # Secure cookie -> forward manually for this plain-http test client (see
    # test_tscheck_inbox_auth.py for rationale).
    with httpx.Client(base_url=f"{backend_url}/api", timeout=30.0) as c:
        login = c.post("/inbox/login", json={"pin": DEFAULT_PIN})
        assert login.status_code == 200, login.text
        token = login.cookies.get("vda_inbox_session")
        assert token, "login did not set vda_inbox_session cookie"
        cookies = {"vda_inbox_session": token}

        # wrong current pin -> 400
        bad = c.post("/inbox/pin", json={"current_pin": "999999", "new_pin": "123456"}, cookies=cookies)
        assert bad.status_code == 400, bad.text

        # correct current pin -> change, then change back to restore state
        changed = c.post("/inbox/pin", json={"current_pin": DEFAULT_PIN, "new_pin": "193756"}, cookies=cookies)
        assert changed.status_code == 200, changed.text

        reverted = c.post("/inbox/pin", json={"current_pin": "193756", "new_pin": DEFAULT_PIN}, cookies=cookies)
        assert reverted.status_code == 200, reverted.text

        # confirm default pin works again
        relogin = c.post("/inbox/login", json={"pin": DEFAULT_PIN})
        assert relogin.status_code == 200

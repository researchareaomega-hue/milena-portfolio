import hashlib
import os
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response

from lib.db import db
from models.inquiry import (
    Inquiry,
    InquiryAck,
    InquiryCreate,
    InquiryList,
    InquiryUpdate,
    PinChange,
    PinLogin,
    SessionState,
)

router = APIRouter()

COOKIE = "vda_inbox_session"
SESSION_TTL = timedelta(hours=12)
DEFAULT_PIN = os.environ.get("INBOX_DEFAULT_PIN", "350026")


def _hash(pin: str) -> str:
    return hashlib.sha256(f"vda::{pin}".encode()).hexdigest()


async def _pin_hash() -> str:
    doc = await db.settings.find_one({"key": "inbox_pin"})
    return doc["value"] if doc else _hash(DEFAULT_PIN)


async def require_session(vda_inbox_session: str | None = Cookie(default=None)) -> str:
    if not vda_inbox_session:
        raise HTTPException(status_code=401, detail="Secure session required")
    doc = await db.inbox_sessions.find_one({"token": vda_inbox_session})
    if not doc:
        raise HTTPException(status_code=401, detail="Secure session required")
    expires = doc["expires_at"].replace(tzinfo=timezone.utc)
    if expires < datetime.now(timezone.utc):
        await db.inbox_sessions.delete_one({"token": vda_inbox_session})
        raise HTTPException(status_code=401, detail="Session expired")
    return vda_inbox_session


# ---------- Public ----------
@router.post("/inquiries", response_model=InquiryAck, status_code=201)
async def create_inquiry(payload: InquiryCreate):
    data = payload.model_dump()
    data["organization"] = (data.get("organization") or "").strip() or None
    inquiry = Inquiry(**data)
    await db.inquiries.insert_one(inquiry.model_dump())
    return InquiryAck(id=inquiry.id, status="received")


# ---------- Inbox auth ----------
@router.post("/inbox/login", response_model=SessionState)
async def inbox_login(payload: PinLogin, response: Response):
    if not secrets.compare_digest(_hash(payload.pin), await _pin_hash()):
        raise HTTPException(status_code=401, detail="Access denied")
    token = secrets.token_urlsafe(32)
    await db.inbox_sessions.insert_one(
        {"token": token, "expires_at": datetime.now(timezone.utc) + SESSION_TTL}
    )
    response.set_cookie(
        COOKIE, token, httponly=True, samesite="lax", secure=True,
        max_age=int(SESSION_TTL.total_seconds()), path="/",
    )
    return SessionState(authenticated=True)


@router.post("/inbox/logout", response_model=SessionState)
async def inbox_logout(response: Response, vda_inbox_session: str | None = Cookie(default=None)):
    if vda_inbox_session:
        await db.inbox_sessions.delete_one({"token": vda_inbox_session})
    response.delete_cookie(COOKIE, path="/")
    return SessionState(authenticated=False)


@router.get("/inbox/session", response_model=SessionState)
async def inbox_session(vda_inbox_session: str | None = Cookie(default=None)):
    try:
        await require_session(vda_inbox_session)
        return SessionState(authenticated=True)
    except HTTPException:
        return SessionState(authenticated=False)


@router.post("/inbox/pin", response_model=SessionState)
async def change_pin(payload: PinChange, _: str = Depends(require_session)):
    if not secrets.compare_digest(_hash(payload.current_pin), await _pin_hash()):
        raise HTTPException(status_code=400, detail="Current PIN is incorrect")
    await db.settings.update_one(
        {"key": "inbox_pin"}, {"$set": {"value": _hash(payload.new_pin)}}, upsert=True
    )
    return SessionState(authenticated=True)


# ---------- Inbox data ----------
@router.get("/inbox/messages", response_model=InquiryList)
async def list_messages(_: str = Depends(require_session)):
    docs = await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    items = []
    for d in docs:
        d["created_at"] = d["created_at"].replace(tzinfo=timezone.utc)
        items.append(Inquiry(**d))
    unread = sum(1 for i in items if not i.read)
    return InquiryList(items=items, unread=unread, total=len(items))


@router.patch("/inbox/messages/{id}", response_model=Inquiry)
async def update_message(id: str, payload: InquiryUpdate, _: str = Depends(require_session)):
    res = await db.inquiries.find_one_and_update(
        {"id": id}, {"$set": {"read": payload.read}}, projection={"_id": 0}, return_document=True
    )
    if not res:
        raise HTTPException(status_code=404, detail="Message not found")
    res["created_at"] = res["created_at"].replace(tzinfo=timezone.utc)
    return Inquiry(**res)


@router.delete("/inbox/messages/{id}", response_model=InquiryAck)
async def delete_message(id: str, _: str = Depends(require_session)):
    res = await db.inquiries.delete_one({"id": id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return InquiryAck(id=id, status="deleted")

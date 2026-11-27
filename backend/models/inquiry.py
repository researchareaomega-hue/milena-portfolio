import uuid
from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class InquiryCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    organization: Optional[str] = Field(default=None, max_length=160)
    subject: str = Field(min_length=3, max_length=200)
    message: str = Field(min_length=10, max_length=5000)


class Inquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    organization: Optional[str] = None
    subject: str
    message: str
    read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class InquiryAck(BaseModel):
    id: str
    status: str


class InquiryList(BaseModel):
    items: list[Inquiry]
    unread: int
    total: int


class InquiryUpdate(BaseModel):
    read: bool


class PinLogin(BaseModel):
    pin: str = Field(min_length=1, max_length=32)


class PinChange(BaseModel):
    current_pin: str = Field(min_length=1, max_length=32)
    new_pin: str = Field(min_length=4, max_length=12, pattern=r"^\d+$")


class SessionState(BaseModel):
    authenticated: bool

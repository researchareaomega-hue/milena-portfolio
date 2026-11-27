// Mirrors backend/models/inquiry.py — keep in sync by hand.
export interface InquiryCreate {
  name: string;
  email: string;
  organization?: string | null;
  subject: string;
  message: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface InquiryAck {
  id: string;
  status: string;
}

export interface InquiryList {
  items: Inquiry[];
  unread: number;
  total: number;
}

export interface InquiryUpdate {
  read: boolean;
}

export interface PinLogin {
  pin: string;
}

export interface PinChange {
  current_pin: string;
  new_pin: string;
}

export interface SessionState {
  authenticated: boolean;
}

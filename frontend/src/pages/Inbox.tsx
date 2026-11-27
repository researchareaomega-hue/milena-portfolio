import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { ArrowLeft, Check, KeyRound, Lock, LogOut, Mail, MailOpen, Trash2 } from "lucide-react";
import { apiDelete, apiGet, apiPatch, apiPost, ApiError } from "@/lib/api";
import type { Inquiry, InquiryAck, InquiryList, PinChange, SessionState } from "@/lib/types";
import { Monogram } from "@/components/site/Monogram";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const SESSION_KEY = ["inbox", "session"];
const MESSAGES_KEY = ["inbox", "messages"];

const termInput =
  "w-full border border-[#30363D] bg-[#0D1117] px-4 py-3 font-mono text-sm text-[#E6EDF3] placeholder:text-[#484F58] transition-colors duration-200 focus:border-[#8B949E] focus:outline-none";

function PinGate() {
  const qc = useQueryClient();
  const [pin, setPin] = useState("");
  const login = useMutation({
    mutationFn: (p: string) => apiPost<SessionState>("/inbox/login", { pin: p }),
    onSuccess: () => {
      setPin("");
      qc.invalidateQueries({ queryKey: ["inbox"] });
    },
    onError: () => {
      setPin("");
      toast.error("Access denied");
    },
  });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (pin) login.mutate(pin);
  };
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="w-full max-w-md border border-[#30363D] bg-[#0D1117]" data-testid="inbox-pin-panel">
        <div className="flex items-center justify-between border-b border-[#30363D] bg-[#161B22] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8B949E]">
          <span>vda://secure-access</span>
          <span className="flex gap-1.5">
            <span className="size-2 rounded-full bg-[#30363D]" />
            <span className="size-2 rounded-full bg-[#30363D]" />
            <span className="size-2 rounded-full bg-[#3FB950]/70" />
          </span>
        </div>
        <form onSubmit={submit} className="relative overflow-hidden p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-full">
            <div className="scan-line h-16 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
          </div>
          <Monogram size={44} />
          <p className="mt-8 font-mono text-xs text-[#8B949E]">
            &gt; Executive Secure Access<br />&gt; Authorization required<span className="caret ml-1 text-[#E6EDF3]">_</span>
          </p>
          <label htmlFor="inbox-pin" className="mt-8 block font-mono text-[10px] uppercase tracking-[0.25em] text-[#8B949E]">
            Access PIN
          </label>
          <input
            id="inbox-pin"
            data-testid="inbox-pin-input"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            autoFocus
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className={cn(termInput, "mt-2 tracking-[0.5em]")}
            placeholder="••••••"
          />
          <button
            type="submit"
            data-testid="inbox-pin-submit-button"
            disabled={login.isPending || !pin}
            className="mt-6 w-full bg-[#E6EDF3] py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-[#0D1117] transition-colors duration-200 hover:bg-white disabled:opacity-50"
          >
            {login.isPending ? "Verifying..." : "Authenticate"}
          </button>
          {login.isError && (
            <p data-testid="inbox-pin-error" className="mt-4 font-mono text-xs text-[#F85149]">
              ! Access denied. Credential rejected.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function ChangePinDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const m = useMutation({
    mutationFn: (b: PinChange) => apiPost<SessionState>("/inbox/pin", b),
    onSuccess: () => {
      toast.success("PIN updated");
      setCur("");
      setNext("");
      onOpenChange(false);
    },
    onError: (e) => {
      const detail = e instanceof ApiError && e.status === 400 ? "Current PIN is incorrect" : "New PIN must be 4 to 12 digits";
      toast.error(detail);
    },
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[#30363D] bg-[#0D1117] font-mono" data-testid="change-pin-dialog">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm uppercase tracking-[0.2em] text-[#E6EDF3]">Change Access PIN</DialogTitle>
          <DialogDescription className="text-xs text-[#8B949E]">New PIN must be 4 to 12 digits.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            m.mutate({ current_pin: cur, new_pin: next });
          }}
          className="space-y-4"
        >
          <input data-testid="change-pin-current-input" type="password" inputMode="numeric" placeholder="Current PIN" value={cur} onChange={(e) => setCur(e.target.value)} className={termInput} />
          <input data-testid="change-pin-new-input" type="password" inputMode="numeric" placeholder="New PIN" value={next} onChange={(e) => setNext(e.target.value)} className={termInput} />
          <button type="submit" data-testid="change-pin-submit-button" disabled={m.isPending || !cur || !next} className="w-full bg-[#E6EDF3] py-3 text-[11px] uppercase tracking-[0.25em] text-[#0D1117] transition-colors duration-200 hover:bg-white disabled:opacity-50">
            Update PIN
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Dashboard() {
  const qc = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: MESSAGES_KEY,
    queryFn: () => apiGet<InquiryList>("/inbox/messages"),
  });

  const toggleRead = useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) => apiPatch<Inquiry>(`/inbox/messages/${id}`, { read }),
    onSuccess: () => qc.invalidateQueries({ queryKey: MESSAGES_KEY }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => apiDelete<InquiryAck>(`/inbox/messages/${id}`),
    onSuccess: () => {
      toast.success("Message deleted");
      setSelectedId(null);
      setConfirmDelete(false);
      qc.invalidateQueries({ queryKey: MESSAGES_KEY });
    },
  });
  const logout = useMutation({
    mutationFn: () => apiPost<SessionState>("/inbox/logout"),
    onSettled: () => {
      qc.removeQueries({ queryKey: MESSAGES_KEY });
      qc.invalidateQueries({ queryKey: SESSION_KEY });
    },
  });

  const items = data?.items ?? [];
  const selected = items.find((i) => i.id === selectedId) ?? null;

  const open = (m: Inquiry) => {
    setSelectedId(m.id);
    setConfirmDelete(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border border-[#30363D] bg-[#161B22] px-5 py-4">
        <div className="flex items-center gap-4">
          <Monogram size={32} />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8B949E]">vda://inbox</p>
            <h1 className="font-heading text-xl text-[#E6EDF3]">Executive Inbox</h1>
          </div>
        </div>
        <div className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.18em]">
          <span className="text-[#8B949E]">
            Total <span data-testid="inbox-total-count" className="ml-1 text-[#E6EDF3]">{data?.total ?? 0}</span>
          </span>
          <span className="flex items-center gap-2 text-[#8B949E]">
            Unread
            <span data-testid="inbox-unread-count" className="border border-[#3FB950]/50 bg-[#3FB950]/10 px-2 py-0.5 text-[#3FB950]">
              {data?.unread ?? 0}
            </span>
          </span>
          <button type="button" data-testid="inbox-change-pin-button" onClick={() => setPinOpen(true)} className="flex items-center gap-1.5 text-[#8B949E] transition-colors duration-200 hover:text-[#E6EDF3]">
            <KeyRound className="size-3.5" /> PIN
          </button>
          <button type="button" data-testid="inbox-logout-button" onClick={() => logout.mutate()} className="flex items-center gap-1.5 text-[#8B949E] transition-colors duration-200 hover:text-[#F85149]">
            <LogOut className="size-3.5" /> Exit
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <ul className="max-h-[70vh] overflow-y-auto border border-[#30363D] bg-[#0D1117] lg:col-span-5" data-testid="inbox-message-list">
          {isLoading && <li className="p-6 font-mono text-xs text-[#8B949E]">&gt; Decrypting stream<span className="caret">_</span></li>}
          {isError && <li className="p-6 font-mono text-xs text-[#F85149]">! Unable to load messages.</li>}
          {!isLoading && !isError && items.length === 0 && (
            <li data-testid="inbox-empty-state" className="p-6 font-mono text-xs text-[#8B949E]">&gt; No messages in the secure inbox.</li>
          )}
          {items.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                data-testid={`inbox-message-item-${m.id}`}
                onClick={() => open(m)}
                className={cn(
                  "block w-full border-b border-[#30363D] px-5 py-4 text-left transition-colors duration-150 hover:bg-[#161B22]",
                  selectedId === m.id && "bg-[#161B22]",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={cn("flex items-center gap-2 truncate text-sm", m.read ? "text-[#8B949E]" : "font-semibold text-[#E6EDF3]")}>
                    {!m.read && <span className="size-1.5 shrink-0 rounded-full bg-[#3FB950]" />}
                    {m.name}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] text-[#8B949E]">{format(new Date(m.created_at), "dd MMM HH:mm")}</span>
                </div>
                <p className={cn("mt-1 truncate text-sm", m.read ? "text-[#8B949E]" : "text-[#C9D1D9]")}>{m.subject}</p>
              </button>
            </li>
          ))}
        </ul>

        <div className="min-h-[50vh] border border-[#30363D] bg-[#0D1117] lg:col-span-7" data-testid="inbox-message-detail">
          {selected ? (
            <div className="flex h-full flex-col">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#30363D] px-6 py-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8B949E]">
                  {format(new Date(selected.created_at), "dd MMM yyyy, HH:mm")}
                </span>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em]">
                  <button
                    type="button"
                    data-testid="inbox-toggle-read-button"
                    onClick={() => toggleRead.mutate({ id: selected.id, read: !selected.read })}
                    className="flex items-center gap-1.5 border border-[#30363D] px-3 py-1.5 text-[#C9D1D9] transition-colors duration-150 hover:border-[#8B949E]"
                  >
                    {selected.read ? <><Mail className="size-3.5" /> Mark unread</> : <><MailOpen className="size-3.5" /> Mark as read</>}
                  </button>
                  {confirmDelete ? (
                    <button type="button" data-testid="inbox-confirm-delete-button" onClick={() => remove.mutate(selected.id)} className="flex items-center gap-1.5 border border-[#F85149] bg-[#F85149]/10 px-3 py-1.5 text-[#F85149]">
                      <Check className="size-3.5" /> Confirm delete
                    </button>
                  ) : (
                    <button type="button" data-testid="inbox-delete-button" onClick={() => setConfirmDelete(true)} className="flex items-center gap-1.5 border border-[#30363D] px-3 py-1.5 text-[#C9D1D9] transition-colors duration-150 hover:border-[#F85149] hover:text-[#F85149]">
                      <Trash2 className="size-3.5" /> Delete
                    </button>
                  )}
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <h2 data-testid="inbox-detail-subject" className="font-heading text-2xl text-[#E6EDF3]">{selected.subject}</h2>
                <dl className="mt-6 grid grid-cols-1 gap-3 font-mono text-xs sm:grid-cols-3">
                  <div><dt className="text-[#484F58]">FROM</dt><dd data-testid="inbox-detail-name" className="mt-1 text-[#C9D1D9]">{selected.name}</dd></div>
                  <div><dt className="text-[#484F58]">EMAIL</dt><dd className="mt-1 break-all"><a data-testid="inbox-detail-email" href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`} className="text-[#C9D1D9] underline-offset-4 hover:underline">{selected.email}</a></dd></div>
                  <div><dt className="text-[#484F58]">ORG</dt><dd data-testid="inbox-detail-organization" className="mt-1 text-[#C9D1D9]">{selected.organization ?? "Not provided"}</dd></div>
                </dl>
                <p data-testid="inbox-detail-message" className="mt-8 whitespace-pre-wrap border-t border-[#30363D] pt-6 leading-relaxed text-[#C9D1D9]">{selected.message}</p>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[50vh] items-center justify-center font-mono text-xs text-[#484F58]">
              &gt; Select a message to review<span className="caret ml-1">_</span>
            </div>
          )}
        </div>
      </div>
      <ChangePinDialog open={pinOpen} onOpenChange={setPinOpen} />
    </div>
  );
}

export default function Inbox() {
  const session = useQuery({
    queryKey: SESSION_KEY,
    queryFn: () => apiGet<SessionState>("/inbox/session"),
    retry: false,
  });
  const authed = session.data?.authenticated === true && !session.isError;

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3]">
      <div className="border-b border-[#30363D] px-4 py-3 sm:px-6">
        <Link to="/" data-testid="inbox-back-link" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#8B949E] transition-colors duration-200 hover:text-[#E6EDF3]">
          <ArrowLeft className="size-3.5" /> Public site
        </Link>
        <span className="float-right flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#484F58]">
          <Lock className="size-3" /> Restricted
        </span>
      </div>
      {session.isLoading ? (
        <p className="p-10 font-mono text-xs text-[#8B949E]">&gt; Establishing secure channel<span className="caret">_</span></p>
      ) : authed ? (
        <Dashboard />
      ) : (
        <PinGate />
      )}
    </div>
  );
}

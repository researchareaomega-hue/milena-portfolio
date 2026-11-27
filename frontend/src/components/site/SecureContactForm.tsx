import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { apiPost } from "@/lib/api";
import type { InquiryAck, InquiryCreate } from "@/lib/types";
import { cn } from "@/lib/utils";

type Fields = { name: string; email: string; organization: string; subject: string; message: string };
const EMPTY: Fields = { name: "", email: "", organization: "", subject: "", message: "" };

function validate(f: Fields): Partial<Record<keyof Fields, string>> {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (f.name.trim().length < 2) e.name = "Please provide your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Please provide a valid email address.";
  if (f.subject.trim().length < 3) e.subject = "Please state the subject of your inquiry.";
  if (f.message.trim().length < 10) e.message = "Please provide at least 10 characters.";
  return e;
}

const fieldCls =
  "w-full border-0 border-b border-[#242B35] bg-transparent px-0 py-3 text-base text-slate-100 placeholder:text-slate-600 transition-colors duration-200 focus:border-slate-300 focus:outline-none";

function Field({
  id, label, optional, error, children,
}: { id: string; label: string; optional?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
        {label}
        {optional && <span className="ml-2 text-slate-700">Optional</span>}
      </label>
      {children}
      {error && (
        <p data-testid={`${id}-error`} className="mt-2 text-xs text-[#F87171]">
          {error}
        </p>
      )}
    </div>
  );
}

export function SecureContactForm() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: (body: InquiryCreate) => apiPost<InquiryAck>("/inquiries", body),
    onSuccess: () => {
      setSent(true);
      setF(EMPTY);
    },
    onError: () => toast.error("Transmission failed. Please try again shortly."),
  });

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = validate(f);
    setErrors(v);
    if (Object.keys(v).length) return;
    mutation.mutate({
      name: f.name.trim(),
      email: f.email.trim(),
      organization: f.organization.trim() || null,
      subject: f.subject.trim(),
      message: f.message.trim(),
    });
  };

  return (
    <div className="relative border border-[#1F242D] bg-[#12151B]/70 p-6 sm:p-10">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            data-testid="contact-success-panel"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-h-[420px] flex-col items-start justify-center"
          >
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <circle cx="32" cy="32" r="30" stroke="#374151" />
              <circle className="seal-draw" cx="32" cy="32" r="25" stroke="#E5E7EB" strokeWidth="1" />
              <path className="seal-draw" d="M22 33l7 7 14-15" stroke="#34D399" strokeWidth="1.6" />
            </svg>
            <h3 data-testid="contact-success-title" className="mt-8 font-heading text-3xl text-slate-100">
              Message Sent Successfully
            </h3>
            <p className="mt-4 max-w-md text-slate-400">
              Your inquiry has been logged to the secure internal inbox. You will receive a response at the
              address provided once it has been reviewed.
            </p>
            <button
              type="button"
              data-testid="contact-send-another-button"
              onClick={() => setSent(false)}
              className="mt-10 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400 underline-offset-8 transition-colors duration-200 hover:text-white hover:underline"
            >
              Send another inquiry
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            noValidate
            data-testid="contact-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2"
          >
            <Field id="contact-name" label="Full Name" error={errors.name}>
              <input id="contact-name" data-testid="contact-name-input" className={fieldCls} value={f.name} onChange={set("name")} placeholder="Your name" autoComplete="name" />
            </Field>
            <Field id="contact-email" label="Email" error={errors.email}>
              <input id="contact-email" type="email" data-testid="contact-email-input" className={fieldCls} value={f.email} onChange={set("email")} placeholder="name@company.com" autoComplete="email" />
            </Field>
            <Field id="contact-organization" label="Organization" optional>
              <input id="contact-organization" data-testid="contact-organization-input" className={fieldCls} value={f.organization} onChange={set("organization")} placeholder="Company or fund" autoComplete="organization" />
            </Field>
            <Field id="contact-subject" label="Subject" error={errors.subject}>
              <input id="contact-subject" data-testid="contact-subject-input" className={fieldCls} value={f.subject} onChange={set("subject")} placeholder="Nature of inquiry" />
            </Field>
            <div className="sm:col-span-2">
              <Field id="contact-message" label="Message" error={errors.message}>
                <textarea id="contact-message" data-testid="contact-message-input" rows={5} className={cn(fieldCls, "resize-none")} value={f.message} onChange={set("message")} placeholder="Outline your proposal, timeline, and scope." />
              </Field>
            </div>
            <div className="flex flex-col gap-6 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600">
                Channel encrypted in transit
              </span>
              <button
                type="submit"
                disabled={mutation.isPending}
                data-testid="contact-submit-button"
                className="group inline-flex items-center justify-center gap-3 bg-[#E5E7EB] px-8 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#0B0C10] transition-colors duration-200 hover:bg-white disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C10]"
              >
                {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                Transmit Inquiry
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

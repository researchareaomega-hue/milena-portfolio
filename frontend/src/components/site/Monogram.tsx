import { cn } from "@/lib/utils";

export function Monogram({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <rect x="0.5" y="0.5" width="47" height="47" stroke="#6B7280" strokeOpacity="0.6" />
      <rect x="4.5" y="4.5" width="39" height="39" stroke="#C0C7D0" strokeOpacity="0.35" />
      <path
        d="M13 34V14.5L24 28L35 14.5V34"
        stroke="#E5E7EB"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
      <path d="M10 38H38" stroke="#9CA3AF" strokeWidth="0.75" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-3", className)} data-testid="brand-wordmark">
      <Monogram size={34} />
      <span className="flex flex-col leading-none">
        <span className="font-heading text-lg tracking-wide text-slate-100">Milena</span>
        <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.28em] text-slate-500">
          Vanguard Digital Assets™
        </span>
      </span>
    </span>
  );
}

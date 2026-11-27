import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Monogram } from "@/components/site/Monogram";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-[#1F242D] bg-[#0B0C10]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
        <div className="flex items-center gap-4">
          <Monogram size={28} />
          <p data-testid="footer-copyright" className="text-sm text-slate-400">
            © 2026 Vanguard Digital Assets™. Managed by Milena.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 font-mono text-[11px] uppercase tracking-[0.2em]">
          <Link to="/terms" data-testid="footer-terms-link" className="text-slate-400 transition-colors duration-200 hover:text-white">
            Terms of Service
          </Link>
          <Link to="/privacy" data-testid="footer-privacy-link" className="text-slate-400 transition-colors duration-200 hover:text-white">
            Privacy Policy
          </Link>
          <Link
            to="/inbox"
            data-testid="footer-secure-access-link"
            className="group flex items-center gap-2 text-slate-600 transition-colors duration-200 hover:text-slate-300"
          >
            <Lock className="size-3 transition-transform duration-200 group-hover:-translate-y-px" />
            Executive Secure Access
          </Link>
        </div>
      </div>
    </footer>
  );
}

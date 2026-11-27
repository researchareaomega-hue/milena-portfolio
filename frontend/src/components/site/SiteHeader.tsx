import { Link } from "react-router-dom";
import { Wordmark } from "@/components/site/Monogram";

const links = [
  { href: "#overview", label: "Overview" },
  { href: "#competencies", label: "Competencies" },
  { href: "#operations", label: "Operations" },
  { href: "#transactions", label: "Transactions" },
];

export function SiteHeader({ onHome = true }: { onHome?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#1F242D] bg-[#0B0C10]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-8 lg:px-12">
        <Link to="/" data-testid="header-home-link" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300">
          <Wordmark />
        </Link>
        {onHome && (
          <nav className="flex items-center gap-8">
            <ul className="hidden items-center gap-8 md:flex">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    data-testid={`nav-${l.label.toLowerCase()}-link`}
                    className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              data-testid="nav-contact-link"
              className="border border-[#374151] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-200 transition-colors duration-200 hover:border-slate-300 hover:bg-[#E5E7EB] hover:text-[#0B0C10]"
            >
              Contact
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}

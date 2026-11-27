import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export interface LegalSection {
  title: string;
  body: string;
}

export function LegalPage({
  eyebrow, title, intro, sections, testId,
}: { eyebrow: string; title: string; intro: ReactNode; sections: LegalSection[]; testId: string }) {
  return (
    <div className="grain min-h-screen bg-[#0B0C10]">
      <SiteHeader onHome={false} />
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:px-12">
        <Link to="/" data-testid="legal-back-link" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500 transition-colors duration-200 hover:text-white">
          <ArrowLeft className="size-3.5" /> Return
        </Link>
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">{eyebrow}</p>
            <h1 data-testid={testId} className="mt-4 font-heading text-4xl tracking-tight text-slate-100 sm:text-5xl">{title}</h1>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-600">Effective 1 January 2026</p>
            <ol className="mt-10 hidden space-y-3 border-l border-[#1F242D] pl-5 lg:block">
              {sections.map((s, i) => (
                <li key={s.title} className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500">
                  {String(i + 1).padStart(2, "0")} {s.title}
                </li>
              ))}
            </ol>
          </aside>
          <article className="space-y-12 lg:col-span-8">
            <div className="text-lg font-light leading-relaxed text-slate-300">{intro}</div>
            {sections.map((s, i) => (
              <section key={s.title} className="border-t border-[#1F242D] pt-8">
                <h2 className="font-heading text-2xl text-slate-100">
                  <span className="mr-4 font-mono text-sm text-slate-600">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h2>
                <p className="mt-4 leading-relaxed text-slate-400">{s.body}</p>
              </section>
            ))}
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

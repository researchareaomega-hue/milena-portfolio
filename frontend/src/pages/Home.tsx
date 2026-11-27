import { motion } from "motion/react";
import { ArrowDownRight, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Monogram } from "@/components/site/Monogram";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { SecureContactForm } from "@/components/site/SecureContactForm";
import { competencies, operations, transactions } from "@/lib/content";

const container = "mx-auto max-w-6xl px-6 sm:px-8 lg:px-12";
const ease = [0.16, 1, 0.3, 1] as const;

export default function Home() {
  return (
    <div className="grain min-h-screen bg-[#0B0C10] text-slate-300">
      <SiteHeader />
      <main className="relative z-10">
        {/* HERO */}
        <section id="home" className={container} data-testid="hero-section">
          <div className="grid min-h-[85vh] grid-cols-1 items-center gap-12 py-20 lg:grid-cols-12 lg:gap-16 lg:py-28">
            <div className="lg:col-span-8">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease }}
                className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500"
              >
                Vanguard Digital Assets™
              </motion.p>
              <motion.h1
                data-testid="hero-name"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1, ease }}
                className="platinum-text mt-6 font-heading text-7xl font-normal leading-[0.95] tracking-tight sm:text-8xl lg:text-[9rem]"
              >
                Milena
              </motion.h1>
              <motion.p
                data-testid="hero-title"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease }}
                className="mt-8 text-lg font-light tracking-wide text-slate-200 sm:text-xl"
              >
                Principal Financier &amp; Executive Representative
              </motion.p>
              <motion.p
                data-testid="hero-bio"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45, ease }}
                className="mt-6 max-w-xl leading-relaxed text-slate-400"
              >
                I direct capital toward durable digital assets. I structure acquisitions, govern the infrastructure
                behind them, and represent Vanguard Digital Assets™ wherever terms are decided.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease }}
                className="mt-12 flex flex-wrap items-center gap-6"
              >
                <a
                  href="#contact"
                  data-testid="hero-inquiry-button"
                  className="group inline-flex items-center gap-3 bg-[#E5E7EB] px-8 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#0B0C10] transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C10]"
                >
                  Initiate Business Inquiry
                  <ArrowDownRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                </a>
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600">
                  <ShieldCheck className="size-3.5" /> By inquiry only
                </span>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, delay: 0.5, ease }}
              className="hidden lg:col-span-4 lg:block"
            >
              <div className="relative border border-[#1F242D] bg-[#12151B]/60 p-10">
                <Monogram size={120} className="mx-auto" />
                <dl className="mt-10 space-y-4 border-t border-[#1F242D] pt-6 font-mono text-[11px] uppercase tracking-[0.18em]">
                  {[
                    ["Role", "Principal Financier"],
                    ["Mandate", "Executive Representative"],
                    ["Focus", "Digital Assets"],
                    ["Est.", "Vanguard Digital Assets™"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4">
                      <dt className="text-slate-600">{k}</dt>
                      <dd className="text-right text-slate-300">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </motion.div>
          </div>
        </section>

        {/* OVERVIEW */}
        <section id="overview" className={`${container} scroll-mt-20 py-24`}>
          <SectionHeading index="01" eyebrow="Profile" title="Executive Overview" testId="overview-title" />
          <div className="grid grid-cols-1 md:grid-cols-12">
            <Reveal className="md:col-span-9 md:col-start-4">
              <p data-testid="overview-text" className="font-heading text-2xl font-normal leading-snug text-slate-200 sm:text-3xl">
                Milena serves as Principal Financier and Executive Representative of Vanguard Digital Assets™,
                overseeing the acquisition and stewardship of digital properties with measurable, lasting value.
              </p>
              <p className="mt-8 max-w-2xl leading-relaxed text-slate-400">
                Her mandate spans capital allocation, transaction leadership, and post-acquisition governance. She
                operates with discretion and precision, favoring structures that protect capital, preserve
                continuity, and compound over time. Every engagement is conducted under strict confidentiality.
              </p>
            </Reveal>
          </div>
        </section>

        {/* COMPETENCIES */}
        <section id="competencies" className={`${container} scroll-mt-20 py-24`}>
          <SectionHeading index="02" eyebrow="Capabilities" title="Core Competencies" testId="competencies-title" />
          <ol className="grid grid-cols-1 md:grid-cols-12">
            {competencies.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06} className="md:col-span-9 md:col-start-4">
                <li
                  data-testid={`competency-item-${i}`}
                  className="group grid grid-cols-[3rem_1fr] gap-4 border-b border-[#1F242D] py-8 transition-colors duration-300 hover:border-[#374151]"
                >
                  <span className="pt-1 font-mono text-xs text-slate-600">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">{c.title}</h3>
                    <p className="mt-2 max-w-2xl leading-relaxed text-slate-400">{c.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* OPERATIONS */}
        <section id="operations" className={`${container} scroll-mt-20 py-24`}>
          <SectionHeading index="03" eyebrow="Mandate" title="Strategic Operations" testId="operations-title" />
          <div className="grid grid-cols-1 gap-px border border-[#1F242D] bg-[#1F242D] md:grid-cols-3">
            {operations.map((o, i) => (
              <Reveal key={o.title} delay={i * 0.1} className="bg-[#0B0C10]">
                <div
                  data-testid={`operation-card-${i}`}
                  className="flex h-full flex-col p-8 transition-colors duration-300 hover:bg-[#12151B] lg:p-10"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600">{o.code}</span>
                  <h3 className="mt-10 font-heading text-2xl text-slate-100">{o.title}</h3>
                  <p className="mt-4 leading-relaxed text-slate-400">{o.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* TRANSACTIONS */}
        <section id="transactions" className={`${container} scroll-mt-20 py-24`}>
          <SectionHeading index="04" eyebrow="Record" title="Selected Transactions" testId="transactions-title" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {transactions.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.1}>
                <article
                  data-testid={`transaction-card-${i}`}
                  className="relative flex h-full flex-col border border-[#1F242D] bg-[#12151B]/70 p-8 transition-colors duration-300 hover:border-[#374151] lg:p-10"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600">{t.ref}</span>
                    <span
                      data-testid={`transaction-nda-badge-${i}`}
                      className="inline-flex items-center gap-2 border border-[#374151] bg-[#1A1F27] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#94A3B8]"
                    >
                      <span className="size-1.5 rounded-full bg-[#94A3B8]" /> Confidential / NDA
                    </span>
                  </div>
                  <h3 className="mt-10 font-heading text-3xl text-slate-100">{t.title}</h3>
                  <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-500">{t.entity}</p>
                  <p className="mt-6 flex-1 leading-relaxed text-slate-400">{t.body}</p>
                  <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-[#1F242D] pt-6">
                    {t.meta.map(([k, v]) => (
                      <div key={k}>
                        <dt className="font-mono text-[9px] uppercase tracking-[0.22em] text-slate-600">{k}</dt>
                        <dd className="mt-1 text-sm text-slate-300">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className={`${container} scroll-mt-20 py-24`}>
          <SectionHeading index="05" eyebrow="Channel" title="Secure Communications" testId="contact-title" />
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <p className="text-lg font-light leading-relaxed text-slate-300">
                For acquisition proposals, capital partnerships, or negotiations, submit your inquiry through this
                official channel. Direct contact details are not published.
              </p>
              <p data-testid="contact-review-note" className="mt-8 border-l border-[#374151] pl-5 text-sm leading-relaxed text-slate-500">
                All inquiries are reviewed within 24 hours via the internal inbox. Only qualified proposals will
                receive a response.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-8">
              <SecureContactForm />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

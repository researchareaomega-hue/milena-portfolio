import type { ReactNode } from "react";
import { motion } from "motion/react";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  testId,
}: {
  index: string;
  eyebrow: string;
  title: string;
  testId: string;
}) {
  return (
    <Reveal className="mb-14 grid grid-cols-1 gap-6 border-t border-[#1F242D] pt-8 md:grid-cols-12">
      <div className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500 md:col-span-3">
        <span className="text-slate-300">{index}</span>
        <span className="mx-3 text-slate-700">/</span>
        {eyebrow}
      </div>
      <h2
        data-testid={testId}
        className="font-heading text-3xl font-normal tracking-tight text-slate-100 sm:text-4xl md:col-span-9"
      >
        {title}
      </h2>
    </Reveal>
  );
}

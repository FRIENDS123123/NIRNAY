import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Divided vertical list — the standard record container inside a section. */
export function RecordList({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col divide-y divide-ink-100", className)}>{children}</div>;
}

interface RecordItemProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Right-aligned status, value or badge. */
  meta?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function RecordItem({ title, subtitle, meta, children, className }: RecordItemProps) {
  return (
    <div className={cn("py-3 first:pt-0 last:pb-0", className)}>
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-ink-900">{title}</div>
          {subtitle && <div className="mt-0.5 text-xs leading-relaxed text-ink-500">{subtitle}</div>}
        </div>
        {meta && <div className="flex shrink-0 items-center gap-2">{meta}</div>}
      </div>
      {children && <div className="mt-2.5">{children}</div>}
    </div>
  );
}

/** Small uppercase label that groups records inside a section. */
export function SubHeading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-400",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** Shown when a whole sub-group has no records. */
export function NoRecords({ children }: { children: ReactNode }) {
  return <p className="text-sm italic text-ink-400">{children}</p>;
}

/** Compact 0–1 confidence bar with its numeric value. */
export function ConfidenceBar({
  value,
  label,
  className,
}: {
  value: number;
  label?: string;
  className?: string;
}) {
  const pct = Math.round(value * 100);
  const tone = pct >= 85 ? "bg-success-500" : pct >= 60 ? "bg-warning-500" : "bg-danger-500";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && <span className="text-xs text-ink-500">{label}</span>}
      <div
        className="h-1.5 w-20 overflow-hidden rounded-full bg-ink-200"
        role="img"
        aria-label={`${label ?? "Confidence"}: ${pct}%`}
      >
        <div className={cn("h-full rounded-full", tone)} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-right font-mono text-xs font-semibold text-ink-900">{pct}%</span>
    </div>
  );
}

/** Miniature event trail used for ownership and residence histories. */
export function MiniTimeline({
  events,
}: {
  events: { date: string; title: string; detail?: string }[];
}) {
  return (
    <ol className="flex flex-col gap-2 border-l border-ink-200 pl-3.5">
      {events.map((event, i) => (
        <li key={i} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[19px] top-1.5 h-1.5 w-1.5 rounded-full bg-primary-400 ring-2 ring-surface"
          />
          <p className="text-xs font-medium text-ink-900">
            {event.title}
            <span className="ml-1.5 font-mono font-normal text-ink-400">{event.date}</span>
          </p>
          {event.detail && <p className="text-xs text-ink-500">{event.detail}</p>}
        </li>
      ))}
    </ol>
  );
}

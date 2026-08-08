import type { LucideIcon } from "lucide-react";
import { Activity, CheckCircle2, FolderOpen, Layers, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { CaseStats } from "@/lib/investigations/use-investigations";
import { cn } from "@/lib/cn";

type Tone = "default" | "primary" | "success" | "danger";

const toneClasses: Record<Tone, { icon: string; value: string }> = {
  default: { icon: "bg-ink-100 text-ink-500", value: "text-ink-900" },
  primary: { icon: "bg-primary-50 text-primary-600", value: "text-primary-700" },
  success: { icon: "bg-success-50 text-success-700", value: "text-success-700" },
  danger: { icon: "bg-danger-50 text-danger-700", value: "text-danger-700" },
};

function MetricTile({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: Tone;
}) {
  const classes = toneClasses[tone];

  return (
    <Card className="p-4 transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]">
      <div className="flex items-center gap-2">
        <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg", classes.icon)}>
          <Icon size={14} strokeWidth={2.25} aria-hidden="true" />
        </span>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-400">
          {label}
        </p>
      </div>
      <p className={cn("mt-2 text-2xl font-bold leading-none", classes.value)}>{value}</p>
      {hint && <p className="mt-1 text-[11px] text-ink-400">{hint}</p>}
    </Card>
  );
}

/** Officer dashboard figures — derived from stored cases, never from a chart library. */
export function CaseStatsPanel({ stats }: { stats: CaseStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <MetricTile icon={Layers} label="Total" value={String(stats.total)} hint="Investigations" />
      <MetricTile
        icon={FolderOpen}
        label="Open"
        value={String(stats.open)}
        hint="Actively worked"
        tone="primary"
      />
      <MetricTile
        icon={CheckCircle2}
        label="Closed"
        value={String(stats.closed)}
        hint="Closed or archived"
        tone="success"
      />
      <MetricTile
        icon={ShieldAlert}
        label="High risk"
        value={String(stats.highRisk)}
        hint="Cases flagged high"
        tone={stats.highRisk > 0 ? "danger" : "default"}
      />
      <MetricTile
        icon={Activity}
        label="Average risk"
        value={stats.total === 0 ? "—" : `${stats.averageRisk}/100`}
        hint="Across all cases"
      />
    </div>
  );
}

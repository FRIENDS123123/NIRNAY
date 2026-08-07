import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  /** Emphasis for the value — used to colour the risk score by severity. */
  tone?: "default" | "positive" | "caution" | "critical";
  className?: string;
}

const toneClasses: Record<NonNullable<StatTileProps["tone"]>, string> = {
  default: "text-white",
  positive: "text-success-300",
  caution: "text-warning-100",
  critical: "text-danger-100",
};

/**
 * One metric inside the AI summary header strip. Deliberately not a chart —
 * these are single authored figures, not aggregations computed at runtime.
 */
export function StatTile({ icon: Icon, label, value, hint, tone = "default", className }: StatTileProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-white/[0.07] p-3.5 ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/[0.12]",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 text-white/60">
        <Icon size={13} strokeWidth={2.25} />
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em]">{label}</p>
      </div>
      <p className={cn("mt-1.5 text-xl font-bold leading-none", toneClasses[tone])}>{value}</p>
      {hint && <p className="mt-1 text-[11px] leading-tight text-white/50">{hint}</p>}
    </div>
  );
}

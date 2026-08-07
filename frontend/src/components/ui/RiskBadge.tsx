import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import type { RiskLevel } from "@/mock-data/types";
import { cn } from "@/lib/cn";

const config: Record<RiskLevel, { classes: string; icon: typeof ShieldCheck }> = {
  Low: { classes: "bg-success-50 text-success-700 ring-1 ring-inset ring-success-200", icon: ShieldCheck },
  Medium: { classes: "bg-warning-50 text-warning-700 ring-1 ring-inset ring-warning-100", icon: AlertTriangle },
  High: { classes: "bg-danger-50 text-danger-700 ring-1 ring-inset ring-danger-100", icon: ShieldAlert },
};

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  const { classes, icon: Icon } = config[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold",
        classes,
        className,
      )}
    >
      <Icon size={15} strokeWidth={2.25} />
      {level} risk
    </span>
  );
}

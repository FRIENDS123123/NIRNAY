import { AlertTriangle, BadgeCheck, Clock, HelpCircle } from "lucide-react";
import type { VerificationStatus } from "@/mock-data/types";
import { cn } from "@/lib/cn";

const config: Record<
  VerificationStatus,
  { classes: string; icon: typeof BadgeCheck }
> = {
  Verified: {
    classes: "bg-success-50 text-success-700 ring-success-200",
    icon: BadgeCheck,
  },
  "Pending Verification": {
    classes: "bg-warning-50 text-warning-700 ring-warning-100",
    icon: Clock,
  },
  Unverified: {
    classes: "bg-ink-100 text-ink-500 ring-ink-200",
    icon: HelpCircle,
  },
  Disputed: {
    classes: "bg-danger-50 text-danger-700 ring-danger-100",
    icon: AlertTriangle,
  },
};

interface VerificationChipProps {
  status: VerificationStatus;
  /** Optional 0–1 confidence rendered alongside the status. */
  confidence?: number;
  className?: string;
}

/** Government verification chip — the same status always reads the same way. */
export function VerificationChip({ status, confidence, className }: VerificationChipProps) {
  const { classes, icon: Icon } = config[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
        classes,
        className,
      )}
    >
      <Icon size={12} strokeWidth={2.5} />
      {status}
      {typeof confidence === "number" && (
        <span className="font-mono font-medium opacity-70">{Math.round(confidence * 100)}%</span>
      )}
    </span>
  );
}

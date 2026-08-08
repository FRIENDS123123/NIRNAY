import { CircleDot, FileEdit, ShieldCheck, XCircle } from "lucide-react";
import type { ReviewStatus } from "@/lib/legal-records/types";
import { cn } from "@/lib/cn";

/** Green / amber / blue / red, fixed per status so it reads the same everywhere. */
const config: Record<ReviewStatus, { classes: string; icon: typeof ShieldCheck }> = {
  Verified: { classes: "bg-success-50 text-success-700 ring-success-200", icon: ShieldCheck },
  "Needs Review": { classes: "bg-warning-50 text-warning-700 ring-warning-100", icon: CircleDot },
  Draft: { classes: "bg-primary-50 text-primary-700 ring-primary-200", icon: FileEdit },
  Rejected: { classes: "bg-danger-50 text-danger-700 ring-danger-100", icon: XCircle },
};

export function ReviewStatusBadge({
  status,
  className,
}: {
  status: ReviewStatus;
  className?: string;
}) {
  const { classes, icon: Icon } = config[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
        classes,
        className,
      )}
    >
      <Icon size={12} strokeWidth={2.5} aria-hidden="true" />
      {status}
    </span>
  );
}

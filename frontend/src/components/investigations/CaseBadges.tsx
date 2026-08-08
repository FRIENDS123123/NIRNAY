import { Badge } from "@/components/ui/Badge";
import type { CasePriority, CaseStatus } from "@/lib/investigations/types";

type BadgeVariant = "neutral" | "primary" | "accent" | "success" | "warning" | "danger";

const statusVariant: Record<CaseStatus, BadgeVariant> = {
  Open: "primary",
  "Under Review": "accent",
  "Need More Evidence": "warning",
  Escalated: "danger",
  Closed: "success",
  Archived: "neutral",
};

const priorityVariant: Record<CasePriority, BadgeVariant> = {
  Critical: "danger",
  High: "warning",
  Medium: "accent",
  Low: "neutral",
};

export function CaseStatusBadge({ status, className }: { status: CaseStatus; className?: string }) {
  return (
    <Badge variant={statusVariant[status]} className={className}>
      {status}
    </Badge>
  );
}

export function PriorityBadge({
  priority,
  className,
}: {
  priority: CasePriority;
  className?: string;
}) {
  return (
    <Badge variant={priorityVariant[priority]} className={className}>
      {priority} priority
    </Badge>
  );
}

import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { CASE_STATUSES, type CaseStatus } from "@/lib/investigations/types";
import { setCaseStatus } from "@/lib/investigations/store";
import { cn } from "@/lib/cn";

/**
 * Case status control. A native select so it is keyboard and screen-reader
 * accessible by default; writing through the store means the change lands on
 * the workspace list and officer dashboard at the same time.
 */
export function StatusSelect({
  investigationId,
  status,
  className,
}: {
  investigationId: string;
  status: CaseStatus;
  className?: string;
}) {
  const id = useId();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label htmlFor={id} className="sr-only">
        Case status
      </label>
      <div className="relative">
        <select
          id={id}
          value={status}
          onChange={(event) => setCaseStatus(investigationId, event.target.value as CaseStatus)}
          className="appearance-none rounded-xl border border-ink-200 bg-surface py-2 pl-3.5 pr-9 text-sm font-medium text-ink-900 transition-colors hover:border-ink-300 focus-visible:border-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        >
          {CASE_STATUSES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          size={15}
          strokeWidth={2.25}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400"
        />
      </div>
    </div>
  );
}

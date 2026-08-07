import { departmentCode } from "@/mock-data/departments";
import { cn } from "@/lib/cn";

/**
 * Compact department marker. Shows the short code with the full name on hover
 * so a dense card can list ten departments without becoming a wall of text.
 */
export function DepartmentChip({ name, className }: { name: string; className?: string }) {
  return (
    <span
      title={name}
      className={cn(
        "inline-flex items-center rounded-md border border-ink-200 bg-canvas px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-ink-500",
        className,
      )}
    >
      {departmentCode(name)}
    </span>
  );
}

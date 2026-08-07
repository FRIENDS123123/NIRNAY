import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CopyButton } from "./CopyButton";

interface DataRowProps {
  label: string;
  value: ReactNode;
  /** Render the value in the mono face — for identifiers and reference numbers. */
  mono?: boolean;
  /** When set, a copy-to-clipboard button appears beside the value. */
  copyValue?: string;
  className?: string;
}

export function DataRow({ label, value, mono, copyValue, className }: DataRowProps) {
  return (
    <div
      className={cn(
        "group flex items-start justify-between gap-4 border-b border-ink-100/70 py-2 text-sm last:border-b-0",
        className,
      )}
    >
      <span className="shrink-0 text-ink-500">{label}</span>
      <span className="flex min-w-0 items-center justify-end gap-1.5">
        <span className={cn("truncate text-right font-medium text-ink-900", mono && "font-mono text-[13px]")}>
          {value}
        </span>
        {copyValue && (
          <CopyButton
            value={copyValue}
            label={label}
            className="opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
          />
        )}
      </span>
    </div>
  );
}

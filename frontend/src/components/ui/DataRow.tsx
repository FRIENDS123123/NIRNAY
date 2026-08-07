import type { ReactNode } from "react";

export function DataRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
      <span className="text-ink-500">{label}</span>
      <span className="text-right font-medium text-ink-900">{value}</span>
    </div>
  );
}

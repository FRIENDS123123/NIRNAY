import { useState } from "react";
import { FileCode2, FileSpreadsheet, Printer } from "lucide-react";
import type { ExportFormat, SavedReport } from "@/lib/reports/types";
import { exportReportAs } from "@/lib/reports/export";
import { recordExport } from "@/lib/reports/store";
import { cn } from "@/lib/cn";

const config: { format: ExportFormat; label: string; icon: typeof Printer; hint: string }[] = [
  { format: "PDF", label: "Export PDF", icon: Printer, hint: "Opens the print dialog — choose “Save as PDF”" },
  { format: "HTML", label: "Export HTML", icon: FileCode2, hint: "Downloads a standalone .html file" },
  { format: "CSV", label: "Export CSV", icon: FileSpreadsheet, hint: "Downloads a .csv of every section" },
];

export function ExportButtons({
  report,
  size = "md",
  className,
}: {
  report: SavedReport;
  size?: "sm" | "md";
  className?: string;
}) {
  const [busy, setBusy] = useState<ExportFormat | null>(null);

  function handleExport(format: ExportFormat) {
    setBusy(format);
    const ok = exportReportAs(report, format);
    if (ok) recordExport(report.id, format);
    setTimeout(() => setBusy(null), 700);
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {config.map(({ format, label, icon: Icon, hint }) => (
        <button
          key={format}
          type="button"
          title={hint}
          onClick={() => handleExport(format)}
          data-export-format={format}
          className={cn(
            "inline-flex items-center justify-center gap-1.5 rounded-xl border border-ink-200 bg-surface font-semibold text-ink-700 transition-colors hover:border-primary-300 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
            size === "sm" ? "px-2.5 py-1.5 text-[11px]" : "px-3.5 py-2 text-xs",
            busy === format && "border-primary-300 text-primary-700",
          )}
        >
          <Icon size={size === "sm" ? 12 : 14} strokeWidth={2.25} aria-hidden="true" />
          {busy === format ? "Exporting…" : label}
        </button>
      ))}
    </div>
  );
}

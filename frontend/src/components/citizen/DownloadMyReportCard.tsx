import { useState } from "react";
import { FileCode2, Loader2, Printer, ShieldCheck } from "lucide-react";
import type { Citizen } from "@/mock-data/types";
import { Card } from "@/components/ui/Card";
import { useGenerateReport } from "@/lib/reports/use-generate-report";
import { exportReportAs, reportFilename } from "@/lib/reports/export";
import { recordExport } from "@/lib/reports/store";
import type { ExportFormat } from "@/lib/reports/types";
import { toast } from "@/lib/toast";

/**
 * The citizen's own copy. Reuses the existing report pipeline with the
 * "Citizen" audience, which strips risk scoring, AI analysis, evidence and
 * reviewer commentary before the document is rendered.
 */
export function DownloadMyReportCard({ citizen }: { citizen: Citizen }) {
  const generate = useGenerateReport();
  const [busy, setBusy] = useState<ExportFormat | null>(null);

  function download(format: Extract<ExportFormat, "PDF" | "HTML">) {
    setBusy(format);
    const report = generate(citizen, null, "Citizen");
    const ok = exportReportAs(report, format);

    if (ok) {
      recordExport(report.id, format);
      toast({
        title: format === "PDF" ? "Opening print dialog" : "Your record statement downloaded",
        description:
          format === "PDF"
            ? `Choose “Save as PDF” to store ${report.id}.`
            : `${reportFilename(report, "html")} saved to your downloads.`,
        tone: format === "PDF" ? "info" : "success",
      });
    } else {
      toast({
        title: "Download could not start",
        description: "Your browser blocked the download. Try the other format.",
        tone: "danger",
      });
    }
    setTimeout(() => setBusy(null), 700);
  }

  return (
    <Card className="border-primary-100 bg-primary-50/40 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 basis-64 items-start gap-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white">
            <ShieldCheck size={19} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="font-semibold text-ink-900">Download My Citizen Report</h2>
            <p className="mt-0.5 text-sm leading-relaxed text-ink-600">
              A personal statement of the government records held against your Citizen ID and
              their verification status. It contains no internal assessment or case information.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => download("PDF")}
            disabled={busy !== null}
            data-citizen-export="PDF"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(41,38,120,0.16)] transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
          >
            {busy === "PDF" ? (
              <Loader2 size={15} strokeWidth={2.5} className="animate-spin" aria-hidden="true" />
            ) : (
              <Printer size={15} strokeWidth={2.5} aria-hidden="true" />
            )}
            Download PDF
          </button>

          <button
            type="button"
            onClick={() => download("HTML")}
            disabled={busy !== null}
            data-citizen-export="HTML"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-ink-200 bg-surface px-4 text-sm font-semibold text-ink-700 transition-colors hover:border-primary-300 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            {busy === "HTML" ? (
              <Loader2 size={15} strokeWidth={2.5} className="animate-spin" aria-hidden="true" />
            ) : (
              <FileCode2 size={15} strokeWidth={2.5} aria-hidden="true" />
            )}
            Download HTML
          </button>
        </div>
      </div>
    </Card>
  );
}

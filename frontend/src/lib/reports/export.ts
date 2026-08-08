// Local export. No backend and no PDF library: HTML and CSV download as files
// via a Blob URL, and PDF is produced through the browser's own print-to-PDF
// on a print-styled copy of the report — the standard offline path.

import { renderReportCsv } from "./render-csv";
import { renderReportHtml } from "./render-html";
import type { ExportFormat, SavedReport } from "./types";

function triggerDownload(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  // Revoke on the next tick so the download has picked the blob up.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/**
 * Renders the report into a detached iframe and invokes the browser's print
 * dialog, where the operator chooses "Save as PDF". Returns false if the
 * iframe could not be prepared.
 */
function printToPdf(html: string): boolean {
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.position = "fixed";
  frame.style.right = "0";
  frame.style.bottom = "0";
  frame.style.width = "0";
  frame.style.height = "0";
  frame.style.border = "0";
  document.body.appendChild(frame);

  const doc = frame.contentDocument;
  if (!doc) {
    document.body.removeChild(frame);
    return false;
  }

  doc.open();
  doc.write(html);
  doc.close();

  const run = () => {
    try {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
    } finally {
      setTimeout(() => {
        if (frame.parentNode) document.body.removeChild(frame);
      }, 1000);
    }
  };

  if (doc.readyState === "complete") setTimeout(run, 60);
  else frame.onload = run;

  return true;
}

export function reportFilename(report: SavedReport, extension: string): string {
  const safeName = report.citizenName.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  return `${report.id}-${safeName}.${extension}`;
}

/** Performs the export. Returns false only if the browser refused the action. */
export function exportReportAs(report: SavedReport, format: ExportFormat): boolean {
  switch (format) {
    case "HTML":
      triggerDownload(
        reportFilename(report, "html"),
        renderReportHtml(report.document),
        "text/html;charset=utf-8",
      );
      return true;
    case "CSV":
      triggerDownload(
        reportFilename(report, "csv"),
        renderReportCsv(report.document),
        "text/csv;charset=utf-8",
      );
      return true;
    case "PDF":
      return printToPdf(renderReportHtml(report.document));
  }
}

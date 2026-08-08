import { useSyncExternalStore } from "react";
import { createLocalStore } from "@/lib/local-store";
import type { ExportFormat, ReportAudience, ReportDocument, SavedReport } from "./types";

const isReportList = (value: unknown): value is SavedReport[] =>
  Array.isArray(value) &&
  value.every(
    (r) =>
      typeof r === "object" && r !== null && typeof (r as SavedReport).id === "string",
  );

export const reportStore = createLocalStore<SavedReport[]>("nirnay.reports", [], isReportList);

export function useReports(): SavedReport[] {
  return useSyncExternalStore(
    reportStore.subscribe,
    reportStore.getSnapshot,
    reportStore.getServerSnapshot,
  );
}

export function useReport(id: string | undefined): SavedReport | undefined {
  const reports = useReports();
  return id ? reports.find((r) => r.id === id) : undefined;
}

/** Next report ID in NIR-RPT-<year>-<seq> form. */
export function nextReportId(): string {
  const year = new Date().getFullYear();
  const prefix = `NIR-RPT-${year}-`;
  const highest = reportStore
    .get()
    .filter((r) => r.id.startsWith(prefix))
    .map((r) => Number.parseInt(r.id.slice(prefix.length), 10))
    .filter((n) => Number.isFinite(n))
    .reduce((max, n) => Math.max(max, n), 0);
  return `${prefix}${String(highest + 1).padStart(4, "0")}`;
}

export interface SaveReportInput {
  id: string;
  document: ReportDocument;
  audience: ReportAudience;
  citizenId: string;
  citizenName: string;
  investigationId: string | null;
  caseStatus: string | null;
  riskLevel: SavedReport["riskLevel"];
  riskScore: number;
  officer: string;
}

export function saveReport(input: SaveReportInput): SavedReport {
  const report: SavedReport = {
    ...input,
    title: input.document.meta.title,
    generatedAt: input.document.meta.generatedAt,
    exports: [],
  };
  reportStore.update((reports) => [report, ...reports]);
  return report;
}

export function recordExport(reportId: string, format: ExportFormat) {
  reportStore.update((reports) =>
    reports.map((report) =>
      report.id === reportId
        ? {
            ...report,
            exports: [
              {
                id: `EXP-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
                format,
                at: new Date().toISOString(),
              },
              ...report.exports,
            ],
          }
        : report,
    ),
  );
}

export function deleteReport(reportId: string) {
  reportStore.update((reports) => reports.filter((r) => r.id !== reportId));
}

export function clearReports() {
  reportStore.reset();
}

export interface ExportHistoryEntry {
  reportId: string;
  reportTitle: string;
  citizenName: string;
  format: ExportFormat;
  at: string;
  id: string;
}

/** Flat export log across every saved report, newest first. */
export function useExportHistory(): ExportHistoryEntry[] {
  const reports = useReports();
  return reports
    .flatMap((report) =>
      report.exports.map((event) => ({
        id: event.id,
        reportId: report.id,
        reportTitle: report.title,
        citizenName: report.citizenName,
        format: event.format,
        at: event.at,
      })),
    )
    .sort((a, b) => b.at.localeCompare(a.at));
}

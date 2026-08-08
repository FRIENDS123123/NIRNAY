// Report model. A report is a point-in-time snapshot: the document is
// assembled when the officer generates it and stored as-is, so re-downloading
// months later reproduces exactly what was reported — it does not silently
// re-read whatever the underlying records say today.

import type { RiskLevel } from "@/mock-data/types";
import type { ReviewStatus } from "@/lib/legal-records/types";

export type ExportFormat = "PDF" | "HTML" | "CSV";

export const EXPORT_FORMATS: ExportFormat[] = ["PDF", "HTML", "CSV"];

export interface ExportEvent {
  id: string;
  format: ExportFormat;
  at: string;
}

export interface ReportFieldRow {
  label: string;
  value: string;
}

export interface ReportEvidenceRow {
  id: string;
  label: string;
  department: string;
  reference: string;
  confidence: string;
  verification: string;
  linkedRecord: string;
}

export interface ReportVerificationRow {
  title: string;
  category: string;
  department: string;
  reference: string;
  status: ReviewStatus;
  reviewerNotes: string;
  reviewedBy: string;
  reviewedAt: string;
}

export interface ReportNarrative {
  title: string;
  body: string;
  evidence: string[];
}

/** Everything a rendered report contains, in render order. */
export interface ReportDocument {
  meta: {
    reportId: string;
    title: string;
    generatedAt: string;
    officer: string;
    department: string;
    role: string;
  };
  citizen: {
    citizenId: string;
    name: string;
    identity: ReportFieldRow[];
    address: string;
  };
  investigation: {
    id: string;
    status: string;
    priority: string;
    officer: string;
    createdAt: string;
    updatedAt: string;
    reason: string;
  } | null;
  risk: {
    level: RiskLevel;
    score: number;
    citizenStatus: string;
    aiConfidence: string;
    rationale: ReportNarrative[];
  };
  aiSummary: {
    executive: string;
    domains: ReportNarrative[];
  };
  recommendations: ReportNarrative[];
  evidence: ReportEvidenceRow[];
  verification: ReportVerificationRow[];
  passport: ReportFieldRow[];
  travel: {
    stats: ReportFieldRow[];
    trips: ReportFieldRow[];
    observation: string;
  };
  properties: ReportFieldRow[];
  employment: ReportFieldRow[];
  benefits: ReportFieldRow[];
  timeline: ReportFieldRow[];
  caseNotes: ReportFieldRow[];
  caseTasks: ReportFieldRow[];
}

/** Saved report metadata plus its frozen document. */
export interface SavedReport {
  id: string;
  title: string;
  citizenId: string;
  citizenName: string;
  investigationId: string | null;
  caseStatus: string | null;
  riskLevel: RiskLevel;
  riskScore: number;
  officer: string;
  generatedAt: string;
  exports: ExportEvent[];
  document: ReportDocument;
}

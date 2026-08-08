// Flattens a report document into a three-column CSV (Section, Field, Value)
// so every section survives the export rather than only the tabular ones.

import { formatDateTime } from "@/lib/format";
import type { ReportDocument, ReportFieldRow } from "./types";

function cell(value: string): string {
  const needsQuoting = /[",\n\r]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuoting ? `"${escaped}"` : escaped;
}

function line(section: string, field: string, value: string): string {
  return [cell(section), cell(field), cell(value)].join(",");
}

function fromRows(section: string, rows: ReportFieldRow[]): string[] {
  if (rows.length === 0) return [line(section, "—", "No records held")];
  return rows.map((r) => line(section, r.label, r.value));
}

export function renderReportCsv(doc: ReportDocument): string {
  const { meta, citizen, investigation, risk, aiSummary } = doc;
  const lines: string[] = ["Section,Field,Value"];

  lines.push(
    line("Report", "Report ID", meta.reportId),
    line("Report", "Title", meta.title),
    line("Report", "Generated at", formatDateTime(meta.generatedAt)),
    line("Report", "Officer", meta.officer),
    line("Report", "Department", meta.department),
    line("Report", "Active role", meta.role),
    line("Report", "Data classification", "Synthetic demonstration data"),
  );

  lines.push(...fromRows("Citizen Identity", citizen.identity));
  lines.push(line("Citizen Identity", "Registered address", citizen.address));

  if (investigation) {
    lines.push(
      line("Investigation", "Investigation ID", investigation.id),
      line("Investigation", "Case status", investigation.status),
      line("Investigation", "Priority", investigation.priority),
      line("Investigation", "Assigned officer", investigation.officer),
      line("Investigation", "Opened", investigation.createdAt),
      line("Investigation", "Last updated", investigation.updatedAt),
      line("Investigation", "Reason", investigation.reason),
    );
  } else {
    lines.push(line("Investigation", "Linked case", "None"));
  }

  lines.push(
    line("Risk", "Risk level", risk.level),
    line("Risk", "Risk score", `${risk.score}/100`),
    line("Risk", "Citizen status", risk.citizenStatus),
    line("Risk", "AI confidence", risk.aiConfidence),
  );
  risk.rationale.forEach((item, i) =>
    lines.push(line("Risk", `Rationale ${i + 1}`, `${item.body} [evidence: ${item.evidence.join(" ")}]`)),
  );

  lines.push(line("AI Summary", "Executive summary", aiSummary.executive));
  aiSummary.domains.forEach((domain) =>
    lines.push(line("AI Summary", domain.title, `${domain.body} [evidence: ${domain.evidence.join(" ")}]`)),
  );

  doc.recommendations.forEach((rec) =>
    lines.push(line("Recommendations", rec.title, `${rec.body} [evidence: ${rec.evidence.join(" ")}]`)),
  );

  doc.evidence.forEach((item) =>
    lines.push(
      line(
        "Evidence",
        item.id,
        `${item.label} | dept: ${item.department} | ref: ${item.reference} | confidence: ${item.confidence} | ${item.verification} | linked: ${item.linkedRecord}`,
      ),
    ),
  );

  doc.verification.forEach((item) =>
    lines.push(
      line(
        "Verification",
        item.title,
        `status: ${item.status} | category: ${item.category} | dept: ${item.department} | ref: ${item.reference} | reviewed by: ${item.reviewedBy} | at: ${item.reviewedAt} | notes: ${item.reviewerNotes}`,
      ),
    ),
  );

  lines.push(...fromRows("Passport", doc.passport));
  lines.push(...fromRows("Travel", doc.travel.stats));
  lines.push(line("Travel", "AI observation", doc.travel.observation));
  lines.push(...fromRows("Travel Trips", doc.travel.trips));
  lines.push(...fromRows("Properties", doc.properties));
  lines.push(...fromRows("Employment", doc.employment));
  lines.push(...fromRows("Benefits", doc.benefits));
  lines.push(...fromRows("Timeline", doc.timeline));

  if (investigation) {
    lines.push(...fromRows("Investigation Notes", doc.caseNotes));
    lines.push(...fromRows("Investigation Tasks", doc.caseTasks));
  }

  return lines.join("\r\n");
}

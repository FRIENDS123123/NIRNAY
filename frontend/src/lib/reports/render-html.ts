// Renders a report document into a standalone, printable HTML file.
// Self-contained: all styling is inline, so the downloaded file opens and
// prints correctly with no network access and no NIRNAY runtime.

import { formatDateTime } from "@/lib/format";
import type { ReportDocument, ReportFieldRow, ReportNarrative } from "./types";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fieldTable(rows: ReportFieldRow[]): string {
  if (rows.length === 0) return `<p class="empty">No records held.</p>`;
  return `<table class="fields">${rows
    .map(
      (r) =>
        `<tr><th>${escapeHtml(r.label)}</th><td>${escapeHtml(r.value)}</td></tr>`,
    )
    .join("")}</table>`;
}

function narrativeList(items: ReportNarrative[]): string {
  if (items.length === 0) return `<p class="empty">None recorded.</p>`;
  return `<ul class="narrative">${items
    .map(
      (item) => `<li>
        <p class="n-title">${escapeHtml(item.title)}</p>
        <p class="n-body">${escapeHtml(item.body)}</p>
        ${
          item.evidence.length
            ? `<p class="n-ev"><span>Evidence</span> ${item.evidence.map((e) => `<code>${escapeHtml(e)}</code>`).join(" ")}</p>`
            : ""
        }
      </li>`,
    )
    .join("")}</ul>`;
}

function section(title: string, body: string): string {
  return `<section class="block"><h2>${escapeHtml(title)}</h2>${body}</section>`;
}

const STATUS_CLASS: Record<string, string> = {
  Verified: "ok",
  "Needs Review": "warn",
  Draft: "info",
  Rejected: "bad",
};

export function renderReportHtml(doc: ReportDocument): string {
  const { meta, citizen, investigation, risk, aiSummary } = doc;

  const evidenceTable = doc.evidence.length
    ? `<table class="grid">
        <thead><tr><th>ID</th><th>Source record</th><th>Department</th><th>Reference</th><th>Confidence</th><th>Verification</th></tr></thead>
        <tbody>${doc.evidence
          .map(
            (e) =>
              `<tr><td><code>${escapeHtml(e.id)}</code></td><td>${escapeHtml(e.label)}</td><td>${escapeHtml(e.department)}</td><td><code>${escapeHtml(e.reference)}</code></td><td>${escapeHtml(e.confidence)}</td><td>${escapeHtml(e.verification)}</td></tr>`,
          )
          .join("")}</tbody>
       </table>`
    : `<p class="empty">No evidence records.</p>`;

  const verificationTable = doc.verification.length
    ? `<table class="grid">
        <thead><tr><th>Record</th><th>Category</th><th>Department</th><th>Status</th><th>Reviewed by</th><th>Reviewer notes</th></tr></thead>
        <tbody>${doc.verification
          .map(
            (v) =>
              `<tr><td>${escapeHtml(v.title)}</td><td>${escapeHtml(v.category)}</td><td>${escapeHtml(v.department)}</td><td><span class="pill ${STATUS_CLASS[v.status] ?? "info"}">${escapeHtml(v.status)}</span></td><td>${escapeHtml(v.reviewedBy)}<br><span class="muted">${escapeHtml(v.reviewedAt)}</span></td><td>${escapeHtml(v.reviewerNotes)}</td></tr>`,
          )
          .join("")}</tbody>
       </table>`
    : `<p class="empty">No legal records.</p>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(meta.reportId)} — NIRNAY Intelligence Report</title>
<style>
  :root {
    --indigo: #3730b8; --indigo-dark: #17153f; --teal: #178683;
    --ink-900: #14162b; --ink-700: #33354f; --ink-500: #64667e; --ink-400: #8688a0;
    --ink-200: #e2e3ec; --ink-100: #edeef5; --canvas: #f7f7fb;
    --ok: #047857; --ok-bg: #ecfdf5; --warn: #b45309; --warn-bg: #fffbeb;
    --bad: #9f1239; --bad-bg: #fef2f2; --info: #2f2a94; --info-bg: #eef1fd;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--canvas); color: var(--ink-900);
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 13px; line-height: 1.55; -webkit-font-smoothing: antialiased;
  }
  .page { max-width: 900px; margin: 0 auto; padding: 32px 28px 56px; }
  header.brand {
    display: flex; justify-content: space-between; align-items: flex-start; gap: 24px;
    background: linear-gradient(135deg, var(--indigo-dark), var(--indigo) 55%, var(--teal));
    color: #fff; border-radius: 16px; padding: 22px 24px;
  }
  .wordmark { display: flex; align-items: center; gap: 10px; }
  .mark {
    width: 30px; height: 30px; border-radius: 9px; background: rgba(255,255,255,.16);
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 14px; letter-spacing: -.5px;
  }
  .wordmark h1 { margin: 0; font-size: 19px; font-weight: 800; letter-spacing: -.4px; }
  .wordmark p { margin: 2px 0 0; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; opacity: .72; }
  .meta { text-align: right; font-size: 11px; opacity: .9; }
  .meta strong { display: block; font-size: 13px; font-family: ui-monospace, Menlo, Consolas, monospace; }
  .synthetic {
    margin: 14px 0 0; padding: 9px 12px; border-radius: 10px;
    background: var(--warn-bg); border: 1px solid #fde68a; color: var(--warn);
    font-size: 11px; font-weight: 600;
  }
  .summary-strip { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
  .stat { flex: 1 1 128px; background: #fff; border: 1px solid var(--ink-100); border-radius: 12px; padding: 11px 13px; }
  .stat span { display: block; font-size: 9px; letter-spacing: 1.4px; text-transform: uppercase; color: var(--ink-400); font-weight: 700; }
  .stat strong { display: block; margin-top: 4px; font-size: 17px; }
  .block { background: #fff; border: 1px solid var(--ink-100); border-radius: 14px; padding: 18px 20px; margin-top: 16px; }
  .block h2 { margin: 0 0 12px; font-size: 14px; font-weight: 800; color: var(--indigo); }
  .lede { margin: 0; font-size: 13.5px; color: var(--ink-700); }
  table { width: 100%; border-collapse: collapse; }
  table.fields th { width: 34%; text-align: left; font-weight: 500; color: var(--ink-500); padding: 5px 0; vertical-align: top; font-size: 12px; }
  table.fields td { padding: 5px 0; font-weight: 600; color: var(--ink-900); font-size: 12px; }
  table.fields tr + tr th, table.fields tr + tr td { border-top: 1px solid var(--ink-100); }
  table.grid { font-size: 11px; }
  table.grid th { text-align: left; background: var(--canvas); color: var(--ink-500); font-size: 10px;
    text-transform: uppercase; letter-spacing: .6px; padding: 7px 8px; border-bottom: 1px solid var(--ink-200); }
  table.grid td { padding: 7px 8px; border-bottom: 1px solid var(--ink-100); vertical-align: top; }
  code { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 10.5px; color: var(--ink-700); }
  .pill { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: 700; }
  .pill.ok { background: var(--ok-bg); color: var(--ok); }
  .pill.warn { background: var(--warn-bg); color: var(--warn); }
  .pill.bad { background: var(--bad-bg); color: var(--bad); }
  .pill.info { background: var(--info-bg); color: var(--info); }
  ul.narrative { list-style: none; margin: 0; padding: 0; }
  ul.narrative li { padding: 9px 0; border-bottom: 1px solid var(--ink-100); }
  ul.narrative li:last-child { border-bottom: 0; }
  .n-title { margin: 0; font-weight: 700; font-size: 12.5px; }
  .n-body { margin: 3px 0 0; color: var(--ink-700); font-size: 12px; }
  .n-ev { margin: 5px 0 0; font-size: 10px; color: var(--ink-400); }
  .n-ev span { font-weight: 700; text-transform: uppercase; letter-spacing: .8px; margin-right: 5px; }
  .empty { margin: 0; color: var(--ink-400); font-style: italic; font-size: 12px; }
  .muted { color: var(--ink-400); font-size: 10px; }
  footer.brand {
    margin-top: 22px; padding-top: 14px; border-top: 1px solid var(--ink-200);
    display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap;
    font-size: 10.5px; color: var(--ink-400);
  }
  @media print {
    body { background: #fff; }
    .page { max-width: none; padding: 0; }
    .block, .stat { break-inside: avoid; }
    header.brand { break-after: avoid; }
    @page { margin: 14mm; }
  }
</style>
</head>
<body>
<div class="page">

  <header class="brand">
    <div class="wordmark">
      <div class="mark">N</div>
      <div>
        <h1>NIRNAY</h1>
        <p>AI Unified Citizen Intelligence Platform</p>
      </div>
    </div>
    <div class="meta">
      <strong>${escapeHtml(meta.reportId)}</strong>
      Generated ${escapeHtml(formatDateTime(meta.generatedAt))}<br>
      ${escapeHtml(meta.officer)} · ${escapeHtml(meta.department)}<br>
      Role: ${escapeHtml(meta.role)}
    </div>
  </header>

  <p class="synthetic">
    SYNTHETIC DATA — every record in this report is fabricated demonstration data.
    No real citizen, department, file or reference number is represented.
  </p>

  <div class="summary-strip">
    <div class="stat"><span>Citizen</span><strong>${escapeHtml(citizen.name)}</strong></div>
    <div class="stat"><span>Citizen ID</span><strong>${escapeHtml(citizen.citizenId)}</strong></div>
    <div class="stat"><span>Risk score</span><strong>${risk.score}/100 · ${escapeHtml(risk.level)}</strong></div>
    <div class="stat"><span>Case status</span><strong>${escapeHtml(investigation?.status ?? "No linked case")}</strong></div>
    <div class="stat"><span>AI confidence</span><strong>${escapeHtml(risk.aiConfidence)}</strong></div>
  </div>

  ${section("Executive Summary", `<p class="lede">${escapeHtml(aiSummary.executive)}</p>`)}

  ${section("Citizen Identity", fieldTable(citizen.identity) + `<p class="muted" style="margin-top:8px">Registered address: ${escapeHtml(citizen.address)}</p>`)}

  ${section(
    "Investigation Summary",
    investigation
      ? fieldTable([
          { label: "Investigation ID", value: investigation.id },
          { label: "Case status", value: investigation.status },
          { label: "Priority", value: investigation.priority },
          { label: "Assigned officer", value: investigation.officer },
          { label: "Opened", value: investigation.createdAt },
          { label: "Last updated", value: investigation.updatedAt },
          { label: "Reason", value: investigation.reason },
        ])
      : `<p class="empty">This report is not linked to an investigation case.</p>`,
  )}

  ${section(
    "Risk Assessment",
    fieldTable([
      { label: "Risk level", value: risk.level },
      { label: "Risk score", value: `${risk.score} / 100` },
      { label: "Citizen status", value: risk.citizenStatus },
      { label: "AI confidence", value: risk.aiConfidence },
    ]) + narrativeList(risk.rationale),
  )}

  ${section("AI Summary — Domain Analysis", narrativeList(aiSummary.domains))}
  ${section("Recommendations", narrativeList(doc.recommendations))}
  ${section("Verification Status & Reviewer Notes", verificationTable)}
  ${section("Evidence References", evidenceTable)}
  ${section("Passport", fieldTable(doc.passport))}
  ${section(
    "International Travel",
    fieldTable(doc.travel.stats) +
      `<p class="lede" style="margin-top:10px"><strong>AI observation:</strong> ${escapeHtml(doc.travel.observation)}</p>` +
      (doc.travel.trips.length ? `<div style="margin-top:10px">${fieldTable(doc.travel.trips)}</div>` : ""),
  )}
  ${section("Properties", fieldTable(doc.properties))}
  ${section("Employment & Business", fieldTable(doc.employment))}
  ${section("Government Benefits", fieldTable(doc.benefits))}
  ${section("Citizen Timeline", fieldTable(doc.timeline))}
  ${investigation ? section("Investigation Notes", fieldTable(doc.caseNotes)) : ""}
  ${investigation ? section("Investigation Tasks", fieldTable(doc.caseTasks)) : ""}

  <footer class="brand">
    <div>
      <strong>NIRNAY</strong> — AI Unified Citizen Intelligence Platform ·
      Report ${escapeHtml(meta.reportId)}
    </div>
    <div>
      Generated ${escapeHtml(formatDateTime(meta.generatedAt))} by ${escapeHtml(meta.officer)} ·
      Synthetic demonstration data only
    </div>
  </footer>

</div>
</body>
</html>`;
}

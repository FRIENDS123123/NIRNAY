// Assembles a report document from a citizen, an optional investigation, and
// the current verification state. Pure: no storage access, no side effects.

import type { Citizen } from "@/mock-data/types";
import type { Investigation } from "@/lib/investigations/types";
import type { ResolvedLegalRecord } from "@/lib/legal-records/types";
import { formatCurrency, formatDate, formatDateTime, formatPercent } from "@/lib/format";
import type { ReportDocument, ReportFieldRow } from "./types";

function row(label: string, value: string | number | undefined | null): ReportFieldRow {
  return { label, value: value === undefined || value === null || value === "" ? "—" : String(value) };
}

export interface BuildReportInput {
  reportId: string;
  citizen: Citizen;
  investigation?: Investigation | null;
  records: ResolvedLegalRecord[];
  officer: string;
  department: string;
  role: string;
}

export function buildReportDocument({
  reportId,
  citizen,
  investigation,
  records,
  officer,
  department,
  role,
}: BuildReportInput): ReportDocument {
  const { identity, aiSummary, travel, addressIntel } = citizen;

  return {
    meta: {
      reportId,
      title: `Citizen Intelligence Report — ${identity.fullName}`,
      generatedAt: new Date().toISOString(),
      officer,
      department,
      role,
    },

    citizen: {
      citizenId: citizen.citizenId,
      name: identity.fullName,
      address: `${addressIntel.current.line}, ${addressIntel.current.city}, ${addressIntel.current.state} — ${addressIntel.current.pincode}`,
      identity: [
        row("Full name", identity.fullName),
        row("Citizen ID", citizen.citizenId),
        row("Date of birth", formatDate(identity.dateOfBirth)),
        row("Gender", identity.gender),
        row("Aadhaar", identity.aadhaar),
        row("PAN", identity.pan),
        row("Passport", identity.passport),
        row("Driving licence", identity.drivingLicence),
        row("Voter ID", identity.voterId),
        row("Ration card", identity.rationCard),
        row("ABHA ID", identity.abhaId),
        row("Phone", identity.phone),
        row("Email", identity.email),
        row("Resolution confidence", formatPercent(citizen.resolutionConfidence)),
      ],
    },

    investigation: investigation
      ? {
          id: investigation.id,
          status: investigation.status,
          priority: investigation.priority,
          officer: investigation.assignedOfficer,
          createdAt: formatDateTime(investigation.createdAt),
          updatedAt: formatDateTime(investigation.updatedAt),
          reason: investigation.reason,
        }
      : null,

    risk: {
      level: aiSummary.riskLevel,
      score: aiSummary.metrics.riskScore,
      citizenStatus: aiSummary.metrics.citizenStatus,
      aiConfidence: formatPercent(aiSummary.metrics.aiConfidence),
      rationale: aiSummary.riskRationale.map((finding) => ({
        title: "Risk signal",
        body: finding.text,
        evidence: finding.evidenceIds,
      })),
    },

    aiSummary: {
      executive: aiSummary.executiveSummary,
      domains: aiSummary.domainSummaries.map((domain) => ({
        title: domain.title,
        body: domain.text,
        evidence: domain.evidenceIds,
      })),
    },

    recommendations: aiSummary.recommendations.map((rec) => ({
      title: `${rec.title} (${rec.priority} priority)`,
      body: rec.detail,
      evidence: rec.evidenceIds,
    })),

    evidence: citizen.evidence.map((item) => ({
      id: item.id,
      label: item.label,
      department: item.sourceDepartment,
      reference: item.referenceNumber,
      confidence: formatPercent(item.confidence),
      verification: item.verificationStatus,
      linkedRecord: item.linkedRecord,
    })),

    verification: records.map((record) => ({
      title: record.title,
      category: record.category,
      department: record.department,
      reference: record.reference,
      status: record.status,
      reviewerNotes: record.reviewerNotes || "—",
      reviewedBy: record.reviewedBy ?? "Not reviewed",
      reviewedAt: record.reviewedAt ? formatDateTime(record.reviewedAt) : "—",
    })),

    passport: travel.passport
      ? [
          row("Passport number", travel.passport.number),
          row("Issue date", formatDate(travel.passport.issueDate)),
          row("Expiry date", formatDate(travel.passport.expiryDate)),
          row("Issuing office", travel.passport.issuingOffice),
          row("Status", travel.passport.status),
        ]
      : [row("Passport", "No passport held by this citizen")],

    travel: {
      stats: [
        row("Total trips", travel.totalTrips),
        row("Countries visited", travel.countriesVisited),
        row("Average stay", travel.averageStayDays > 0 ? `${travel.averageStayDays} days` : "—"),
        row("Travel frequency", travel.travelFrequency),
        row("Last exit", travel.lastExit ? formatDate(travel.lastExit) : "—"),
        row("Last entry", travel.lastEntry ? formatDate(travel.lastEntry) : "—"),
      ],
      trips: travel.trips.map((trip) =>
        row(
          `${trip.country} · ${trip.purpose}`,
          `${formatDate(trip.exitDate)} → ${formatDate(trip.entryDate)} (${trip.durationDays} days, ${trip.visaType})`,
        ),
      ),
      observation: travel.observation.text,
    },

    properties: citizen.properties.map((property) =>
      row(
        `${property.category} · ${property.id}`,
        `${property.address} · declared ${formatCurrency(property.declaredValue)} · current ${formatCurrency(property.currentValuation)} · ${property.encumbrance}`,
      ),
    ),

    employment: [
      ...citizen.employment.history.map((job) =>
        row(`${job.status} · ${job.role}`, `${job.employer} · ${job.sector} · since ${formatDate(job.since)}`),
      ),
      ...citizen.employment.gstRegistrations.map((gst) =>
        row(`GST · ${gst.status}`, `${gst.gstin} · ${gst.legalName} · last filing ${formatDate(gst.lastFiling)}`),
      ),
      ...citizen.employment.directorships.map((dir) =>
        row(`Directorship · ${dir.status}`, `${dir.company} · ${dir.role} · CIN ${dir.cin}`),
      ),
    ],

    benefits: citizen.benefits.map((benefit) =>
      row(benefit.scheme, `${benefit.category} · ${benefit.status} · eligibility ${benefit.eligibility}`),
    ),

    timeline: citizen.timeline.map((event) =>
      row(`${formatDate(event.date)} · ${event.title}`, `${event.description} (${event.department})`),
    ),

    caseNotes: investigation
      ? investigation.notes.map((note) =>
          row(`${note.author} · ${formatDateTime(note.createdAt)}`, note.body),
        )
      : [],

    caseTasks: investigation
      ? investigation.tasks.map((task) => row(`${task.status} · ${task.title}`, task.detail))
      : [],
  };
}

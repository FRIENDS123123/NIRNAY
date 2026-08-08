// Verification workflow for legal records.
//
// A "legal record" is any statutory artefact the platform holds about a
// citizen — an identifier, a document, a registration, a licence, a holding.
// Each one carries an officer-controlled review state that is persisted
// locally and reflected everywhere the record appears.
//
// Note: this ReviewStatus is deliberately distinct from the synthetic
// `VerificationStatus` on the source records (see /mock-data/types.ts). That
// one describes what the source department reported; this one records what a
// NIRNAY officer decided.

import type { RecordCategory } from "@/lib/roles/types";

export type ReviewStatus = "Draft" | "Needs Review" | "Verified" | "Rejected";

export const REVIEW_STATUSES: ReviewStatus[] = [
  "Draft",
  "Needs Review",
  "Verified",
  "Rejected",
];

/** A statutory record, derived from the synthetic citizen data. */
export interface LegalRecord {
  /** Stable across reloads — the verification store keys on this. */
  id: string;
  citizenId: string;
  category: RecordCategory;
  title: string;
  subtitle: string;
  department: string;
  reference: string;
  issuedOn?: string;
  /** Review state implied by the source data before any officer decision. */
  defaultStatus: ReviewStatus;
  evidenceIds: string[];
}

/** An officer's decision on a record. Absent until someone reviews it. */
export interface VerificationState {
  status: ReviewStatus;
  reviewerNotes: string;
  reviewedBy: string;
  reviewedAt: string;
  updatedAt: string;
}

/** A record joined with its current review state, reviewed or not. */
export interface ResolvedLegalRecord extends LegalRecord {
  status: ReviewStatus;
  reviewerNotes: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  updatedAt: string | null;
  /** True once an officer has explicitly acted on this record. */
  reviewed: boolean;
}

// Investigation workspace domain. Unlike /mock-data, these records are created
// by the officer at runtime and persisted to localStorage — there is no
// backend in this phase. The citizen they point at stays the synthetic
// source of truth and is never copied wholesale into the case.

import type { RiskLevel } from "@/mock-data/types";

export type CaseStatus =
  | "Open"
  | "Under Review"
  | "Need More Evidence"
  | "Escalated"
  | "Closed"
  | "Archived";

export type CasePriority = "Critical" | "High" | "Medium" | "Low";

export type TaskStatus = "Pending" | "In Progress" | "Completed";

/** Every status an officer can move a case through, in workflow order. */
export const CASE_STATUSES: CaseStatus[] = [
  "Open",
  "Under Review",
  "Need More Evidence",
  "Escalated",
  "Closed",
  "Archived",
];

export const TASK_STATUSES: TaskStatus[] = ["Pending", "In Progress", "Completed"];

/** Statuses that mean the case is no longer being actively worked. */
export const RESOLVED_STATUSES: CaseStatus[] = ["Closed", "Archived"];

export interface InvestigationNote {
  id: string;
  body: string;
  author: string;
  createdAt: string;
  /** Set only once the note has been edited. */
  updatedAt?: string;
}

export interface InvestigationTask {
  id: string;
  title: string;
  detail: string;
  status: TaskStatus;
  /** Evidence from the source citizen record backing this task. */
  evidenceIds: string[];
  completedAt?: string;
}

export type ActivityKind = "created" | "status" | "note" | "task";

export interface CaseActivity {
  id: string;
  at: string;
  kind: ActivityKind;
  label: string;
  detail?: string;
}

export interface Investigation {
  id: string;
  sourceCitizenId: string;
  /** Denormalised so the workspace list renders without resolving citizens. */
  citizenName: string;
  citizenInitials: string;
  riskLevel: RiskLevel;
  riskScore: number;
  priority: CasePriority;
  status: CaseStatus;
  reason: string;
  assignedOfficer: string;
  createdAt: string;
  updatedAt: string;
  notes: InvestigationNote[];
  tasks: InvestigationTask[];
  activity: CaseActivity[];
}

// Investigation persistence. localStorage only — there is no backend, no API
// and no authentication in this phase.
//
// The store is an external store in the React sense: every mutation
// invalidates the cached snapshot and notifies subscribers, so a status change
// on the case detail page updates the workspace list and the officer dashboard
// without any prop plumbing.

import type { Citizen } from "@/mock-data/types";
import { currentOfficer } from "./officer";
import { suggestedTasksFor } from "./suggested-tasks";
import type {
  CaseActivity,
  CasePriority,
  CaseStatus,
  Investigation,
  InvestigationNote,
  TaskStatus,
} from "./types";

const STORAGE_KEY = "nirnay.investigations";

const listeners = new Set<() => void>();
let cache: Investigation[] | null = null;

function isInvestigation(value: unknown): value is Investigation {
  if (typeof value !== "object" || value === null) return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === "string" &&
    typeof c.sourceCitizenId === "string" &&
    typeof c.status === "string" &&
    Array.isArray(c.notes) &&
    Array.isArray(c.tasks)
  );
}

function readStorage(): Investigation[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isInvestigation);
  } catch {
    // Corrupt or unavailable storage — start from empty rather than crash.
    return [];
  }
}

function writeStorage(next: Investigation[]) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Quota or private mode: the in-memory snapshot still drives the UI.
  }
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Stable reference between mutations — required by useSyncExternalStore. */
export function getSnapshot(): Investigation[] {
  if (cache === null) cache = readStorage();
  return cache;
}

export function getServerSnapshot(): Investigation[] {
  return [];
}

// Another tab changed the data — drop the cache and re-render.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      cache = null;
      listeners.forEach((listener) => listener());
    }
  });
}

// ---------------------------------------------------------------------------
// Derivation
// ---------------------------------------------------------------------------

function priorityFor(citizen: Citizen): CasePriority {
  const { riskLevel, metrics } = citizen.aiSummary;
  if (riskLevel === "High") return metrics.riskScore >= 75 ? "Critical" : "High";
  if (riskLevel === "Medium") return "Medium";
  return "Low";
}

function reasonFor(citizen: Citizen): string {
  const { aiSummary } = citizen;
  const base = `Opened from Citizen 360 resolution — ${aiSummary.riskLevel.toLowerCase()} risk (${aiSummary.metrics.riskScore}/100) across ${aiSummary.metrics.departmentsCorrelated} correlated departments.`;
  const lead = aiSummary.investigationLeads[0]?.text;
  return lead
    ? `${base} Primary lead: ${lead}`
    : `${base} No open investigation leads — opened for record review.`;
}

function nextCaseId(existing: Investigation[]): string {
  const year = new Date().getFullYear();
  const prefix = `NIR-INV-${year}-`;
  const highest = existing
    .filter((c) => c.id.startsWith(prefix))
    .map((c) => Number.parseInt(c.id.slice(prefix.length), 10))
    .filter((n) => Number.isFinite(n))
    .reduce((max, n) => Math.max(max, n), 0);
  return `${prefix}${String(highest + 1).padStart(4, "0")}`;
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function activity(kind: CaseActivity["kind"], label: string, detail?: string): CaseActivity {
  return { id: uid("ACT"), at: new Date().toISOString(), kind, label, detail };
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/** Creates a case from a resolved citizen and returns it. */
export function createInvestigation(citizen: Citizen): Investigation {
  const existing = getSnapshot();
  const now = new Date().toISOString();

  const investigation: Investigation = {
    id: nextCaseId(existing),
    sourceCitizenId: citizen.citizenId,
    citizenName: citizen.identity.fullName,
    citizenInitials: citizen.identity.photoInitials,
    riskLevel: citizen.aiSummary.riskLevel,
    riskScore: citizen.aiSummary.metrics.riskScore,
    priority: priorityFor(citizen),
    status: "Open",
    reason: reasonFor(citizen),
    assignedOfficer: currentOfficer.name,
    createdAt: now,
    updatedAt: now,
    notes: [],
    tasks: suggestedTasksFor(citizen.citizenId).map((seed) => ({
      id: uid("TSK"),
      title: seed.title,
      detail: seed.detail,
      status: "Pending" as TaskStatus,
      evidenceIds: seed.evidenceIds,
    })),
    activity: [
      {
        id: uid("ACT"),
        at: now,
        kind: "created",
        label: "Investigation opened",
        detail: `Case created from citizen ${citizen.citizenId} by ${currentOfficer.name}.`,
      },
    ],
  };

  writeStorage([investigation, ...existing]);
  return investigation;
}

function mutate(id: string, apply: (c: Investigation) => Investigation) {
  const next = getSnapshot().map((c) =>
    c.id === id ? { ...apply(c), updatedAt: new Date().toISOString() } : c,
  );
  writeStorage(next);
}

export function setCaseStatus(id: string, status: CaseStatus) {
  mutate(id, (c) =>
    c.status === status
      ? c
      : {
          ...c,
          status,
          activity: [
            activity("status", `Status changed to ${status}`, `Previously ${c.status}.`),
            ...c.activity,
          ],
        },
  );
}

export function addNote(id: string, body: string) {
  const trimmed = body.trim();
  if (!trimmed) return;

  mutate(id, (c) => {
    const note: InvestigationNote = {
      id: uid("NOTE"),
      body: trimmed,
      author: currentOfficer.name,
      createdAt: new Date().toISOString(),
    };
    return {
      ...c,
      notes: [note, ...c.notes],
      activity: [activity("note", "Note added"), ...c.activity],
    };
  });
}

export function updateNote(id: string, noteId: string, body: string) {
  const trimmed = body.trim();
  if (!trimmed) return;

  mutate(id, (c) => ({
    ...c,
    notes: c.notes.map((note) =>
      note.id === noteId ? { ...note, body: trimmed, updatedAt: new Date().toISOString() } : note,
    ),
    activity: [activity("note", "Note edited"), ...c.activity],
  }));
}

export function deleteNote(id: string, noteId: string) {
  mutate(id, (c) => ({
    ...c,
    notes: c.notes.filter((note) => note.id !== noteId),
    activity: [activity("note", "Note deleted"), ...c.activity],
  }));
}

export function setTaskStatus(id: string, taskId: string, status: TaskStatus) {
  mutate(id, (c) => {
    const task = c.tasks.find((t) => t.id === taskId);
    if (!task || task.status === status) return c;

    return {
      ...c,
      tasks: c.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status,
              completedAt: status === "Completed" ? new Date().toISOString() : undefined,
            }
          : t,
      ),
      activity: [activity("task", `Task marked ${status}`, task.title), ...c.activity],
    };
  });
}

/** Test/demo helper — clears every stored case. */
export function clearInvestigations() {
  writeStorage([]);
}

import { useSyncExternalStore } from "react";
import { createLocalStore } from "@/lib/local-store";
import { currentOfficer } from "@/lib/investigations/officer";
import type { ReviewStatus, VerificationState } from "./types";

/** recordId → officer decision. Records absent here have never been reviewed. */
export type VerificationMap = Record<string, VerificationState>;

const isMap = (value: unknown): value is VerificationMap =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const verificationStore = createLocalStore<VerificationMap>(
  "nirnay.verification",
  {},
  isMap,
);

export function useVerificationMap(): VerificationMap {
  return useSyncExternalStore(
    verificationStore.subscribe,
    verificationStore.getSnapshot,
    verificationStore.getServerSnapshot,
  );
}

function existingOrSeed(map: VerificationMap, recordId: string, fallback: ReviewStatus) {
  return (
    map[recordId] ?? {
      status: fallback,
      reviewerNotes: "",
      reviewedBy: "",
      reviewedAt: "",
      updatedAt: "",
    }
  );
}

export function setRecordStatus(recordId: string, status: ReviewStatus, fallback: ReviewStatus) {
  verificationStore.update((map) => {
    const now = new Date().toISOString();
    const current = existingOrSeed(map, recordId, fallback);
    return {
      ...map,
      [recordId]: {
        ...current,
        status,
        reviewedBy: currentOfficer.name,
        reviewedAt: now,
        updatedAt: now,
      },
    };
  });
}

export function setReviewerNotes(recordId: string, notes: string, fallback: ReviewStatus) {
  verificationStore.update((map) => {
    const now = new Date().toISOString();
    const current = existingOrSeed(map, recordId, fallback);
    return {
      ...map,
      [recordId]: {
        ...current,
        reviewerNotes: notes,
        reviewedBy: currentOfficer.name,
        reviewedAt: current.reviewedAt || now,
        updatedAt: now,
      },
    };
  });
}

export function resetVerification() {
  verificationStore.reset();
}

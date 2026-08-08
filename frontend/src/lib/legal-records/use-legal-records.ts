import { useMemo } from "react";
import type { Citizen } from "@/mock-data/types";
import { roleDefinition, type Role } from "@/lib/roles/types";
import { deriveLegalRecords } from "./derive";
import { useVerificationMap, type VerificationMap } from "./store";
import type { ResolvedLegalRecord, ReviewStatus } from "./types";

/** Joins derived records with any officer decisions. Pure — reused by exports. */
export function resolveLegalRecords(
  citizen: Citizen,
  map: VerificationMap,
): ResolvedLegalRecord[] {
  return deriveLegalRecords(citizen).map((record) => {
    const decision = map[record.id];
    return {
      ...record,
      status: decision?.status ?? record.defaultStatus,
      reviewerNotes: decision?.reviewerNotes ?? "",
      reviewedBy: decision?.reviewedBy || null,
      reviewedAt: decision?.reviewedAt || null,
      updatedAt: decision?.updatedAt || null,
      reviewed: Boolean(decision),
    };
  });
}

/** Applies a role's category and review-state scope. */
export function scopeRecordsToRole(
  records: ResolvedLegalRecord[],
  role: Role,
): ResolvedLegalRecord[] {
  const definition = roleDefinition(role);

  return records.filter((record) => {
    if (definition.scope !== "all" && !definition.scope.includes(record.category)) return false;
    if (definition.reviewScope && !definition.reviewScope.includes(record.status)) return false;
    return true;
  });
}

export function useResolvedLegalRecords(citizen: Citizen): ResolvedLegalRecord[] {
  const map = useVerificationMap();
  return useMemo(() => resolveLegalRecords(citizen, map), [citizen, map]);
}

export function useScopedLegalRecords(citizen: Citizen, role: Role): ResolvedLegalRecord[] {
  const records = useResolvedLegalRecords(citizen);
  return useMemo(() => scopeRecordsToRole(records, role), [records, role]);
}

export type ReviewCounts = Record<ReviewStatus, number>;

export function countByStatus(records: ResolvedLegalRecord[]): ReviewCounts {
  const counts: ReviewCounts = { Draft: 0, "Needs Review": 0, Verified: 0, Rejected: 0 };
  for (const record of records) counts[record.status] += 1;
  return counts;
}

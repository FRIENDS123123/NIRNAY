import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileLock2, Inbox } from "lucide-react";
import type { Citizen } from "@/mock-data/types";
import { ROLES } from "@/lib/roles/types";
import { setActiveRole, useActiveRole } from "@/lib/roles/store";
import { roleDefinition } from "@/lib/roles/types";
import {
  countByStatus,
  scopeRecordsToRole,
  useResolvedLegalRecords,
} from "@/lib/legal-records/use-legal-records";
import { REVIEW_STATUSES } from "@/lib/legal-records/types";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { ReviewStatusBadge } from "./ReviewStatusBadge";
import { LegalRecordRow } from "./LegalRecordRow";

/**
 * Role-scoped legal records with their verification workflow. Rendered on both
 * the citizen profile and the investigation case so a status change on either
 * surface is reflected on the other immediately.
 */
export function LegalRecordsPanel({ citizen }: { citizen: Citizen }) {
  const role = useActiveRole();
  const records = useResolvedLegalRecords(citizen);
  const definition = roleDefinition(role);

  const visible = useMemo(() => scopeRecordsToRole(records, role), [records, role]);
  const counts = useMemo(() => countByStatus(records), [records]);
  const roleCounts = useMemo(
    () =>
      Object.fromEntries(
        ROLES.map((r) => [r.id, scopeRecordsToRole(records, r.id).length]),
      ) as Record<string, number>,
    [records],
  );

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white">
            <FileLock2 size={18} aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-semibold text-ink-900">Legal Records & Verification</h2>
            <p className="text-sm text-ink-500">
              {records.length} statutory records · scoped to the active role
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {REVIEW_STATUSES.filter((status) => counts[status] > 0).map((status) => (
            <span key={status} className="flex items-center gap-1">
              <ReviewStatusBadge status={status} />
              <span className="font-mono text-xs font-semibold text-ink-500">{counts[status]}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Role tabs */}
      <div
        role="tablist"
        aria-label="Filter legal records by role"
        className="mt-4 flex flex-wrap gap-1.5 border-b border-ink-100 pb-3"
      >
        {ROLES.map((option) => {
          const active = option.id === role;
          return (
            <button
              key={option.id}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => setActiveRole(option.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
                active
                  ? "border-primary-300 bg-primary-50 text-primary-700"
                  : "border-ink-200 bg-surface text-ink-500 hover:border-ink-300 hover:text-ink-700",
              )}
            >
              {option.label}
              <span
                className={cn(
                  "ml-1.5 font-mono font-semibold",
                  active ? "text-primary-500" : "text-ink-400",
                )}
              >
                {roleCounts[option.id] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-ink-500">
        <span className="font-semibold text-ink-700">{definition.label}</span> —{" "}
        {definition.description}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={role}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="mt-3"
        >
          <p className="mb-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-400">
            {visible.length} record{visible.length === 1 ? "" : "s"} visible to {definition.label}
          </p>

          {visible.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-ink-200 px-6 py-10 text-center">
              <Inbox size={20} className="text-ink-300" strokeWidth={2} aria-hidden="true" />
              <p className="text-sm font-semibold text-ink-900">
                No records visible to {definition.label}
              </p>
              <p className="max-w-sm text-xs text-ink-500">
                {definition.reviewScope
                  ? "Every record on this profile has already been verified — nothing is awaiting a decision."
                  : "This role's scope does not cover any record held against this citizen."}
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {visible.map((record) => (
                <LegalRecordRow key={record.id} record={record} evidence={citizen.evidence} />
              ))}
            </ul>
          )}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}

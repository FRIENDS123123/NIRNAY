import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, MessageSquareText } from "lucide-react";
import type { Evidence } from "@/mock-data/types";
import type { ResolvedLegalRecord, ReviewStatus } from "@/lib/legal-records/types";
import { REVIEW_STATUSES } from "@/lib/legal-records/types";
import { setRecordStatus, setReviewerNotes } from "@/lib/legal-records/store";
import { EvidenceRefs } from "@/components/evidence/EvidenceRefs";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/cn";
import { ReviewStatusBadge } from "./ReviewStatusBadge";

export function LegalRecordRow({
  record,
  evidence,
}: {
  record: ResolvedLegalRecord;
  evidence: Evidence[];
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(record.reviewerNotes);
  const [justSaved, setJustSaved] = useState(false);
  const selectId = useId();
  const panelId = useId();

  // Keep the editor in step when another surface edits the same record.
  useEffect(() => setDraft(record.reviewerNotes), [record.reviewerNotes]);

  useEffect(() => {
    if (!justSaved) return;
    const timer = setTimeout(() => setJustSaved(false), 1600);
    return () => clearTimeout(timer);
  }, [justSaved]);

  function saveNotes() {
    setReviewerNotes(record.id, draft, record.defaultStatus);
    setJustSaved(true);
  }

  return (
    <motion.li layout className="rounded-xl border border-ink-100 bg-canvas/50 p-3.5">
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <div className="min-w-0 flex-1 basis-64">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-ink-200 bg-surface px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-ink-500">
              {record.category}
            </span>
            <p className="text-sm font-semibold text-ink-900">{record.title}</p>
          </div>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{record.subtitle}</p>
          <p className="mt-0.5 font-mono text-[11px] text-ink-400">
            {record.department} · {record.reference}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <ReviewStatusBadge status={record.status} />
          <label htmlFor={selectId} className="sr-only">
            Verification status for {record.title}
          </label>
          <div className="relative">
            <select
              id={selectId}
              value={record.status}
              onChange={(event) =>
                setRecordStatus(record.id, event.target.value as ReviewStatus, record.defaultStatus)
              }
              className="appearance-none rounded-lg border border-ink-200 bg-surface py-1.5 pl-2.5 pr-7 text-xs font-medium text-ink-900 transition-colors hover:border-ink-300 focus-visible:border-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            >
              {REVIEW_STATUSES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              strokeWidth={2.25}
              aria-hidden="true"
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ink-400"
            />
          </div>
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <EvidenceRefs ids={record.evidenceIds} context={record.title} evidence={evidence} />

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-surface px-2 py-1 text-[11px] font-medium text-ink-600 transition-colors hover:border-ink-300 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        >
          <MessageSquareText size={11} strokeWidth={2.25} aria-hidden="true" />
          Reviewer notes
          {record.reviewerNotes && (
            <span className="h-1.5 w-1.5 rounded-full bg-accent-500" aria-label="has notes" />
          )}
          <ChevronDown
            size={11}
            strokeWidth={2.5}
            aria-hidden="true"
            className={cn("transition-transform", open && "rotate-180")}
          />
        </button>

        {record.reviewed ? (
          <span className="text-[11px] text-ink-400">
            Reviewed by {record.reviewedBy} ·{" "}
            {record.reviewedAt ? formatDateTime(record.reviewedAt) : "—"}
          </span>
        ) : (
          <span className="text-[11px] italic text-ink-400">Not yet reviewed</span>
        )}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 border-t border-ink-100 pt-3">
              <label htmlFor={`${panelId}-notes`} className="sr-only">
                Reviewer notes for {record.title}
              </label>
              <textarea
                id={`${panelId}-notes`}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={3}
                placeholder="Record the reason for this decision…"
                className="w-full resize-y rounded-lg border border-ink-200 bg-surface p-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus-visible:border-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              />

              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-[11px] text-ink-400">
                  Last updated{" "}
                  {record.updatedAt ? formatDateTime(record.updatedAt) : "never"}
                </p>
                <button
                  type="button"
                  onClick={saveNotes}
                  disabled={draft === record.reviewerNotes}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                >
                  {justSaved ? (
                    <>
                      <Check size={11} strokeWidth={2.5} aria-hidden="true" /> Saved
                    </>
                  ) : (
                    "Save notes"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileSearch } from "lucide-react";
import type { Evidence } from "@/mock-data/types";

/**
 * Renders a single evidence citation as an inline, hoverable chip. This is
 * the UI-level enforcement of the AI Engine's attribution requirement — see
 * /docs/04_AI_ENGINE.md — every AI-style claim must point back to a
 * specific mock source record.
 */
export function EvidenceTag({ evidence }: { evidence: Evidence }) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-md border border-accent-200 bg-accent-50 px-1.5 py-0.5 text-[11px] font-medium text-accent-700 hover:border-accent-300 hover:bg-accent-100"
      >
        <FileSearch size={11} strokeWidth={2.25} />
        {evidence.sourceDepartment}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 top-full z-20 mt-1.5 w-64 rounded-xl border border-ink-100 bg-surface p-3 text-xs shadow-[var(--shadow-card-hover)]"
          >
            <p className="font-semibold text-ink-900">{evidence.label}</p>
            <dl className="mt-2 space-y-1 text-ink-500">
              <div className="flex justify-between gap-2">
                <dt>Department</dt>
                <dd className="text-right text-ink-700">{evidence.sourceDepartment}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>Record</dt>
                <dd className="text-right font-mono text-ink-700">{evidence.sourceRecordId}</dd>
              </div>
            </dl>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

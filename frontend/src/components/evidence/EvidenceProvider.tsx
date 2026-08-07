import { useCallback, useMemo, useState, type ReactNode } from "react";
import { FileSearch, Landmark, Link2, ShieldQuestion } from "lucide-react";
import type { Evidence } from "@/mock-data/types";
import { Drawer } from "@/components/ui/Drawer";
import { VerificationChip } from "@/components/ui/VerificationChip";
import { CopyButton } from "@/components/ui/CopyButton";
import { formatDate, formatPercent } from "@/lib/format";
import { EvidenceContextProvider, type EvidenceRequest } from "./evidence-context";

/**
 * Owns the evidence drawer for one citizen profile. Any descendant can call
 * `useEvidence().openEvidence(...)` — that is how the platform guarantees every
 * AI statement is one click away from the records it was derived from.
 */
export function EvidenceProvider({
  evidence,
  children,
}: {
  evidence: Evidence[];
  children: ReactNode;
}) {
  const [request, setRequest] = useState<EvidenceRequest | null>(null);
  const [open, setOpen] = useState(false);

  const byId = useMemo(() => new Map(evidence.map((e) => [e.id, e])), [evidence]);

  const openEvidence = useCallback((next: EvidenceRequest) => {
    setRequest(next);
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ openEvidence }), [openEvidence]);

  const records = (request?.ids ?? [])
    .map((id) => byId.get(id))
    .filter((e): e is Evidence => Boolean(e));

  return (
    <EvidenceContextProvider value={value}>
      {children}

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Evidence"
        subtitle={request?.title}
      >
        {records.length === 0 ? (
          <div className="flex flex-col items-center gap-2.5 py-12 text-center">
            <ShieldQuestion size={24} className="text-ink-300" strokeWidth={2} />
            <p className="text-sm font-semibold text-ink-900">No source records attached</p>
            <p className="max-w-xs text-xs text-ink-500">
              This statement is derived from the absence of records rather than from a
              specific departmental entry.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-ink-500">
              {records.length} source record{records.length > 1 ? "s" : ""} support this
              statement.
            </p>

            {records.map((record) => (
              <EvidenceRecordCard key={record.id} record={record} />
            ))}
          </div>
        )}

        <p className="mt-6 border-t border-ink-100 pt-4 text-[11px] leading-relaxed text-ink-400">
          All records shown are synthetic demonstration data. Reference numbers do not
          correspond to any real department, file or person.
        </p>
      </Drawer>
    </EvidenceContextProvider>
  );
}

function EvidenceRecordCard({ record }: { record: Evidence }) {
  return (
    <article className="rounded-xl border border-ink-100 bg-canvas/60 p-3.5">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-700">
          <FileSearch size={14} strokeWidth={2.25} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold leading-snug text-ink-900">{record.label}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-ink-500">
            <Landmark size={11} strokeWidth={2.25} />
            {record.sourceDepartment}
          </p>
        </div>
      </div>

      <dl className="mt-3 space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-ink-500">Reference number</dt>
          <dd className="flex items-center gap-1 font-mono text-ink-900">
            {record.referenceNumber}
            <CopyButton value={record.referenceNumber} label="reference number" />
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-ink-500">Source record</dt>
          <dd className="truncate font-mono text-ink-900">{record.sourceRecordId}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-ink-500">Linked record</dt>
          <dd className="flex items-center gap-1 text-ink-900">
            <Link2 size={10} strokeWidth={2.5} className="text-ink-400" />
            {record.linkedRecord}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-ink-500">Last updated</dt>
          <dd className="text-ink-900">{formatDate(record.recordedOn)}</dd>
        </div>
      </dl>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-ink-100 pt-3">
        <VerificationChip status={record.verificationStatus} />
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wide text-ink-400">
            Confidence
          </span>
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-ink-200">
            <div
              className="h-full rounded-full bg-primary-500"
              style={{ width: `${Math.round(record.confidence * 100)}%` }}
            />
          </div>
          <span className="w-8 text-right font-mono text-[11px] font-semibold text-ink-900">
            {formatPercent(record.confidence)}
          </span>
        </div>
      </div>
    </article>
  );
}

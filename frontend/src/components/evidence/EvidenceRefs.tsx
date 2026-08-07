import { ChevronRight, FileSearch } from "lucide-react";
import type { Evidence } from "@/mock-data/types";
import { departmentCode } from "@/mock-data/departments";
import { cn } from "@/lib/cn";
import { useEvidence } from "./evidence-context";

interface EvidenceRefsProps {
  ids: string[];
  /** The statement these records support — becomes the drawer subtitle. */
  context: string;
  evidence: Evidence[];
  className?: string;
}

/**
 * The citation control attached to every AI statement. Renders the departments
 * behind a claim and opens the evidence drawer with the full source records —
 * the UI-level enforcement of the AI Engine's attribution requirement, see
 * /docs/04_AI_ENGINE.md.
 */
export function EvidenceRefs({ ids, context, evidence, className }: EvidenceRefsProps) {
  const { openEvidence } = useEvidence();

  const records = ids
    .map((id) => evidence.find((e) => e.id === id))
    .filter((e): e is Evidence => Boolean(e));

  if (records.length === 0) return null;

  const codes = [...new Set(records.map((r) => departmentCode(r.sourceDepartment)))];
  const shown = codes.slice(0, 4);
  const overflow = codes.length - shown.length;

  return (
    <button
      type="button"
      onClick={() => openEvidence({ title: context, ids })}
      aria-label={`View ${records.length} source record${records.length > 1 ? "s" : ""} supporting this statement`}
      className={cn(
        "group/ev inline-flex max-w-full items-center gap-1.5 rounded-lg border border-accent-200 bg-accent-50 px-2 py-1 align-middle text-[11px] font-medium text-accent-700 transition-colors hover:border-accent-300 hover:bg-accent-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400",
        className,
      )}
    >
      <FileSearch size={11} strokeWidth={2.5} className="shrink-0" />
      <span className="font-mono uppercase tracking-wide">
        {shown.join(" · ")}
        {overflow > 0 && ` +${overflow}`}
      </span>
      <ChevronRight
        size={11}
        strokeWidth={2.5}
        className="shrink-0 transition-transform group-hover/ev:translate-x-0.5"
      />
    </button>
  );
}

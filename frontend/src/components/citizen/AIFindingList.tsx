import type { AIFinding, Evidence } from "@/mock-data/types";
import { EvidenceRefs } from "@/components/evidence/EvidenceRefs";

export function AIFindingList({
  findings,
  evidence,
  emptyLabel,
}: {
  findings: AIFinding[];
  evidence: Evidence[];
  emptyLabel: string;
}) {
  if (findings.length === 0) {
    return <p className="text-sm italic text-ink-400">{emptyLabel}</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {findings.map((finding, i) => (
        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink-700">
          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-300" />
          <span className="min-w-0">
            {finding.text}{" "}
            <EvidenceRefs
              ids={finding.evidenceIds}
              context={finding.text}
              evidence={evidence}
              className="ml-0.5"
            />
          </span>
        </li>
      ))}
    </ul>
  );
}

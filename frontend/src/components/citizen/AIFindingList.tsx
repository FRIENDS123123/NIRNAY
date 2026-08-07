import type { AIFinding, Evidence } from "@/mock-data/types";
import { EvidenceTag } from "@/components/ui/EvidenceTag";

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

  const evidenceById = new Map(evidence.map((e) => [e.id, e]));

  return (
    <ul className="flex flex-col gap-3">
      {findings.map((finding, i) => (
        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink-700">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-300" />
          <span>
            {finding.text}
            {finding.evidenceIds.length > 0 && (
              <span className="ml-2 inline-flex flex-wrap gap-1 align-middle">
                {finding.evidenceIds.map((id) => {
                  const e = evidenceById.get(id);
                  return e ? <EvidenceTag key={id} evidence={e} /> : null;
                })}
              </span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

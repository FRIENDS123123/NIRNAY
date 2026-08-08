import { useId, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, FilePlus2 } from "lucide-react";
import { citizens, getCitizenById } from "@/mock-data/citizens";
import { useInvestigations } from "@/lib/investigations/use-investigations";
import { useGenerateReport } from "@/lib/reports/use-generate-report";
import { Card } from "@/components/ui/Card";

function Field({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 flex-1 basis-56">
      <label htmlFor={id} className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-400">
        {label}
      </label>
      <div className="relative mt-1.5">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-xl border border-ink-200 bg-surface py-2.5 pl-3.5 pr-9 text-sm font-medium text-ink-900 transition-colors hover:border-ink-300 focus-visible:border-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        >
          {children}
        </select>
        <ChevronDown
          size={15}
          strokeWidth={2.25}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400"
        />
      </div>
    </div>
  );
}

export function GenerateReportPanel() {
  const navigate = useNavigate();
  const investigations = useInvestigations();
  const generate = useGenerateReport();

  const [citizenId, setCitizenId] = useState(citizens[0].citizenId);
  const [caseId, setCaseId] = useState("none");

  const citizenIdField = useId();
  const caseField = useId();

  const linkedCases = useMemo(
    () => investigations.filter((c) => c.sourceCitizenId === citizenId),
    [investigations, citizenId],
  );

  function handleGenerate() {
    const citizen = getCitizenById(citizenId);
    if (!citizen) return;
    const investigation = linkedCases.find((c) => c.id === caseId) ?? null;
    const report = generate(citizen, investigation);
    navigate(`/reports/${report.id}`);
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white">
          <FilePlus2 size={18} aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-semibold text-ink-900">Generate Report</h2>
          <p className="text-sm text-ink-500">
            Snapshots the citizen record, risk assessment and current verification state
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <Field id={citizenIdField} label="Citizen" value={citizenId} onChange={(v) => {
          setCitizenId(v);
          setCaseId("none");
        }}>
          {citizens.map((c) => (
            <option key={c.citizenId} value={c.citizenId}>
              {c.identity.fullName} — {c.citizenId}
            </option>
          ))}
        </Field>

        <Field id={caseField} label="Link investigation" value={caseId} onChange={setCaseId}>
          <option value="none">No linked case</option>
          {linkedCases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id} — {c.status}
            </option>
          ))}
        </Field>

        <button
          type="button"
          onClick={handleGenerate}
          className="inline-flex h-[42px] shrink-0 items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(41,38,120,0.16)] transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
        >
          <FilePlus2 size={15} strokeWidth={2.5} aria-hidden="true" />
          Generate Report
        </button>
      </div>

      {linkedCases.length === 0 && (
        <p className="mt-2.5 text-xs text-ink-400">
          No investigation cases exist for this citizen yet — the report will be generated
          standalone.
        </p>
      )}
    </Card>
  );
}

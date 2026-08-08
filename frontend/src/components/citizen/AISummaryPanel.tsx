import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertOctagon,
  Banknote,
  Briefcase,
  Building2,
  Compass,
  FileStack,
  Fingerprint,
  Gauge,
  Landmark,
  Link2,
  ListChecks,
  Plane,
  ScrollText,
  ShieldAlert,
  Sparkles,
  Target,
  UserCheck,
} from "lucide-react";
import type { AIDomain, AIRecommendation, Citizen } from "@/mock-data/types";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { StatTile } from "@/components/ui/StatTile";
import { EvidenceRefs } from "@/components/evidence/EvidenceRefs";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/cn";
import { AIFindingList } from "./AIFindingList";

const domainIcons: Record<AIDomain, typeof Fingerprint> = {
  identity: Fingerprint,
  income: Banknote,
  property: Building2,
  travel: Plane,
  employment: Briefcase,
  behaviour: Activity,
  risk: ShieldAlert,
};

const findingGroups = [
  { key: "inconsistencies", title: "Potential Inconsistencies", icon: AlertOctagon, empty: "No inconsistencies detected across linked records." },
  { key: "schemeEligibility", title: "Government Scheme Eligibility", icon: ListChecks, empty: "No scheme eligibility signals identified." },
  { key: "linkedEntities", title: "Linked Entities", icon: Link2, empty: "No additional linked entities identified." },
  { key: "investigationLeads", title: "Investigation Leads", icon: Compass, empty: "No investigation leads identified from current records." },
  { key: "riskRationale", title: "Risk Rationale", icon: Target, empty: "No specific risk signals identified." },
] as const;

const priorityClasses: Record<AIRecommendation["priority"], string> = {
  High: "bg-danger-50 text-danger-700 ring-danger-100",
  Medium: "bg-warning-50 text-warning-700 ring-warning-100",
  Low: "bg-ink-100 text-ink-600 ring-ink-200",
};

function riskTone(score: number) {
  if (score <= 33) return "positive" as const;
  if (score <= 66) return "caution" as const;
  return "critical" as const;
}

/** One titled block inside the panel — dark chrome, white content surface. */
function PanelBlock({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: typeof Sparkles;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-xl bg-white/[0.06] p-4 ring-1 ring-inset ring-white/10", className)}>
      <div className="mb-2.5 flex items-center gap-2 text-white/90">
        <Icon size={15} strokeWidth={2.25} aria-hidden="true" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="rounded-lg bg-surface p-3.5">{children}</div>
    </section>
  );
}

export function AISummaryPanel({ citizen }: { citizen: Citizen }) {
  const { aiSummary, evidence } = citizen;
  const { metrics } = aiSummary;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      aria-label="AI investigation summary"
      className="overflow-hidden rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-950 via-primary-800 to-accent-700 text-white shadow-[var(--shadow-hero)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
            <Sparkles size={16} strokeWidth={2.25} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-sm font-semibold">AI Investigation Summary</h2>
            <p className="text-[11px] text-white/60">
              Generated from correlated synthetic records · demo synthesis, not live AI
            </p>
          </div>
        </div>
        <RiskBadge level={aiSummary.riskLevel} />
      </div>

      {/* Metrics strip */}
      <div className="grid grid-cols-2 gap-2.5 px-6 pt-5 sm:grid-cols-4 lg:grid-cols-7">
        <StatTile icon={Sparkles} label="AI confidence" value={formatPercent(metrics.aiConfidence)} hint="Record resolution" />
        <StatTile icon={Landmark} label="Departments" value={String(metrics.departmentsCorrelated)} hint="Correlated" />
        <StatTile icon={ScrollText} label="Records" value={String(metrics.recordsAnalysed)} hint="Analysed" />
        <StatTile icon={Target} label="Evidence" value={String(metrics.evidenceSources)} hint="Source records" />
        <StatTile icon={FileStack} label="Documents" value={String(metrics.documentsLinked)} hint="Linked" />
        <StatTile icon={Gauge} label="Risk score" value={`${metrics.riskScore}/100`} hint={`${aiSummary.riskLevel} risk`} tone={riskTone(metrics.riskScore)} />
        <StatTile icon={UserCheck} label="Status" value={metrics.citizenStatus} hint="Citizen record" tone={metrics.citizenStatus === "Flagged" ? "critical" : "default"} />
      </div>

      <div className="grid gap-4 px-6 py-5">
        {/* Executive summary */}
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
            Executive Summary
          </p>
          <p className="mt-2 max-w-4xl text-[15px] leading-relaxed text-white/95">
            {aiSummary.executiveSummary}
          </p>
        </div>

        {/* Domain summaries */}
        <section aria-label="Domain summaries">
          <p className="mb-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
            Domain Analysis
          </p>
          <div className="grid gap-2.5 md:grid-cols-2">
            {aiSummary.domainSummaries.map((summary) => {
              const Icon = domainIcons[summary.key];
              return (
                <article key={summary.key} className="rounded-xl bg-surface p-4">
                  <div className="flex items-center gap-2 text-primary-700">
                    <Icon size={14} strokeWidth={2.5} aria-hidden="true" />
                    <h4 className="text-[13px] font-bold text-ink-900">{summary.title}</h4>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-700">{summary.text}</p>
                  <EvidenceRefs
                    ids={summary.evidenceIds}
                    context={summary.title}
                    evidence={evidence}
                    className="mt-2.5"
                  />
                </article>
              );
            })}
          </div>
        </section>

        {findingGroups.map(({ key, title, icon, empty }) => (
          <PanelBlock key={key} icon={icon} title={title}>
            <AIFindingList findings={aiSummary[key]} evidence={evidence} emptyLabel={empty} />
          </PanelBlock>
        ))}

        {/* Recommendations */}
        <PanelBlock icon={ListChecks} title="AI Recommendations">
          <ul className="flex flex-col gap-3">
            {aiSummary.recommendations.map((rec, i) => (
              <li key={rec.id} className="flex gap-3 border-b border-ink-100 pb-3 last:border-b-0 last:pb-0">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-700">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-ink-900">{rec.title}</p>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset",
                        priorityClasses[rec.priority],
                      )}
                    >
                      {rec.priority} priority
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-600">{rec.detail}</p>
                  <EvidenceRefs
                    ids={rec.evidenceIds}
                    context={rec.title}
                    evidence={evidence}
                    className="mt-2"
                  />
                </div>
              </li>
            ))}
          </ul>
        </PanelBlock>
      </div>
    </motion.section>
  );
}

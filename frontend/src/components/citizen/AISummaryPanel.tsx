import { motion } from "framer-motion";
import {
  AlertOctagon,
  Compass,
  Link2,
  ListChecks,
  Sparkles,
  Target,
} from "lucide-react";
import type { Citizen } from "@/mock-data/types";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { AIFindingList } from "./AIFindingList";

const sections = [
  { key: "inconsistencies", title: "Potential Inconsistencies", icon: AlertOctagon, empty: "No inconsistencies detected across linked records." },
  { key: "schemeEligibility", title: "Government Scheme Eligibility", icon: ListChecks, empty: "No scheme eligibility signals identified." },
  { key: "linkedEntities", title: "Linked Entities", icon: Link2, empty: "No additional linked entities identified." },
  { key: "investigationLeads", title: "Investigation Leads", icon: Compass, empty: "No investigation leads identified from current records." },
] as const;

export function AISummaryPanel({ citizen }: { citizen: Citizen }) {
  const { aiSummary, evidence } = citizen;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-950 via-primary-800 to-accent-700 text-white shadow-[var(--shadow-hero)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
            <Sparkles size={16} strokeWidth={2.25} />
          </span>
          <div>
            <p className="text-sm font-semibold">AI Investigation Summary</p>
            <p className="text-[11px] text-white/60">
              Generated from correlated synthetic records · demo synthesis, not live AI
            </p>
          </div>
        </div>
        <RiskBadge level={aiSummary.riskLevel} />
      </div>

      <div className="grid gap-6 px-6 py-6 lg:grid-cols-5">
        <div className="lg:col-span-5">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-white/60">Citizen Overview</p>
          <p className="mt-2 max-w-4xl text-[15px] leading-relaxed text-white/95">{aiSummary.overview}</p>
        </div>

        {sections.map(({ key, title, icon: Icon, empty }) => (
          <div key={key} className="rounded-xl bg-white/[0.06] p-4 backdrop-blur-sm lg:col-span-5">
            <div className="mb-2.5 flex items-center gap-2 text-white/90">
              <Icon size={15} strokeWidth={2.25} />
              <p className="text-sm font-semibold">{title}</p>
            </div>
            <div className="rounded-lg bg-white p-3.5">
              <AIFindingList findings={aiSummary[key]} evidence={evidence} emptyLabel={empty} />
            </div>
          </div>
        ))}

        <div className="rounded-xl bg-white/[0.06] p-4 backdrop-blur-sm lg:col-span-5">
          <div className="mb-2.5 flex items-center gap-2 text-white/90">
            <Target size={15} strokeWidth={2.25} />
            <p className="text-sm font-semibold">Risk Rationale</p>
          </div>
          <div className="rounded-lg bg-white p-3.5">
            <AIFindingList findings={aiSummary.riskRationale} evidence={evidence} emptyLabel="No specific risk signals identified." />
          </div>
        </div>

        <div className="rounded-xl bg-white/[0.06] p-4 backdrop-blur-sm lg:col-span-5">
          <div className="mb-2.5 flex items-center gap-2 text-white/90">
            <ListChecks size={15} strokeWidth={2.25} />
            <p className="text-sm font-semibold">Recommendations</p>
          </div>
          <ul className="flex flex-col gap-2">
            {aiSummary.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/95">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent-400/90 text-[10px] font-bold text-primary-950">
                  {i + 1}
                </span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.section>
  );
}

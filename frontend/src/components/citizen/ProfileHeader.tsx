import { motion } from "framer-motion";
import { Cake, Landmark, MapPin, Phone } from "lucide-react";
import type { Citizen } from "@/mock-data/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CopyButton } from "@/components/ui/CopyButton";
import { DepartmentChip } from "@/components/ui/DepartmentChip";
import { formatDate, formatPercent } from "@/lib/format";

export function ProfileHeader({ citizen }: { citizen: Citizen }) {
  const confidencePct = Math.round(citizen.resolutionConfidence * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-2xl font-bold text-white">
          {citizen.identity.photoInitials}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-ink-900">{citizen.identity.fullName}</h1>
            <Badge variant={confidencePct >= 90 ? "success" : "accent"}>
              {confidencePct}% resolution confidence
            </Badge>
            <Badge variant={citizen.status === "Flagged" ? "danger" : "neutral"}>
              {citizen.status}
            </Badge>
          </div>

          <p className="mt-0.5 flex items-center gap-1 font-mono text-xs text-ink-400">
            {citizen.citizenId}
            <CopyButton value={citizen.citizenId} label="Citizen ID" />
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink-500">
            <span className="flex items-center gap-1.5">
              <Cake size={14} aria-hidden="true" /> {formatDate(citizen.identity.dateOfBirth)} ·{" "}
              {citizen.identity.gender}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={14} aria-hidden="true" /> {citizen.identity.phone}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} aria-hidden="true" /> {citizen.addressIntel.current.city},{" "}
              {citizen.addressIntel.current.state}
            </span>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 border-t border-ink-100 pt-3.5">
            <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-400">
              <Landmark size={11} strokeWidth={2.5} aria-hidden="true" />
              {citizen.linkedDepartments.length} departments correlated
            </span>
            {citizen.linkedDepartments.map((department) => (
              <DepartmentChip key={department} name={department} />
            ))}
          </div>
        </div>

        <div className="shrink-0 rounded-xl border border-ink-100 bg-canvas/60 px-4 py-3 text-center">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-400">
            AI confidence
          </p>
          <p className="mt-1 text-2xl font-bold leading-none text-primary-700">
            {formatPercent(citizen.aiSummary.metrics.aiConfidence)}
          </p>
          <p className="mt-1 text-[11px] text-ink-400">
            {citizen.aiSummary.metrics.recordsAnalysed} records
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

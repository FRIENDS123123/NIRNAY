import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckSquare, Clock, UserRound } from "lucide-react";
import type { Investigation } from "@/lib/investigations/types";
import { Card } from "@/components/ui/Card";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { formatDate, formatRelative } from "@/lib/format";
import { CaseStatusBadge, PriorityBadge } from "./CaseBadges";

export function InvestigationCard({
  investigation,
  index = 0,
}: {
  investigation: Investigation;
  index?: number;
}) {
  const openTasks = investigation.tasks.filter((t) => t.status !== "Completed").length;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Card className="p-5 transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-sm font-bold text-white">
            {investigation.citizenInitials}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-mono text-sm font-bold text-ink-900">
                <Link
                  to={`/investigations/${investigation.id}`}
                  className="rounded transition-colors hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                >
                  {investigation.id}
                </Link>
              </h3>
              <CaseStatusBadge status={investigation.status} />
              <PriorityBadge priority={investigation.priority} />
            </div>

            <p className="mt-1 text-sm font-semibold text-ink-900">{investigation.citizenName}</p>
            <p className="font-mono text-xs text-ink-400">{investigation.sourceCitizenId}</p>
          </div>

          <RiskBadge level={investigation.riskLevel} className="shrink-0" />
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-600">
          {investigation.reason}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-ink-100 pt-3.5 text-xs text-ink-500">
          <span className="flex items-center gap-1.5">
            <UserRound size={12} strokeWidth={2.25} aria-hidden="true" />
            {investigation.assignedOfficer}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} strokeWidth={2.25} aria-hidden="true" />
            Created {formatDate(investigation.createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            Updated {formatRelative(investigation.updatedAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <CheckSquare size={12} strokeWidth={2.25} aria-hidden="true" />
            {openTasks} of {investigation.tasks.length} tasks open
          </span>

          <Link
            to={`/investigations/${investigation.id}`}
            className="group/cta ml-auto inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            Open case
            <ArrowRight
              size={13}
              strokeWidth={2.5}
              aria-hidden="true"
              className="transition-transform group-hover/cta:translate-x-0.5"
            />
          </Link>
        </div>
      </Card>
    </motion.article>
  );
}

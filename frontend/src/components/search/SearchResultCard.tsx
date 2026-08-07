import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, MapPin, Sparkles } from "lucide-react";
import type { SearchResult } from "@/mock-data/types";
import { identifierLabels } from "@/mock-data/search";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { DepartmentChip } from "@/components/ui/DepartmentChip";
import { formatDate, formatPercent } from "@/lib/format";

/**
 * Government intelligence card. Everything an officer needs to decide whether
 * this is the right citizen — before opening the full profile.
 */
export function SearchResultCard({ result, index }: { result: SearchResult; index: number }) {
  const matchPct = Math.round(result.matchConfidence * 100);

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
    >
      <Card className="p-5 transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-sm font-bold text-white">
            {result.photoInitials}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-ink-900">
                <Link
                  to={`/citizens/${result.citizenId}`}
                  className="rounded transition-colors hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                >
                  {result.fullName}
                </Link>
              </h2>
              <Badge variant={matchPct >= 90 ? "success" : "accent"}>{matchPct}% match</Badge>
              <Badge variant={result.status === "Flagged" ? "danger" : "neutral"}>{result.status}</Badge>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-500">
              <span className="font-mono text-ink-600">{result.citizenId}</span>
              <span>DOB {formatDate(result.dateOfBirth)}</span>
              <span className="flex items-center gap-1">
                <MapPin size={11} strokeWidth={2.25} aria-hidden="true" />
                {result.primaryAddress}
              </span>
              <span>
                Matched on {identifierLabels[result.matchedOn]}
                {result.matchedOn !== "name" && (
                  <span className="ml-1 font-mono text-ink-600">{result.matchedValue}</span>
                )}
              </span>
            </div>
          </div>

          <RiskBadge level={result.riskLevel} className="shrink-0" />
        </div>

        <p className="mt-4 text-sm leading-relaxed text-ink-700">{result.quickSummary}</p>

        <div className="mt-4 grid gap-4 border-t border-ink-100 pt-4 sm:grid-cols-[auto_auto_1fr_auto] sm:items-center">
          <div>
            <p className="flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-400">
              <Building2 size={10} strokeWidth={2.5} aria-hidden="true" /> Departments
            </p>
            <p className="mt-1 text-sm font-bold text-ink-900">{result.departmentCorrelations}</p>
          </div>

          <div>
            <p className="flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-400">
              <Sparkles size={10} strokeWidth={2.5} aria-hidden="true" /> AI confidence
            </p>
            <p className="mt-1 text-sm font-bold text-ink-900">{formatPercent(result.aiConfidence)}</p>
          </div>

          <div className="min-w-0">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-400">
              Linked departments
            </p>
            <div className="mt-1 flex flex-wrap gap-1">
              {result.linkedDepartments.map((department) => (
                <DepartmentChip key={department} name={department} />
              ))}
            </div>
          </div>

          <Link
            to={`/citizens/${result.citizenId}`}
            className="group/cta inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
          >
            Open Intelligence Profile
            <ArrowRight
              size={15}
              strokeWidth={2.5}
              className="transition-transform group-hover/cta:translate-x-0.5"
            />
          </Link>
        </div>
      </Card>
    </motion.article>
  );
}

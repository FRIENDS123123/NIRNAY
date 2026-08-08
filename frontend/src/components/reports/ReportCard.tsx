import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Download, FolderOpen, Trash2, UserRound } from "lucide-react";
import type { SavedReport } from "@/lib/reports/types";
import { deleteReport } from "@/lib/reports/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { formatDateTime, formatRelative } from "@/lib/format";
import { ExportButtons } from "./ExportButtons";

export function ReportCard({ report, index = 0 }: { report: SavedReport; index?: number }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Card className="p-5 transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]">
        <div className="flex flex-wrap items-start gap-3">
          <div className="min-w-0 flex-1 basis-64">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-mono text-sm font-bold text-ink-900">
                <Link
                  to={`/reports/${report.id}`}
                  className="rounded transition-colors hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                >
                  {report.id}
                </Link>
              </h3>
              <Badge variant={report.audience === "Citizen" ? "success" : "primary"}>
                {report.audience === "Citizen" ? "Citizen copy" : "Officer report"}
              </Badge>
              {report.investigationId ? (
                <Badge variant="primary">Case {report.investigationId}</Badge>
              ) : (
                <Badge variant="neutral">Standalone</Badge>
              )}
              {report.caseStatus && <Badge variant="accent">{report.caseStatus}</Badge>}
            </div>
            <p className="mt-1 text-sm font-semibold text-ink-900">{report.citizenName}</p>
            <p className="font-mono text-xs text-ink-400">{report.citizenId}</p>
          </div>

          <RiskBadge level={report.riskLevel} className="shrink-0" />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-ink-100 pt-3 text-xs text-ink-500">
          <span className="flex items-center gap-1.5">
            <UserRound size={12} strokeWidth={2.25} aria-hidden="true" />
            {report.officer}
          </span>
          <span>Generated {formatDateTime(report.generatedAt)}</span>
          <span className="flex items-center gap-1.5">
            <Download size={12} strokeWidth={2.25} aria-hidden="true" />
            {report.exports.length} export{report.exports.length === 1 ? "" : "s"}
            {report.exports[0] &&
              ` · last ${report.exports[0].format} ${formatRelative(report.exports[0].at)}`}
          </span>
          {report.exports.length > 0 && (
            <span className="flex items-center gap-1">
              {[...new Set(report.exports.map((e) => e.format))].map((format) => (
                <span
                  key={format}
                  className="rounded-md border border-ink-200 bg-canvas px-1.5 py-0.5 font-mono text-[10px] font-semibold text-ink-500"
                >
                  {format}
                </span>
              ))}
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <ExportButtons report={report} size="sm" />

          <div className="flex items-center gap-2">
            {confirming ? (
              <>
                <span className="text-[11px] font-medium text-danger-700">Delete report?</span>
                <button
                  type="button"
                  onClick={() => deleteReport(report.id)}
                  className="rounded-md px-2 py-1 text-[11px] font-semibold text-danger-700 transition-colors hover:bg-danger-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="rounded-md px-2 py-1 text-[11px] font-medium text-ink-500 transition-colors hover:bg-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                aria-label={`Delete report ${report.id}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-danger-50 hover:text-danger-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500"
              >
                <Trash2 size={14} strokeWidth={2.25} />
              </button>
            )}

            <Link
              to={`/reports/${report.id}`}
              className="group/cta inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            >
              <FolderOpen size={13} strokeWidth={2.25} aria-hidden="true" />
              Open
              <ArrowRight
                size={12}
                strokeWidth={2.5}
                aria-hidden="true"
                className="transition-transform group-hover/cta:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </Card>
    </motion.article>
  );
}

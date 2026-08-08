import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Download, FileSearch, History, Search } from "lucide-react";
import type { RiskLevel } from "@/mock-data/types";
import { useExportHistory, useReports } from "@/lib/reports/store";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { GenerateReportPanel } from "@/components/reports/GenerateReportPanel";
import { ReportCard } from "@/components/reports/ReportCard";
import { formatDateTime, formatRelative } from "@/lib/format";
import { cn } from "@/lib/cn";

type RiskFilter = "All" | RiskLevel;

const riskFilters: RiskFilter[] = ["All", "High", "Medium", "Low"];
const LOAD_DELAY_MS = 240;

export function ReportsPage() {
  const reports = useReports();
  const history = useExportHistory();

  const [query, setQuery] = useState("");
  const [risk, setRisk] = useState<RiskFilter>("All");
  const [loading, setLoading] = useState(true);

  const officerCopies = reports.filter((r) => r.audience !== "Citizen").length;
  const lastGenerated = reports.reduce(
    (latest, r) => (r.generatedAt > latest ? r.generatedAt : latest),
    reports[0]?.generatedAt ?? "",
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), LOAD_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return reports
      .filter((report) => (risk === "All" ? true : report.riskLevel === risk))
      .filter((report) =>
        needle === ""
          ? true
          : [report.id, report.citizenName, report.citizenId, report.investigationId ?? ""]
              .join(" ")
              .toLowerCase()
              .includes(needle),
      )
      .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
  }, [reports, query, risk]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header>
        <h1 className="text-xl font-bold text-ink-900">Reports</h1>
        <p className="mt-1 text-sm text-ink-500">
          Intelligence reporting centre. Reports snapshot the record at generation time and
          export locally as PDF, HTML or CSV.
        </p>

        {reports.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-ink-500">
            <span>
              <span className="font-semibold text-ink-900">{reports.length}</span> saved
            </span>
            <span>
              <span className="font-semibold text-ink-900">{officerCopies}</span> officer ·{" "}
              <span className="font-semibold text-ink-900">{reports.length - officerCopies}</span>{" "}
              citizen
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} strokeWidth={2.25} aria-hidden="true" />
              Last generated {formatRelative(lastGenerated)}
            </span>
            <span className="flex items-center gap-1.5">
              <Download size={12} strokeWidth={2.25} aria-hidden="true" />
              {history.length} download{history.length === 1 ? "" : "s"}
            </span>
          </div>
        )}
      </header>

      <div className="mt-6">
        <GenerateReportPanel />
      </div>

      {/* Search + filter */}
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 basis-64">
          <Search
            size={15}
            strokeWidth={2.25}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <label htmlFor="report-search" className="sr-only">
            Search reports
          </label>
          <input
            id="report-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by report ID, citizen or case…"
            className="h-11 w-full rounded-xl border border-ink-200 bg-surface pl-10 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:border-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          />
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter reports by risk">
          {riskFilters.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={risk === value}
              onClick={() => setRisk(value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
                risk === value
                  ? "border-primary-300 bg-primary-50 text-primary-700"
                  : "border-ink-200 bg-surface text-ink-500 hover:border-ink-300 hover:text-ink-700",
              )}
            >
              {value === "All" ? "All risk" : `${value} risk`}
            </button>
          ))}
        </div>
      </div>

      {/* Saved reports */}
      <div className="mt-6">
        {loading ? (
          <div className="flex flex-col gap-4" aria-busy="true">
            <Skeleton className="h-[184px] rounded-2xl" />
            <Skeleton className="h-[184px] rounded-2xl" />
          </div>
        ) : reports.length === 0 ? (
          <EmptyState
            icon={<FileSearch size={22} strokeWidth={2} />}
            title="No reports generated yet"
            description="Use Generate Report above to snapshot a citizen record, or open an investigation case and generate from there."
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={<FileSearch size={22} strokeWidth={2} />}
            title="No reports match this search"
            description="Clear the search box or switch the risk filter back to “All risk”."
          />
        ) : (
          <>
            <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-400">
              Saved reports · {visible.length} of {reports.length}
            </p>
            <AnimatePresence mode="popLayout">
              <motion.div layout className="flex flex-col gap-4">
                {visible.map((report, index) => (
                  <ReportCard key={report.id} report={report} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Export history */}
      {history.length > 0 && (
        <section className="mt-8">
          <Card className="p-5">
            <div className="flex items-center gap-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white">
                <History size={18} aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-semibold text-ink-900">Recent Downloads</h2>
                <p className="text-sm text-ink-500">
                  Export history for this browser — report, format and time, newest first
                </p>
              </div>
            </div>

            <ul className="mt-4 flex flex-col divide-y divide-ink-100">
              {history.slice(0, 12).map((entry) => (
                <li
                  key={entry.id}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2.5 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-medium text-ink-900">
                      <Download size={12} strokeWidth={2.25} aria-hidden="true" className="text-ink-400" />
                      <Link
                        to={`/reports/${entry.reportId}`}
                        className="rounded font-mono text-xs hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                      >
                        {entry.reportId}
                      </Link>
                      <span className="truncate text-xs text-ink-500">{entry.citizenName}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="accent">{entry.format}</Badge>
                    <span className="text-xs text-ink-400">{formatDateTime(entry.at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FolderSearch } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { CaseStatsPanel } from "@/components/investigations/CaseStatsPanel";
import { InvestigationCard } from "@/components/investigations/InvestigationCard";
import { useCaseStats, useInvestigations } from "@/lib/investigations/use-investigations";
import { CASE_STATUSES, type CaseStatus } from "@/lib/investigations/types";
import { cn } from "@/lib/cn";

type Filter = "All" | CaseStatus;

const filters: Filter[] = ["All", ...CASE_STATUSES];

/** Brief hold so the workspace resolves visibly rather than snapping in. */
const LOAD_DELAY_MS = 260;

export function InvestigationsPage() {
  const investigations = useInvestigations();
  const stats = useCaseStats();
  const [filter, setFilter] = useState<Filter>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), LOAD_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const visible = useMemo(() => {
    const sorted = [...investigations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return filter === "All" ? sorted : sorted.filter((c) => c.status === filter);
  }, [investigations, filter]);

  const countFor = (value: Filter) =>
    value === "All"
      ? investigations.length
      : investigations.filter((c) => c.status === value).length;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header>
        <h1 className="text-xl font-bold text-ink-900">Investigations</h1>
        <p className="mt-1 text-sm text-ink-500">
          Cases opened from citizen profiles. Stored in this browser only — no backend, no
          synchronisation.
        </p>
      </header>

      <div className="mt-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[104px] rounded-2xl" />
            ))}
          </div>
        ) : (
          <CaseStatsPanel stats={stats} />
        )}
      </div>

      {investigations.length > 0 && (
        <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Filter cases by status">
          {filters.map((value) => {
            const count = countFor(value);
            const active = filter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
                  active
                    ? "border-primary-300 bg-primary-50 text-primary-700"
                    : "border-ink-200 bg-surface text-ink-500 hover:border-ink-300 hover:text-ink-700",
                )}
              >
                {value}
                <span className={cn("ml-1.5 font-mono", active ? "text-primary-500" : "text-ink-400")}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <div className="flex flex-col gap-4" aria-busy="true">
            <Skeleton className="h-[188px] rounded-2xl" />
            <Skeleton className="h-[188px] rounded-2xl" />
          </div>
        ) : investigations.length === 0 ? (
          <EmptyState
            icon={<FolderSearch size={22} strokeWidth={2} />}
            title="No investigations yet"
            description="Open a citizen profile from Citizen Search and choose “Start Investigation” to create your first case."
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={<FolderSearch size={22} strokeWidth={2} />}
            title={`No cases with status “${filter}”`}
            description="Change the filter above to see other cases in the workspace."
          />
        ) : (
          <>
            <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-400">
              {filter === "All"
                ? `Recent cases · ${visible.length}`
                : `${visible.length} ${filter} case${visible.length === 1 ? "" : "s"}`}
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={filter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                {visible.map((investigation, index) => (
                  <InvestigationCard
                    key={investigation.id}
                    investigation={investigation}
                    index={index}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}

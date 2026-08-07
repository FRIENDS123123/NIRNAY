import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, ScanSearch, SearchX } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResultCard } from "@/components/search/SearchResultCard";
import { SearchResultSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { searchCitizens, identifierLabels, type SearchMode } from "@/mock-data/search";

/**
 * Correlation is instantaneous against the local synthetic dataset. The short
 * hold below exists so the resolution step is visible rather than instant —
 * it is a UI affordance, not a network call.
 */
const CORRELATION_DELAY_MS = 420;

export function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get("query") ?? "";
  const mode = (params.get("mode") as SearchMode | null) ?? "auto";

  // Start in the correlating state when the page loads with a query already in
  // the URL, otherwise the first paint flashes results before the effect runs.
  const [correlating, setCorrelating] = useState(() => Boolean(query.trim()));

  const results = useMemo(() => searchCitizens(query, mode), [query, mode]);

  useEffect(() => {
    if (!query.trim()) {
      setCorrelating(false);
      return;
    }
    setCorrelating(true);
    const timer = setTimeout(() => setCorrelating(false), CORRELATION_DELAY_MS);
    return () => clearTimeout(timer);
  }, [query, mode]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-xl font-bold text-ink-900">Citizen Search</h1>
      <p className="mt-1 text-sm text-ink-500">
        Search across every linked department by any known identifier.
      </p>

      <div className="mt-6">
        <SearchBar size="compact" initialQuery={query} initialMode={mode} autoFocus={false} />
      </div>

      <div className="mt-8">
        {!query.trim() ? (
          <EmptyState
            icon={<ScanSearch size={22} strokeWidth={2} />}
            title="Enter a search above"
            description="Search by name, Citizen ID, Aadhaar, PAN, passport, driving licence or phone number. Leave the mode on “All identifiers” to let NIRNAY detect the type for you."
          />
        ) : correlating ? (
          <div>
            <p className="mb-3 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-400">
              <Loader2 size={12} className="animate-spin" strokeWidth={2.5} aria-hidden="true" />
              Correlating synthetic department records…
            </p>
            <div className="flex flex-col gap-3" aria-busy="true" aria-live="polite">
              <SearchResultSkeleton />
              <SearchResultSkeleton />
            </div>
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            icon={<SearchX size={22} strokeWidth={2} />}
            title="No matching citizen found"
            description={`No synthetic record matches “${query}” ${
              mode === "auto" ? "on any identifier" : `on ${identifierLabels[mode]}`
            }. Check the spelling, or widen the search to “All identifiers”.`}
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${query}-${mode}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <p
                aria-live="polite"
                className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-400"
              >
                {results.length} candidate{results.length > 1 ? "s" : ""} resolved
              </p>
              <div className="flex flex-col gap-4">
                {results.map((result, i) => (
                  <SearchResultCard key={result.citizenId} result={result} index={i} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

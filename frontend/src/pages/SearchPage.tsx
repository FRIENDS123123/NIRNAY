import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchX } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResultCard } from "@/components/search/SearchResultCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { searchCitizens } from "@/mock-data/search";
import type { IdentifierType } from "@/mock-data/types";

export function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get("query") ?? "";
  const type = (params.get("type") as IdentifierType | null) ?? "name";

  const results = useMemo(() => searchCitizens(query, type), [query, type]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-xl font-bold text-ink-900">Citizen Search</h1>
      <p className="mt-1 text-sm text-ink-500">
        Search across every linked department by any known identifier.
      </p>

      <div className="mt-6">
        <SearchBar size="compact" initialQuery={query} initialType={type} />
      </div>

      <div className="mt-8">
        {query && results.length === 0 && (
          <EmptyState
            icon={<SearchX size={22} strokeWidth={2} />}
            title="No matching citizen found"
            description={`No synthetic records match "${query}" on ${type}. Try a different identifier or check the spelling.`}
          />
        )}

        {results.length > 0 && (
          <>
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-400">
              {results.length} candidate{results.length > 1 ? "s" : ""} found
            </p>
            <div className="flex flex-col gap-3">
              {results.map((result, i) => (
                <SearchResultCard key={result.citizenId} result={result} index={i} />
              ))}
            </div>
          </>
        )}

        {!query && (
          <EmptyState
            icon={<SearchX size={22} strokeWidth={2} />}
            title="Enter a search above"
            description="Search by name, Citizen ID, Aadhaar, PAN, passport, driving licence, or phone number."
          />
        )}
      </div>
    </div>
  );
}

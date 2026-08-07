import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { searchIdentifierOptions } from "@/mock-data/search";
import type { IdentifierType } from "@/mock-data/types";
import { cn } from "@/lib/cn";

interface SearchBarProps {
  size?: "hero" | "compact";
  initialQuery?: string;
  initialType?: IdentifierType;
}

export function SearchBar({ size = "hero", initialQuery = "", initialType = "name" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<IdentifierType>(initialType);
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?query=${encodeURIComponent(query.trim())}&type=${type}`);
  }

  const isHero = size === "hero";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border border-ink-200 bg-white px-4 shadow-[var(--shadow-hero)] transition-shadow focus-within:border-primary-300 focus-within:shadow-[0_0_0_4px_rgba(59,55,184,0.08)]",
          isHero ? "h-16 md:px-5" : "h-12",
        )}
      >
        <Search className="shrink-0 text-ink-400" size={isHero ? 22 : 18} strokeWidth={2.25} />
        <input
          autoFocus={isHero}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            isHero
              ? "Search by name, Aadhaar, PAN, passport, driving licence, or phone number…"
              : "Search citizens…"
          }
          className={cn(
            "min-w-0 flex-1 bg-transparent text-ink-900 placeholder:text-ink-400 focus:outline-none",
            isHero ? "text-base md:text-lg" : "text-sm",
          )}
        />
        <button
          type="submit"
          className={cn(
            "shrink-0 rounded-xl bg-primary-600 font-semibold text-white transition-colors hover:bg-primary-700",
            isHero ? "px-5 py-2.5 text-sm" : "px-3.5 py-1.5 text-xs",
          )}
        >
          Search
        </button>
      </div>

      <div className={cn("flex flex-wrap items-center gap-2", isHero ? "mt-4 justify-center" : "mt-2.5")}>
        {searchIdentifierOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setType(option.value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              type === option.value
                ? "border-primary-300 bg-primary-50 text-primary-700"
                : "border-ink-200 bg-white text-ink-500 hover:border-ink-300 hover:text-ink-700",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </form>
  );
}

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, CornerDownLeft, History, Search, Sparkles, Trash2, User } from "lucide-react";
import {
  buildSuggestions,
  detectIdentifierType,
  identifierLabels,
  searchIdentifierOptions,
  type SearchMode,
} from "@/mock-data/search";
import {
  addRecentSearch,
  clearRecentSearches,
  readRecentSearches,
  type RecentSearch,
} from "@/lib/recent-searches";
import { cn } from "@/lib/cn";

interface SearchBarProps {
  size?: "hero" | "compact";
  initialQuery?: string;
  initialMode?: SearchMode;
  /** Focus the input on mount — the home hero wants this, the search page does not. */
  autoFocus?: boolean;
}

type DropdownItem =
  | { kind: "suggestion"; citizenId: string; label: string; sublabel: string }
  | { kind: "recent"; query: string; mode: SearchMode };

export function SearchBar({
  size = "hero",
  initialQuery = "",
  initialMode = "auto",
  autoFocus,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [mode, setMode] = useState<SearchMode>(initialMode);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recents, setRecents] = useState<RecentSearch[]>([]);

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isHero = size === "hero";

  useEffect(() => setRecents(readRecentSearches()), []);

  // Keep the field in step when the page navigates to a new query.
  useEffect(() => setQuery(initialQuery), [initialQuery]);
  useEffect(() => setMode(initialMode), [initialMode]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpenDropdown(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const trimmed = query.trim();
  const suggestions = useMemo(
    () => (trimmed ? buildSuggestions(query, mode) : []),
    [query, trimmed, mode],
  );
  const detected = useMemo(
    () => (mode === "auto" && trimmed ? detectIdentifierType(query) : null),
    [mode, query, trimmed],
  );

  const items: DropdownItem[] = trimmed
    ? suggestions.map((s) => ({
        kind: "suggestion" as const,
        citizenId: s.citizenId,
        label: s.label,
        sublabel: s.sublabel,
      }))
    : recents.map((r) => ({ kind: "recent" as const, query: r.query, mode: r.mode }));

  useEffect(() => setActiveIndex(-1), [query, mode]);

  const runSearch = useCallback(
    (nextQuery: string, nextMode: SearchMode) => {
      const value = nextQuery.trim();
      if (!value) return;
      setRecents(addRecentSearch(value, nextMode));
      setOpenDropdown(false);
      inputRef.current?.blur();
      navigate(`/search?query=${encodeURIComponent(value)}&mode=${nextMode}`);
    },
    [navigate],
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    runSearch(query, mode);
  }

  function activate(item: DropdownItem) {
    if (item.kind === "suggestion") {
      setRecents(addRecentSearch(query, mode));
      setOpenDropdown(false);
      navigate(`/citizens/${item.citizenId}`);
    } else {
      setQuery(item.query);
      setMode(item.mode);
      runSearch(item.query, item.mode);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpenDropdown(false);
      setActiveIndex(-1);
      return;
    }
    if (!openDropdown || items.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % items.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      activate(items[activeIndex]);
    }
  }

  const showDropdown = openDropdown && items.length > 0;
  const listboxId = "citizen-search-listbox";

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} role="search" className="w-full">
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl border border-ink-200 bg-surface px-4 shadow-[var(--shadow-hero)] transition-all focus-within:border-primary-300 focus-within:shadow-[0_0_0_4px_rgba(59,55,184,0.08)]",
            isHero ? "h-16 md:px-5" : "h-12",
            showDropdown && "rounded-b-none border-b-transparent",
          )}
        >
          <Search
            className="shrink-0 text-ink-400"
            size={isHero ? 22 : 18}
            strokeWidth={2.25}
            aria-hidden="true"
          />

          <input
            ref={inputRef}
            autoFocus={autoFocus ?? isHero}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpenDropdown(true);
            }}
            onFocus={() => setOpenDropdown(true)}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
            aria-label="Search citizens by any identifier"
            placeholder={
              isHero
                ? "Search by name, Citizen ID, Aadhaar, PAN, passport, licence or phone…"
                : "Search citizens…"
            }
            className={cn(
              "min-w-0 flex-1 bg-transparent text-ink-900 placeholder:text-ink-400 focus:outline-none",
              isHero ? "text-base md:text-lg" : "text-sm",
            )}
          />

          {detected && (
            <span className="hidden shrink-0 items-center gap-1 rounded-md bg-accent-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-accent-700 sm:inline-flex">
              <Sparkles size={10} strokeWidth={2.5} />
              {identifierLabels[detected]}
            </span>
          )}

          <button
            type="submit"
            className={cn(
              "shrink-0 rounded-xl bg-primary-600 font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2",
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
              onClick={() => setMode(option.value)}
              aria-pressed={mode === option.value}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
                mode === option.value
                  ? "border-primary-300 bg-primary-50 text-primary-700"
                  : "border-ink-200 bg-surface text-ink-500 hover:border-ink-300 hover:text-ink-700",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </form>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.14 }}
            className="absolute inset-x-0 top-full z-40 -mt-px overflow-hidden rounded-b-2xl border border-ink-200 border-t-ink-100 bg-surface shadow-[var(--shadow-card-hover)]"
          >
            <ul id={listboxId} role="listbox" aria-label="Search suggestions" className="max-h-80 overflow-y-auto py-1.5">
              {!trimmed && (
                <li className="flex items-center justify-between gap-2 px-4 pb-1 pt-1.5">
                  <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-400">
                    <History size={11} strokeWidth={2.5} /> Recent searches
                  </span>
                  <button
                    type="button"
                    onClick={() => setRecents(clearRecentSearches())}
                    className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
                  >
                    <Trash2 size={11} strokeWidth={2.25} /> Clear
                  </button>
                </li>
              )}

              {items.map((item, index) => (
                <li key={item.kind === "suggestion" ? item.citizenId : `${item.query}-${item.mode}`}>
                  <button
                    type="button"
                    id={`${listboxId}-${index}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => activate(item)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                      index === activeIndex ? "bg-primary-50" : "hover:bg-canvas",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                        item.kind === "suggestion"
                          ? "bg-primary-100 text-primary-700"
                          : "bg-ink-100 text-ink-400",
                      )}
                    >
                      {item.kind === "suggestion" ? (
                        <User size={13} strokeWidth={2.25} />
                      ) : (
                        <Clock size={13} strokeWidth={2.25} />
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink-900">
                        {item.kind === "suggestion" ? item.label : item.query}
                      </span>
                      <span className="block truncate text-xs text-ink-500">
                        {item.kind === "suggestion"
                          ? item.sublabel
                          : item.mode === "auto"
                            ? "All identifiers"
                            : identifierLabels[item.mode]}
                      </span>
                    </span>

                    {index === activeIndex && (
                      <CornerDownLeft size={13} className="shrink-0 text-ink-300" strokeWidth={2.25} />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

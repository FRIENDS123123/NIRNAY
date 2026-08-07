// Recent searches persist in localStorage only. Nothing leaves the browser —
// there is no backend in this phase, and the queries themselves are synthetic.

import type { SearchMode } from "@/mock-data/search";

const STORAGE_KEY = "nirnay.recent-searches";
const MAX_ENTRIES = 6;

export interface RecentSearch {
  query: string;
  mode: SearchMode;
  at: number;
}

function isRecentSearch(value: unknown): value is RecentSearch {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Record<string, unknown>;
  return typeof entry.query === "string" && typeof entry.mode === "string" && typeof entry.at === "number";
}

export function readRecentSearches(): RecentSearch[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRecentSearch).slice(0, MAX_ENTRIES);
  } catch {
    // Private-mode / disabled storage — recents are a convenience, not a feature.
    return [];
  }
}

export function addRecentSearch(query: string, mode: SearchMode): RecentSearch[] {
  const trimmed = query.trim();
  if (!trimmed) return readRecentSearches();

  const next: RecentSearch[] = [
    { query: trimmed, mode, at: Date.now() },
    ...readRecentSearches().filter(
      (entry) => entry.query.toLowerCase() !== trimmed.toLowerCase() || entry.mode !== mode,
    ),
  ].slice(0, MAX_ENTRIES);

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore write failures; the in-memory list is still returned.
  }
  return next;
}

export function clearRecentSearches(): RecentSearch[] {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do — storage is unavailable.
  }
  return [];
}

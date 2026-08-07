import { citizens } from "./citizens";
import type {
  Citizen,
  IdentifierType,
  SearchResult,
  SearchSuggestion,
} from "./types";

/**
 * "auto" lets the officer paste any identifier without first choosing its
 * type — the resolution service decides which field it looks like. The seven
 * explicit modes narrow the search to a single field.
 */
export type SearchMode = "auto" | IdentifierType;

export const searchIdentifierOptions: { value: SearchMode; label: string }[] = [
  { value: "auto", label: "All identifiers" },
  { value: "name", label: "Name" },
  { value: "citizenId", label: "Citizen ID" },
  { value: "aadhaar", label: "Aadhaar" },
  { value: "pan", label: "PAN" },
  { value: "passport", label: "Passport" },
  { value: "drivingLicence", label: "Driving Licence" },
  { value: "phone", label: "Phone Number" },
];

export const identifierLabels: Record<IdentifierType, string> = {
  name: "Name",
  citizenId: "Citizen ID",
  aadhaar: "Aadhaar",
  pan: "PAN",
  passport: "Passport",
  drivingLicence: "Driving Licence",
  phone: "Phone Number",
};

const ALL_IDENTIFIERS: IdentifierType[] = [
  "name",
  "citizenId",
  "aadhaar",
  "pan",
  "passport",
  "drivingLicence",
  "phone",
];

/** Lowercase, strip whitespace and separators so masked values still match. */
function normalize(value: string): string {
  return value.toLowerCase().replace(/[\s\-/+]/g, "");
}

function fieldValue(citizen: Citizen, type: IdentifierType): string | undefined {
  switch (type) {
    case "citizenId":
      return citizen.citizenId;
    case "aadhaar":
      return citizen.identity.aadhaar;
    case "pan":
      return citizen.identity.pan;
    case "passport":
      return citizen.identity.passport;
    case "drivingLicence":
      return citizen.identity.drivingLicence;
    case "phone":
      return citizen.identity.phone;
    case "name":
      return citizen.identity.fullName;
  }
}

/**
 * Guesses which identifier a raw query looks like. Purely shape-based — it
 * never touches the dataset, so an unknown value still reports a best guess.
 */
export function detectIdentifierType(query: string): IdentifierType | null {
  const raw = query.trim();
  if (!raw) return null;
  const compact = normalize(raw);

  if (/^nir(cit)?[-a-z0-9]*$/.test(compact) && /\d/.test(compact)) return "citizenId";
  if (/^[a-z]{5}\d{4}[a-z]$/.test(compact)) return "pan";
  if (/^[a-z]\d{7}$/.test(compact)) return "passport";
  if (/^(91)?\d{10}$/.test(compact)) return "phone";
  if (/^\d{12}$/.test(compact)) return "aadhaar";
  if (/^[a-z]{2}\d{2}\d{6,}$/.test(compact)) return "drivingLicence";
  if (/^[a-z][a-z\s.']+$/i.test(raw)) return "name";
  return null;
}

/** Classic Levenshtein distance — small inputs only, so the O(n·m) fill is fine. */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    prev = curr;
  }
  return prev[b.length];
}

/** 0–1 similarity derived from edit distance. */
function similarity(a: string, b: string): number {
  const longest = Math.max(a.length, b.length);
  if (longest === 0) return 1;
  return 1 - levenshtein(a, b) / longest;
}

/**
 * Scores a query against one identifier value. Exact beats prefix beats
 * substring beats fuzzy, so a precise identifier always outranks a near-miss.
 */
function scoreValue(query: string, value: string): number {
  const q = normalize(query);
  const v = normalize(value);
  if (!q || !v) return 0;

  if (v === q) return 1;
  if (v.startsWith(q)) return 0.93;
  if (v.includes(q)) return 0.84;

  // Masked identifiers only expose their trailing digits — match on those too.
  const tail = v.replace(/^x+/, "");
  if (tail.length >= 3 && (tail === q || tail.startsWith(q))) return 0.88;

  const fuzzy = similarity(q, v);
  return fuzzy >= 0.72 ? fuzzy * 0.8 : 0;
}

/** Names match per token, so "deshmukh ananya" and a typo both still resolve. */
function scoreName(query: string, fullName: string): number {
  const queryTokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (queryTokens.length === 0) return 0;
  const nameTokens = fullName.toLowerCase().split(/\s+/);

  let total = 0;
  for (const qt of queryTokens) {
    let best = 0;
    for (const nt of nameTokens) {
      if (nt === qt) best = Math.max(best, 1);
      else if (nt.startsWith(qt)) best = Math.max(best, 0.95);
      else if (nt.includes(qt) && qt.length >= 3) best = Math.max(best, 0.82);
      else {
        const fuzzy = similarity(qt, nt);
        if (fuzzy >= 0.7) best = Math.max(best, fuzzy * 0.85);
      }
    }
    total += best;
  }

  const score = total / queryTokens.length;
  return normalize(query) === normalize(fullName) ? 1 : score;
}

function scoreIdentifier(citizen: Citizen, query: string, type: IdentifierType): number {
  const value = fieldValue(citizen, type);
  if (!value) return 0;
  return type === "name" ? scoreName(query, value) : scoreValue(query, value);
}

const MATCH_THRESHOLD = 0.55;

interface Match {
  citizen: Citizen;
  matchedOn: IdentifierType;
  matchedValue: string;
  score: number;
}

function findMatches(query: string, mode: SearchMode): Match[] {
  if (!query.trim()) return [];
  const fields = mode === "auto" ? ALL_IDENTIFIERS : [mode];
  const matches: Match[] = [];

  for (const citizen of citizens) {
    let best: Match | null = null;
    for (const type of fields) {
      const score = scoreIdentifier(citizen, query, type);
      if (score >= MATCH_THRESHOLD && (!best || score > best.score)) {
        best = {
          citizen,
          matchedOn: type,
          matchedValue: fieldValue(citizen, type) ?? "",
          score,
        };
      }
    }
    if (best) matches.push(best);
  }

  return matches.sort((a, b) => b.score - a.score);
}

/**
 * Client-side stand-in for the Citizen 360 Resolution Service's search
 * behaviour (see /docs/05_DATA_FLOW.md, step 1). No network, no backend —
 * every result is derived from the synthetic dataset in this folder.
 */
export function searchCitizens(query: string, mode: SearchMode = "auto"): SearchResult[] {
  return findMatches(query, mode).map(({ citizen, matchedOn, matchedValue, score }) => ({
    citizenId: citizen.citizenId,
    fullName: citizen.identity.fullName,
    photoInitials: citizen.identity.photoInitials,
    dateOfBirth: citizen.identity.dateOfBirth,
    primaryAddress: `${citizen.addressIntel.current.city}, ${citizen.addressIntel.current.state}`,
    quickSummary: citizen.quickSummary,
    linkedDepartments: citizen.linkedDepartments,
    departmentCorrelations: citizen.linkedDepartments.length,
    aiConfidence: citizen.aiSummary.metrics.aiConfidence,
    riskLevel: citizen.aiSummary.riskLevel,
    status: citizen.status,
    matchedOn,
    matchedValue,
    matchConfidence: Math.round(score * 100) / 100,
  }));
}

/** Compact typeahead entries for the search bar dropdown. */
export function buildSuggestions(
  query: string,
  mode: SearchMode = "auto",
  limit = 5,
): SearchSuggestion[] {
  return findMatches(query, mode)
    .slice(0, limit)
    .map(({ citizen, matchedOn, matchedValue }) => ({
      citizenId: citizen.citizenId,
      label: citizen.identity.fullName,
      sublabel:
        matchedOn === "name"
          ? `${citizen.citizenId} · ${citizen.addressIntel.current.city}`
          : `${identifierLabels[matchedOn]} · ${matchedValue}`,
      matchedOn,
    }));
}

import { citizens } from "./citizens";
import type { IdentifierType, SearchResult } from "./types";

export const searchIdentifierOptions: { value: IdentifierType; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "citizenId", label: "Citizen ID" },
  { value: "aadhaar", label: "Aadhaar" },
  { value: "pan", label: "PAN" },
  { value: "passport", label: "Passport" },
  { value: "drivingLicence", label: "Driving Licence" },
  { value: "phone", label: "Phone Number" },
];

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function fieldForIdentifier(citizen: (typeof citizens)[number], type: IdentifierType): string | undefined {
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
 * Client-side stand-in for the Citizen 360 Resolution Service's search
 * behavior (see /docs/05_DATA_FLOW.md, step 1). Ranks by match confidence;
 * name search matches on partial/token overlap, identifiers match on
 * normalized substring.
 */
export function searchCitizens(query: string, type: IdentifierType): SearchResult[] {
  const q = normalize(query);
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const citizen of citizens) {
    const field = fieldForIdentifier(citizen, type);
    if (!field) continue;
    const normalizedField = normalize(field);

    let confidence = 0;
    if (type === "name") {
      const queryTokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const nameTokens = citizen.identity.fullName.toLowerCase().split(/\s+/);
      const matchedTokens = queryTokens.filter((t) => nameTokens.some((n) => n.startsWith(t)));
      if (matchedTokens.length === 0) continue;
      confidence = matchedTokens.length / Math.max(queryTokens.length, 1);
      if (normalizedField === normalize(citizen.identity.fullName)) confidence = 1;
    } else {
      if (!normalizedField.includes(q)) continue;
      confidence = normalizedField === q ? 1 : 0.7;
    }

    results.push({
      citizenId: citizen.citizenId,
      fullName: citizen.identity.fullName,
      dateOfBirth: citizen.identity.dateOfBirth,
      address: `${citizen.address.city}, ${citizen.address.state}`,
      matchedOn: type,
      matchConfidence: Math.round(confidence * 100) / 100,
    });
  }

  return results.sort((a, b) => b.matchConfidence - a.matchConfidence);
}

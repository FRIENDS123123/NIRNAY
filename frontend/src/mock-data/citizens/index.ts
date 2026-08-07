// Aggregates the synthetic citizen records. Each record lives in its own file
// so the datasets stay reviewable; import paths are unchanged for consumers
// (`@/mock-data/citizens`).

import type { Citizen, Evidence } from "../types";
import { ananyaRaoDeshmukh } from "./nir-cit-100234";
import { vikramSinghChauhan } from "./nir-cit-104871";
import { rajeshDeshmukh } from "./nir-cit-100235";

export const citizens: Citizen[] = [
  ananyaRaoDeshmukh,
  vikramSinghChauhan,
  rajeshDeshmukh,
];

export function getCitizenById(citizenId: string): Citizen | undefined {
  return citizens.find((c) => c.citizenId === citizenId);
}

/** Resolves evidence IDs to records, dropping any that do not exist. */
export function resolveEvidence(citizen: Citizen, ids: string[]): Evidence[] {
  const byId = new Map(citizen.evidence.map((e) => [e.id, e]));
  return ids.map((id) => byId.get(id)).filter((e): e is Evidence => Boolean(e));
}

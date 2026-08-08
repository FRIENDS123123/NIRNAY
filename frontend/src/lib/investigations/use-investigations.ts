import { useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, subscribe } from "./store";
import { RESOLVED_STATUSES, type Investigation } from "./types";

/** Every stored case, newest first. Re-renders on any mutation. */
export function useInvestigations(): Investigation[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useInvestigation(id: string | undefined): Investigation | undefined {
  const investigations = useInvestigations();
  return id ? investigations.find((c) => c.id === id) : undefined;
}

/** Cases opened against one citizen — used by the profile action. */
export function useInvestigationsForCitizen(citizenId: string): Investigation[] {
  return useInvestigations().filter((c) => c.sourceCitizenId === citizenId);
}

export interface CaseStats {
  total: number;
  open: number;
  closed: number;
  highRisk: number;
  averageRisk: number;
}

/** Officer dashboard figures, derived from stored cases only. */
export function useCaseStats(): CaseStats {
  const investigations = useInvestigations();

  const total = investigations.length;
  const closed = investigations.filter((c) => RESOLVED_STATUSES.includes(c.status)).length;
  const open = total - closed;
  const highRisk = investigations.filter((c) => c.riskLevel === "High").length;
  const averageRisk =
    total === 0
      ? 0
      : Math.round(investigations.reduce((sum, c) => sum + c.riskScore, 0) / total);
  return { total, open, closed, highRisk, averageRisk };
}

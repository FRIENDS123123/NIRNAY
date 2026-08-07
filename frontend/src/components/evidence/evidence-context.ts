import { createContext, useContext } from "react";

export interface EvidenceRequest {
  /** What the officer clicked — shown as the drawer subtitle. */
  title: string;
  ids: string[];
}

export interface EvidenceContextValue {
  openEvidence: (request: EvidenceRequest) => void;
}

/**
 * Default is a no-op so evidence-aware components stay usable outside a
 * profile (search cards, for example) without throwing.
 */
const EvidenceContext = createContext<EvidenceContextValue>({
  openEvidence: () => {},
});

export const EvidenceContextProvider = EvidenceContext.Provider;

export function useEvidence(): EvidenceContextValue {
  return useContext(EvidenceContext);
}

import { useSyncExternalStore } from "react";
import { createLocalStore } from "@/lib/local-store";
import { currentOfficer } from "@/lib/investigations/officer";
import type { ExportFormat } from "@/lib/reports/types";

export type ThemePreference = "light" | "dark" | "system";

export interface NotificationPrefs {
  caseUpdates: boolean;
  highRiskAlerts: boolean;
  reviewQueue: boolean;
  weeklyDigest: boolean;
}

export interface ExportPrefs {
  defaultFormat: ExportFormat;
  includeEvidence: boolean;
  includeTimeline: boolean;
  includeReviewerNotes: boolean;
}

export interface Settings {
  officerName: string;
  officerId: string;
  department: string;
  theme: ThemePreference;
  notifications: NotificationPrefs;
  exports: ExportPrefs;
  demoMode: boolean;
  /** Controls the "synthetic data" chip in the top bar only. */
  showSyntheticBanner: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  officerName: currentOfficer.name,
  officerId: "NIR-OFF-4471",
  department: "Central Intelligence Coordination Unit",
  theme: "light",
  notifications: {
    caseUpdates: true,
    highRiskAlerts: true,
    reviewQueue: false,
    weeklyDigest: false,
  },
  exports: {
    defaultFormat: "PDF",
    includeEvidence: true,
    includeTimeline: true,
    includeReviewerNotes: true,
  },
  demoMode: true,
  showSyntheticBanner: true,
};

const isSettings = (value: unknown): value is Settings =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as Settings).officerName === "string" &&
  typeof (value as Settings).theme === "string";

const store = createLocalStore<Settings>("nirnay.settings", DEFAULT_SETTINGS, isSettings);

export const settingsStore = store;

export function useSettings(): Settings {
  const stored = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
  // Merge over defaults so a settings object saved by an older build still has
  // every key present.
  return { ...DEFAULT_SETTINGS, ...stored };
}

export function updateSettings(patch: Partial<Settings>) {
  store.update((current) => ({ ...DEFAULT_SETTINGS, ...current, ...patch }));
}

export function resetSettings() {
  store.reset();
}

export const DEPARTMENTS = [
  "Central Intelligence Coordination Unit",
  "Revenue Intelligence Directorate",
  "Transport Enforcement Wing",
  "Financial Crimes Unit",
  "Immigration & Border Intelligence",
  "Welfare Scheme Audit Cell",
];

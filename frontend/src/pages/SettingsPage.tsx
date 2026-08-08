import { useId, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  BadgeInfo,
  Bell,
  Building,
  ChevronDown,
  Database,
  Download,
  Monitor,
  Moon,
  Play,
  Sun,
  Trash2,
  UserRound,
} from "lucide-react";
import { citizens } from "@/mock-data/citizens";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Toggle } from "@/components/ui/Toggle";
import { RoleSelector } from "@/components/legal/RoleSelector";
import {
  DEPARTMENTS,
  resetSettings,
  updateSettings,
  useSettings,
  type ThemePreference,
} from "@/lib/settings/store";
import { EXPORT_FORMATS, type ExportFormat } from "@/lib/reports/types";
import { clearReports } from "@/lib/reports/store";
import { useGenerateReport } from "@/lib/reports/use-generate-report";
import { clearInvestigations, createInvestigation } from "@/lib/investigations/store";
import { resetVerification } from "@/lib/legal-records/store";
import { clearRecentSearches } from "@/lib/recent-searches";
import { roleStore } from "@/lib/roles/store";
import { cn } from "@/lib/cn";

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof UserRound;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white">
          <Icon size={18} aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-semibold text-ink-900">{title}</h2>
          <p className="text-sm text-ink-500">{description}</p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </Card>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className="min-w-0 flex-1 basis-56">
      <label
        htmlFor={id}
        className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-400"
      >
        {label}
      </label>
      <input
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 bg-surface px-3.5 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:border-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div className="min-w-0 flex-1 basis-56">
      <label
        htmlFor={id}
        className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-400"
      >
        {label}
      </label>
      <div className="relative mt-1.5">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-ink-200 bg-surface pl-3.5 pr-9 text-sm font-medium text-ink-900 focus-visible:border-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        >
          {children}
        </select>
        <ChevronDown
          size={15}
          strokeWidth={2.25}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400"
        />
      </div>
    </div>
  );
}

const themeOptions: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function SettingsPage() {
  const settings = useSettings();
  const generateReport = useGenerateReport();
  const [seeded, setSeeded] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  function seedDemoWorkspace() {
    // Opens a case for each synthetic citizen and files a report against the
    // highest-risk one, so a fresh browser has something to review.
    const created = citizens.map((citizen) => createInvestigation(citizen));
    const highRisk = citizens.find((c) => c.aiSummary.riskLevel === "High") ?? citizens[0];
    const linked = created.find((c) => c.sourceCitizenId === highRisk.citizenId) ?? null;
    generateReport(highRisk, linked);
    setSeeded(`Seeded ${created.length} investigations and 1 report.`);
    setTimeout(() => setSeeded(null), 4000);
  }

  function resetAll() {
    clearInvestigations();
    clearReports();
    resetVerification();
    clearRecentSearches();
    roleStore.reset();
    resetSettings();
    setConfirmReset(false);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <header>
        <h1 className="text-xl font-bold text-ink-900">Settings</h1>
        <p className="mt-1 text-sm text-ink-500">
          Preferences are stored in this browser. There is no account and no server —
          clearing browser storage resets everything.
        </p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-6 flex flex-col gap-5"
      >
        <Section
          icon={UserRound}
          title="Officer Profile"
          description="Attributed to cases, notes, reviews and generated reports"
        >
          <div className="flex flex-wrap gap-3">
            <TextField
              label="Officer name"
              value={settings.officerName}
              onChange={(officerName) => updateSettings({ officerName })}
              placeholder="Officer name"
            />
            <TextField
              label="Officer ID"
              value={settings.officerId}
              onChange={(officerId) => updateSettings({ officerId })}
              placeholder="NIR-OFF-0000"
            />
          </div>
        </Section>

        <Section
          icon={Building}
          title="Department & Role"
          description="Scopes report headers and which legal records are visible"
        >
          <div className="flex flex-wrap items-end gap-3">
            <SelectField
              label="Department"
              value={settings.department}
              onChange={(department) => updateSettings({ department })}
            >
              {DEPARTMENTS.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </SelectField>

            <div className="min-w-0 flex-1 basis-56">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-400">
                Active role
              </p>
              <div className="mt-1.5 flex h-11 items-center">
                <RoleSelector />
              </div>
            </div>
          </div>
        </Section>

        <Section
          icon={Sun}
          title="Theme"
          description="Applies immediately across every screen"
        >
          <div
            role="radiogroup"
            aria-label="Theme preference"
            className="flex flex-wrap gap-2"
          >
            {themeOptions.map(({ value, label, icon: Icon }) => {
              const active = settings.theme === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => updateSettings({ theme: value })}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
                    active
                      ? "border-primary-300 bg-primary-50 text-primary-700"
                      : "border-ink-200 bg-surface text-ink-600 hover:border-ink-300 hover:text-ink-900",
                  )}
                >
                  <Icon size={15} strokeWidth={2.25} aria-hidden="true" />
                  {label}
                </button>
              );
            })}
          </div>
        </Section>

        <Section
          icon={Bell}
          title="Notification Preferences"
          description="In-app preferences only — nothing is emailed or pushed in this phase"
        >
          <div className="divide-y divide-ink-100">
            <Toggle
              label="Case updates"
              description="Notify when an investigation's status changes."
              checked={settings.notifications.caseUpdates}
              onChange={(caseUpdates) =>
                updateSettings({ notifications: { ...settings.notifications, caseUpdates } })
              }
            />
            <Toggle
              label="High risk alerts"
              description="Notify when a citizen resolves at high risk."
              checked={settings.notifications.highRiskAlerts}
              onChange={(highRiskAlerts) =>
                updateSettings({ notifications: { ...settings.notifications, highRiskAlerts } })
              }
            />
            <Toggle
              label="Review queue"
              description="Notify when legal records are marked Needs Review."
              checked={settings.notifications.reviewQueue}
              onChange={(reviewQueue) =>
                updateSettings({ notifications: { ...settings.notifications, reviewQueue } })
              }
            />
            <Toggle
              label="Weekly digest"
              description="Summarise case and review activity once a week."
              checked={settings.notifications.weeklyDigest}
              onChange={(weeklyDigest) =>
                updateSettings({ notifications: { ...settings.notifications, weeklyDigest } })
              }
            />
          </div>
        </Section>

        <Section
          icon={Download}
          title="Export Preferences"
          description="Defaults applied when generating and downloading reports"
        >
          <SelectField
            label="Default export format"
            value={settings.exports.defaultFormat}
            onChange={(value) =>
              updateSettings({
                exports: { ...settings.exports, defaultFormat: value as ExportFormat },
              })
            }
          >
            {EXPORT_FORMATS.map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </SelectField>

          <div className="mt-3 divide-y divide-ink-100">
            <Toggle
              label="Include evidence references"
              description="Attach the full evidence table to exported reports."
              checked={settings.exports.includeEvidence}
              onChange={(includeEvidence) =>
                updateSettings({ exports: { ...settings.exports, includeEvidence } })
              }
            />
            <Toggle
              label="Include citizen timeline"
              description="Attach the chronological departmental record."
              checked={settings.exports.includeTimeline}
              onChange={(includeTimeline) =>
                updateSettings({ exports: { ...settings.exports, includeTimeline } })
              }
            />
            <Toggle
              label="Include reviewer notes"
              description="Attach verification decisions and reviewer commentary."
              checked={settings.exports.includeReviewerNotes}
              onChange={(includeReviewerNotes) =>
                updateSettings({ exports: { ...settings.exports, includeReviewerNotes } })
              }
            />
          </div>
        </Section>

        <Section
          icon={Play}
          title="Demo Mode"
          description="Helpers for demonstrating the platform from a clean browser"
        >
          <div className="divide-y divide-ink-100">
            <Toggle
              label="Demo mode"
              description="Enables the workspace seeding action below."
              checked={settings.demoMode}
              onChange={(demoMode) => updateSettings({ demoMode })}
            />
            <Toggle
              label="Show synthetic data banner"
              description="Controls the SYNTHETIC DATA chip in the top bar. Exported reports always carry the notice regardless of this setting."
              checked={settings.showSyntheticBanner}
              onChange={(showSyntheticBanner) => updateSettings({ showSyntheticBanner })}
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={seedDemoWorkspace}
              disabled={!settings.demoMode}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
            >
              <Play size={14} strokeWidth={2.5} aria-hidden="true" />
              Seed demo workspace
            </button>
            {seeded && <span className="text-xs font-medium text-success-700">{seeded}</span>}
          </div>
        </Section>

        <Section
          icon={Database}
          title="Data Source"
          description="What this build is running on"
        >
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-warning-100 bg-warning-50 p-3.5">
            <Badge variant="warning">Synthetic corpus</Badge>
            <p className="min-w-0 flex-1 text-xs leading-relaxed text-warning-700">
              Every citizen, department, document and reference number in this build is
              fabricated demonstration data. There is no connection to any real government
              system, and no live data source can be selected in this phase.
            </p>
          </div>
        </Section>

        <Section
          icon={Trash2}
          title="Local Data"
          description="Everything NIRNAY stores lives in this browser"
        >
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => clearRecentSearches()}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-ink-200 bg-surface px-3.5 text-sm font-medium text-ink-700 transition-colors hover:border-ink-300 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            >
              Clear recent searches
            </button>
            <button
              type="button"
              onClick={() => clearReports()}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-ink-200 bg-surface px-3.5 text-sm font-medium text-ink-700 transition-colors hover:border-ink-300 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            >
              Clear saved reports
            </button>
            <button
              type="button"
              onClick={() => resetVerification()}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-ink-200 bg-surface px-3.5 text-sm font-medium text-ink-700 transition-colors hover:border-ink-300 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            >
              Reset verification decisions
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-3">
            {confirmReset ? (
              <>
                <span className="text-sm font-medium text-danger-700">
                  Erase all investigations, reports, reviews and preferences?
                </span>
                <button
                  type="button"
                  onClick={resetAll}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-danger-600 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-danger-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500"
                >
                  Yes, reset everything
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="inline-flex h-9 items-center rounded-xl px-3 text-xs font-medium text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-danger-100 bg-danger-50 px-3.5 text-sm font-semibold text-danger-700 transition-colors hover:border-danger-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500"
              >
                <Trash2 size={14} strokeWidth={2.25} aria-hidden="true" />
                Reset all local data
              </button>
            )}
          </div>
        </Section>

        <Section
          icon={BadgeInfo}
          title="About NIRNAY"
          description="AI Unified Citizen Intelligence Platform"
        >
          <dl className="grid gap-x-8 sm:grid-cols-2">
            {[
              ["Build", "Phase 5 — Reports & Settings"],
              ["Frontend", "React 19 · TypeScript · Vite · Tailwind v4"],
              ["Motion", "Framer Motion"],
              ["Persistence", "Browser localStorage only"],
              ["Backend", "None — no API, no database, no authentication"],
              ["AI", "Authored demo synthesis, not a live model"],
              ["Data", "Fully synthetic corpus"],
              ["Licence", "MIT"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-start justify-between gap-4 border-b border-ink-100/70 py-2 text-sm last:border-b-0"
              >
                <dt className="shrink-0 text-ink-500">{label}</dt>
                <dd className="text-right font-medium text-ink-900">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-ink-500">
            Design philosophy: Search First. Intelligence Second. Everything Else Last. See
            the repository documentation for architecture and data-model detail.
          </p>
        </Section>
      </motion.div>
    </div>
  );
}

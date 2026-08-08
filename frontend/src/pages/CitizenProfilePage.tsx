import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, UserX } from "lucide-react";
import { getCitizenById } from "@/mock-data/citizens";
import { EvidenceProvider } from "@/components/evidence/EvidenceProvider";
import { ProfileHeader } from "@/components/citizen/ProfileHeader";
import { AISummaryPanel } from "@/components/citizen/AISummaryPanel";
import { ProfileSections } from "@/components/citizen/ProfileSections";
import { StartInvestigationButton } from "@/components/citizen/StartInvestigationButton";
import { LegalRecordsPanel } from "@/components/legal/LegalRecordsPanel";
import { CitizenPortalView } from "@/components/citizen/CitizenPortalView";
import { useActiveRole } from "@/lib/roles/store";
import { CitizenTimeline } from "@/components/citizen/CitizenTimeline";
import { ProfileSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

/** Visible hold while the profile assembles — a UI affordance, not a fetch. */
const CORRELATION_DELAY_MS = 380;

export function CitizenProfilePage() {
  const { citizenId } = useParams<{ citizenId: string }>();
  const citizen = citizenId ? getCitizenById(citizenId) : undefined;
  const role = useActiveRole();

  // Investigator and Administrator keep the full officer view unchanged.
  const officerView = role === "Investigator" || role === "Administrator" || role === "Reviewer";
  // Reviewers work the verification queue first, so it leads the page.
  const reviewFirst = role === "Reviewer" || role === "Hospital" || role === "Authority";

  const [correlating, setCorrelating] = useState(true);

  useEffect(() => {
    setCorrelating(true);
    window.scrollTo({ top: 0 });
    const timer = setTimeout(() => setCorrelating(false), CORRELATION_DELAY_MS);
    return () => clearTimeout(timer);
  }, [citizenId]);

  if (!citizen) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <EmptyState
          icon={<UserX size={22} strokeWidth={2} />}
          title="Citizen record not found"
          description={`No synthetic citizen matches ID “${citizenId}”. Return to search and try again.`}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/search"
          className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-ink-500 transition-colors hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        >
          <ArrowLeft size={15} aria-hidden="true" /> Back to search
        </Link>

        {/* A citizen cannot open an investigation into themselves. */}
        {!correlating && role !== "Citizen" && <StartInvestigationButton citizen={citizen} />}
      </div>

      {correlating ? (
        <>
          <p className="mb-4 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-400">
            <Loader2 size={12} className="animate-spin" strokeWidth={2.5} aria-hidden="true" />
            Building unified citizen profile…
          </p>
          <div aria-busy="true" aria-live="polite">
            <ProfileSkeleton />
          </div>
        </>
      ) : (
        <EvidenceProvider evidence={citizen.evidence}>
          {role === "Citizen" ? (
            <CitizenPortalView citizen={citizen} />
          ) : (
            <div className="flex flex-col gap-6">
              <ProfileHeader citizen={citizen} />

              {/* Hospital and Authority are verification-facing roles: they see
                  the records they are entitled to, not the investigation. */}
              {officerView && <AISummaryPanel citizen={citizen} />}

              {reviewFirst && <LegalRecordsPanel citizen={citizen} />}

              {role === "Hospital" ? (
                <p className="rounded-2xl border border-ink-100 bg-surface p-5 text-sm leading-relaxed text-ink-500 shadow-[var(--shadow-card)]">
                  Viewing as <span className="font-semibold text-ink-900">Hospital</span> —
                  scoped to medical, ABHA, health and insurance records only. Switch role in
                  the top bar to see the full profile.
                </p>
              ) : (
                <ProfileSections citizen={citizen} />
              )}

              {/* Investigator and Administrator keep the original ordering. */}
              {!reviewFirst && <LegalRecordsPanel citizen={citizen} />}

              {role !== "Hospital" && <CitizenTimeline citizen={citizen} />}
            </div>
          )}
        </EvidenceProvider>
      )}
    </div>
  );
}

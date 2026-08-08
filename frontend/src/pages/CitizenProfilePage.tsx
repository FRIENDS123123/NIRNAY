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
import { CitizenTimeline } from "@/components/citizen/CitizenTimeline";
import { ProfileSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

/** Visible hold while the profile assembles — a UI affordance, not a fetch. */
const CORRELATION_DELAY_MS = 380;

export function CitizenProfilePage() {
  const { citizenId } = useParams<{ citizenId: string }>();
  const citizen = citizenId ? getCitizenById(citizenId) : undefined;

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

        {!correlating && <StartInvestigationButton citizen={citizen} />}
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
          <div className="flex flex-col gap-6">
            <ProfileHeader citizen={citizen} />
            <AISummaryPanel citizen={citizen} />
            <ProfileSections citizen={citizen} />
            <LegalRecordsPanel citizen={citizen} />
            <CitizenTimeline citizen={citizen} />
          </div>
        </EvidenceProvider>
      )}
    </div>
  );
}

import { useParams, Link } from "react-router-dom";
import { ArrowLeft, UserX } from "lucide-react";
import { getCitizenById } from "@/mock-data/citizens";
import { ProfileHeader } from "@/components/citizen/ProfileHeader";
import { AISummaryPanel } from "@/components/citizen/AISummaryPanel";
import { ProfileSections } from "@/components/citizen/ProfileSections";
import { EmptyState } from "@/components/ui/EmptyState";

export function CitizenProfilePage() {
  const { citizenId } = useParams<{ citizenId: string }>();
  const citizen = citizenId ? getCitizenById(citizenId) : undefined;

  if (!citizen) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <EmptyState
          icon={<UserX size={22} strokeWidth={2} />}
          title="Citizen record not found"
          description={`No synthetic citizen matches ID "${citizenId}". Return to search and try again.`}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <Link to="/search" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900">
        <ArrowLeft size={15} /> Back to search
      </Link>

      <div className="flex flex-col gap-6">
        <ProfileHeader citizen={citizen} />
        <AISummaryPanel citizen={citizen} />
        <ProfileSections citizen={citizen} />
      </div>
    </div>
  );
}

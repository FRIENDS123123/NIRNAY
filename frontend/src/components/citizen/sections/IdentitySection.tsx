import { Fingerprint } from "lucide-react";
import type { Citizen } from "@/mock-data/types";
import { ExpandableCard } from "@/components/ui/ExpandableCard";
import { DataRow } from "@/components/ui/DataRow";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/format";

export function IdentitySection({ citizen }: { citizen: Citizen }) {
  const { identity } = citizen;

  const rows: { label: string; value?: string; mono?: boolean }[] = [
    { label: "Full name", value: identity.fullName },
    { label: "Citizen ID", value: citizen.citizenId, mono: true },
    { label: "Aadhaar", value: identity.aadhaar, mono: true },
    { label: "PAN", value: identity.pan, mono: true },
    { label: "Passport", value: identity.passport, mono: true },
    { label: "Driving licence", value: identity.drivingLicence, mono: true },
    { label: "Voter ID", value: identity.voterId, mono: true },
    { label: "Ration card", value: identity.rationCard, mono: true },
    { label: "ABHA ID", value: identity.abhaId, mono: true },
    { label: "Date of birth", value: formatDate(identity.dateOfBirth) },
    { label: "Gender", value: identity.gender },
    { label: "Phone", value: identity.phone },
    { label: "Email", value: identity.email },
  ];

  const populated = rows.filter((row) => Boolean(row.value));

  return (
    <ExpandableCard
      icon={<Fingerprint size={18} aria-hidden="true" />}
      title="Identity"
      summary="Aadhaar, PAN, passport, voter, ration and health identifiers"
      count={populated.length}
      meta={<Badge variant="success">Verified</Badge>}
      defaultOpen
    >
      <div className="grid gap-x-8 sm:grid-cols-2">
        {populated.map((row) => (
          <DataRow
            key={row.label}
            label={row.label}
            value={row.value}
            mono={row.mono}
            copyValue={row.value}
          />
        ))}
      </div>
      {!identity.passport && (
        <p className="mt-3 text-xs italic text-ink-400">
          No passport is held by this citizen.
        </p>
      )}
    </ExpandableCard>
  );
}

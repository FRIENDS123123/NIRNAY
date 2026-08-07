import { Link } from "react-router-dom";
import { ArrowUpRight, PhoneCall, Users } from "lucide-react";
import type { Citizen, FamilyMember, FamilyRelation } from "@/mock-data/types";
import { ExpandableCard } from "@/components/ui/ExpandableCard";
import { VerificationChip } from "@/components/ui/VerificationChip";
import { RecordItem, RecordList, SubHeading, NoRecords } from "./primitives";
import { RelationshipGraph } from "./RelationshipGraph";

const groups: { label: string; relations: FamilyRelation[] }[] = [
  { label: "Father", relations: ["Father"] },
  { label: "Mother", relations: ["Mother"] },
  { label: "Spouse", relations: ["Spouse"] },
  { label: "Children", relations: ["Son", "Daughter"] },
];

function MemberRow({ member }: { member: FamilyMember }) {
  return (
    <RecordItem
      title={member.name}
      subtitle={`${member.relation} · ${member.age} yrs · ${member.occupation}`}
      meta={
        <>
          <VerificationChip status={member.verification} />
          {member.linkedCitizenId && (
            <Link
              to={`/citizens/${member.linkedCitizenId}`}
              className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 transition-colors hover:border-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            >
              View profile <ArrowUpRight size={12} strokeWidth={2.5} aria-hidden="true" />
            </Link>
          )}
        </>
      }
    />
  );
}

export function FamilySection({ citizen }: { citizen: Citizen }) {
  const { family } = citizen;

  return (
    <ExpandableCard
      icon={<Users size={18} aria-hidden="true" />}
      title="Family Intelligence"
      summary={`Household ${family.householdId}`}
      count={family.members.length}
    >
      <div className="flex flex-col gap-5">
        {groups.map((group) => {
          const members = family.members.filter((m) => group.relations.includes(m.relation));
          return (
            <div key={group.label}>
              <SubHeading className="mb-1.5">{group.label}</SubHeading>
              {members.length === 0 ? (
                <NoRecords>No {group.label.toLowerCase()} record on file.</NoRecords>
              ) : (
                <RecordList>
                  {members.map((member) => (
                    <MemberRow key={member.id} member={member} />
                  ))}
                </RecordList>
              )}
            </div>
          );
        })}

        <div>
          <SubHeading className="mb-1.5">Emergency contact</SubHeading>
          <div className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-canvas/60 px-3.5 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-700">
              <PhoneCall size={14} strokeWidth={2.25} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-medium text-ink-900">{family.emergencyContact.name}</p>
              <p className="text-xs text-ink-500">
                {family.emergencyContact.relation} · {family.emergencyContact.phone}
              </p>
            </div>
          </div>
        </div>

        <div>
          <SubHeading className="mb-1.5">Relationship graph preview</SubHeading>
          <RelationshipGraph
            centerInitials={citizen.identity.photoInitials}
            centerName={citizen.identity.fullName}
            members={family.members}
          />
        </div>
      </div>
    </ExpandableCard>
  );
}

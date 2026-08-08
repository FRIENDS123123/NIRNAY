import { useMemo } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Cake, Info, MapPin, Phone, ShieldCheck } from "lucide-react";
import type { Citizen } from "@/mock-data/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
import { ReviewStatusBadge } from "@/components/legal/ReviewStatusBadge";
import { REVIEW_STATUSES } from "@/lib/legal-records/types";
import {
  countByStatus,
  scopeRecordsToRole,
  useResolvedLegalRecords,
} from "@/lib/legal-records/use-legal-records";
import { formatDate } from "@/lib/format";
import { IdentitySection } from "./sections/IdentitySection";
import { FamilySection } from "./sections/FamilySection";
import { AddressSection } from "./sections/AddressSection";
import { EmploymentSection } from "./sections/EmploymentSection";
import { BenefitsSection } from "./sections/BenefitsSection";
import { DocumentsSection } from "./sections/DocumentsSection";
import { CivicSections } from "./sections/CivicSections";
import { CitizenTimeline } from "./CitizenTimeline";
import { DownloadMyReportCard } from "./DownloadMyReportCard";

/**
 * The citizen's own portal view. Everything officer-internal — the AI
 * investigation summary, risk scoring, recommendations, evidence citations,
 * reviewer notes and case material — is absent by construction: this view
 * simply never renders those components.
 */
export function CitizenPortalView({ citizen }: { citizen: Citizen }) {
  const allRecords = useResolvedLegalRecords(citizen);

  // Only the categories a citizen is entitled to see.
  const records = useMemo(() => scopeRecordsToRole(allRecords, "Citizen"), [allRecords]);
  const counts = useMemo(() => countByStatus(records), [records]);
  const verifiedAll = records.length > 0 && counts.Verified === records.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      {/* Personal header */}
      <Card className="p-6">
        <div className="flex flex-wrap items-start gap-5">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-2xl font-bold text-white">
            {citizen.identity.photoInitials}
          </span>

          <div className="min-w-0 flex-1 basis-64">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-600">
              Your citizen profile
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-ink-900">{citizen.identity.fullName}</h1>
              {verifiedAll ? (
                <Badge variant="success">
                  <BadgeCheck size={12} strokeWidth={2.5} aria-hidden="true" />
                  Verified citizen
                </Badge>
              ) : (
                <Badge variant="warning">
                  {counts["Needs Review"] + counts.Draft + counts.Rejected} record
                  {counts["Needs Review"] + counts.Draft + counts.Rejected === 1 ? "" : "s"} pending
                </Badge>
              )}
            </div>

            <p className="mt-0.5 flex items-center gap-1 font-mono text-xs text-ink-400">
              {citizen.citizenId}
              <CopyButton value={citizen.citizenId} label="Citizen ID" />
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink-500">
              <span className="flex items-center gap-1.5">
                <Cake size={14} aria-hidden="true" /> {formatDate(citizen.identity.dateOfBirth)}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={14} aria-hidden="true" /> {citizen.identity.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} aria-hidden="true" /> {citizen.addressIntel.current.city},{" "}
                {citizen.addressIntel.current.state}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 flex items-start gap-2 rounded-xl border border-ink-100 bg-canvas/60 p-3 text-xs leading-relaxed text-ink-500">
          <Info size={13} strokeWidth={2.25} aria-hidden="true" className="mt-0.5 shrink-0" />
          You are viewing NIRNAY as a citizen. Investigation material, risk assessment and
          officer notes are not part of this view. Switch role in the top bar to see the
          officer experience.
        </p>
      </Card>

      <DownloadMyReportCard citizen={citizen} />

      {/* Verification status — read only for the citizen */}
      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white">
              <ShieldCheck size={18} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-semibold text-ink-900">Verification Status</h2>
              <p className="text-sm text-ink-500">
                How each of your records currently stands with the issuing department
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {REVIEW_STATUSES.filter((status) => counts[status] > 0).map((status) => (
              <span key={status} className="flex items-center gap-1">
                <ReviewStatusBadge status={status} />
                <span className="font-mono text-xs font-semibold text-ink-500">
                  {counts[status]}
                </span>
              </span>
            ))}
          </div>
        </div>

        {records.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-ink-200 px-6 py-8 text-center text-sm text-ink-500">
            No records are currently held against your Citizen ID.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col divide-y divide-ink-100">
            {records.map((record) => (
              <li
                key={record.id}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2.5 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1 basis-56">
                  <p className="text-sm font-medium text-ink-900">{record.title}</p>
                  <p className="font-mono text-[11px] text-ink-400">
                    {record.department} · {record.reference}
                  </p>
                </div>
                <ReviewStatusBadge status={record.status} />
              </li>
            ))}
          </ul>
        )}

        <p className="mt-3 border-t border-ink-100 pt-3 text-xs text-ink-400">
          To contest a status, contact the issuing department shown against the record.
        </p>
      </Card>

      {/* The citizen's own records */}
      <div className="flex flex-col gap-3">
        <IdentitySection citizen={citizen} />
        <FamilySection citizen={citizen} />
        <AddressSection citizen={citizen} />
        <EmploymentSection citizen={citizen} />
        <BenefitsSection citizen={citizen} />
        <DocumentsSection citizen={citizen} />
        <CivicSections citizen={citizen} />
      </div>

      <CitizenTimeline citizen={citizen} showEvidence={false} />
    </motion.div>
  );
}

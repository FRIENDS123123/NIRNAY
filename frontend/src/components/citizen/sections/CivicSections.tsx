import {
  FolderLock,
  GraduationCap,
  Plug,
  ScrollText,
  ShieldCheck,
  Smartphone,
  Vote,
} from "lucide-react";
import type { Citizen } from "@/mock-data/types";
import { ExpandableCard } from "@/components/ui/ExpandableCard";
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
import { formatDate } from "@/lib/format";
import { NoRecords, RecordItem, RecordList } from "./primitives";

/**
 * Everyday civic records. These are the parts of a profile a citizen would
 * recognise from their own government portal, so they render in the same
 * expandable-card language as the intelligence domains above them.
 */
export function CivicSections({ citizen }: { citizen: Citizen }) {
  const { civic } = citizen;
  const activeTelecom = civic.telecom.filter((t) => t.status === "Active").length;
  const activeUtilities = civic.utilities.filter((u) => u.status === "Active").length;
  const votes = civic.elections.filter((e) => e.participated).length;
  const clearance = civic.criminalClearance;

  const clearanceVariant =
    clearance.result === "No Adverse Record"
      ? "success"
      : clearance.result === "Pending"
        ? "warning"
        : "danger";

  return (
    <>
      <ExpandableCard
        icon={<GraduationCap size={18} aria-hidden="true" />}
        title="Education"
        summary="Qualifications and issuing boards"
        count={civic.education.length}
      >
        {civic.education.length === 0 ? (
          <NoRecords>No education record on file.</NoRecords>
        ) : (
          <RecordList>
            {civic.education.map((record) => (
              <RecordItem
                key={record.id}
                title={record.qualification}
                subtitle={`${record.institution} · ${record.board} · ${record.year}`}
                meta={
                  <Badge variant={record.status === "Verified" ? "success" : "warning"}>
                    {record.status}
                  </Badge>
                }
              />
            ))}
          </RecordList>
        )}
      </ExpandableCard>

      <ExpandableCard
        icon={<Smartphone size={18} aria-hidden="true" />}
        title="Telecom Connections"
        summary="Mobile and broadband connections linked to this identity"
        count={civic.telecom.length}
        meta={<Badge variant="neutral">{activeTelecom} active</Badge>}
      >
        {civic.telecom.length === 0 ? (
          <NoRecords>No telecom connection on file.</NoRecords>
        ) : (
          <RecordList>
            {civic.telecom.map((record) => (
              <RecordItem
                key={record.id}
                title={record.operator}
                subtitle={
                  <>
                    <span className="font-mono">{record.maskedNumber}</span> · {record.type} ·
                    active since {formatDate(record.activeSince)}
                  </>
                }
                meta={
                  <Badge variant={record.status === "Active" ? "success" : "neutral"}>
                    {record.status}
                  </Badge>
                }
              />
            ))}
          </RecordList>
        )}
      </ExpandableCard>

      <ExpandableCard
        icon={<Plug size={18} aria-hidden="true" />}
        title="Utility Connections"
        summary="Electricity, water, gas and municipal tax accounts"
        count={civic.utilities.length}
        meta={<Badge variant="neutral">{activeUtilities} active</Badge>}
      >
        {civic.utilities.length === 0 ? (
          <NoRecords>No utility connection on file.</NoRecords>
        ) : (
          <RecordList>
            {civic.utilities.map((record) => (
              <RecordItem
                key={record.id}
                title={`${record.utility} — ${record.provider}`}
                subtitle={
                  <>
                    <span className="font-mono">{record.consumerNumber}</span> · {record.address}
                  </>
                }
                meta={
                  <Badge variant={record.status === "Active" ? "success" : "neutral"}>
                    {record.status}
                  </Badge>
                }
              />
            ))}
          </RecordList>
        )}
      </ExpandableCard>

      <ExpandableCard
        icon={<FolderLock size={18} aria-hidden="true" />}
        title="Digital Locker"
        summary="Documents issued directly to the citizen's locker"
        count={civic.digitalLocker.length}
      >
        {civic.digitalLocker.length === 0 ? (
          <NoRecords>No document issued to the digital locker.</NoRecords>
        ) : (
          <RecordList>
            {civic.digitalLocker.map((record) => (
              <RecordItem
                key={record.id}
                title={record.document}
                subtitle={`${record.issuer} · issued ${formatDate(record.issuedOn)}`}
                meta={
                  <>
                    <Badge variant="accent">{record.format}</Badge>
                    <CopyButton value={record.document} label="document name" />
                  </>
                }
              />
            ))}
          </RecordList>
        )}
      </ExpandableCard>

      <ExpandableCard
        icon={<Vote size={18} aria-hidden="true" />}
        title="Election Participation"
        summary="Recorded turnout against the citizen's electoral roll entry"
        count={civic.elections.length}
        meta={<Badge variant="neutral">{votes} voted</Badge>}
      >
        {civic.elections.length === 0 ? (
          <NoRecords>No election record on file.</NoRecords>
        ) : (
          <RecordList>
            {civic.elections.map((record) => (
              <RecordItem
                key={record.id}
                title={`${record.election} ${record.year}`}
                subtitle={record.constituency}
                meta={
                  <Badge variant={record.participated ? "success" : "neutral"}>
                    {record.participated ? "Voted" : "Did not vote"}
                  </Badge>
                }
              />
            ))}
          </RecordList>
        )}
      </ExpandableCard>

      <ExpandableCard
        icon={<ShieldCheck size={18} aria-hidden="true" />}
        title="Criminal Clearance"
        summary="Police clearance certificate status"
        meta={<Badge variant={clearanceVariant}>{clearance.result}</Badge>}
      >
        <div className="rounded-xl border border-ink-100 bg-canvas/50 p-3.5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-ink-900">
                <ScrollText size={13} strokeWidth={2.25} aria-hidden="true" className="text-ink-400" />
                {clearance.certificateNumber}
              </p>
              <p className="mt-0.5 text-xs text-ink-500">{clearance.issuingAuthority}</p>
            </div>
            <Badge variant={clearanceVariant}>{clearance.result}</Badge>
          </div>
          <p className="mt-2.5 border-t border-ink-100 pt-2.5 text-xs leading-relaxed text-ink-600">
            {clearance.remarks}
          </p>
          <p className="mt-1.5 font-mono text-[11px] text-ink-400">
            Issued {formatDate(clearance.issuedOn)} · valid to {formatDate(clearance.validTill)}
          </p>
        </div>
      </ExpandableCard>
    </>
  );
}

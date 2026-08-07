import { MapPinned } from "lucide-react";
import type { AddressRecord, Citizen } from "@/mock-data/types";
import { ExpandableCard } from "@/components/ui/ExpandableCard";
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
import { formatDate, formatDateRange, formatPercent } from "@/lib/format";
import { ConfidenceBar, MiniTimeline, NoRecords, SubHeading } from "./primitives";

function fullAddress(record: AddressRecord): string {
  return `${record.line}, ${record.city}, ${record.state} — ${record.pincode}`;
}

function AddressBlock({ record }: { record: AddressRecord }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-canvas/50 p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium leading-relaxed text-ink-900">{record.line}</p>
          <p className="text-sm text-ink-600">
            {record.city}, {record.state} — <span className="font-mono">{record.pincode}</span>
          </p>
        </div>
        <CopyButton value={fullAddress(record)} label={`${record.type} address`} />
      </div>
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-ink-100 pt-2.5">
        <p className="text-xs text-ink-500">
          {record.toDate ? formatDateRange(record.fromDate, record.toDate) : `Since ${formatDate(record.fromDate)}`}
          <span className="ml-2 text-ink-400">· {record.source}</span>
        </p>
        <ConfidenceBar value={record.geoConfidence} label="Geo" />
      </div>
    </div>
  );
}

export function AddressSection({ citizen }: { citizen: Citizen }) {
  const { addressIntel } = citizen;
  const residences = [addressIntel.current, ...addressIntel.historical];

  return (
    <ExpandableCard
      icon={<MapPinned size={18} aria-hidden="true" />}
      title="Address Intelligence"
      summary={`${addressIntel.current.city}, ${addressIntel.current.state}`}
      count={2 + addressIntel.historical.length}
      meta={<Badge variant="accent">Geo {formatPercent(addressIntel.geoConfidence)}</Badge>}
    >
      <div className="flex flex-col gap-5">
        <div>
          <SubHeading className="mb-1.5">Current address</SubHeading>
          <AddressBlock record={addressIntel.current} />
        </div>

        <div>
          <SubHeading className="mb-1.5">Permanent address</SubHeading>
          <AddressBlock record={addressIntel.permanent} />
        </div>

        <div>
          <SubHeading className="mb-1.5">Historical addresses</SubHeading>
          {addressIntel.historical.length === 0 ? (
            <NoRecords>No previous addresses on file.</NoRecords>
          ) : (
            <div className="flex flex-col gap-2.5">
              {addressIntel.historical.map((record) => (
                <AddressBlock key={record.id} record={record} />
              ))}
            </div>
          )}
        </div>

        <div>
          <SubHeading className="mb-2">Residence timeline</SubHeading>
          <MiniTimeline
            events={[...residences]
              .sort((a, b) => b.fromDate.localeCompare(a.fromDate))
              .map((record) => ({
                date: record.toDate
                  ? `${record.fromDate.slice(0, 4)}–${record.toDate.slice(0, 4)}`
                  : `${record.fromDate.slice(0, 4)}–present`,
                title: `${record.city}, ${record.state}`,
                detail: record.line,
              }))}
          />
        </div>
      </div>
    </ExpandableCard>
  );
}

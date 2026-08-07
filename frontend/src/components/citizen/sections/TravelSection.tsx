import { Plane, PlaneLanding, PlaneTakeoff, Sparkles } from "lucide-react";
import type { Citizen } from "@/mock-data/types";
import { ExpandableCard } from "@/components/ui/ExpandableCard";
import { Badge } from "@/components/ui/Badge";
import { DataRow } from "@/components/ui/DataRow";
import { EvidenceRefs } from "@/components/evidence/EvidenceRefs";
import { formatDate } from "@/lib/format";
import { MiniTimeline, NoRecords, RecordItem, RecordList, SubHeading } from "./primitives";

const passportVariant = {
  Active: "success",
  Expired: "danger",
  "Under Renewal": "warning",
} as const;

export function TravelSection({ citizen }: { citizen: Citizen }) {
  const { travel, evidence } = citizen;

  return (
    <ExpandableCard
      icon={<Plane size={18} aria-hidden="true" />}
      title="Passport & International Travel"
      summary={
        travel.passport
          ? `${travel.totalTrips} trip${travel.totalTrips === 1 ? "" : "s"} · ${travel.countriesVisited} countries`
          : "No passport held"
      }
      count={travel.trips.length}
      meta={
        travel.passport ? (
          <Badge variant={passportVariant[travel.passport.status]}>
            Passport {travel.passport.status}
          </Badge>
        ) : (
          <Badge variant="neutral">No passport</Badge>
        )
      }
    >
      <div className="flex flex-col gap-5">
        <div>
          <SubHeading className="mb-1.5">Passport</SubHeading>
          {!travel.passport ? (
            <NoRecords>No passport is held by this citizen.</NoRecords>
          ) : (
            <div className="grid gap-x-8 sm:grid-cols-2">
              <DataRow
                label="Passport number"
                value={travel.passport.number}
                mono
                copyValue={travel.passport.number}
              />
              <DataRow label="Issue date" value={formatDate(travel.passport.issueDate)} />
              <DataRow label="Expiry date" value={formatDate(travel.passport.expiryDate)} />
              <DataRow label="Issuing office" value={travel.passport.issuingOffice} />
              <DataRow
                label="Status"
                value={
                  <Badge variant={passportVariant[travel.passport.status]}>
                    {travel.passport.status}
                  </Badge>
                }
              />
            </div>
          )}
        </div>

        <div>
          <SubHeading className="mb-2">Travel pattern</SubHeading>
          <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {[
              { label: "Total trips", value: String(travel.totalTrips) },
              { label: "Countries visited", value: String(travel.countriesVisited) },
              { label: "Average stay", value: travel.averageStayDays > 0 ? `${travel.averageStayDays} days` : "—" },
              { label: "Last exit", value: travel.lastExit ? formatDate(travel.lastExit) : "—" },
              { label: "Last entry", value: travel.lastEntry ? formatDate(travel.lastEntry) : "—" },
              { label: "Frequency", value: travel.travelFrequency },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-ink-100 bg-canvas/50 p-3">
                <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-400">
                  {stat.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold leading-snug text-ink-900">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <SubHeading className="mb-1.5">Visited countries & purpose</SubHeading>
          {travel.trips.length === 0 ? (
            <NoRecords>No international travel recorded.</NoRecords>
          ) : (
            <RecordList>
              {travel.trips.map((trip) => (
                <RecordItem
                  key={trip.id}
                  title={
                    <span className="flex items-center gap-2">
                      <span aria-hidden="true">{trip.flag}</span>
                      {trip.country}
                    </span>
                  }
                  subtitle={
                    <>
                      {trip.visaType} · departed {formatDate(trip.exitDate)} via {trip.port} ·
                      returned {formatDate(trip.entryDate)}
                    </>
                  }
                  meta={
                    <>
                      <Badge variant="neutral">{trip.purpose}</Badge>
                      <span className="text-xs font-semibold text-ink-700">
                        {trip.durationDays}d
                      </span>
                    </>
                  }
                />
              ))}
            </RecordList>
          )}
        </div>

        {travel.trips.length > 0 && (
          <div>
            <SubHeading className="mb-2">Travel timeline</SubHeading>
            <MiniTimeline
              events={[...travel.trips]
                .sort((a, b) => b.exitDate.localeCompare(a.exitDate))
                .map((trip) => ({
                  date: formatDate(trip.exitDate),
                  title: `${trip.country} — ${trip.purpose}`,
                  detail: `${trip.durationDays} days · ${trip.visaType}`,
                }))}
            />
          </div>
        )}

        <div>
          <SubHeading className="mb-1.5">Immigration records</SubHeading>
          {travel.immigrationRecords.length === 0 ? (
            <NoRecords>No immigration record on file.</NoRecords>
          ) : (
            <RecordList>
              {travel.immigrationRecords.map((record) => (
                <RecordItem
                  key={record.id}
                  title={
                    <span className="flex items-center gap-1.5">
                      {record.type === "Departure" ? (
                        <PlaneTakeoff size={13} strokeWidth={2.25} className="text-ink-400" aria-hidden="true" />
                      ) : (
                        <PlaneLanding size={13} strokeWidth={2.25} className="text-ink-400" aria-hidden="true" />
                      )}
                      {record.type} · {record.port}
                    </span>
                  }
                  subtitle={
                    <>
                      {formatDate(record.date)} · ref{" "}
                      <span className="font-mono">{record.reference}</span>
                    </>
                  }
                  meta={
                    <Badge variant={record.status === "Cleared" ? "success" : "danger"}>
                      {record.status}
                    </Badge>
                  }
                />
              ))}
            </RecordList>
          )}
        </div>

        <div className="rounded-xl border border-primary-100 bg-primary-50/60 p-3.5">
          <p className="flex items-center gap-1.5 text-xs font-bold text-primary-700">
            <Sparkles size={12} strokeWidth={2.5} aria-hidden="true" />
            AI travel observation
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{travel.observation.text}</p>
          <EvidenceRefs
            ids={travel.observation.evidenceIds}
            context="AI travel observation"
            evidence={evidence}
            className="mt-2.5"
          />
        </div>
      </div>
    </ExpandableCard>
  );
}

import { Car, IdCard, ShieldCheck, TriangleAlert, Wrench } from "lucide-react";
import type { Citizen, Vehicle, VehicleCategory } from "@/mock-data/types";
import { ExpandableCard } from "@/components/ui/ExpandableCard";
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
import { formatCurrency, formatDate } from "@/lib/format";
import { MiniTimeline, NoRecords, RecordItem, RecordList, SubHeading } from "./primitives";

const categoryLabels: Record<VehicleCategory, string> = {
  Car: "Cars",
  Motorcycle: "Motorcycles",
  Commercial: "Commercial vehicles",
};

const categoryOrder: VehicleCategory[] = ["Car", "Motorcycle", "Commercial"];

const challanVariant = { Paid: "success", Pending: "danger", Contested: "warning" } as const;

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const unpaid = vehicle.challans.filter((c) => c.status !== "Paid").length;

  return (
    <article className="rounded-xl border border-ink-100 bg-canvas/50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink-900">{vehicle.makeModel}</p>
          <p className="mt-0.5 text-xs text-ink-500">
            {vehicle.fuel} · registered {formatDate(vehicle.registeredOn)}
          </p>
        </div>
        <span className="flex items-center gap-1 rounded-lg border border-ink-200 bg-surface px-2 py-1 font-mono text-xs font-semibold text-ink-900">
          {vehicle.registrationNumber}
          <CopyButton value={vehicle.registrationNumber} label="registration number" />
        </span>
      </div>

      <div className="mt-3 grid gap-2.5 border-t border-ink-100 pt-3 sm:grid-cols-2">
        <div className="rounded-lg bg-surface p-2.5">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-500">
            <ShieldCheck size={11} strokeWidth={2.5} aria-hidden="true" /> Insurance
          </p>
          <p className="mt-1 text-xs text-ink-700">{vehicle.insurance.provider}</p>
          <p className="font-mono text-[11px] text-ink-400">{vehicle.insurance.policyNumber}</p>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[11px] text-ink-500">
              Valid to {formatDate(vehicle.insurance.validTill)}
            </span>
            <Badge variant={vehicle.insurance.status === "Active" ? "success" : "danger"}>
              {vehicle.insurance.status}
            </Badge>
          </div>
        </div>

        <div className="rounded-lg bg-surface p-2.5">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-500">
            <Wrench size={11} strokeWidth={2.5} aria-hidden="true" /> Fitness
          </p>
          <p className="mt-1 font-mono text-[11px] text-ink-400">
            {vehicle.fitness.certificateNumber}
          </p>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[11px] text-ink-500">
              Valid to {formatDate(vehicle.fitness.validTill)}
            </span>
            <Badge variant={vehicle.fitness.status === "Valid" ? "success" : "danger"}>
              {vehicle.fitness.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-3 border-t border-ink-100 pt-3">
        <SubHeading className="mb-2">
          Traffic challans {unpaid > 0 && <span className="text-danger-600">· {unpaid} outstanding</span>}
        </SubHeading>
        {vehicle.challans.length === 0 ? (
          <NoRecords>No challans recorded against this vehicle.</NoRecords>
        ) : (
          <RecordList>
            {vehicle.challans.map((challan) => (
              <RecordItem
                key={challan.id}
                title={challan.offence}
                subtitle={`${formatDate(challan.date)} · ${challan.location}`}
                meta={
                  <>
                    <span className="text-sm font-semibold text-ink-900">
                      {formatCurrency(challan.amount)}
                    </span>
                    <Badge variant={challanVariant[challan.status]}>{challan.status}</Badge>
                  </>
                }
              />
            ))}
          </RecordList>
        )}
      </div>

      <div className="mt-3 border-t border-ink-100 pt-3">
        <SubHeading className="mb-2">Ownership history</SubHeading>
        <MiniTimeline
          events={vehicle.ownershipHistory.map((event) => ({
            date: formatDate(event.date),
            title: event.event,
            detail: event.detail,
          }))}
        />
      </div>
    </article>
  );
}

export function VehicleSection({ citizen }: { citizen: Citizen }) {
  const { vehicles } = citizen;
  const drivingLicences = citizen.licences.filter((l) => l.category === "Driving");
  const outstanding = vehicles.reduce(
    (sum, v) => sum + v.challans.filter((c) => c.status !== "Paid").length,
    0,
  );

  return (
    <ExpandableCard
      icon={<Car size={18} aria-hidden="true" />}
      title="Vehicle Intelligence"
      summary="Registrations, insurance, fitness, challans and ownership"
      count={vehicles.length}
      meta={
        outstanding > 0 ? (
          <Badge variant="danger">
            <TriangleAlert size={11} strokeWidth={2.5} aria-hidden="true" />
            {outstanding} open challan{outstanding > 1 ? "s" : ""}
          </Badge>
        ) : undefined
      }
    >
      {vehicles.length === 0 ? (
        <NoRecords>No vehicle is registered under this citizen.</NoRecords>
      ) : (
        <div className="flex flex-col gap-5">
          {categoryOrder.map((category) => {
            const inCategory = vehicles.filter((v) => v.category === category);
            if (inCategory.length === 0) return null;
            return (
              <div key={category}>
                <SubHeading className="mb-2">
                  {categoryLabels[category]} ({inCategory.length})
                </SubHeading>
                <div className="flex flex-col gap-2.5">
                  {inCategory.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
              </div>
            );
          })}

          {drivingLicences.length > 0 && (
            <div>
              <SubHeading className="mb-1.5">Driving licences</SubHeading>
              <RecordList>
                {drivingLicences.map((licence) => (
                  <RecordItem
                    key={licence.id}
                    title={
                      <span className="flex items-center gap-1.5">
                        <IdCard size={13} strokeWidth={2.25} aria-hidden="true" className="text-ink-400" />
                        {licence.type}
                      </span>
                    }
                    subtitle={`${licence.licenceNumber} · ${licence.issuingAuthority} · valid to ${formatDate(licence.expiryDate)}`}
                    meta={
                      <Badge variant={licence.status === "Active" ? "success" : "danger"}>
                        {licence.status}
                      </Badge>
                    }
                  />
                ))}
              </RecordList>
            </div>
          )}
        </div>
      )}
    </ExpandableCard>
  );
}

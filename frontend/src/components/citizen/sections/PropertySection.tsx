import { Building2, Gavel } from "lucide-react";
import type { Citizen, Property, PropertyCategory } from "@/mock-data/types";
import { ExpandableCard } from "@/components/ui/ExpandableCard";
import { Badge } from "@/components/ui/Badge";
import { formatCompactCurrency, formatCurrency, formatDate } from "@/lib/format";
import { MiniTimeline, NoRecords, SubHeading } from "./primitives";

const categoryOrder: PropertyCategory[] = [
  "Residential",
  "Commercial",
  "Agricultural Land",
  "Government Lease",
];

const encumbranceVariant = {
  Clear: "success",
  Mortgaged: "warning",
  "Under Dispute": "danger",
} as const;

function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="rounded-xl border border-ink-100 bg-canvas/50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink-900">{property.address}</p>
          <p className="mt-0.5 font-mono text-xs text-ink-400">
            {property.id} · {property.surveyOrUnitNo}
          </p>
        </div>
        <Badge variant={encumbranceVariant[property.encumbrance]}>{property.encumbrance}</Badge>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-ink-100 pt-3 sm:grid-cols-3">
        <div>
          <dt className="text-[11px] text-ink-400">Declared value</dt>
          <dd className="text-sm font-semibold text-ink-900">
            {property.declaredValue > 0 ? formatCompactCurrency(property.declaredValue) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-ink-400">Current valuation</dt>
          <dd className="text-sm font-semibold text-ink-900">
            {property.currentValuation > 0 ? formatCompactCurrency(property.currentValuation) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-ink-400">Area</dt>
          <dd className="text-sm font-medium text-ink-700">
            {property.areaSqFt.toLocaleString("en-IN")} sq ft
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-ink-400">Purchased</dt>
          <dd className="text-sm font-medium text-ink-700">{formatDate(property.purchaseDate)}</dd>
        </div>
        <div>
          <dt className="text-[11px] text-ink-400">Registered</dt>
          <dd className="text-sm font-medium text-ink-700">{formatDate(property.registrationDate)}</dd>
        </div>
        <div>
          <dt className="text-[11px] text-ink-400">Ownership</dt>
          <dd className="text-sm font-medium text-ink-700">{property.ownershipShare}</dd>
        </div>
      </dl>

      <div className="mt-3 border-t border-ink-100 pt-3">
        <SubHeading className="mb-2">Purchase & ownership history</SubHeading>
        <MiniTimeline
          events={property.ownershipHistory.map((event) => ({
            date: formatDate(event.date),
            title: event.event,
            detail: event.value ? `${event.detail} · ${formatCurrency(event.value)}` : event.detail,
          }))}
        />
      </div>

      {property.dispute && (
        <div className="mt-3 rounded-lg border border-danger-100 bg-danger-50 p-3">
          <p className="flex items-center gap-1.5 text-xs font-bold text-danger-700">
            <Gavel size={12} strokeWidth={2.5} aria-hidden="true" />
            Dispute — {property.dispute.status}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-danger-700/90">
            {property.dispute.subject}
          </p>
          <p className="mt-1 font-mono text-[11px] text-danger-700/70">
            {property.dispute.caseNumber} · {property.dispute.forum} · filed{" "}
            {formatDate(property.dispute.filedOn)}
          </p>
        </div>
      )}
    </article>
  );
}

export function PropertySection({ citizen }: { citizen: Citizen }) {
  const { properties } = citizen;
  const totalValue = properties.reduce((sum, p) => sum + p.currentValuation, 0);
  const disputes = properties.filter((p) => p.dispute).length;

  return (
    <ExpandableCard
      icon={<Building2 size={18} aria-hidden="true" />}
      title="Property Intelligence"
      summary="Residential, commercial, agricultural and leased holdings"
      count={properties.length}
      meta={
        properties.length > 0 ? (
          <Badge variant={disputes > 0 ? "danger" : "neutral"}>
            {disputes > 0 ? `${disputes} dispute${disputes > 1 ? "s" : ""}` : formatCompactCurrency(totalValue)}
          </Badge>
        ) : undefined
      }
    >
      {properties.length === 0 ? (
        <NoRecords>No property is registered under this citizen.</NoRecords>
      ) : (
        <div className="flex flex-col gap-5">
          {categoryOrder.map((category) => {
            const inCategory = properties.filter((p) => p.category === category);
            if (inCategory.length === 0) return null;
            return (
              <div key={category}>
                <SubHeading className="mb-2">
                  {category} ({inCategory.length})
                </SubHeading>
                <div className="flex flex-col gap-2.5">
                  {inCategory.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-between rounded-xl bg-primary-50 px-3.5 py-2.5">
            <p className="text-xs font-medium text-primary-700">Total current valuation</p>
            <p className="text-sm font-bold text-primary-700">{formatCurrency(totalValue)}</p>
          </div>
        </div>
      )}
    </ExpandableCard>
  );
}

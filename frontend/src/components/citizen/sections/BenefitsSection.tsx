import { HandHeart } from "lucide-react";
import type { BenefitCategory, Citizen } from "@/mock-data/types";
import { ExpandableCard } from "@/components/ui/ExpandableCard";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { NoRecords, RecordItem, RecordList, SubHeading } from "./primitives";

const categoryOrder: BenefitCategory[] = [
  "Housing",
  "Health",
  "Education",
  "Pension",
  "DBT",
  "Agriculture",
];

const statusVariant = { Active: "success", Inactive: "warning", "Not Enrolled": "neutral" } as const;
const eligibilityVariant = {
  Eligible: "success",
  "Under Review": "warning",
  "Not Eligible": "neutral",
} as const;

export function BenefitsSection({ citizen }: { citizen: Citizen }) {
  const { benefits } = citizen;
  const active = benefits.filter((b) => b.status === "Active").length;

  return (
    <ExpandableCard
      icon={<HandHeart size={18} aria-hidden="true" />}
      title="Government Benefits"
      summary="Scheme enrolment and eligibility across welfare programmes"
      count={benefits.length}
      meta={<Badge variant={active > 0 ? "success" : "neutral"}>{active} active</Badge>}
    >
      {benefits.length === 0 ? (
        <NoRecords>No welfare scheme record on file.</NoRecords>
      ) : (
        <div className="flex flex-col gap-5">
          {categoryOrder.map((category) => {
            const inCategory = benefits.filter((b) => b.category === category);
            if (inCategory.length === 0) return null;
            return (
              <div key={category}>
                <SubHeading className="mb-1.5">{category}</SubHeading>
                <RecordList>
                  {inCategory.map((benefit) => (
                    <RecordItem
                      key={benefit.id}
                      title={benefit.scheme}
                      subtitle={
                        <>
                          {benefit.department}
                          {benefit.enrollmentDate && ` · enrolled ${formatDate(benefit.enrollmentDate)}`}
                          {typeof benefit.amountDisbursed === "number" &&
                            benefit.amountDisbursed > 0 &&
                            ` · disbursed ${formatCurrency(benefit.amountDisbursed)}`}
                          {benefit.lastDisbursedOn && ` · last ${formatDate(benefit.lastDisbursedOn)}`}
                        </>
                      }
                      meta={
                        <>
                          <Badge variant={eligibilityVariant[benefit.eligibility]}>
                            {benefit.eligibility}
                          </Badge>
                          <Badge variant={statusVariant[benefit.status]}>{benefit.status}</Badge>
                        </>
                      }
                    />
                  ))}
                </RecordList>
              </div>
            );
          })}
        </div>
      )}
    </ExpandableCard>
  );
}

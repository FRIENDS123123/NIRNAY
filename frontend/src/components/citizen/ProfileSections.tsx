import type { Citizen } from "@/mock-data/types";
import { IdentitySection } from "./sections/IdentitySection";
import { FamilySection } from "./sections/FamilySection";
import { AddressSection } from "./sections/AddressSection";
import { PropertySection } from "./sections/PropertySection";
import { VehicleSection } from "./sections/VehicleSection";
import { EmploymentSection } from "./sections/EmploymentSection";
import { FinancialSection } from "./sections/FinancialSection";
import { TravelSection } from "./sections/TravelSection";
import { BenefitsSection } from "./sections/BenefitsSection";
import { DocumentsSection } from "./sections/DocumentsSection";

/**
 * The ten intelligence domains of the Citizen 360 profile, in the order an
 * officer works through them: who they are, who they are connected to, where
 * they are, what they hold, and what the state has issued them.
 */
export function ProfileSections({ citizen }: { citizen: Citizen }) {
  return (
    <div className="flex flex-col gap-3">
      <IdentitySection citizen={citizen} />
      <FamilySection citizen={citizen} />
      <AddressSection citizen={citizen} />
      <PropertySection citizen={citizen} />
      <VehicleSection citizen={citizen} />
      <EmploymentSection citizen={citizen} />
      <FinancialSection citizen={citizen} />
      <TravelSection citizen={citizen} />
      <BenefitsSection citizen={citizen} />
      <DocumentsSection citizen={citizen} />
    </div>
  );
}

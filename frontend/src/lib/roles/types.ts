// Role-aware access model. Roles scope which legal records an operator sees —
// this is a demonstration of record scoping, not authentication. There is no
// login and no enforcement boundary: switching role is a UI filter only.

/** Category every legal record is tagged with, used for role scoping. */
export type RecordCategory =
  | "Identity"
  | "Document"
  | "Land"
  | "Property"
  | "Passport"
  | "Travel"
  | "Medical"
  | "Health"
  | "Insurance"
  | "Benefit"
  | "Licence"
  | "Vehicle"
  | "Employment"
  | "Financial"
  | "Government"
  | "Evidence"
  | "Risk";

export type Role =
  | "Citizen"
  | "Investigator"
  | "Reviewer"
  | "Authority"
  | "Hospital"
  | "Administrator";

export interface RoleDefinition {
  id: Role;
  label: string;
  description: string;
  /** Categories this role may see. `"all"` bypasses category filtering. */
  scope: RecordCategory[] | "all";
  /** When set, the role only sees records currently in these review states. */
  reviewScope?: ("Draft" | "Needs Review" | "Rejected" | "Verified")[];
}

export const ROLES: RoleDefinition[] = [
  {
    id: "Citizen",
    label: "Citizen / User",
    description: "Sees only their own identity, benefits and issued documents.",
    scope: ["Identity", "Document", "Benefit", "Health"],
  },
  {
    id: "Investigator",
    label: "Investigator",
    description: "Full visibility including risk, evidence and case timeline.",
    scope: "all",
  },
  {
    id: "Reviewer",
    label: "Reviewer",
    description: "Only records awaiting a decision — draft, needs review or rejected.",
    scope: "all",
    reviewScope: ["Draft", "Needs Review", "Rejected"],
  },
  {
    id: "Authority",
    label: "Authority",
    description: "Identity, land, property, passport and government records.",
    scope: ["Identity", "Land", "Property", "Passport", "Government", "Licence"],
  },
  {
    id: "Hospital",
    label: "Hospital",
    description: "Medical, ABHA, health and insurance records only.",
    scope: ["Medical", "Health", "Insurance"],
  },
  {
    id: "Administrator",
    label: "Administrator",
    description: "Full visibility across every record, plus audit and settings.",
    scope: "all",
  },
];

export const DEFAULT_ROLE: Role = "Investigator";

export function roleDefinition(role: Role): RoleDefinition {
  return ROLES.find((r) => r.id === role) ?? ROLES[1];
}

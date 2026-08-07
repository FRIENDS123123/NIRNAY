// Canonical registry of the synthetic departments NIRNAY correlates against.
// Used for the short codes shown on department chips so the same department
// always renders identically across search cards, evidence and the profile.

export interface Department {
  name: string;
  code: string;
}

export const departments: Department[] = [
  { name: "Identity Authority", code: "IDA" },
  { name: "Income Tax Department", code: "ITD" },
  { name: "Land Records Department", code: "LRD" },
  { name: "Transport Department", code: "TRD" },
  { name: "Regional Transport Authority", code: "RTA" },
  { name: "Regional Passport Office", code: "RPO" },
  { name: "Bureau of Immigration", code: "BOI" },
  { name: "Municipal Corporation", code: "MUN" },
  { name: "Welfare Department", code: "WFD" },
  { name: "Banking & Credit Bureau", code: "BCB" },
  { name: "Ministry of Corporate Affairs", code: "MCA" },
  { name: "Goods & Services Tax Network", code: "GST" },
  { name: "Election Commission", code: "ECI" },
  { name: "Health Authority", code: "ABDM" },
  { name: "Revenue Department", code: "REV" },
  { name: "Employment Records", code: "EMP" },
];

const codeByName = new Map(departments.map((d) => [d.name, d.code]));

/** Short code for a department name; falls back to initials for unknowns. */
export function departmentCode(name: string): string {
  const known = codeByName.get(name);
  if (known) return known;
  return name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

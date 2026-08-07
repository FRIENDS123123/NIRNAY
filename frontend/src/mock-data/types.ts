// Synthetic data shapes only. Mirrors the resolved Citizen 360 profile
// concept described in /docs/03_DATABASE_SCHEMA.md and
// /architecture/DATABASE_RELATIONS.md — flattened here for a
// mock-data-only, no-backend Phase 1 frontend.

export type RiskLevel = "Low" | "Medium" | "High";

export type IdentifierType =
  | "citizenId"
  | "aadhaar"
  | "pan"
  | "passport"
  | "drivingLicence"
  | "phone"
  | "name";

export interface Evidence {
  id: string;
  label: string;
  sourceDepartment: string;
  sourceRecordId: string;
}

export interface FamilyMember {
  name: string;
  relation: string;
  age: number;
  linkedCitizenId?: string;
}

export interface Employment {
  employer: string;
  role: string;
  sector: string;
  since: string;
  status: "Active" | "Former";
}

export interface Property {
  id: string;
  type: "Land" | "Residential" | "Commercial";
  address: string;
  declaredValue: number;
  registrationDate: string;
}

export interface Vehicle {
  id: string;
  type: string;
  registrationNumber: string;
  registeredSince: string;
}

export interface GovDocument {
  id: string;
  type: string;
  issuingAuthority: string;
  issueDate: string;
  status: "Verified" | "Unverified";
}

export interface Benefit {
  id: string;
  scheme: string;
  enrollmentDate: string;
  status: "Active" | "Inactive";
}

export interface Licence {
  id: string;
  type: string;
  issueDate: string;
  expiryDate: string;
  status: "Active" | "Expired" | "Revoked";
}

export interface IncomeRecord {
  year: string;
  declaredIncome: number;
  filingStatus: "Filed" | "Overdue" | "Under Review";
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  department: string;
}

export interface AIFinding {
  text: string;
  evidenceIds: string[];
}

export interface AISummary {
  overview: string;
  inconsistencies: AIFinding[];
  schemeEligibility: AIFinding[];
  linkedEntities: AIFinding[];
  investigationLeads: AIFinding[];
  riskLevel: RiskLevel;
  riskRationale: AIFinding[];
  recommendations: string[];
}

export interface Citizen {
  citizenId: string;
  resolutionConfidence: number;
  identity: {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    aadhaar: string;
    pan: string;
    passport?: string;
    drivingLicence?: string;
    phone: string;
    photoInitials: string;
  };
  address: {
    line: string;
    city: string;
    state: string;
    pincode: string;
  };
  family: FamilyMember[];
  employment: Employment[];
  properties: Property[];
  vehicles: Vehicle[];
  documents: GovDocument[];
  benefits: Benefit[];
  licences: Licence[];
  income: IncomeRecord[];
  timeline: TimelineEvent[];
  evidence: Evidence[];
  aiSummary: AISummary;
}

export interface SearchResult {
  citizenId: string;
  fullName: string;
  dateOfBirth: string;
  address: string;
  matchedOn: IdentifierType;
  matchConfidence: number;
}

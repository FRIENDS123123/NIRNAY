// Synthetic data shapes only. Mirrors the resolved Citizen 360 profile
// concept described in /docs/03_DATABASE_SCHEMA.md and
// /architecture/DATABASE_RELATIONS.md — flattened here for a
// mock-data-only, no-backend frontend.
//
// Phase 2 expands these shapes to cover the ten intelligence domains of the
// Citizen 360 profile. Nothing here is fetched, computed or inferred at
// runtime: every value is authored synthetic data.

export type RiskLevel = "Low" | "Medium" | "High";

export type IdentifierType =
  | "citizenId"
  | "aadhaar"
  | "pan"
  | "passport"
  | "drivingLicence"
  | "phone"
  | "name";

export type VerificationStatus =
  | "Verified"
  | "Pending Verification"
  | "Unverified"
  | "Disputed";

/** Status of the resolved citizen record as a whole. */
export type CitizenStatus = "Verified" | "Under Review" | "Flagged";

// ---------------------------------------------------------------------------
// Evidence — the spine of the platform. Every AI-style claim points at these.
// ---------------------------------------------------------------------------

export interface Evidence {
  id: string;
  /** Human-readable description of what this record demonstrates. */
  label: string;
  sourceDepartment: string;
  /** Internal record identifier inside the source department's system. */
  sourceRecordId: string;
  /** Departmental file/reference number as an officer would quote it. */
  referenceNumber: string;
  /** Correlation confidence for this specific record, 0–1. */
  confidence: number;
  verificationStatus: VerificationStatus;
  /** Which profile record this evidence attaches to. */
  linkedRecord: string;
  /** ISO date the source record was last updated. */
  recordedOn: string;
}

export interface AIFinding {
  text: string;
  evidenceIds: string[];
}

export interface AIRecommendation {
  id: string;
  title: string;
  detail: string;
  priority: "High" | "Medium" | "Low";
  evidenceIds: string[];
}

export type AIDomain =
  | "identity"
  | "income"
  | "property"
  | "travel"
  | "employment"
  | "behaviour"
  | "risk";

export interface AIDomainSummary {
  key: AIDomain;
  title: string;
  text: string;
  evidenceIds: string[];
}

export interface AIMetrics {
  /** Overall correlation confidence across all linked departments, 0–1. */
  aiConfidence: number;
  departmentsCorrelated: number;
  recordsAnalysed: number;
  evidenceSources: number;
  documentsLinked: number;
  /** Deterministic 0–100 score authored alongside riskLevel — never computed. */
  riskScore: number;
  citizenStatus: CitizenStatus;
}

export interface AISummary {
  metrics: AIMetrics;
  executiveSummary: string;
  domainSummaries: AIDomainSummary[];
  inconsistencies: AIFinding[];
  schemeEligibility: AIFinding[];
  linkedEntities: AIFinding[];
  investigationLeads: AIFinding[];
  riskLevel: RiskLevel;
  riskRationale: AIFinding[];
  recommendations: AIRecommendation[];
}

// ---------------------------------------------------------------------------
// Section 1 — Identity
// ---------------------------------------------------------------------------

export interface Identity {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  aadhaar: string;
  pan: string;
  passport?: string;
  drivingLicence?: string;
  voterId: string;
  rationCard: string;
  abhaId: string;
  phone: string;
  email: string;
  photoInitials: string;
}

// ---------------------------------------------------------------------------
// Section 2 — Family intelligence
// ---------------------------------------------------------------------------

export type FamilyRelation =
  | "Father"
  | "Mother"
  | "Spouse"
  | "Son"
  | "Daughter";

export interface FamilyMember {
  id: string;
  name: string;
  relation: FamilyRelation;
  age: number;
  occupation: string;
  linkedCitizenId?: string;
  verification: VerificationStatus;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface FamilyIntel {
  householdId: string;
  members: FamilyMember[];
  emergencyContact: EmergencyContact;
}

// ---------------------------------------------------------------------------
// Section 3 — Address intelligence
// ---------------------------------------------------------------------------

export interface AddressRecord {
  id: string;
  type: "Current" | "Permanent" | "Historical";
  line: string;
  city: string;
  state: string;
  pincode: string;
  fromDate: string;
  toDate?: string;
  source: string;
  /** Geo-match confidence for this address, 0–1. */
  geoConfidence: number;
}

export interface AddressIntel {
  current: AddressRecord;
  permanent: AddressRecord;
  historical: AddressRecord[];
  /** Aggregate geo confidence across all address records, 0–1. */
  geoConfidence: number;
}

// ---------------------------------------------------------------------------
// Section 4 — Property intelligence
// ---------------------------------------------------------------------------

export type PropertyCategory =
  | "Residential"
  | "Commercial"
  | "Agricultural Land"
  | "Government Lease";

export interface OwnershipEvent {
  date: string;
  event: string;
  detail: string;
  value?: number;
}

export interface PropertyDispute {
  caseNumber: string;
  forum: string;
  subject: string;
  filedOn: string;
  status: "Open" | "Resolved" | "Stayed";
}

export interface Property {
  id: string;
  category: PropertyCategory;
  address: string;
  surveyOrUnitNo: string;
  areaSqFt: number;
  purchaseDate: string;
  registrationDate: string;
  declaredValue: number;
  currentValuation: number;
  ownershipShare: string;
  encumbrance: "Clear" | "Mortgaged" | "Under Dispute";
  ownershipHistory: OwnershipEvent[];
  dispute?: PropertyDispute;
  source: string;
}

// ---------------------------------------------------------------------------
// Section 5 — Vehicle intelligence
// ---------------------------------------------------------------------------

export type VehicleCategory = "Car" | "Motorcycle" | "Commercial";

export interface Challan {
  id: string;
  date: string;
  offence: string;
  location: string;
  amount: number;
  status: "Paid" | "Pending" | "Contested";
}

export interface Vehicle {
  id: string;
  category: VehicleCategory;
  makeModel: string;
  registrationNumber: string;
  registeredOn: string;
  fuel: string;
  insurance: {
    provider: string;
    policyNumber: string;
    validTill: string;
    status: "Active" | "Expired";
  };
  fitness: {
    certificateNumber: string;
    validTill: string;
    status: "Valid" | "Expired" | "Not Applicable";
  };
  challans: Challan[];
  ownershipHistory: OwnershipEvent[];
}

// ---------------------------------------------------------------------------
// Section 6 — Employment & business
// ---------------------------------------------------------------------------

export interface Employment {
  id: string;
  employer: string;
  role: string;
  sector: string;
  since: string;
  until?: string;
  status: "Active" | "Former";
}

export interface GstRegistration {
  gstin: string;
  legalName: string;
  state: string;
  registeredOn: string;
  status: "Active" | "Suspended" | "Cancelled";
  lastFiling: string;
}

export interface Directorship {
  din: string;
  company: string;
  cin: string;
  role: string;
  appointedOn: string;
  status: "Active" | "Resigned";
}

export type LicenceCategory = "Driving" | "Professional" | "Business" | "Transport";

export interface Licence {
  id: string;
  type: string;
  category: LicenceCategory;
  licenceNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  status: "Active" | "Expired" | "Revoked";
}

export interface EmploymentIntel {
  history: Employment[];
  gstRegistrations: GstRegistration[];
  directorships: Directorship[];
}

// ---------------------------------------------------------------------------
// Section 7 — Financial intelligence
// ---------------------------------------------------------------------------

export interface IncomeRecord {
  assessmentYear: string;
  declaredIncome: number;
  taxPaid: number;
  filingStatus: "Filed" | "Overdue" | "Under Review";
  filedOn?: string;
}

export interface BankAccount {
  id: string;
  bank: string;
  maskedNumber: string;
  type: "Savings" | "Current";
  branch: string;
  openedOn: string;
  status: "Active" | "Dormant";
}

export interface Loan {
  id: string;
  lender: string;
  type: string;
  sanctionedAmount: number;
  outstanding: number;
  emi: number;
  sanctionedOn: string;
  status: "Active" | "Closed" | "Irregular";
}

export interface Investment {
  id: string;
  kind: "Mutual Fund" | "Fixed Deposit";
  institution: string;
  identifier: string;
  value: number;
  startedOn: string;
  maturityOn?: string;
}

export interface InsurancePolicy {
  id: string;
  insurer: string;
  type: "Life" | "Health" | "Vehicle";
  policyNumber: string;
  sumAssured: number;
  annualPremium: number;
  validTill: string;
  status: "Active" | "Lapsed";
}

export interface UpiHandle {
  handle: string;
  linkedBank: string;
  status: "Active" | "Inactive";
}

export interface CreditProfile {
  score: number;
  bureau: string;
  band: "Excellent" | "Good" | "Fair" | "Poor";
  asOf: string;
}

export interface FinancialIntel {
  incomeRange: string;
  incomeTax: IncomeRecord[];
  bankAccounts: BankAccount[];
  loans: Loan[];
  creditProfile: CreditProfile;
  mutualFunds: Investment[];
  fixedDeposits: Investment[];
  insurance: InsurancePolicy[];
  upiIds: UpiHandle[];
}

// ---------------------------------------------------------------------------
// Section 8 — Passport & international travel
// ---------------------------------------------------------------------------

export interface PassportRecord {
  number: string;
  issueDate: string;
  expiryDate: string;
  issuingOffice: string;
  status: "Active" | "Expired" | "Under Renewal";
}

export interface Trip {
  id: string;
  country: string;
  flag: string;
  purpose: "Business" | "Tourism" | "Family" | "Medical" | "Conference";
  visaType: string;
  exitDate: string;
  entryDate: string;
  durationDays: number;
  port: string;
}

export interface ImmigrationRecord {
  id: string;
  date: string;
  type: "Departure" | "Arrival";
  port: string;
  reference: string;
  status: "Cleared" | "Flagged";
}

export interface TravelIntel {
  passport: PassportRecord | null;
  trips: Trip[];
  immigrationRecords: ImmigrationRecord[];
  totalTrips: number;
  countriesVisited: number;
  averageStayDays: number;
  travelFrequency: string;
  lastExit: string | null;
  lastEntry: string | null;
  /** Authored observation, paired with evidence like every other AI claim. */
  observation: AIFinding;
}

// ---------------------------------------------------------------------------
// Section 9 — Government benefits
// ---------------------------------------------------------------------------

export type BenefitCategory =
  | "Housing"
  | "Health"
  | "Education"
  | "Pension"
  | "DBT"
  | "Agriculture";

export interface Benefit {
  id: string;
  scheme: string;
  category: BenefitCategory;
  department: string;
  enrollmentDate?: string;
  status: "Active" | "Inactive" | "Not Enrolled";
  eligibility: "Eligible" | "Not Eligible" | "Under Review";
  amountDisbursed?: number;
  lastDisbursedOn?: string;
}

// ---------------------------------------------------------------------------
// Section 10 — Government documents
// ---------------------------------------------------------------------------

export interface GovDocument {
  id: string;
  type: string;
  documentNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate?: string;
  status: VerificationStatus;
  /** Verification confidence for this document, 0–1. */
  verificationConfidence: number;
}

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------

export type TimelineCategory =
  | "Identity"
  | "Property"
  | "Vehicle"
  | "Employment"
  | "Travel"
  | "Financial"
  | "Licence"
  | "Benefit";

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  department: string;
  category: TimelineCategory;
  evidenceIds: string[];
}

// ---------------------------------------------------------------------------
// The resolved citizen
// ---------------------------------------------------------------------------

export interface Citizen {
  citizenId: string;
  /** Confidence that all linked department records describe one person, 0–1. */
  resolutionConfidence: number;
  status: CitizenStatus;
  /** One-line synopsis surfaced on search result cards. */
  quickSummary: string;
  linkedDepartments: string[];
  identity: Identity;
  addressIntel: AddressIntel;
  family: FamilyIntel;
  employment: EmploymentIntel;
  properties: Property[];
  vehicles: Vehicle[];
  financial: FinancialIntel;
  travel: TravelIntel;
  benefits: Benefit[];
  documents: GovDocument[];
  licences: Licence[];
  timeline: TimelineEvent[];
  evidence: Evidence[];
  aiSummary: AISummary;
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export interface SearchResult {
  citizenId: string;
  fullName: string;
  photoInitials: string;
  dateOfBirth: string;
  primaryAddress: string;
  quickSummary: string;
  linkedDepartments: string[];
  departmentCorrelations: number;
  aiConfidence: number;
  riskLevel: RiskLevel;
  status: CitizenStatus;
  /** Which identifier produced the hit, and the value that matched. */
  matchedOn: IdentifierType;
  matchedValue: string;
  matchConfidence: number;
}

export interface SearchSuggestion {
  citizenId: string;
  label: string;
  sublabel: string;
  matchedOn: IdentifierType;
}

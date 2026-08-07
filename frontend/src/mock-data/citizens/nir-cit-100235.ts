// Fully synthetic demonstration record. No real citizen, government, or
// department data is used — see /docs/07_SECURITY.md. This record is
// deliberately sparse: it demonstrates household resolution against
// NIR-CIT-100234 and exercises the empty states of several sections.

import type { Citizen } from "../types";

export const rajeshDeshmukh: Citizen = {
  citizenId: "NIR-CIT-100235",
  resolutionConfidence: 0.93,
  status: "Verified",
  quickSummary:
    "Pune construction professional. Same household as NIR-CIT-100234. Limited but internally consistent records; no independently held property.",
  linkedDepartments: [
    "Identity Authority",
    "Income Tax Department",
    "Transport Department",
    "Banking & Credit Bureau",
    "Employment Records",
    "Health Authority",
  ],

  identity: {
    fullName: "Rajesh Deshmukh",
    dateOfBirth: "1983-01-27",
    gender: "Male",
    aadhaar: "XXXX XXXX 3390",
    pan: "RDMPD3390K",
    drivingLicence: "MH12 20080011209",
    voterId: "MHX3390812",
    rationCard: "MH-PUN-2011-448210",
    abhaId: "24-3390-7712-0088",
    phone: "+91 98XXX XX902",
    email: "r.deshmukh@synthetic.example",
    photoInitials: "RD",
  },

  addressIntel: {
    geoConfidence: 0.9,
    current: {
      id: "ADR-100235-C",
      type: "Current",
      line: "Flat 12B, Silver Oak Residency, Baner Road",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411045",
      fromDate: "2018-11-02",
      source: "Identity Authority",
      geoConfidence: 0.95,
    },
    permanent: {
      id: "ADR-100235-P",
      type: "Permanent",
      line: "Deshmukh Wada, Main Road, Karad",
      city: "Satara",
      state: "Maharashtra",
      pincode: "415110",
      fromDate: "1983-01-27",
      source: "Identity Authority",
      geoConfidence: 0.86,
    },
    historical: [
      {
        id: "ADR-100235-H1",
        type: "Historical",
        line: "Flat 402, Sunrise Apartments, Kothrud",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411038",
        fromDate: "2014-05-10",
        toDate: "2018-10-31",
        source: "Employment Records",
        geoConfidence: 0.88,
      },
    ],
  },

  family: {
    householdId: "HH-PUN-411045-0912",
    members: [
      { id: "FAM-100235-1", name: "Ananya Rao Deshmukh", relation: "Spouse", age: 36, occupation: "Senior Product Manager", linkedCitizenId: "NIR-CIT-100234", verification: "Verified" },
      { id: "FAM-100235-2", name: "Meera Deshmukh", relation: "Daughter", age: 9, occupation: "Student", verification: "Verified" },
      { id: "FAM-100235-3", name: "Prakash Deshmukh", relation: "Father", age: 71, occupation: "Retired, State Transport", verification: "Verified" },
    ],
    emergencyContact: {
      name: "Ananya Rao Deshmukh",
      relation: "Spouse",
      phone: "+91 98XXX XX341",
    },
  },

  employment: {
    history: [
      { id: "EMP-100235-1", employer: "Meridian Infrastructure Ltd.", role: "Site Engineering Head", sector: "Construction", since: "2016-03-01", status: "Active" },
      { id: "EMP-100235-2", employer: "Konkan Builders Pvt. Ltd.", role: "Project Engineer", sector: "Construction", since: "2008-11-03", until: "2016-02-26", status: "Former" },
    ],
    gstRegistrations: [],
    directorships: [],
  },

  properties: [],

  vehicles: [
    {
      id: "VEH-55021",
      category: "Car",
      makeModel: "Honda City VX",
      registrationNumber: "MH12 GT 4471",
      registeredOn: "2020-02-14",
      fuel: "Petrol",
      insurance: { provider: "Sahyadri General Insurance", policyNumber: "SGI-MOT-4471-2024", validTill: "2025-02-13", status: "Active" },
      fitness: { certificateNumber: "FC-MH12-4471", validTill: "2035-02-13", status: "Valid" },
      challans: [
        { id: "CHL-11204", date: "2022-11-19", offence: "Signal violation", location: "University Road, Pune", amount: 1000, status: "Paid" },
      ],
      ownershipHistory: [
        { date: "2020-02-14", event: "Registered", detail: "Registered to spouse; recorded against this household record" },
      ],
    },
  ],

  financial: {
    incomeRange: "₹15,00,000 – ₹20,00,000 per annum",
    incomeTax: [
      { assessmentYear: "2024-25", declaredIncome: 1890000, taxPaid: 372000, filingStatus: "Filed", filedOn: "2024-07-11" },
      { assessmentYear: "2023-24", declaredIncome: 1750000, taxPaid: 331000, filingStatus: "Filed", filedOn: "2023-07-14" },
    ],
    bankAccounts: [
      { id: "ACC-1", bank: "State Cooperative Bank", maskedNumber: "XXXXXXXX3390", type: "Savings", branch: "Baner, Pune", openedOn: "2008-11-20", status: "Active" },
    ],
    loans: [
      { id: "LON-1", lender: "State Cooperative Bank", type: "Home Loan (co-borrower)", sanctionedAmount: 5200000, outstanding: 2840000, emi: 46800, sanctionedOn: "2019-01-09", status: "Active" },
    ],
    creditProfile: { score: 754, bureau: "National Credit Bureau", band: "Good", asOf: "2025-01-31" },
    mutualFunds: [
      { id: "MF-1", kind: "Mutual Fund", institution: "Sahyadri Asset Management", identifier: "FOLIO-33901188", value: 320000, startedOn: "2019-09-05" },
    ],
    fixedDeposits: [],
    insurance: [
      { id: "INS-1", insurer: "Bharat Life Assurance", type: "Life", policyNumber: "BLA-3390-1187", sumAssured: 5000000, annualPremium: 34000, validTill: "2043-01-31", status: "Active" },
    ],
    upiIds: [{ handle: "rajesh.d@synthbank", linkedBank: "State Cooperative Bank", status: "Active" }],
  },

  travel: {
    passport: null,
    trips: [],
    immigrationRecords: [],
    totalTrips: 0,
    countriesVisited: 0,
    averageStayDays: 0,
    travelFrequency: "No international travel on record",
    lastExit: null,
    lastEntry: null,
    observation: {
      text: "No passport is held and no immigration record exists for this citizen. Absence of travel history is consistent with the rest of the profile and is not itself a risk signal.",
      evidenceIds: ["EV-ID-01"],
    },
  },

  benefits: [
    { id: "BEN-50011", scheme: "Pradhan Mantri Awas Yojana", category: "Housing", department: "Welfare Department", status: "Not Enrolled", eligibility: "Not Eligible" },
    { id: "BEN-50012", scheme: "Ayushman Bharat", category: "Health", department: "Health Authority", status: "Not Enrolled", eligibility: "Not Eligible" },
    { id: "BEN-50013", scheme: "National Pension Scheme", category: "Pension", department: "Welfare Department", enrollmentDate: "2018-06-01", status: "Active", eligibility: "Eligible" },
  ],

  documents: [
    { id: "DOC-72200", type: "Aadhaar", documentNumber: "XXXX XXXX 3390", issuingAuthority: "Identity Authority", issueDate: "2011-07-14", status: "Verified", verificationConfidence: 0.98 },
    { id: "DOC-72201", type: "PAN Card", documentNumber: "RDMPD3390K", issuingAuthority: "Income Tax Department", issueDate: "2008-09-12", status: "Verified", verificationConfidence: 0.99 },
    { id: "DOC-72202", type: "ABHA Health ID", documentNumber: "24-3390-7712-0088", issuingAuthority: "Health Authority", issueDate: "2022-02-08", status: "Verified", verificationConfidence: 0.91 },
  ],

  licences: [
    { id: "LIC-42200", type: "Driving Licence (LMV)", category: "Driving", licenceNumber: "MH12 20080011209", issuingAuthority: "Regional Transport Office, Pune", issueDate: "2008-06-14", expiryDate: "2028-06-13", status: "Active" },
  ],

  timeline: [
    { date: "2008-06-14", title: "Driving licence issued", description: "LMV driving licence issued.", department: "Regional Transport Office", category: "Licence", evidenceIds: ["EV-TR-02"] },
    { date: "2008-09-12", title: "PAN issued", description: "Permanent Account Number allotted.", department: "Income Tax Department", category: "Identity", evidenceIds: ["EV-ID-01"] },
    { date: "2008-11-03", title: "First employment recorded", description: "Joined Konkan Builders Pvt. Ltd. as Project Engineer.", department: "Employment Records", category: "Employment", evidenceIds: ["EV-EMP-02"] },
    { date: "2016-03-01", title: "Employment change", description: "Joined Meridian Infrastructure Ltd. as Site Engineering Head.", department: "Employment Records", category: "Employment", evidenceIds: ["EV-EMP-01"] },
    { date: "2018-11-02", title: "Household address updated", description: "Residence updated to the Baner Road address shared with spouse.", department: "Identity Authority", category: "Identity", evidenceIds: ["EV-ADR-01"] },
    { date: "2019-01-09", title: "Home loan sanctioned (co-borrower)", description: "Joint home loan sanctioned against the household residence.", department: "Banking & Credit Bureau", category: "Financial", evidenceIds: ["EV-BCB-01"] },
    { date: "2020-02-14", title: "Vehicle registered to household", description: "Sedan registered; shared with spouse's citizen record.", department: "Transport Department", category: "Vehicle", evidenceIds: ["EV-TR-01"] },
    { date: "2024-07-11", title: "Income tax return filed", description: "AY 2024-25 return filed declaring ₹18,90,000.", department: "Income Tax Department", category: "Financial", evidenceIds: ["EV-IT-01"] },
  ],

  evidence: [
    { id: "EV-ID-01", label: "Core identity record with linked PAN and Aadhaar", sourceDepartment: "Identity Authority", sourceRecordId: "NIR-CIT-100235", referenceNumber: "IDA/PUN/2011/3390", confidence: 0.97, verificationStatus: "Verified", linkedRecord: "Identity → Aadhaar, PAN", recordedOn: "2024-11-02" },
    { id: "EV-ADR-01", label: "Shared residential address with spouse citizen record", sourceDepartment: "Identity Authority", sourceRecordId: "ADR-100235-C", referenceNumber: "IDA/HH/411045/0912", confidence: 0.95, verificationStatus: "Verified", linkedRecord: "Address → Current", recordedOn: "2024-11-02" },
    { id: "EV-FAM-01", label: "Household linkage to NIR-CIT-100234", sourceDepartment: "Identity Authority", sourceRecordId: "NIR-CIT-100234", referenceNumber: "IDA/HH/411045/0912", confidence: 0.95, verificationStatus: "Verified", linkedRecord: "Family → Spouse", recordedOn: "2024-11-02" },
    { id: "EV-IT-01", label: "Income tax return, AY 2024-25 — declared income ₹18,90,000", sourceDepartment: "Income Tax Department", sourceRecordId: "IT-2024-25-1890000", referenceNumber: "ITD/ITR/2024/3390118", confidence: 0.96, verificationStatus: "Verified", linkedRecord: "Financial → Income tax", recordedOn: "2024-07-11" },
    { id: "EV-TR-01", label: "Vehicle record shared across the household", sourceDepartment: "Transport Department", sourceRecordId: "VEH-55021", referenceNumber: "TRD/PUN/2020/55021", confidence: 0.92, verificationStatus: "Verified", linkedRecord: "Vehicle → VEH-55021", recordedOn: "2020-02-14" },
    { id: "EV-TR-02", label: "Driving licence, valid to 2028", sourceDepartment: "Regional Transport Authority", sourceRecordId: "LIC-42200", referenceNumber: "RTA/PUN/2008/11209", confidence: 0.97, verificationStatus: "Verified", linkedRecord: "Licence → LIC-42200", recordedOn: "2008-06-14" },
    { id: "EV-EMP-01", label: "Active employment record, construction sector", sourceDepartment: "Employment Records", sourceRecordId: "EMP-100235-1", referenceNumber: "EMP/MER/2016/0331", confidence: 0.93, verificationStatus: "Verified", linkedRecord: "Employment → Current", recordedOn: "2024-10-01" },
    { id: "EV-EMP-02", label: "Prior employment record, construction sector", sourceDepartment: "Employment Records", sourceRecordId: "EMP-100235-2", referenceNumber: "EMP/KON/2008/1103", confidence: 0.88, verificationStatus: "Verified", linkedRecord: "Employment → History", recordedOn: "2016-02-26" },
    { id: "EV-BCB-01", label: "Joint home loan as co-borrower, servicing regular", sourceDepartment: "Banking & Credit Bureau", sourceRecordId: "LON-1", referenceNumber: "BCB/LON/2019/5200", confidence: 0.91, verificationStatus: "Verified", linkedRecord: "Financial → Loans", recordedOn: "2025-01-31" },
    { id: "EV-BCB-02", label: "Credit profile — score 754, no irregular accounts", sourceDepartment: "Banking & Credit Bureau", sourceRecordId: "CB-100235", referenceNumber: "BCB/RPT/2025/100235", confidence: 0.9, verificationStatus: "Verified", linkedRecord: "Financial → Credit profile", recordedOn: "2025-01-31" },
  ],

  aiSummary: {
    metrics: {
      aiConfidence: 0.93,
      departmentsCorrelated: 6,
      recordsAnalysed: 27,
      evidenceSources: 10,
      documentsLinked: 3,
      riskScore: 11,
      citizenStatus: "Verified",
    },
    executiveSummary:
      "Rajesh Deshmukh is a 41-year-old construction professional in Pune, resolved across six departments at 93% confidence. The record is sparse — no independently held property, no international travel, a single vehicle shared with the household — but every available record is internally consistent and corroborated. This profile resolves to the same household as NIR-CIT-100234.",
    domainSummaries: [
      { key: "identity", title: "Identity Summary", text: "Aadhaar, PAN, voter ID and ABHA records agree on name, date of birth and address. No passport is held. Ration card number is shared with the spouse's record, consistent with a single household.", evidenceIds: ["EV-ID-01", "EV-ADR-01"] },
      { key: "income", title: "Income Summary", text: "Two assessment years on file, both filed on time, rising from ₹17,50,000 to ₹18,90,000. Credit score of 754 with a regularly serviced joint home loan.", evidenceIds: ["EV-IT-01", "EV-BCB-01", "EV-BCB-02"] },
      { key: "property", title: "Property Summary", text: "No property is registered independently to this citizen. The household residence is registered 50% jointly under the spouse's record, against which this citizen is a home loan co-borrower.", evidenceIds: ["EV-BCB-01", "EV-FAM-01"] },
      { key: "travel", title: "Travel Summary", text: "No passport and no immigration records. Absence of travel history is consistent with the rest of the profile.", evidenceIds: ["EV-ID-01"] },
      { key: "employment", title: "Employment Summary", text: "Continuous employment in the construction sector since 2008, with one employer change in 2016. No business registrations or directorships on record.", evidenceIds: ["EV-EMP-01", "EV-EMP-02"] },
      { key: "behaviour", title: "Behaviour Summary", text: "One traffic challan since 2020, paid. Tax filings and loan repayments are on time. No lapsed renewals across any correlated department.", evidenceIds: ["EV-IT-01", "EV-TR-01", "EV-BCB-02"] },
      { key: "risk", title: "Risk Summary", text: "Risk score 11/100 (Low) — the lowest of the resolved records. No open legal, licensing, tax or financial irregularity exists on file.", evidenceIds: ["EV-IT-01", "EV-TR-02", "EV-BCB-02"] },
    ],
    inconsistencies: [],
    schemeEligibility: [
      { text: "Not eligible for income-linked welfare schemes; declared income exceeds applicable thresholds.", evidenceIds: ["EV-IT-01"] },
      { text: "National Pension Scheme enrolment is Active and correctly matched to the employment record.", evidenceIds: ["EV-EMP-01"] },
    ],
    linkedEntities: [
      { text: "Resolves to the same household as NIR-CIT-100234 (spouse) — shared household ID, residential address, ration card and vehicle registration.", evidenceIds: ["EV-FAM-01", "EV-ADR-01", "EV-TR-01"] },
    ],
    investigationLeads: [],
    riskLevel: "Low",
    riskRationale: [
      { text: "No open legal, licensing or tax irregularities on file across six correlated departments.", evidenceIds: ["EV-IT-01", "EV-TR-02"] },
      { text: "Declared income comfortably supports the only credit obligation on record.", evidenceIds: ["EV-BCB-01", "EV-BCB-02"] },
    ],
    recommendations: [
      { id: "REC-1", title: "No investigative action warranted", detail: "Every available record is corroborated and no contradiction was found across the six correlated departments. Recommend closing the review with no further action.", priority: "Low", evidenceIds: ["EV-IT-01", "EV-BCB-02", "EV-EMP-01"] },
      { id: "REC-2", title: "Treat as a household record when reviewing NIR-CIT-100234", detail: "Address, ration card and vehicle registration are shared with the spouse's record. Any household-level finding on either profile should be assessed against both.", priority: "Low", evidenceIds: ["EV-FAM-01", "EV-ADR-01", "EV-TR-01"] },
    ],
  },
};

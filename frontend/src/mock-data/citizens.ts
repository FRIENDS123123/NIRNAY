// Fully synthetic demonstration data. No real citizen, government, or
// department records are used anywhere in this file — see
// /docs/07_SECURITY.md. Every AI-style claim below is deliberately paired
// with evidence IDs so the UI can render "why the system believes this."

import type { Citizen } from "./types";

export const citizens: Citizen[] = [
  {
    citizenId: "NIR-CIT-100234",
    resolutionConfidence: 0.97,
    identity: {
      fullName: "Ananya Rao Deshmukh",
      dateOfBirth: "1988-04-12",
      gender: "Female",
      aadhaar: "XXXX XXXX 4821",
      pan: "ARDPD4821Q",
      passport: "N8213457",
      drivingLicence: "MH12 20140091823",
      phone: "+91 98XXX XX341",
      photoInitials: "AD",
    },
    address: {
      line: "Flat 12B, Silver Oak Residency, Baner Road",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411045",
    },
    family: [
      { name: "Rajesh Deshmukh", relation: "Spouse", age: 41, linkedCitizenId: "NIR-CIT-100235" },
      { name: "Meera Deshmukh", relation: "Daughter", age: 9 },
      { name: "Sunita Rao", relation: "Mother", age: 68 },
    ],
    employment: [
      { employer: "Kavach Analytics Pvt. Ltd.", role: "Senior Product Manager", sector: "Information Technology", since: "2019-06-01", status: "Active" },
      { employer: "Trident Consulting Group", role: "Business Analyst", sector: "Consulting", since: "2013-08-15", status: "Former" },
    ],
    properties: [
      { id: "PROP-88213", type: "Residential", address: "Flat 12B, Silver Oak Residency, Baner Road, Pune", declaredValue: 9800000, registrationDate: "2018-11-02" },
      { id: "PROP-91027", type: "Land", address: "Survey No. 214, Mulshi Taluka, Pune District", declaredValue: 4200000, registrationDate: "2022-01-19" },
      { id: "PROP-93410", type: "Commercial", address: "Shop 4, Ganesh Arcade, FC Road, Pune", declaredValue: 6100000, registrationDate: "2023-07-08" },
    ],
    vehicles: [
      { id: "VEH-55021", type: "Sedan — Honda City", registrationNumber: "MH12 GT 4471", registeredSince: "2020-02-14" },
      { id: "VEH-55890", type: "SUV — Hyundai Creta", registrationNumber: "MH14 BK 9021", registeredSince: "2023-09-30" },
    ],
    documents: [
      { id: "DOC-70011", type: "Passport", issuingAuthority: "Regional Passport Office, Pune", issueDate: "2021-03-11", status: "Verified" },
      { id: "DOC-70012", type: "Income Certificate", issuingAuthority: "Revenue Department, Maharashtra", issueDate: "2024-04-01", status: "Verified" },
      { id: "DOC-70013", type: "Address Proof", issuingAuthority: "Pune Municipal Corporation", issueDate: "2022-08-19", status: "Unverified" },
    ],
    benefits: [
      { id: "BEN-30044", scheme: "Pradhan Mantri Fasal Bima Yojana", enrollmentDate: "2022-05-01", status: "Inactive" },
    ],
    licences: [
      { id: "LIC-40091", type: "Driving Licence (LMV + MCWG)", issueDate: "2014-01-09", expiryDate: "2034-01-08", status: "Active" },
      { id: "LIC-40092", type: "Shop & Establishment Licence", issueDate: "2023-07-10", expiryDate: "2025-07-09", status: "Active" },
    ],
    income: [
      { year: "2024-25", declaredIncome: 3120000, filingStatus: "Filed" },
      { year: "2023-24", declaredIncome: 2680000, filingStatus: "Filed" },
      { year: "2022-23", declaredIncome: 1450000, filingStatus: "Filed" },
    ],
    timeline: [
      { date: "2023-09-30", title: "Vehicle registered", description: "SUV (Hyundai Creta) registered under citizen's name.", department: "Transport Department" },
      { date: "2023-07-08", title: "Commercial property registered", description: "Shop unit purchased on FC Road, Pune.", department: "Land Records Department" },
      { date: "2023-07-10", title: "Business licence issued", description: "Shop & Establishment licence issued for commercial unit.", department: "Municipal Licensing Authority" },
      { date: "2022-08-19", title: "Address proof issued", description: "Address proof document issued, pending verification.", department: "Pune Municipal Corporation" },
      { date: "2022-01-19", title: "Land parcel registered", description: "Agricultural land registered in Mulshi Taluka.", department: "Land Records Department" },
      { date: "2021-03-11", title: "Passport issued", description: "Passport renewed and verified.", department: "Regional Passport Office" },
      { date: "2018-11-02", title: "Residential property registered", description: "Primary residence registered.", department: "Land Records Department" },
      { date: "2014-01-09", title: "Driving licence issued", description: "LMV and MCWG driving licence issued.", department: "Regional Transport Office" },
    ],
    evidence: [
      { id: "EV-1", label: "Declared income FY2024-25 vs. new commercial property value", sourceDepartment: "Tax Department", sourceRecordId: "IT-2024-3120000" },
      { id: "EV-2", label: "Commercial property registration record", sourceDepartment: "Land Records Department", sourceRecordId: "PROP-93410" },
      { id: "EV-3", label: "Address proof verification status", sourceDepartment: "Pune Municipal Corporation", sourceRecordId: "DOC-70013" },
      { id: "EV-4", label: "Residential address on identity record", sourceDepartment: "Identity Department", sourceRecordId: "NIR-CIT-100234" },
      { id: "EV-5", label: "Spouse identity linkage", sourceDepartment: "Identity Department", sourceRecordId: "NIR-CIT-100235" },
      { id: "EV-6", label: "Shop & Establishment licence record", sourceDepartment: "Municipal Licensing Authority", sourceRecordId: "LIC-40092" },
      { id: "EV-7", label: "Welfare scheme enrollment record", sourceDepartment: "Welfare Department", sourceRecordId: "BEN-30044" },
      { id: "EV-8", label: "Vehicle ownership records (2)", sourceDepartment: "Transport Department", sourceRecordId: "VEH-55021, VEH-55890" },
    ],
    aiSummary: {
      overview:
        "Ananya Rao Deshmukh is a 36-year-old Pune-based professional with a verified identity record, three registered properties, two registered vehicles, and consistent tax filings over the past three years. Employment history shows a stable transition from consulting to a senior technology role in 2019.",
      inconsistencies: [
        {
          text: "Address proof on file has not completed verification, while the same address appears as the registered residence on two other department records.",
          evidenceIds: ["EV-3", "EV-4"],
        },
        {
          text: "Commercial property (₹61,00,000) was acquired in the same filing year as a declared income of ₹31,20,000 — plausible given prior years' income, but worth confirming financing source.",
          evidenceIds: ["EV-1", "EV-2"],
        },
      ],
      schemeEligibility: [
        {
          text: "Not currently eligible for income-linked welfare schemes given declared income exceeds standard thresholds; existing enrollment (PMFBY) is Inactive and may be eligible for closure review.",
          evidenceIds: ["EV-7"],
        },
      ],
      linkedEntities: [
        {
          text: "Spouse Rajesh Deshmukh resolves to an existing citizen record (NIR-CIT-100235) with shared residential address.",
          evidenceIds: ["EV-5", "EV-4"],
        },
      ],
      investigationLeads: [
        {
          text: "Complete address proof verification to resolve the one open inconsistency on file.",
          evidenceIds: ["EV-3"],
        },
        {
          text: "Cross-check commercial property financing against declared income history if this citizen becomes subject of a financial inquiry.",
          evidenceIds: ["EV-1", "EV-2"],
        },
      ],
      riskLevel: "Low",
      riskRationale: [
        { text: "No open legal records, no expired or revoked licences, and consistent multi-year tax filing history.", evidenceIds: ["EV-6"] },
        { text: "Single unresolved verification (address proof) is administrative, not indicative of risk on its own.", evidenceIds: ["EV-3"] },
      ],
      recommendations: [
        "Route address proof to verification queue before relying on it as a standalone document.",
        "No further investigative action warranted at this time based on available records.",
      ],
    },
  },
  {
    citizenId: "NIR-CIT-104871",
    resolutionConfidence: 0.81,
    identity: {
      fullName: "Vikram Singh Chauhan",
      dateOfBirth: "1979-11-03",
      gender: "Male",
      aadhaar: "XXXX XXXX 7710",
      pan: "VSCPC7710M",
      drivingLicence: "DL04 20050034521",
      phone: "+91 99XXX XX108",
      photoInitials: "VC",
    },
    address: {
      line: "House No. 21, Sector 45",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122003",
    },
    family: [
      { name: "Pooja Chauhan", relation: "Spouse", age: 44 },
      { name: "Aditya Chauhan", relation: "Son", age: 19 },
    ],
    employment: [
      { employer: "Chauhan Freight & Logistics", role: "Proprietor", sector: "Logistics", since: "2011-04-01", status: "Active" },
    ],
    properties: [
      { id: "PROP-77002", type: "Residential", address: "House No. 21, Sector 45, Gurugram", declaredValue: 15500000, registrationDate: "2015-06-20" },
      { id: "PROP-77890", type: "Commercial", address: "Warehouse Unit 7, Sector 68 Industrial Area, Gurugram", declaredValue: 32000000, registrationDate: "2021-02-11" },
      { id: "PROP-78341", type: "Land", address: "Khasra No. 112, Pataudi Road, Gurugram District", declaredValue: 18000000, registrationDate: "2023-11-05" },
    ],
    vehicles: [
      { id: "VEH-61120", type: "Heavy Goods Vehicle — Tata Prima", registrationNumber: "HR55 AB 1102", registeredSince: "2018-03-19" },
      { id: "VEH-61121", type: "Heavy Goods Vehicle — Ashok Leyland", registrationNumber: "HR55 AB 1103", registeredSince: "2020-07-22" },
      { id: "VEH-61980", type: "Sedan — Toyota Camry", registrationNumber: "HR26 CQ 7781", registeredSince: "2022-12-01" },
    ],
    documents: [
      { id: "DOC-81022", type: "Business Registration Certificate", issuingAuthority: "Ministry of Corporate Affairs", issueDate: "2011-04-01", status: "Verified" },
      { id: "DOC-81023", type: "Income Certificate", issuingAuthority: "Revenue Department, Haryana", issueDate: "2023-05-14", status: "Unverified" },
    ],
    benefits: [],
    licences: [
      { id: "LIC-51002", type: "Transport Operator Licence", issueDate: "2011-05-01", expiryDate: "2024-04-30", status: "Expired" },
      { id: "LIC-51003", type: "Driving Licence (HMV)", issueDate: "2005-02-17", expiryDate: "2025-02-16", status: "Active" },
    ],
    income: [
      { year: "2024-25", declaredIncome: 2200000, filingStatus: "Under Review" },
      { year: "2023-24", declaredIncome: 1980000, filingStatus: "Filed" },
      { year: "2022-23", declaredIncome: 1750000, filingStatus: "Overdue" },
    ],
    timeline: [
      { date: "2024-04-30", title: "Transport operator licence expired", description: "Primary business operating licence lapsed without renewal on file.", department: "Regional Transport Authority" },
      { date: "2023-11-05", title: "Land parcel registered", description: "Large land parcel acquired on Pataudi Road.", department: "Land Records Department" },
      { date: "2023-05-14", title: "Income certificate issued", description: "Issued pending verification.", department: "Revenue Department, Haryana" },
      { date: "2022-12-01", title: "Vehicle registered", description: "Personal sedan registered.", department: "Transport Department" },
      { date: "2021-02-11", title: "Commercial warehouse registered", description: "Large industrial warehouse unit acquired.", department: "Land Records Department" },
      { date: "2020-07-22", title: "Second HGV registered", description: "Fleet expansion — second heavy goods vehicle.", department: "Transport Department" },
      { date: "2018-03-19", title: "First HGV registered", description: "Fleet vehicle registered to business.", department: "Transport Department" },
      { date: "2015-06-20", title: "Residential property registered", description: "Primary residence registered.", department: "Land Records Department" },
    ],
    evidence: [
      { id: "EV-1", label: "Declared income vs. combined value of two large property acquisitions (2021, 2023)", sourceDepartment: "Tax Department", sourceRecordId: "IT-2022-2024-range" },
      { id: "EV-2", label: "Commercial warehouse registration record", sourceDepartment: "Land Records Department", sourceRecordId: "PROP-77890" },
      { id: "EV-3", label: "Land parcel registration record", sourceDepartment: "Land Records Department", sourceRecordId: "PROP-78341" },
      { id: "EV-4", label: "Transport operator licence status", sourceDepartment: "Regional Transport Authority", sourceRecordId: "LIC-51002" },
      { id: "EV-5", label: "Fleet of 2 heavy goods vehicles still actively registered", sourceDepartment: "Transport Department", sourceRecordId: "VEH-61120, VEH-61121" },
      { id: "EV-6", label: "FY2022-23 tax filing status", sourceDepartment: "Tax Department", sourceRecordId: "IT-2022-23-overdue" },
      { id: "EV-7", label: "Income certificate verification status", sourceDepartment: "Revenue Department, Haryana", sourceRecordId: "DOC-81023" },
    ],
    aiSummary: {
      overview:
        "Vikram Singh Chauhan is a 45-year-old logistics business proprietor in Gurugram operating a fleet of heavy goods vehicles. Property holdings (₹6.55 crore across three registrations) significantly exceed cumulative declared income over the same period, and one core operating licence has lapsed.",
      inconsistencies: [
        {
          text: "Combined value of the 2021 commercial warehouse and 2023 land acquisition (₹5.0 crore) is disproportionate to declared income across the same years — a substantial gap not explained by on-file records.",
          evidenceIds: ["EV-1", "EV-2", "EV-3"],
        },
        {
          text: "FY2022-23 tax filing is marked overdue, while two major property acquisitions occurred in adjacent years.",
          evidenceIds: ["EV-6", "EV-2"],
        },
      ],
      schemeEligibility: [
        {
          text: "No active welfare scheme enrollments on file; declared income level would place this citizen outside standard eligibility thresholds regardless.",
          evidenceIds: [],
        },
      ],
      linkedEntities: [
        {
          text: "Business entity 'Chauhan Freight & Logistics' is the registered owner on both heavy goods vehicle records — confirms business/personal asset overlap.",
          evidenceIds: ["EV-5"],
        },
      ],
      investigationLeads: [
        {
          text: "Reconcile source of funds for the 2021 and 2023 property acquisitions against filed income for those years.",
          evidenceIds: ["EV-1", "EV-2", "EV-3"],
        },
        {
          text: "Confirm whether the business is operating without a valid Transport Operator Licence, given the fleet remains actively registered.",
          evidenceIds: ["EV-4", "EV-5"],
        },
        {
          text: "Follow up on the overdue FY2022-23 filing before closing any related review.",
          evidenceIds: ["EV-6"],
        },
      ],
      riskLevel: "High",
      riskRationale: [
        { text: "Significant, unexplained gap between declared income and asset acquisition value.", evidenceIds: ["EV-1"] },
        { text: "Core business operating licence expired ten months ago with no renewal on file, while fleet remains active.", evidenceIds: ["EV-4", "EV-5"] },
        { text: "One tax filing year overdue, coinciding with the acquisition period under review.", evidenceIds: ["EV-6"] },
      ],
      recommendations: [
        "Escalate for a financial records cross-check between the Tax Department and Land Records Department for FY2021-23.",
        "Notify Regional Transport Authority of active fleet operation under an expired operator licence.",
        "Flag for manual review before approving any new licence, permit, or scheme application.",
      ],
    },
  },
  {
    citizenId: "NIR-CIT-100235",
    resolutionConfidence: 0.93,
    identity: {
      fullName: "Rajesh Deshmukh",
      dateOfBirth: "1983-01-27",
      gender: "Male",
      aadhaar: "XXXX XXXX 3390",
      pan: "RDMPD3390K",
      drivingLicence: "MH12 20080011209",
      phone: "+91 98XXX XX902",
      photoInitials: "RD",
    },
    address: {
      line: "Flat 12B, Silver Oak Residency, Baner Road",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411045",
    },
    family: [
      { name: "Ananya Rao Deshmukh", relation: "Spouse", age: 36, linkedCitizenId: "NIR-CIT-100234" },
      { name: "Meera Deshmukh", relation: "Daughter", age: 9 },
    ],
    employment: [
      { employer: "Meridian Infrastructure Ltd.", role: "Site Engineering Head", sector: "Construction", since: "2016-03-01", status: "Active" },
    ],
    properties: [],
    vehicles: [
      { id: "VEH-55021", type: "Sedan — Honda City", registrationNumber: "MH12 GT 4471", registeredSince: "2020-02-14" },
    ],
    documents: [
      { id: "DOC-72201", type: "PAN Card", issuingAuthority: "Income Tax Department", issueDate: "2008-09-12", status: "Verified" },
    ],
    benefits: [],
    licences: [
      { id: "LIC-42200", type: "Driving Licence (LMV)", issueDate: "2008-06-14", expiryDate: "2028-06-13", status: "Active" },
    ],
    income: [
      { year: "2024-25", declaredIncome: 1890000, filingStatus: "Filed" },
      { year: "2023-24", declaredIncome: 1750000, filingStatus: "Filed" },
    ],
    timeline: [
      { date: "2020-02-14", title: "Vehicle registered (joint household)", description: "Sedan registered, shared with spouse's household record.", department: "Transport Department" },
      { date: "2016-03-01", title: "Employment change", description: "Joined Meridian Infrastructure Ltd. as Site Engineering Head.", department: "Employment Records" },
      { date: "2008-09-12", title: "PAN issued", description: "Permanent Account Number issued.", department: "Income Tax Department" },
    ],
    evidence: [
      { id: "EV-1", label: "Shared residential address with spouse citizen record", sourceDepartment: "Identity Department", sourceRecordId: "NIR-CIT-100234" },
      { id: "EV-2", label: "Vehicle record shared across household", sourceDepartment: "Transport Department", sourceRecordId: "VEH-55021" },
    ],
    aiSummary: {
      overview:
        "Rajesh Deshmukh is a 41-year-old construction industry professional in Pune. Records are limited but consistent — stable employment since 2016, verified PAN, and no independently registered property.",
      inconsistencies: [],
      schemeEligibility: [
        {
          text: "No active scheme enrollments; declared income does not indicate eligibility for income-linked welfare schemes.",
          evidenceIds: [],
        },
      ],
      linkedEntities: [
        {
          text: "Resolves to the same household as citizen NIR-CIT-100234 (spouse) — shared address and shared vehicle registration.",
          evidenceIds: ["EV-1", "EV-2"],
        },
      ],
      investigationLeads: [],
      riskLevel: "Low",
      riskRationale: [
        { text: "No open legal, licensing, or tax irregularities on file.", evidenceIds: [] },
      ],
      recommendations: [
        "No investigative action warranted based on available records.",
      ],
    },
  },
];

export function getCitizenById(citizenId: string): Citizen | undefined {
  return citizens.find((c) => c.citizenId === citizenId);
}

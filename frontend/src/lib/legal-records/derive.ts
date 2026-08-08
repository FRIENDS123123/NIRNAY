// Projects a synthetic citizen record into the flat list of legal records that
// the verification workflow and role scoping operate on.
//
// Nothing is invented here: every record maps 1:1 to data already present on
// the citizen, and `defaultStatus` is inferred from what the source department
// reported so a fresh profile already has a realistic review backlog.

import type { Citizen, VerificationStatus } from "@/mock-data/types";
import type { RecordCategory } from "@/lib/roles/types";
import type { LegalRecord, ReviewStatus } from "./types";

function fromSourceStatus(status: VerificationStatus): ReviewStatus {
  switch (status) {
    case "Verified":
      return "Verified";
    case "Pending Verification":
      return "Needs Review";
    case "Disputed":
      return "Rejected";
    case "Unverified":
      return "Draft";
  }
}

/** Documents carry their own category when the type is meaningful. */
function documentCategory(type: string): RecordCategory {
  if (type === "Passport") return "Passport";
  if (type.includes("ABHA") || type.includes("Health")) return "Health";
  if (type.includes("Land") || type.includes("Mutation")) return "Land";
  if (type.includes("Business") || type.includes("Registration")) return "Employment";
  if (type.includes("Income") || type.includes("Address")) return "Government";
  return "Document";
}

export function deriveLegalRecords(citizen: Citizen): LegalRecord[] {
  const records: LegalRecord[] = [];
  const cid = citizen.citizenId;
  const push = (r: Omit<LegalRecord, "citizenId">) => records.push({ ...r, citizenId: cid });

  // --- Core identifiers -----------------------------------------------------
  const { identity } = citizen;
  const identifiers: {
    key: string;
    title: string;
    value: string;
    department: string;
    category: RecordCategory;
  }[] = [
    { key: "aadhaar", title: "Aadhaar", value: identity.aadhaar, department: "Identity Authority", category: "Identity" },
    { key: "pan", title: "PAN", value: identity.pan, department: "Income Tax Department", category: "Identity" },
    { key: "voter", title: "Voter ID", value: identity.voterId, department: "Election Commission", category: "Identity" },
    { key: "ration", title: "Ration Card", value: identity.rationCard, department: "Revenue Department", category: "Government" },
    { key: "abha", title: "ABHA Health ID", value: identity.abhaId, department: "Health Authority", category: "Health" },
  ];

  for (const item of identifiers) {
    push({
      id: `${cid}::identity::${item.key}`,
      category: item.category,
      title: item.title,
      subtitle: item.value,
      department: item.department,
      reference: item.value,
      defaultStatus: "Verified",
      evidenceIds: citizen.evidence.filter((e) => e.linkedRecord.startsWith("Identity")).map((e) => e.id),
    });
  }

  if (identity.passport) {
    push({
      id: `${cid}::identity::passport`,
      category: "Passport",
      title: "Passport",
      subtitle: identity.passport,
      department: "Regional Passport Office",
      reference: identity.passport,
      issuedOn: citizen.travel.passport?.issueDate,
      defaultStatus: citizen.travel.passport?.status === "Expired" ? "Needs Review" : "Verified",
      evidenceIds: citizen.evidence.filter((e) => e.linkedRecord.startsWith("Travel")).map((e) => e.id),
    });
  }

  // --- Issued documents -----------------------------------------------------
  for (const doc of citizen.documents) {
    push({
      id: `${cid}::document::${doc.id}`,
      category: documentCategory(doc.type),
      title: doc.type,
      subtitle: `${doc.documentNumber} · ${doc.issuingAuthority}`,
      department: doc.issuingAuthority,
      reference: doc.documentNumber,
      issuedOn: doc.issueDate,
      defaultStatus: fromSourceStatus(doc.status),
      evidenceIds: citizen.evidence.filter((e) => e.sourceRecordId === doc.id).map((e) => e.id),
    });
  }

  // --- Property and land ----------------------------------------------------
  for (const property of citizen.properties) {
    const disputed = Boolean(property.dispute) || property.encumbrance === "Under Dispute";
    push({
      id: `${cid}::property::${property.id}`,
      category: property.category === "Agricultural Land" ? "Land" : "Property",
      title: `${property.category} — ${property.surveyOrUnitNo}`,
      subtitle: property.address,
      department: property.source,
      reference: property.id,
      issuedOn: property.registrationDate,
      defaultStatus: disputed ? "Rejected" : "Verified",
      evidenceIds: citizen.evidence.filter((e) => e.sourceRecordId === property.id).map((e) => e.id),
    });
  }

  // --- Vehicles -------------------------------------------------------------
  for (const vehicle of citizen.vehicles) {
    const lapsed =
      vehicle.insurance.status === "Expired" || vehicle.fitness.status === "Expired";
    push({
      id: `${cid}::vehicle::${vehicle.id}`,
      category: "Vehicle",
      title: `${vehicle.makeModel} (${vehicle.registrationNumber})`,
      subtitle: `${vehicle.category} · insurance ${vehicle.insurance.status} · fitness ${vehicle.fitness.status}`,
      department: "Transport Department",
      reference: vehicle.registrationNumber,
      issuedOn: vehicle.registeredOn,
      defaultStatus: lapsed ? "Needs Review" : "Verified",
      evidenceIds: citizen.evidence.filter((e) => e.sourceRecordId.includes(vehicle.id)).map((e) => e.id),
    });
  }

  // --- Licences -------------------------------------------------------------
  for (const licence of citizen.licences) {
    push({
      id: `${cid}::licence::${licence.id}`,
      category: "Licence",
      title: licence.type,
      subtitle: `${licence.licenceNumber} · expires ${licence.expiryDate}`,
      department: licence.issuingAuthority,
      reference: licence.licenceNumber,
      issuedOn: licence.issueDate,
      defaultStatus:
        licence.status === "Active"
          ? "Verified"
          : licence.status === "Revoked"
            ? "Rejected"
            : "Needs Review",
      evidenceIds: citizen.evidence.filter((e) => e.sourceRecordId === licence.id).map((e) => e.id),
    });
  }

  // --- Benefits -------------------------------------------------------------
  for (const benefit of citizen.benefits) {
    push({
      id: `${cid}::benefit::${benefit.id}`,
      category: benefit.category === "Health" ? "Medical" : "Benefit",
      title: benefit.scheme,
      subtitle: `${benefit.category} · ${benefit.status} · eligibility ${benefit.eligibility}`,
      department: benefit.department,
      reference: benefit.id,
      issuedOn: benefit.enrollmentDate,
      defaultStatus:
        benefit.eligibility === "Under Review"
          ? "Needs Review"
          : benefit.eligibility === "Not Eligible"
            ? "Draft"
            : "Verified",
      evidenceIds: citizen.evidence.filter((e) => e.sourceRecordId === benefit.id).map((e) => e.id),
    });
  }

  // --- Business & employment ------------------------------------------------
  for (const gst of citizen.employment.gstRegistrations) {
    push({
      id: `${cid}::gst::${gst.gstin}`,
      category: "Employment",
      title: `GST Registration — ${gst.legalName}`,
      subtitle: `${gst.gstin} · ${gst.state} · last filing ${gst.lastFiling}`,
      department: "Goods & Services Tax Network",
      reference: gst.gstin,
      issuedOn: gst.registeredOn,
      defaultStatus:
        gst.status === "Active" ? "Verified" : gst.status === "Cancelled" ? "Rejected" : "Needs Review",
      evidenceIds: citizen.evidence.filter((e) => e.sourceRecordId === gst.gstin).map((e) => e.id),
    });
  }

  for (const role of citizen.employment.directorships) {
    push({
      id: `${cid}::directorship::${role.cin}`,
      category: "Employment",
      title: `Directorship — ${role.company}`,
      subtitle: `${role.role} · DIN ${role.din} · CIN ${role.cin}`,
      department: "Ministry of Corporate Affairs",
      reference: role.cin,
      issuedOn: role.appointedOn,
      defaultStatus: role.status === "Active" ? "Verified" : "Draft",
      evidenceIds: citizen.evidence.filter((e) => e.sourceRecordId === role.cin).map((e) => e.id),
    });
  }

  // --- Financial ------------------------------------------------------------
  for (const filing of citizen.financial.incomeTax) {
    push({
      id: `${cid}::itr::${filing.assessmentYear}`,
      category: "Financial",
      title: `Income Tax Return — AY ${filing.assessmentYear}`,
      subtitle: `Declared ₹${filing.declaredIncome.toLocaleString("en-IN")} · ${filing.filingStatus}`,
      department: "Income Tax Department",
      reference: `ITR-${filing.assessmentYear}`,
      issuedOn: filing.filedOn,
      defaultStatus:
        filing.filingStatus === "Filed"
          ? "Verified"
          : filing.filingStatus === "Overdue"
            ? "Rejected"
            : "Needs Review",
      evidenceIds: citizen.evidence.filter((e) => e.linkedRecord.includes("Income tax")).map((e) => e.id),
    });
  }

  for (const loan of citizen.financial.loans) {
    push({
      id: `${cid}::loan::${loan.id}`,
      category: "Financial",
      title: `${loan.type} — ${loan.lender}`,
      subtitle: `Outstanding ₹${loan.outstanding.toLocaleString("en-IN")} · ${loan.status}`,
      department: "Banking & Credit Bureau",
      reference: loan.id,
      issuedOn: loan.sanctionedOn,
      defaultStatus: loan.status === "Irregular" ? "Rejected" : "Verified",
      evidenceIds: citizen.evidence.filter((e) => e.sourceRecordId === loan.id).map((e) => e.id),
    });
  }

  for (const policy of citizen.financial.insurance) {
    push({
      id: `${cid}::insurance::${policy.id}`,
      category: policy.type === "Vehicle" ? "Vehicle" : "Insurance",
      title: `${policy.type} Insurance — ${policy.insurer}`,
      subtitle: `${policy.policyNumber} · valid to ${policy.validTill}`,
      department: policy.insurer,
      reference: policy.policyNumber,
      defaultStatus: policy.status === "Active" ? "Verified" : "Needs Review",
      evidenceIds: [],
    });
  }

  // --- Residence ------------------------------------------------------------
  const addresses = [
    citizen.addressIntel.current,
    citizen.addressIntel.permanent,
    ...citizen.addressIntel.historical,
  ];
  for (const address of addresses) {
    push({
      id: `${cid}::address::${address.id}`,
      category: "Government",
      title: `${address.type} Address`,
      subtitle: `${address.line}, ${address.city} — ${address.pincode}`,
      department: address.source,
      reference: address.id,
      issuedOn: address.fromDate,
      defaultStatus: address.geoConfidence >= 0.85 ? "Verified" : "Needs Review",
      evidenceIds: citizen.evidence.filter((e) => e.sourceRecordId === address.id).map((e) => e.id),
    });
  }

  // --- Travel ---------------------------------------------------------------
  for (const record of citizen.travel.immigrationRecords) {
    push({
      id: `${cid}::immigration::${record.id}`,
      category: "Travel",
      title: `Immigration ${record.type} — ${record.port}`,
      subtitle: `${record.date} · ref ${record.reference}`,
      department: "Bureau of Immigration",
      reference: record.reference,
      issuedOn: record.date,
      defaultStatus: record.status === "Cleared" ? "Verified" : "Needs Review",
      evidenceIds: citizen.evidence.filter((e) => e.sourceRecordId === record.id).map((e) => e.id),
    });
  }

  // --- Civic records --------------------------------------------------------
  const { civic } = citizen;

  for (const record of civic.education) {
    push({
      id: `${cid}::education::${record.id}`,
      category: "Document",
      title: record.qualification,
      subtitle: `${record.institution} · ${record.board} · ${record.year}`,
      department: record.board,
      reference: record.id,
      issuedOn: `${record.year}-01-01`,
      defaultStatus: record.status === "Verified" ? "Verified" : "Draft",
      evidenceIds: [],
    });
  }

  for (const record of civic.digitalLocker) {
    push({
      id: `${cid}::locker::${record.id}`,
      category: "Document",
      title: `Digital Locker — ${record.document}`,
      subtitle: `${record.issuer} · ${record.format}`,
      department: record.issuer,
      reference: record.id,
      issuedOn: record.issuedOn,
      defaultStatus: "Verified",
      evidenceIds: [],
    });
  }

  for (const record of civic.utilities) {
    push({
      id: `${cid}::utility::${record.id}`,
      category: "Government",
      title: `${record.utility} Connection`,
      subtitle: `${record.provider} · ${record.consumerNumber}`,
      department: record.provider,
      reference: record.consumerNumber,
      defaultStatus: record.status === "Active" ? "Verified" : "Draft",
      evidenceIds: [],
    });
  }

  const clearance = civic.criminalClearance;
  push({
    id: `${cid}::clearance::${clearance.certificateNumber}`,
    category: "Government",
    title: "Police Clearance Certificate",
    subtitle: `${clearance.result} · valid to ${clearance.validTill}`,
    department: clearance.issuingAuthority,
    reference: clearance.certificateNumber,
    issuedOn: clearance.issuedOn,
    defaultStatus:
      clearance.result === "No Adverse Record"
        ? "Verified"
        : clearance.result === "Pending"
          ? "Needs Review"
          : "Rejected",
    evidenceIds: [],
  });

  return records;
}

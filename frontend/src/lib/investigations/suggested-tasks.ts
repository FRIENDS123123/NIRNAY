// AI-suggested opening tasks, authored per synthetic citizen so every task
// points at real evidence IDs from that citizen's record. These are seeds for
// a new case — once created, task state lives on the investigation itself.
//
// Nothing here is generated at runtime: like the rest of the demo data these
// are written by hand, so a task can never cite evidence that does not exist.

interface TaskSeed {
  title: string;
  detail: string;
  evidenceIds: string[];
}

const seedsByCitizen: Record<string, TaskSeed[]> = {
  "NIR-CIT-100234": [
    {
      title: "Verify municipal address",
      detail:
        "The 2022 municipal address proof has never completed field verification, though two other departments corroborate the address. Route it to the verification queue.",
      evidenceIds: ["EV-MUN-01", "EV-ADR-01"],
    },
    {
      title: "Cross-check GST filings",
      detail:
        "Confirm that filings for Deshmukh Retail Ventures reconcile with the commercial property acquired at the same registered address.",
      evidenceIds: ["EV-GST-01", "EV-LR-03"],
    },
    {
      title: "Inspect property acquisition",
      detail:
        "Establish the financing source for the ₹61,00,000 commercial unit acquired in the same assessment year as ₹31,20,000 of declared income.",
      evidenceIds: ["EV-LR-03", "EV-IT-01", "EV-BCB-02"],
    },
    {
      title: "Review travel history",
      detail:
        "Confirm the seven recorded international trips align with the declared employment record. No immigration anomalies are currently flagged.",
      evidenceIds: ["EV-IM-01", "EV-PP-01", "EV-EMP-01"],
    },
    {
      title: "Resolve inactive scheme enrolment",
      detail:
        "PMFBY enrolment is Inactive against a landholding that remains registered. Refer to the Welfare Department for closure or reinstatement.",
      evidenceIds: ["EV-WFD-01", "EV-LR-02"],
    },
  ],

  "NIR-CIT-104871": [
    {
      title: "Reconcile source of funds for 2021 and 2023 acquisitions",
      detail:
        "₹5.00 crore of property was acquired against ₹59,30,000 of cumulative declared income, with no sanctioned facility of that size on record.",
      evidenceIds: ["EV-LR-02", "EV-LR-03", "EV-IT-03", "EV-BCB-02"],
    },
    {
      title: "Confirm fleet operation under expired licence",
      detail:
        "Operator licence and national permit both expired in 2024, yet a fleet vehicle was challaned for permit violation in May 2024.",
      evidenceIds: ["EV-RTA-01", "EV-RTA-02", "EV-TRD-01", "EV-TRD-02"],
    },
    {
      title: "Request immigration review of flagged departure",
      detail:
        "The 26 September 2024 departure carries an unresolved flagged status across eleven trips in five years.",
      evidenceIds: ["EV-IM-01", "EV-IM-02"],
    },
    {
      title: "Close out overdue FY2022-23 filing",
      detail:
        "The FY2022-23 return is overdue with nil tax paid, in the year following the largest single asset acquisition.",
      evidenceIds: ["EV-IT-02", "EV-LR-02"],
    },
    {
      title: "Verify 2023 income certificate",
      detail:
        "Income certificate issued by the Revenue Department in May 2023 was never verified (31% confidence).",
      evidenceIds: ["EV-REV-02"],
    },
    {
      title: "Track mutation objection outcome",
      detail:
        "A co-sharer objection to the Pataudi Road land mutation is pending before the Revenue Court and blocks scheme eligibility.",
      evidenceIds: ["EV-REV-01", "EV-LR-03"],
    },
    {
      title: "Cross-check GST filings",
      detail:
        "Pataudi Warehousing Services is suspended with no filing since November 2023 while the warehouse remains registered.",
      evidenceIds: ["EV-GST-01", "EV-LR-02"],
    },
  ],

  "NIR-CIT-100235": [
    {
      title: "Confirm household linkage to NIR-CIT-100234",
      detail:
        "Shared household ID, address and ration card indicate a single household. Any finding on either record should be assessed against both.",
      evidenceIds: ["EV-FAM-01", "EV-ADR-01"],
    },
    {
      title: "Verify shared vehicle registration",
      detail:
        "The sedan is registered under the spouse's record but recorded against this household. Confirm the primary registrant.",
      evidenceIds: ["EV-TR-01"],
    },
    {
      title: "Review income filings",
      detail:
        "Two assessment years on file, both filed on time. Confirm no further years are outstanding before closing.",
      evidenceIds: ["EV-IT-01", "EV-BCB-02"],
    },
  ],
};

/** Opening task list for a citizen; empty when no seeds are authored. */
export function suggestedTasksFor(citizenId: string): TaskSeed[] {
  return seedsByCitizen[citizenId] ?? [];
}

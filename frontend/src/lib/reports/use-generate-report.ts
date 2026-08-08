import { useCallback } from "react";
import type { Citizen } from "@/mock-data/types";
import type { Investigation } from "@/lib/investigations/types";
import { useVerificationMap } from "@/lib/legal-records/store";
import { resolveLegalRecords } from "@/lib/legal-records/use-legal-records";
import { useActiveRole } from "@/lib/roles/store";
import { roleDefinition } from "@/lib/roles/types";
import { useSettings } from "@/lib/settings/store";
import { buildReportDocument } from "./build";
import { nextReportId, saveReport } from "./store";
import type { SavedReport } from "./types";

/**
 * Generates and saves a report. The document is snapshotted at this moment —
 * including the current verification state — so it stays reproducible.
 */
export function useGenerateReport() {
  const settings = useSettings();
  const role = useActiveRole();
  const verification = useVerificationMap();

  return useCallback(
    (citizen: Citizen, investigation?: Investigation | null): SavedReport => {
      const reportId = nextReportId();
      const records = resolveLegalRecords(citizen, verification);

      const document = buildReportDocument({
        reportId,
        citizen,
        investigation,
        records,
        officer: settings.officerName,
        department: settings.department,
        role: roleDefinition(role).label,
      });

      return saveReport({
        id: reportId,
        document,
        citizenId: citizen.citizenId,
        citizenName: citizen.identity.fullName,
        investigationId: investigation?.id ?? null,
        caseStatus: investigation?.status ?? null,
        riskLevel: citizen.aiSummary.riskLevel,
        riskScore: citizen.aiSummary.metrics.riskScore,
        officer: settings.officerName,
      });
    },
    [settings.officerName, settings.department, role, verification],
  );
}

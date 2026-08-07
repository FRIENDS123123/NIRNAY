import { Briefcase } from "lucide-react";
import type { Citizen } from "@/mock-data/types";
import { ExpandableCard } from "@/components/ui/ExpandableCard";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatDateRange } from "@/lib/format";
import { NoRecords, RecordItem, RecordList, SubHeading } from "./primitives";

export function EmploymentSection({ citizen }: { citizen: Citizen }) {
  const { employment } = citizen;
  const current = employment.history.filter((job) => job.status === "Active");
  const past = employment.history.filter((job) => job.status === "Former");
  const operatingLicences = citizen.licences.filter((l) => l.category !== "Driving");
  const expired = operatingLicences.filter((l) => l.status !== "Active").length;

  return (
    <ExpandableCard
      icon={<Briefcase size={18} aria-hidden="true" />}
      title="Employment & Business"
      summary="Employers, GST registrations, directorships and licences"
      count={
        employment.history.length +
        employment.gstRegistrations.length +
        employment.directorships.length
      }
      meta={
        expired > 0 ? (
          <Badge variant="danger">{expired} expired licence{expired > 1 ? "s" : ""}</Badge>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-5">
        <div>
          <SubHeading className="mb-1.5">Current employment</SubHeading>
          {current.length === 0 ? (
            <NoRecords>No active employment record on file.</NoRecords>
          ) : (
            <RecordList>
              {current.map((job) => (
                <RecordItem
                  key={job.id}
                  title={job.role}
                  subtitle={`${job.employer} · ${job.sector} · since ${formatDate(job.since)}`}
                  meta={<Badge variant="success">Active</Badge>}
                />
              ))}
            </RecordList>
          )}
        </div>

        <div>
          <SubHeading className="mb-1.5">Past employment</SubHeading>
          {past.length === 0 ? (
            <NoRecords>No previous employment on file.</NoRecords>
          ) : (
            <RecordList>
              {past.map((job) => (
                <RecordItem
                  key={job.id}
                  title={job.role}
                  subtitle={`${job.employer} · ${job.sector} · ${formatDateRange(job.since, job.until)}`}
                  meta={<Badge variant="neutral">Former</Badge>}
                />
              ))}
            </RecordList>
          )}
        </div>

        <div>
          <SubHeading className="mb-1.5">GST registrations</SubHeading>
          {employment.gstRegistrations.length === 0 ? (
            <NoRecords>No GST registration is linked to this citizen.</NoRecords>
          ) : (
            <RecordList>
              {employment.gstRegistrations.map((gst) => (
                <RecordItem
                  key={gst.gstin}
                  title={gst.legalName}
                  subtitle={
                    <>
                      <span className="font-mono">{gst.gstin}</span> · {gst.state} · registered{" "}
                      {formatDate(gst.registeredOn)} · last filing {formatDate(gst.lastFiling)}
                    </>
                  }
                  meta={
                    <Badge variant={gst.status === "Active" ? "success" : gst.status === "Suspended" ? "warning" : "danger"}>
                      {gst.status}
                    </Badge>
                  }
                />
              ))}
            </RecordList>
          )}
        </div>

        <div>
          <SubHeading className="mb-1.5">Company directorships</SubHeading>
          {employment.directorships.length === 0 ? (
            <NoRecords>No company directorship is recorded.</NoRecords>
          ) : (
            <RecordList>
              {employment.directorships.map((role) => (
                <RecordItem
                  key={`${role.din}-${role.cin}`}
                  title={role.company}
                  subtitle={
                    <>
                      {role.role} · DIN <span className="font-mono">{role.din}</span> · CIN{" "}
                      <span className="font-mono">{role.cin}</span> · appointed{" "}
                      {formatDate(role.appointedOn)}
                    </>
                  }
                  meta={
                    <Badge variant={role.status === "Active" ? "success" : "neutral"}>
                      {role.status}
                    </Badge>
                  }
                />
              ))}
            </RecordList>
          )}
        </div>

        <div>
          <SubHeading className="mb-1.5">Professional & operating licences</SubHeading>
          {operatingLicences.length === 0 ? (
            <NoRecords>No professional or operating licence on file.</NoRecords>
          ) : (
            <RecordList>
              {operatingLicences.map((licence) => (
                <RecordItem
                  key={licence.id}
                  title={licence.type}
                  subtitle={
                    <>
                      <span className="font-mono">{licence.licenceNumber}</span> ·{" "}
                      {licence.issuingAuthority} · {formatDate(licence.issueDate)} →{" "}
                      {formatDate(licence.expiryDate)}
                    </>
                  }
                  meta={
                    <Badge variant={licence.status === "Active" ? "success" : "danger"}>
                      {licence.status}
                    </Badge>
                  }
                />
              ))}
            </RecordList>
          )}
        </div>
      </div>
    </ExpandableCard>
  );
}

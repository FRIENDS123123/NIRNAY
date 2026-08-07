import { FileStack } from "lucide-react";
import type { Citizen } from "@/mock-data/types";
import { ExpandableCard } from "@/components/ui/ExpandableCard";
import { Badge } from "@/components/ui/Badge";
import { VerificationChip } from "@/components/ui/VerificationChip";
import { CopyButton } from "@/components/ui/CopyButton";
import { formatDate } from "@/lib/format";
import { ConfidenceBar, NoRecords, RecordItem, RecordList } from "./primitives";

export function DocumentsSection({ citizen }: { citizen: Citizen }) {
  const { documents } = citizen;
  const unresolved = documents.filter((d) => d.status !== "Verified").length;

  return (
    <ExpandableCard
      icon={<FileStack size={18} aria-hidden="true" />}
      title="Government Documents"
      summary="Linked documents, validity and verification confidence"
      count={documents.length}
      meta={
        unresolved > 0 ? (
          <Badge variant="warning">{unresolved} unresolved</Badge>
        ) : (
          <Badge variant="success">All verified</Badge>
        )
      }
    >
      {documents.length === 0 ? (
        <NoRecords>No government document is linked to this citizen.</NoRecords>
      ) : (
        <RecordList>
          {documents.map((doc) => (
            <RecordItem
              key={doc.id}
              title={doc.type}
              subtitle={
                <>
                  <span className="font-mono">{doc.documentNumber}</span> · {doc.issuingAuthority}
                  <br />
                  Issued {formatDate(doc.issueDate)}
                  {doc.expiryDate ? ` · expires ${formatDate(doc.expiryDate)}` : " · no expiry"}
                </>
              }
              meta={
                <>
                  <CopyButton value={doc.documentNumber} label={`${doc.type} number`} />
                  <VerificationChip status={doc.status} />
                </>
              }
            >
              <ConfidenceBar value={doc.verificationConfidence} label="Verification confidence" />
            </RecordItem>
          ))}
        </RecordList>
      )}
    </ExpandableCard>
  );
}

import { ShieldCheck } from "lucide-react";
import { PhaseStub } from "@/components/layout/PhaseStub";

export function InvestigationsPage() {
  return (
    <PhaseStub
      icon={<ShieldCheck size={26} strokeWidth={2} />}
      title="Investigations"
      description="Saved, in-progress investigations will live here. This surface is planned for a later phase — see docs/08_DEVELOPMENT_PLAN.md. For now, open a citizen profile to start an AI-assisted investigation."
    />
  );
}

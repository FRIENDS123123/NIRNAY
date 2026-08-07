import { FileBarChart2 } from "lucide-react";
import { PhaseStub } from "@/components/layout/PhaseStub";

export function ReportsPage() {
  return (
    <PhaseStub
      icon={<FileBarChart2 size={26} strokeWidth={2} />}
      title="Reports"
      description="Generated Intelligence Reports will be listed and retrievable here. Report generation is planned for a later phase — see docs/08_DEVELOPMENT_PLAN.md."
    />
  );
}

import { Settings } from "lucide-react";
import { PhaseStub } from "@/components/layout/PhaseStub";

export function SettingsPage() {
  return (
    <PhaseStub
      icon={<Settings size={26} strokeWidth={2} />}
      title="Settings"
      description="Officer preferences and platform configuration will live here in a later phase. NIRNAY's Phase 1 has no configurable settings — see docs/08_DEVELOPMENT_PLAN.md."
    />
  );
}

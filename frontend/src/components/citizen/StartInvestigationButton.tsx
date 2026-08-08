import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FolderPlus, Loader2 } from "lucide-react";
import type { Citizen } from "@/mock-data/types";
import { createInvestigation } from "@/lib/investigations/store";
import { useInvestigationsForCitizen } from "@/lib/investigations/use-investigations";

/**
 * The single primary action on a citizen profile. Opens a synthetic case from
 * the resolved record and drops the officer straight into the workspace.
 */
export function StartInvestigationButton({ citizen }: { citizen: Citizen }) {
  const navigate = useNavigate();
  const existing = useInvestigationsForCitizen(citizen.citizenId);
  const [creating, setCreating] = useState(false);

  function handleStart() {
    setCreating(true);
    const investigation = createInvestigation(citizen);
    navigate(`/investigations/${investigation.id}`);
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1">
      {existing.length > 0 && (
        <Link
          to="/investigations"
          className="rounded text-xs font-medium text-ink-500 underline-offset-2 transition-colors hover:text-primary-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        >
          {existing.length} existing investigation{existing.length === 1 ? "" : "s"}
        </Link>
      )}

      <button
        type="button"
        onClick={handleStart}
        disabled={creating}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(41,38,120,0.16)] transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
      >
        {creating ? (
          <Loader2 size={15} strokeWidth={2.5} className="animate-spin" aria-hidden="true" />
        ) : (
          <FolderPlus size={15} strokeWidth={2.5} aria-hidden="true" />
        )}
        Start Investigation
      </button>
    </div>
  );
}

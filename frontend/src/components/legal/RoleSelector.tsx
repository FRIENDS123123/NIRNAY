import { useId } from "react";
import { ChevronDown, UserCog } from "lucide-react";
import { ROLES, type Role } from "@/lib/roles/types";
import { setActiveRole, useActiveRole } from "@/lib/roles/store";
import { cn } from "@/lib/cn";

/**
 * Global role selector. Role scoping is a demonstration of record visibility —
 * it is not an authentication or authorisation boundary.
 */
export function RoleSelector({ className }: { className?: string }) {
  const role = useActiveRole();
  const id = useId();

  return (
    <div className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        Active role
      </label>
      <UserCog
        size={13}
        strokeWidth={2.25}
        aria-hidden="true"
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400"
      />
      <select
        id={id}
        value={role}
        onChange={(event) => setActiveRole(event.target.value as Role)}
        aria-label={`Active role: ${role}`}
        className="appearance-none rounded-full border border-ink-200 bg-surface py-1.5 pl-7 pr-7 text-xs font-semibold text-ink-700 transition-colors hover:border-ink-300 focus-visible:border-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
      >
        {ROLES.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        strokeWidth={2.25}
        aria-hidden="true"
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400"
      />
    </div>
  );
}

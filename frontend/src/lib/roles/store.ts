import { useSyncExternalStore } from "react";
import { createLocalStore } from "@/lib/local-store";
import { DEFAULT_ROLE, ROLES, type Role } from "./types";

const isRole = (value: unknown): value is Role =>
  typeof value === "string" && ROLES.some((r) => r.id === value);

export const roleStore = createLocalStore<Role>("nirnay.active-role", DEFAULT_ROLE, isRole);

/** The active operator role. Changing it re-renders every scoped surface. */
export function useActiveRole(): Role {
  return useSyncExternalStore(
    roleStore.subscribe,
    roleStore.getSnapshot,
    roleStore.getServerSnapshot,
  );
}

export function setActiveRole(role: Role) {
  roleStore.set(role);
}

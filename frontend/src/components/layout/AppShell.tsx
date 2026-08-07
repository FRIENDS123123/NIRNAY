import type { ReactNode } from "react";
import { TopNav } from "./TopNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <TopNav />
      <main>{children}</main>
    </div>
  );
}

import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { HomePage } from "@/pages/HomePage";

// The landing page ships in the initial bundle because it is the entry point
// of the primary flow. Everything downstream is split so the first paint stays
// small — the profile in particular pulls in ten intelligence sections.
const SearchPage = lazy(() => import("@/pages/SearchPage").then((m) => ({ default: m.SearchPage })));
const CitizenProfilePage = lazy(() =>
  import("@/pages/CitizenProfilePage").then((m) => ({ default: m.CitizenProfilePage })),
);
const InvestigationsPage = lazy(() =>
  import("@/pages/InvestigationsPage").then((m) => ({ default: m.InvestigationsPage })),
);
const ReportsPage = lazy(() => import("@/pages/ReportsPage").then((m) => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import("@/pages/SettingsPage").then((m) => ({ default: m.SettingsPage })));

function RouteFallback() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center" aria-busy="true">
      <Loader2 size={20} className="animate-spin text-ink-300" strokeWidth={2.5} aria-label="Loading" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/citizens/:citizenId" element={<CitizenProfilePage />} />
            <Route path="/investigations" element={<InvestigationsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  );
}

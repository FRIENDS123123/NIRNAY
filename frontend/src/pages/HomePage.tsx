import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { SearchBar } from "@/components/search/SearchBar";
import { citizens } from "@/mock-data/citizens";

const quickAccess = citizens.map((c) => ({
  id: c.citizenId,
  name: c.identity.fullName,
  initials: c.identity.photoInitials,
  city: c.addressIntel.current.city,
  risk: c.aiSummary.riskLevel,
}));

const riskDotClasses = {
  Low: "bg-success-500",
  Medium: "bg-warning-500",
  High: "bg-danger-500",
} as const;

export function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex w-full max-w-2xl flex-col items-center text-center"
      >
        <Logo size="lg" />

        <p className="mt-4 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-accent-600">
          AI Unified Citizen Intelligence Platform
        </p>

        <h1 className="mt-5 text-2xl font-bold leading-snug text-ink-900 md:text-3xl">
          Find a citizen. See everything, instantly.
        </h1>
        <p className="mt-2 max-w-lg text-sm text-ink-500 md:text-base">
          Search once — NIRNAY correlates records across every linked department into a
          single, evidence-backed profile.
        </p>

        <div className="mt-9 w-full">
          <SearchBar size="hero" />
        </div>

        <div className="mt-11 w-full">
          <p className="text-sm text-ink-500">
            Search by name, Aadhaar, PAN, passport, driving licence, phone or Citizen ID — or
            open one of the demo records below to see a full profile straight away.
          </p>

          <div className="mt-3.5 grid gap-2.5">
            {quickAccess.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.06 }}
              >
                <Link
                  to={`/citizens/${c.id}`}
                  className="group flex h-full items-center gap-3 rounded-2xl border border-ink-200 bg-surface p-3.5 text-left shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-xs font-bold text-white">
                    {c.initials}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink-900">
                      {c.name}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-ink-400">
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${riskDotClasses[c.risk]}`}
                      />
                      {c.risk} risk · {c.city}
                    </span>
                  </span>

                  <ArrowRight
                    size={14}
                    strokeWidth={2.5}
                    aria-hidden="true"
                    className="shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-primary-600"
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400">
            Demo records · fully synthetic
          </p>
        </div>
      </motion.div>
    </div>
  );
}

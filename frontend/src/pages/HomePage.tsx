import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/layout/Logo";
import { SearchBar } from "@/components/search/SearchBar";
import { citizens } from "@/mock-data/citizens";

const quickAccess = citizens.map((c) => ({ id: c.citizenId, name: c.identity.fullName }));

export function HomePage() {
  const navigate = useNavigate();

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

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs text-ink-400">
          <span>Try a synthetic profile:</span>
          {quickAccess.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/citizens/${c.id}`)}
              className="rounded-full border border-ink-200 bg-white px-2.5 py-1 font-medium text-ink-600 transition-colors hover:border-primary-300 hover:text-primary-700"
            >
              {c.name}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

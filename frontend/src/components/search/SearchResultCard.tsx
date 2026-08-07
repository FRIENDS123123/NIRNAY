import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { SearchResult } from "@/mock-data/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function SearchResultCard({ result, index }: { result: SearchResult; index: number }) {
  const navigate = useNavigate();
  const confidencePct = Math.round(result.matchConfidence * 100);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      onClick={() => navigate(`/citizens/${result.citizenId}`)}
      className="w-full text-left"
    >
      <Card className="flex items-center gap-4 px-5 py-4 transition-shadow hover:shadow-[var(--shadow-card-hover)]">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
          {initialsOf(result.fullName)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="font-semibold text-ink-900">{result.fullName}</span>
            <Badge variant={confidencePct >= 90 ? "success" : "accent"}>{confidencePct}% match</Badge>
          </span>
          <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-ink-500">
            <span className="font-mono">{result.citizenId}</span>
            <span>DOB {result.dateOfBirth}</span>
            <span>{result.address}</span>
          </span>
        </span>
        <ChevronRight size={18} className="shrink-0 text-ink-300" />
      </Card>
    </motion.button>
  );
}

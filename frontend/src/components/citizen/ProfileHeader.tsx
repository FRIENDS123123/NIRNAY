import { motion } from "framer-motion";
import { Cake, MapPin, Phone } from "lucide-react";
import type { Citizen } from "@/mock-data/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function ProfileHeader({ citizen }: { citizen: Citizen }) {
  const confidencePct = Math.round(citizen.resolutionConfidence * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-2xl font-bold text-white">
          {citizen.identity.photoInitials}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-ink-900">{citizen.identity.fullName}</h1>
            <Badge variant={confidencePct >= 90 ? "success" : "accent"}>
              {confidencePct}% resolution confidence
            </Badge>
          </div>
          <p className="mt-0.5 font-mono text-xs text-ink-400">{citizen.citizenId}</p>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink-500">
            <span className="flex items-center gap-1.5">
              <Cake size={14} /> {citizen.identity.dateOfBirth} · {citizen.identity.gender}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={14} /> {citizen.identity.phone}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} /> {citizen.address.city}, {citizen.address.state}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

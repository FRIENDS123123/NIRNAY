import { motion } from "framer-motion";
import {
  Banknote,
  Briefcase,
  Building2,
  Car,
  Fingerprint,
  HandHeart,
  History,
  IdCard,
  Plane,
} from "lucide-react";
import type { Citizen, TimelineCategory, TimelineEvent } from "@/mock-data/types";
import { Card } from "@/components/ui/Card";
import { EvidenceRefs } from "@/components/evidence/EvidenceRefs";
import { formatDate, yearOf } from "@/lib/format";

const categoryIcons: Record<TimelineCategory, typeof Fingerprint> = {
  Identity: Fingerprint,
  Property: Building2,
  Vehicle: Car,
  Employment: Briefcase,
  Travel: Plane,
  Financial: Banknote,
  Licence: IdCard,
  Benefit: HandHeart,
};

const categoryClasses: Record<TimelineCategory, string> = {
  Identity: "bg-primary-50 text-primary-600 ring-primary-100",
  Property: "bg-accent-50 text-accent-700 ring-accent-100",
  Vehicle: "bg-ink-100 text-ink-600 ring-ink-200",
  Employment: "bg-primary-50 text-primary-600 ring-primary-100",
  Travel: "bg-accent-50 text-accent-700 ring-accent-100",
  Financial: "bg-success-50 text-success-700 ring-success-200",
  Licence: "bg-warning-50 text-warning-700 ring-warning-100",
  Benefit: "bg-success-50 text-success-700 ring-success-200",
};

function groupByYear(events: TimelineEvent[]): { year: string; events: TimelineEvent[] }[] {
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const groups: { year: string; events: TimelineEvent[] }[] = [];

  for (const event of sorted) {
    const year = yearOf(event.date);
    const last = groups[groups.length - 1];
    if (last?.year === year) last.events.push(event);
    else groups.push({ year, events: [event] });
  }
  return groups;
}

/**
 * Chronological trail of every recorded departmental event. Reads oldest to
 * newest so the citizen's history builds up the way an officer would narrate it.
 */
export function CitizenTimeline({ citizen }: { citizen: Citizen }) {
  const groups = groupByYear(citizen.timeline);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 px-5 py-4">
        <div className="flex items-center gap-3.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
            <History size={18} aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-semibold text-ink-900">Citizen Timeline</h2>
            <p className="text-sm text-ink-500">
              Every departmental event on record, oldest first
            </p>
          </div>
        </div>
        <span className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-500">
          {citizen.timeline.length} events
        </span>
      </div>

      <div className="px-5 py-5">
        <ol className="relative">
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-[15px] top-2 w-px bg-gradient-to-b from-primary-200 via-ink-200 to-transparent"
          />

          {groups.map((group) => (
            <li key={group.year}>
              <div className="relative mb-3 flex items-center gap-3 pt-1">
                <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600 font-mono text-[10px] font-bold text-white ring-4 ring-surface">
                  {group.year.slice(2)}
                </span>
                <span className="font-mono text-sm font-bold tracking-wide text-ink-900">
                  {group.year}
                </span>
                <span className="h-px flex-1 bg-ink-100" />
              </div>

              <ul className="mb-5 ml-[15px] flex flex-col gap-2.5 border-l border-transparent pl-[21px]">
                {group.events.map((event, i) => {
                  const Icon = categoryIcons[event.category];
                  return (
                    <motion.li
                      key={`${event.date}-${event.title}`}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.2) }}
                      className="relative rounded-xl border border-ink-100 bg-canvas/40 p-3.5 transition-colors hover:border-ink-200 hover:bg-canvas"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute -left-[25px] top-5 h-2 w-2 rounded-full bg-primary-400 ring-4 ring-surface"
                      />

                      <div className="flex flex-wrap items-start gap-3">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ${categoryClasses[event.category]}`}
                        >
                          <Icon size={14} strokeWidth={2.25} aria-hidden="true" />
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <p className="text-sm font-semibold text-ink-900">{event.title}</p>
                            <span className="font-mono text-[11px] text-ink-400">
                              {formatDate(event.date)}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs leading-relaxed text-ink-600">
                            {event.description}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[10px] uppercase tracking-wide text-ink-400">
                              {event.department}
                            </span>
                            <EvidenceRefs
                              ids={event.evidenceIds}
                              context={event.title}
                              evidence={citizen.evidence}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
}

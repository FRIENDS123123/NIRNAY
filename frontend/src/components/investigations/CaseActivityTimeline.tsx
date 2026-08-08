import { motion } from "framer-motion";
import { CheckSquare, FolderPlus, History, NotebookPen, SlidersHorizontal } from "lucide-react";
import type { ActivityKind, CaseActivity } from "@/lib/investigations/types";
import { Card } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/format";

const kindIcons: Record<ActivityKind, typeof History> = {
  created: FolderPlus,
  status: SlidersHorizontal,
  note: NotebookPen,
  task: CheckSquare,
};

const kindClasses: Record<ActivityKind, string> = {
  created: "bg-primary-50 text-primary-600 ring-primary-100",
  status: "bg-accent-50 text-accent-700 ring-accent-100",
  note: "bg-ink-100 text-ink-600 ring-ink-200",
  task: "bg-success-50 text-success-700 ring-success-200",
};

/**
 * Case activity, newest first. This is the investigation's own audit trail —
 * the citizen's departmental timeline stays on the citizen profile.
 */
export function CaseActivityTimeline({ activity }: { activity: CaseActivity[] }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white">
          <History size={18} aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-semibold text-ink-900">Case Timeline</h2>
          <p className="text-sm text-ink-500">Audit trail for this investigation, newest first</p>
        </div>
      </div>

      <ol className="relative mt-5">
        <span
          aria-hidden="true"
          className="absolute bottom-3 left-[15px] top-3 w-px bg-gradient-to-b from-primary-200 via-ink-200 to-transparent"
        />

        {activity.map((event, i) => {
          const Icon = kindIcons[event.kind];
          return (
            <motion.li
              key={event.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.22, delay: Math.min(i * 0.03, 0.18) }}
              className="relative flex gap-3.5 pb-4 last:pb-0"
            >
              <span
                className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-surface ${kindClasses[event.kind]}`}
              >
                <Icon size={14} strokeWidth={2.25} aria-hidden="true" />
              </span>

              <div className="min-w-0 flex-1 pt-1">
                <p className="text-sm font-semibold text-ink-900">{event.label}</p>
                {event.detail && (
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-600">{event.detail}</p>
                )}
                <p className="mt-0.5 font-mono text-[11px] text-ink-400">
                  {formatDateTime(event.at)}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </Card>
  );
}

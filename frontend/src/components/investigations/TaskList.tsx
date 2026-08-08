import { motion } from "framer-motion";
import { CircleDashed, ListChecks, Loader, CheckCircle2 } from "lucide-react";
import type { Evidence } from "@/mock-data/types";
import type { Investigation, InvestigationTask, TaskStatus } from "@/lib/investigations/types";
import { TASK_STATUSES } from "@/lib/investigations/types";
import { setTaskStatus } from "@/lib/investigations/store";
import { Card } from "@/components/ui/Card";
import { EvidenceRefs } from "@/components/evidence/EvidenceRefs";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/cn";

const statusIcons: Record<TaskStatus, typeof CircleDashed> = {
  Pending: CircleDashed,
  "In Progress": Loader,
  Completed: CheckCircle2,
};

const activeClasses: Record<TaskStatus, string> = {
  Pending: "bg-ink-200 text-ink-700",
  "In Progress": "bg-warning-100 text-warning-700",
  Completed: "bg-success-100 text-success-700",
};

function TaskRow({
  investigationId,
  task,
  evidence,
}: {
  investigationId: string;
  task: InvestigationTask;
  evidence: Evidence[];
}) {
  const Icon = statusIcons[task.status];
  const done = task.status === "Completed";

  return (
    <motion.li
      layout
      className={cn(
        "rounded-xl border p-3.5 transition-colors",
        done ? "border-success-200 bg-success-50/40" : "border-ink-100 bg-canvas/50",
      )}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg",
            done ? "bg-success-100 text-success-700" : "bg-ink-100 text-ink-500",
          )}
        >
          <Icon size={13} strokeWidth={2.5} aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-sm font-semibold text-ink-900",
              done && "text-ink-500 line-through decoration-ink-300",
            )}
          >
            {task.title}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-600">{task.detail}</p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <EvidenceRefs ids={task.evidenceIds} context={task.title} evidence={evidence} />
            {task.completedAt && (
              <span className="text-[11px] text-success-700">
                Completed {formatRelative(task.completedAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        role="group"
        aria-label={`Status for task: ${task.title}`}
        className="mt-3 flex flex-wrap gap-1 border-t border-ink-100 pt-2.5"
      >
        {TASK_STATUSES.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={task.status === option}
            onClick={() => setTaskStatus(investigationId, task.id, option)}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
              task.status === option
                ? activeClasses[option]
                : "text-ink-500 hover:bg-ink-100 hover:text-ink-900",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </motion.li>
  );
}

export function TaskList({
  investigation,
  evidence,
}: {
  investigation: Investigation;
  evidence: Evidence[];
}) {
  const completed = investigation.tasks.filter((t) => t.status === "Completed").length;
  const total = investigation.tasks.length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white">
            <ListChecks size={18} aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-semibold text-ink-900">AI Suggested Tasks</h2>
            <p className="text-sm text-ink-500">
              Derived from this citizen's investigation leads · demo synthesis, not live AI
            </p>
          </div>
        </div>
        <span className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-600">
          {completed} of {total} completed
        </span>
      </div>

      {total > 0 && (
        <div
          className="mt-4 h-1.5 overflow-hidden rounded-full bg-ink-200"
          role="img"
          aria-label={`${pct}% of tasks completed`}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </div>
      )}

      {total === 0 ? (
        <p className="mt-4 text-sm italic text-ink-400">
          No suggested tasks are authored for this citizen record.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2.5">
          {investigation.tasks.map((task) => (
            <TaskRow
              key={task.id}
              investigationId={investigation.id}
              task={task}
              evidence={evidence}
            />
          ))}
        </ul>
      )}
    </Card>
  );
}

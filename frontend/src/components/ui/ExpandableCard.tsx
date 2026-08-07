import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card } from "./Card";

interface ExpandableCardProps {
  icon: ReactNode;
  title: string;
  summary?: string;
  count?: number;
  /** Rendered at the right of the header — status chips, alerts, totals. */
  meta?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function ExpandableCard({
  icon,
  title,
  summary,
  count,
  meta,
  defaultOpen = false,
  children,
}: ExpandableCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-3.5 px-5 py-4 text-left transition-colors hover:bg-canvas/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-400"
      >
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
            open ? "bg-primary-600 text-white" : "bg-primary-50 text-primary-600",
          )}
        >
          {icon}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="font-semibold text-ink-900">{title}</span>
            {typeof count === "number" && (
              <span className="rounded-full bg-ink-100 px-1.5 py-0.5 text-[11px] font-medium text-ink-500">
                {count}
              </span>
            )}
          </span>
          {summary && <span className="mt-0.5 block truncate text-sm text-ink-500">{summary}</span>}
        </span>

        {meta && <span className="hidden shrink-0 sm:block">{meta}</span>}

        <ChevronDown
          size={18}
          aria-hidden="true"
          className={cn("shrink-0 text-ink-400 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-ink-100 px-5 py-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

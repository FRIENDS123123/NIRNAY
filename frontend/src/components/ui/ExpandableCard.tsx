import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card } from "./Card";

interface ExpandableCardProps {
  icon: ReactNode;
  title: string;
  summary?: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function ExpandableCard({ icon, title, summary, count, defaultOpen = false, children }: ExpandableCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3.5 px-5 py-4 text-left"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
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
        <ChevronDown
          size={18}
          className={cn("shrink-0 text-ink-400 transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
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

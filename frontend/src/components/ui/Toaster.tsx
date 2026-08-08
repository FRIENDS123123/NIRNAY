import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { dismissToast, useToasts, type ToastTone } from "@/lib/toast";

const config: Record<ToastTone, { icon: typeof CheckCircle2; classes: string }> = {
  success: { icon: CheckCircle2, classes: "text-success-700 bg-success-50 ring-success-200" },
  info: { icon: Info, classes: "text-primary-700 bg-primary-50 ring-primary-200" },
  danger: { icon: TriangleAlert, classes: "text-danger-700 bg-danger-50 ring-danger-100" },
};

/** Transient confirmations, bottom-right. Announced politely to screen readers. */
export function Toaster() {
  const toasts = useToasts();

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
    >
      <AnimatePresence initial={false}>
        {toasts.map((item) => {
          const { icon: Icon, classes } = config[item.tone];
          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="pointer-events-auto flex items-start gap-2.5 rounded-xl border border-ink-100 bg-surface p-3 shadow-[var(--shadow-card-hover)]"
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ${classes}`}
              >
                <Icon size={13} strokeWidth={2.5} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink-900">{item.title}</p>
                {item.description && (
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{item.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(item.id)}
                aria-label="Dismiss notification"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

import type { ReactNode } from "react";

export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-100 text-ink-400">
        {icon}
      </span>
      <div>
        <p className="font-semibold text-ink-900">{title}</p>
        <p className="mt-1 max-w-sm text-sm text-ink-500">{description}</p>
      </div>
    </div>
  );
}

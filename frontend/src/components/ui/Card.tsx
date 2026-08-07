import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-ink-100 bg-surface shadow-[var(--shadow-card)]",
        className,
      )}
      {...props}
    />
  );
}

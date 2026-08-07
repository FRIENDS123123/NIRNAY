import { cn } from "@/lib/cn";

/** Single shimmering placeholder block. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-lg bg-ink-100", className)}
    />
  );
}

/** Placeholder shaped like a search intelligence card. */
export function SearchResultSkeleton() {
  return (
    <div className="rounded-2xl border border-ink-100 bg-surface p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 shrink-0 rounded-2xl" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="mt-2 h-3 w-32" />
        </div>
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-4/5" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

/** Placeholder shaped like the citizen profile, shown while records correlate. */
export function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-ink-100 bg-surface p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-5">
          <Skeleton className="h-20 w-20 rounded-2xl" />
          <div className="flex-1">
            <Skeleton className="h-5 w-56" />
            <Skeleton className="mt-2.5 h-3 w-36" />
            <Skeleton className="mt-3 h-3 w-72" />
          </div>
        </div>
      </div>
      <Skeleton className="h-64 w-full rounded-2xl" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[72px] w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

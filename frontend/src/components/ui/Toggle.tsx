import { useId } from "react";
import { cn } from "@/lib/cn";

interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

/** Labelled switch built on a real checkbox, so it is keyboard operable. */
export function Toggle({ checked, onChange, label, description, disabled }: ToggleProps) {
  const id = useId();

  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <div className="min-w-0">
        <label
          htmlFor={id}
          className={cn(
            "text-sm font-medium text-ink-900",
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
          )}
        >
          {label}
        </label>
        {description && <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{description}</p>}
      </div>

      <label
        className={cn(
          "relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-primary-600" : "bg-ink-200",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        )}
      >
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none ml-0.5 h-4 w-4 rounded-full bg-surface shadow-sm transition-transform",
            checked && "translate-x-4",
          )}
        />
        <span className="pointer-events-none absolute inset-0 rounded-full peer-focus-visible:ring-2 peer-focus-visible:ring-primary-400 peer-focus-visible:ring-offset-2" />
      </label>
    </div>
  );
}

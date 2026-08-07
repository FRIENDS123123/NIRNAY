import { cn } from "@/lib/cn";

export function Logo({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const dims = { sm: 26, md: 34, lg: 48 }[size];
  const textSize = { sm: "text-base", md: "text-xl", lg: "text-3xl" }[size];

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg width={dims} height={dims} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="11" fill="url(#nirnay-logo-gradient)" />
        <path
          d="M12 27V13.5L23 27V13.5"
          stroke="white"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="28.5" cy="13" r="2.1" fill="#5EEAD4" />
        <defs>
          <linearGradient id="nirnay-logo-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3730B8" />
            <stop offset="1" stopColor="#22A7A1" />
          </linearGradient>
        </defs>
      </svg>
      <span className={cn("font-extrabold tracking-tight text-ink-900", textSize)}>NIRNAY</span>
    </span>
  );
}

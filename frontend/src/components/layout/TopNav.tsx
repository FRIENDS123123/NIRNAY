import { NavLink } from "react-router-dom";
import { FolderSearch, Home, Settings, ShieldCheck, FileBarChart2 } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";

const navItems = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/search", label: "Citizen Search", icon: FolderSearch, end: false },
  { to: "/investigations", label: "Investigations", icon: ShieldCheck, end: false },
  { to: "/reports", label: "Reports", icon: FileBarChart2, end: false },
  { to: "/settings", label: "Settings", icon: Settings, end: false },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-6 md:gap-6">
        <NavLink to="/" className="shrink-0">
          <Logo size="sm" />
        </NavLink>

        {/* Scrolls within itself on narrow screens so the five items stay
            reachable without ever widening the page. */}
        <nav className="scrollbar-none flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-primary-50 text-primary-700" : "text-ink-500 hover:bg-ink-100 hover:text-ink-900",
                )
              }
            >
              <Icon size={16} strokeWidth={2.25} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full border border-warning-100 bg-warning-50 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-widest text-warning-700 sm:inline-flex">
            Synthetic data
          </span>
          <div className="flex items-center gap-2.5 rounded-full border border-ink-200 py-1 pl-1 pr-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white">
              RS
            </span>
            <span className="hidden text-left leading-tight md:block">
              <span className="block text-xs font-semibold text-ink-900">R. Sharma</span>
              <span className="block text-[11px] text-ink-400">Investigating Officer</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

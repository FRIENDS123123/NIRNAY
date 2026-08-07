import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export function PhaseStub({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
        {icon}
      </span>
      <h1 className="mt-5 text-xl font-bold text-ink-900">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-500">{description}</p>
      <Link
        to="/search"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
      >
        <Search size={15} /> Go to Citizen Search
      </Link>
    </div>
  );
}

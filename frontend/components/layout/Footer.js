import Link from "next/link";
import { Plane } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-slate-900">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-600 to-violet-600 text-white">
              <Plane className="h-4 w-4" />
            </span>
            AI Trip Planner
          </Link>
          <div className="flex gap-5 text-sm text-slate-500">
            <Link href="/explore" className="hover:text-slate-800">Explore</Link>
            <Link href="/about" className="hover:text-slate-800">About</Link>
            <Link href="/plan" className="hover:text-slate-800">Plan a trip</Link>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} AI Trip Planner · AI-generated suggestions — verify hotels,
          prices & availability before booking.
        </p>
      </div>
    </footer>
  );
}

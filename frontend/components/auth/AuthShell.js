"use client";

import Link from "next/link";
import { Plane } from "lucide-react";
import { seedImage } from "../../lib/img";

// Travel-themed split-screen shell for all auth pages. Responsive:
// image panel hides on small screens, form panel is always full-width there.
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Visual panel */}
      <div className="relative hidden lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${seedImage("travel-auth-scenery", 1200, 1600)}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/80 via-brand-700/60 to-violet-800/70" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <Plane className="h-5 w-5" />
            </span>
            AI Trip Planner
          </Link>
          <div>
            <h2 className="font-display text-4xl font-bold leading-tight">
              Plan your perfect journey with AI
            </h2>
            <p className="mt-3 max-w-md text-brand-100">
              Personalized itineraries, smart budgets, and destination-aware
              recommendations — all in one beautiful place.
            </p>
          </div>
          <p className="text-sm text-brand-200">
            © {new Date().getFullYear()} AI Trip Planner
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-slate-50 px-5 py-12">
        <div className="w-full max-w-md animate-fade-up">
          <Link
            href="/"
            className="mb-8 flex items-center gap-2 text-lg font-bold text-slate-900 lg:hidden"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 text-white">
              <Plane className="h-5 w-5" />
            </span>
            AI Trip Planner
          </Link>

          <h1 className="font-display text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}

          <div className="mt-6">{children}</div>

          {footer && <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

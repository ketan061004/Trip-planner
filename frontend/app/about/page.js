import Link from "next/link";
import { Sparkles, Brain, Route, ShieldCheck } from "lucide-react";

export const metadata = { title: "About · AI Trip Planner" };

const STEPS = [
  { icon: Brain, title: "Tell us your style", desc: "Share your destination, dates, budget, and interests." },
  { icon: Sparkles, title: "AI builds your plan", desc: "We generate a personalized day-by-day itinerary in seconds." },
  { icon: Route, title: "Refine & go", desc: "Edit preferences, regenerate, save, and share your trip." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
        <Sparkles className="h-4 w-4" /> About
      </span>
      <h1 className="mt-4 font-display text-4xl font-bold text-slate-900">
        Travel planning, reimagined with AI
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        AI Trip Planner turns your preferences into a complete, personalized travel plan —
        itineraries, budgets, weather-aware suggestions, and local recommendations, all in one
        place. No more juggling a dozen tabs.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <div key={s.title} className="card p-6">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <s.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-600">Step {i + 1}</p>
            <h3 className="mt-1 font-semibold text-slate-900">{s.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
        <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0" />
        <p>
          Recommendations are AI-generated to inspire your planning. Always verify hotels, prices,
          opening hours, and availability before booking.
        </p>
      </div>

      <div className="mt-12 text-center">
        <Link href="/plan" className="btn-gradient inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-semibold">
          <Sparkles className="h-5 w-5" /> Start planning
        </Link>
      </div>
    </div>
  );
}

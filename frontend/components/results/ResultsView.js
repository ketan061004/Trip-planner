"use client";

import { useRef } from "react";
import { Hotel, UtensilsCrossed, Lightbulb, Bus, Tag } from "lucide-react";
import CoverImage from "./CoverImage";
import DayCard from "./DayCard";
import ActionBar from "./ActionBar";
import { downloadPdf } from "./pdf";

function Money({ value, currency }) {
  const n = typeof value === "number" ? value.toLocaleString() : value;
  return <span>{currency} {n}</span>;
}

function BudgetCard({ budget, currency }) {
  const entries = Object.entries(budget.breakdown || {});
  const max = Math.max(1, ...entries.map(([, v]) => Number(v) || 0));
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-slate-900">Budget breakdown</h3>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${budget.withinBudget ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
          {budget.withinBudget ? "Within budget" : "Over budget"}
        </span>
      </div>
      <p className="mt-1 font-display text-3xl font-bold text-slate-900">
        <Money value={budget.total} currency={currency} />
      </p>
      {budget.budgetNote && <p className="mt-1 text-sm text-slate-500">{budget.budgetNote}</p>}
      <div className="mt-5 space-y-3">
        {entries.map(([k, v]) => (
          <div key={k}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="capitalize text-slate-600">{k}</span>
              <span className="font-medium text-slate-800"><Money value={v} currency={currency} /></span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500"
                style={{ width: `${((Number(v) || 0) / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResultsView({ plan, input, coverImage, actions = {} }) {
  const printRef = useRef(null);
  if (!plan) return null;

  const cur = plan.budget?.currency || plan.tripMeta?.currency || input?.currency || "USD";
  const city = plan.destination?.city || input?.destination || "trip";

  const onDownload = () =>
    downloadPdf(printRef.current, `${city.replace(/\s+/g, "-").toLowerCase()}-itinerary.pdf`);

  return (
    <div className="space-y-6">
      <CoverImage plan={plan} input={input} coverImage={coverImage} />

      <ActionBar {...actions} onDownload={onDownload} />

      <div ref={printRef} className="space-y-6 bg-slate-50">
        {/* Interests */}
        {input?.interests?.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
              <Tag className="h-4 w-4 text-brand-500" /> Interests:
            </span>
            {input.interests.map((i) => (
              <span key={i} className="rounded-full bg-white px-3 py-1 text-sm text-slate-700 shadow-sm">{i}</span>
            ))}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Itinerary */}
          <div className="space-y-4 lg:col-span-2">
            <h3 className="font-display text-lg font-bold text-slate-900">Day-by-day itinerary</h3>
            {(plan.days || []).map((d, i) => (
              <DayCard key={d.day ?? i} day={d} currency={cur} defaultOpen={i === 0} />
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {plan.budget && <BudgetCard budget={plan.budget} currency={cur} />}

            {plan.transport && (plan.transport.gettingAround || plan.transport.fromAirport) && (
              <div className="card p-6">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                  <Bus className="h-5 w-5 text-brand-600" /> Getting around
                </h3>
                {plan.transport.gettingAround && <p className="mt-2 text-sm text-slate-600">{plan.transport.gettingAround}</p>}
                {plan.transport.fromAirport && <p className="mt-2 text-sm text-slate-600"><span className="font-medium">From airport:</span> {plan.transport.fromAirport}</p>}
              </div>
            )}

            {plan.hotels?.length > 0 && (
              <div className="card p-6">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                  <Hotel className="h-5 w-5 text-brand-600" /> Where to stay
                </h3>
                <ul className="mt-3 space-y-3">
                  {plan.hotels.map((h, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-medium text-slate-800">{h.name}</span>
                      <span className="text-slate-400"> · {h.type}{h.area ? ` · ${h.area}` : ""}</span>
                      {h.whyItFits && <p className="text-slate-500">{h.whyItFits}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {plan.restaurants?.length > 0 && (
              <div className="card p-6">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                  <UtensilsCrossed className="h-5 w-5 text-brand-600" /> Where to eat
                </h3>
                <ul className="mt-3 space-y-3">
                  {plan.restaurants.map((r, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-medium text-slate-800">{r.name}</span>
                      <span className="text-slate-400"> · {r.cuisine}{r.priceLevel ? ` · ${r.priceLevel}` : ""}</span>
                      {r.mustTry && <p className="text-slate-500">Must try: {r.mustTry}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        {plan.tips?.length > 0 && (
          <div className="card p-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
              <Lightbulb className="h-5 w-5 text-brand-600" /> Travel tips
            </h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {plan.tips.map((t, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-600">
                  <span className="text-brand-500">•</span> {t}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-slate-400">
        Suggestions are AI-generated. Verify hotels, prices, and opening hours before booking.
      </p>
    </div>
  );
}

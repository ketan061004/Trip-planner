"use client";

import { Check, MapPin } from "lucide-react";
import { useTrip } from "../../context/TripContext";

const STEPS = ["Trip Essentials", "Interests", "Preferences", "Generate Plan"];

export default function ProgressIndicator() {
  const { data, goTo } = useTrip();
  const current = data.step;

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-4xl px-4 py-4">
        {/* Persistent destination badge */}
        <div className="mb-4 flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
            <MapPin className="h-4 w-4" />
            {data.destination ? (
              <>
                {data.fromCity ? `${data.fromCity} → ` : ""}
                {data.destination}
              </>
            ) : (
              "Your trip"
            )}
          </span>
        </div>

        {/* Steps */}
        <ol className="flex items-center">
          <li className="flex items-center text-sm font-medium text-slate-400">
            <span className="hidden sm:inline">Destination</span>
            <span className="mx-2 text-slate-300">→</span>
          </li>
          {STEPS.map((label, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <li key={label} className="flex flex-1 items-center last:flex-none">
                <button
                  type="button"
                  onClick={() => i <= current && goTo(i)}
                  disabled={i > current}
                  className="flex items-center gap-2"
                >
                  <span
                    className={`grid h-7 w-7 flex-shrink-0 place-items-center rounded-full text-xs font-bold transition ${
                      done
                        ? "bg-brand-600 text-white"
                        : active
                        ? "bg-brand-600 text-white ring-4 ring-brand-100"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {done ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  <span
                    className={`hidden text-sm sm:inline ${
                      active ? "font-semibold text-slate-900" : "text-slate-500"
                    }`}
                  >
                    {label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <span className={`mx-2 h-0.5 flex-1 rounded ${done ? "bg-brand-600" : "bg-slate-200"}`} />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

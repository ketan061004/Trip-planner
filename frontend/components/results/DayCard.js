"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Sunrise, Sun, Sunset, Moon, Clock, Bus, Utensils } from "lucide-react";

const SLOTS = [
  { key: "morning", label: "Morning", icon: Sunrise },
  { key: "afternoon", label: "Afternoon", icon: Sun },
  { key: "evening", label: "Evening", icon: Sunset },
  { key: "night", label: "Night", icon: Moon },
];

export default function DayCard({ day, currency, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-4 p-5 text-left"
      >
        <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 text-sm font-bold text-white">
          {day.day}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
            Day {day.day}
            {day.date ? ` · ${day.date}` : ""}
          </p>
          <h4 className="truncate font-semibold text-slate-900">{day.title}</h4>
        </div>
        <div className="hidden items-center gap-3 text-xs text-slate-400 sm:flex">
          {day.dailyCost != null && (
            <span className="font-semibold text-slate-600">
              {currency} {Number(day.dailyCost).toLocaleString()}
            </span>
          )}
        </div>
        <ChevronDown className={`h-5 w-5 flex-shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 px-5 pb-5 pt-4">
              <div className="space-y-4">
                {SLOTS.map(({ key, label, icon: Icon }) => {
                  const slot = day[key];
                  if (!slot || !slot.activity) return null;
                  return (
                    <div key={key} className="flex gap-3">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                        <p className="font-medium text-slate-800">{slot.activity}</p>
                        {slot.detail && <p className="text-sm text-slate-500">{slot.detail}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Meta row */}
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                {day.estimatedTime && (
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {day.estimatedTime}</span>
                )}
                {day.recommendedTransport && (
                  <span className="inline-flex items-center gap-1"><Bus className="h-3.5 w-3.5" /> {day.recommendedTransport}</span>
                )}
                {day.travelTimeToNext && (
                  <span className="inline-flex items-center gap-1">→ {day.travelTimeToNext} to next</span>
                )}
              </div>

              {day.meals && (day.meals.breakfast || day.meals.lunch || day.meals.dinner) && (
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                  <Utensils className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>
                    {[day.meals.breakfast, day.meals.lunch, day.meals.dinner].filter(Boolean).join(" · ")}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

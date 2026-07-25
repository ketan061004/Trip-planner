"use client";

import { MapPin, CalendarDays, Users, Wallet } from "lucide-react";

function Stat({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">
      <Icon className="h-4 w-4" /> {children}
    </span>
  );
}

export default function CoverImage({ plan, input, coverImage }) {
  const city = plan.destination?.city || input?.destination || "Your trip";
  const country = plan.destination?.country;
  const meta = plan.tripMeta || {};
  const cur = plan.budget?.currency || meta.currency || input?.currency || "USD";
  const travelers = meta.travelers || (Number(input?.adults) || 0) + (Number(input?.children) || 0);

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-soft">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: coverImage
            ? `url('${coverImage}')`
            : "linear-gradient(135deg,#4f46e5,#7c3aed)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      <div className="relative flex min-h-[280px] flex-col justify-end p-6 text-white sm:p-8">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
          {city}
          {country ? `, ${country}` : ""}
        </h1>
        {plan.destination?.summary && (
          <p className="mt-2 max-w-2xl text-white/85">{plan.destination.summary}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {input?.fromCity && <Stat icon={MapPin}>{input.fromCity} → {city}</Stat>}
          {input?.startDate && (
            <Stat icon={CalendarDays}>
              {input.startDate}{input.endDate ? ` → ${input.endDate}` : ""}
            </Stat>
          )}
          {meta.durationDays && <Stat icon={CalendarDays}>{meta.durationDays} days</Stat>}
          {travelers > 0 && <Stat icon={Users}>{travelers} traveler{travelers > 1 ? "s" : ""}</Stat>}
          {plan.budget?.total != null && (
            <Stat icon={Wallet}>{cur} {Number(plan.budget.total).toLocaleString()}</Stat>
          )}
        </div>
      </div>
    </div>
  );
}

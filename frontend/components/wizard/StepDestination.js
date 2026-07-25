"use client";

import { Navigation, MapPin, Calendar, Wallet, Users, User, Baby, Briefcase, Heart, Users2, PartyPopper } from "lucide-react";
import { useTrip } from "../../context/TripContext";
import LocationAutocomplete from "../home/LocationAutocomplete";
import Input from "../ui/Input";
import Select from "../ui/Select";
import SegmentedControl from "../ui/SegmentedControl";
import WizardNav from "./WizardNav";

const TRIP_TYPES = [
  { value: "Solo", label: "Solo", icon: User },
  { value: "Couple", label: "Couple", icon: Heart },
  { value: "Family", label: "Family", icon: Users2 },
  { value: "Friends", label: "Friends", icon: PartyPopper },
  { value: "Business", label: "Business", icon: Briefcase },
];

function daysBetween(start, end) {
  if (!start || !end) return null;
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.round((e - s) / 86400000) + 1;
  return diff > 0 ? diff : null;
}

export default function StepDestination() {
  const { data, patch, next } = useTrip();

  const setDates = (key, val) => {
    const nextDates = { ...data, [key]: val };
    const dur = daysBetween(nextDates.startDate, nextDates.endDate);
    patch({ [key]: val, ...(dur ? { durationDays: dur } : {}) });
  };

  const canContinue = data.destination.trim() && data.startDate && data.endDate;
  const dur = daysBetween(data.startDate, data.endDate);

  return (
    <div className="animate-fade-up">
      <h2 className="font-display text-2xl font-bold text-slate-900">Tell us about your trip</h2>
      <p className="mt-1 text-slate-500">The essentials so we can tailor everything to you.</p>

      <div className="mt-6 space-y-6">
        {/* From / To */}
        <div className="grid gap-4 sm:grid-cols-2">
          <LocationAutocomplete
            label="Starting city"
            icon={Navigation}
            placeholder="Your city"
            value={data.fromCity}
            onChange={(v) => patch({ fromCity: v })}
          />
          <LocationAutocomplete
            label="Destination"
            icon={MapPin}
            placeholder="Where to?"
            value={data.destination}
            onChange={(v) => patch({ destination: v })}
          />
        </div>

        {/* Dates */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Start date"
            name="startDate"
            type="date"
            icon={Calendar}
            value={data.startDate}
            onChange={(e) => setDates("startDate", e.target.value)}
          />
          <Input
            label="End date"
            name="endDate"
            type="date"
            icon={Calendar}
            min={data.startDate || undefined}
            value={data.endDate}
            onChange={(e) => setDates("endDate", e.target.value)}
          />
        </div>
        {dur && (
          <p className="-mt-2 text-sm text-brand-600">
            {dur} day{dur > 1 ? "s" : ""} trip
          </p>
        )}

        {/* Travelers */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Adults"
            name="adults"
            type="number"
            min="1"
            max="30"
            icon={Users}
            value={data.adults}
            onChange={(e) => patch({ adults: Number(e.target.value) })}
          />
          <Input
            label="Children"
            name="children"
            type="number"
            min="0"
            max="30"
            icon={Baby}
            value={data.children}
            onChange={(e) => patch({ children: Number(e.target.value) })}
          />
        </div>

        {/* Budget */}
        <div>
          <label className="label">Estimated budget (total)</label>
          <div className="flex gap-2">
            <Select
              className="w-28"
              value={data.currency}
              onChange={(e) => patch({ currency: e.target.value })}
              options={["USD", "EUR", "INR", "GBP", "JPY", "AUD"]}
            />
            <div className="relative flex-1">
              <Wallet className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="field pl-9"
                type="number"
                min="0"
                placeholder="e.g. 1500"
                value={data.budget}
                onChange={(e) => patch({ budget: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Trip type */}
        <SegmentedControl
          label="Trip type"
          options={TRIP_TYPES}
          value={data.tripType}
          onChange={(v) => patch({ tripType: v })}
          columns={5}
        />
      </div>

      <WizardNav hideBack onNext={next} nextDisabled={!canContinue} />
      {!canContinue && (
        <p className="mt-2 text-right text-xs text-slate-400">
          Add a destination and travel dates to continue.
        </p>
      )}
    </div>
  );
}

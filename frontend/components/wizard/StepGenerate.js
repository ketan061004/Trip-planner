"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, MapPin, CalendarDays, Users, Wallet, Tag, Loader2, ChevronLeft } from "lucide-react";
import { useTrip, writeWizard } from "../../context/TripContext";
import { generatePlan, getImages } from "../../lib/api";
import { wizardToPreferences } from "../../lib/tripPayload";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

function Summary({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="truncate text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export default function StepGenerate() {
  const { data, patch, back } = useTrip();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const travelers = `${data.adults} adult${data.adults > 1 ? "s" : ""}${
    data.children ? `, ${data.children} child${data.children > 1 ? "ren" : ""}` : ""
  }`;

  const generate = async () => {
    setError("");
    setLoading(true);
    try {
      const prefs = wizardToPreferences(data);
      const [{ plan }, imgRes] = await Promise.all([
        generatePlan(prefs),
        getImages(data.destination, 1).catch(() => ({ images: [] })),
      ]);
      const coverImage = imgRes.images?.[0]?.url || "";
      // Persist synchronously so /trip/new can read it immediately (avoids a
      // race between the context effect and navigation).
      writeWizard({ plan, coverImage });
      patch({ plan, coverImage });
      router.push("/trip/new");
    } catch (err) {
      setError(err.message || "Failed to generate your plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-up">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-brand-600" />
          <Sparkles className="absolute inset-0 m-auto h-5 w-5 text-violet-500" />
        </div>
        <h3 className="mt-6 font-display text-xl font-bold text-slate-900">
          Crafting your {data.destination} itinerary…
        </h3>
        <p className="mt-2 max-w-sm text-slate-500">
          Our AI is planning day-by-day activities, budgets, and local picks just for you.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <h2 className="font-display text-2xl font-bold text-slate-900">Review & generate</h2>
      <p className="mt-1 text-slate-500">Here’s what we’ll use to build your plan.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Summary icon={MapPin} label="Route" value={`${data.fromCity || "—"} → ${data.destination}`} />
        <Summary icon={CalendarDays} label="Dates" value={`${data.startDate || "—"} → ${data.endDate || "—"} (${data.durationDays}d)`} />
        <Summary icon={Users} label="Travelers" value={`${travelers} · ${data.tripType}`} />
        <Summary icon={Wallet} label="Budget" value={data.budget ? `${data.currency} ${data.budget}` : "Flexible"} />
      </div>

      {data.interests?.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <Tag className="h-4 w-4 text-brand-500" /> Interests
          </p>
          <div className="flex flex-wrap gap-2">
            {data.interests.map((i) => (
              <span key={i} className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700">
                {i}
              </span>
            ))}
          </div>
        </div>
      )}

      {error && <Alert type="error" className="mt-6">{error}</Alert>}

      <div className="mt-8">
        <Button size="lg" onClick={generate} className="w-full">
          <Sparkles className="h-5 w-5" /> Generate My AI Trip Plan
        </Button>
      </div>

      <div className="mt-4">
        <Button type="button" variant="outline" onClick={back}>
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
      </div>
    </div>
  );
}

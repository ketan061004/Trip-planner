"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { useTrip } from "../../context/TripContext";
import { useInterests } from "../../lib/useInterests";
import { getImages } from "../../lib/api";
import InterestCard from "../cards/InterestCard";
import WizardNav from "./WizardNav";

export default function StepInterests() {
  const { data, patch, next, back } = useTrip();
  const { interests, loading, meta } = useInterests({
    destination: data.destination,
    budget: data.budget,
    currency: data.currency,
    durationDays: data.durationDays,
  });

  const [images, setImages] = useState([]);

  // Fetch a pool of destination images once; assign one per card by index.
  useEffect(() => {
    let active = true;
    const dest = (data.destination || "").trim();
    if (!dest) return;
    (async () => {
      try {
        const res = await getImages(dest, 12);
        if (active) setImages(res.images || []);
      } catch {
        if (active) setImages([]);
      }
    })();
    return () => {
      active = false;
    };
  }, [data.destination]);

  const selected = data.interests || [];
  const toggle = (label) =>
    patch({
      interests: selected.includes(label)
        ? selected.filter((x) => x !== label)
        : [...selected, label],
    });

  return (
    <div className="animate-fade-up">
      <h2 className="font-display text-2xl font-bold text-slate-900">Choose your interests</h2>
      <p className="mt-1 text-slate-500">
        {meta.destination
          ? `Handpicked for ${meta.destination} — select everything that appeals to you.`
          : "Select everything that appeals to you."}
      </p>

      {loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="skeleton h-40 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {interests.map((interest, i) => (
            <InterestCard
              key={interest.label}
              interest={interest}
              image={images[i % (images.length || 1)]?.url}
              selected={selected.includes(interest.label)}
              onToggle={() => toggle(interest.label)}
            />
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        <Sparkles className="h-4 w-4 text-brand-500" />
        {selected.length > 0
          ? `${selected.length} interest${selected.length > 1 ? "s" : ""} selected`
          : "Pick at least one to personalize your plan."}
      </div>

      <WizardNav onBack={back} onNext={next} nextDisabled={selected.length === 0} />
    </div>
  );
}

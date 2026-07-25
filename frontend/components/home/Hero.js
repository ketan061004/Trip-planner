"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plane, MapPin, Navigation, Sparkles } from "lucide-react";
import LocationAutocomplete from "./LocationAutocomplete";
import Button from "../ui/Button";
import { seedWizard } from "../../context/TripContext";
import { seedImage } from "../../lib/img";

export default function Hero() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState("");

  const start = (e) => {
    e.preventDefault();
    if (!to.trim()) return setError("Please choose a destination.");
    seedWizard({ fromCity: from.trim(), destination: to.trim() });
    router.push("/plan");
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background image + overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${seedImage("travel-journey-hero", 1600, 900)}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/55 to-slate-900/75" />

      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white backdrop-blur">
            <Sparkles className="h-4 w-4" /> AI-powered travel planning
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight text-white sm:text-6xl">
            Plan Your Perfect Journey with AI
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-200">
            Tell us where you’re headed and we’ll craft a personalized, day-by-day itinerary with
            smart budgets, destination-based interests, and local recommendations.
          </p>
        </motion.div>

        {/* Search card */}
        <motion.form
          onSubmit={start}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 rounded-2xl bg-white/95 p-4 shadow-soft backdrop-blur sm:p-5"
        >
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <LocationAutocomplete
              label="From"
              icon={Navigation}
              placeholder="Your city"
              value={from}
              onChange={(v) => { setFrom(v); setError(""); }}
            />
            <LocationAutocomplete
              label="To"
              icon={MapPin}
              placeholder="Where to?"
              value={to}
              onChange={(v) => { setTo(v); setError(""); }}
            />
            <Button type="submit" size="lg" className="sm:mb-0.5">
              <Plane className="h-4 w-4" /> Start Planning My Trip
            </Button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </motion.form>
      </div>
    </section>
  );
}

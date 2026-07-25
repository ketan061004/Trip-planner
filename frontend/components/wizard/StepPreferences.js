"use client";

import { Footprints, Scale, Zap, Wallet, Gem, Bus, Car, Train, Sparkles } from "lucide-react";
import { useTrip } from "../../context/TripContext";
import SegmentedControl from "../ui/SegmentedControl";
import Slider from "../ui/Slider";
import Toggle from "../ui/Toggle";
import Select from "../ui/Select";
import Input from "../ui/Input";
import WizardNav from "./WizardNav";

const PACE = [
  { value: "Relaxed", label: "Relaxed", icon: Footprints },
  { value: "Balanced", label: "Balanced", icon: Scale },
  { value: "Packed", label: "Packed", icon: Zap },
];
const BUDGET_LEVEL = [
  { value: "Budget", label: "Budget", icon: Wallet },
  { value: "Moderate", label: "Moderate", icon: Scale },
  { value: "Luxury", label: "Luxury", icon: Gem },
];
const TRANSPORT = [
  { value: "Walking", label: "Walking", icon: Footprints },
  { value: "Public Transport", label: "Public", icon: Train },
  { value: "Taxi/Cab", label: "Taxi", icon: Car },
  { value: "Rental Vehicle", label: "Rental", icon: Car },
  { value: "Mixed", label: "Mixed", icon: Bus },
];

export default function StepPreferences() {
  const { data, patchPreferences, next, back } = useTrip();
  const p = data.preferences;
  const set = (partial) => patchPreferences(partial);

  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900">Travel preferences</h2>
        <p className="mt-1 text-slate-500">Fine-tune how you like to travel.</p>
      </div>

      <SegmentedControl label="Travel pace" options={PACE} value={p.pace} onChange={(v) => set({ pace: v })} />
      <SegmentedControl label="Budget level" options={BUDGET_LEVEL} value={p.budgetLevel} onChange={(v) => set({ budgetLevel: v })} />
      <SegmentedControl label="Preferred transportation" options={TRANSPORT} value={p.transport} onChange={(v) => set({ transport: v })} columns={5} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Food preference"
          value={p.food}
          onChange={(e) => set({ food: e.target.value })}
          options={["No restriction", "Vegetarian", "Vegan", "Halal", "Kosher", "Local cuisine", "Gluten-free"]}
        />
        <Select
          label="Accommodation"
          value={p.accommodation}
          onChange={(e) => set({ accommodation: e.target.value })}
          options={["Budget", "Mid-range", "Luxury", "Hostel", "Boutique", "Resort"]}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Slider
          label="Indoor vs Outdoor"
          stops={["Indoor", "Mix", "Outdoor"]}
          value={p.indoorOutdoor}
          onChange={(v) => set({ indoorOutdoor: v })}
        />
        <Slider
          label="Adventure level"
          stops={["Low", "Moderate", "High"]}
          value={p.adventureLevel}
          onChange={(v) => set({ adventureLevel: v })}
        />
        <Slider
          label="Shopping interest"
          stops={["None", "Some", "Lots"]}
          value={p.shopping}
          onChange={(v) => set({ shopping: v })}
        />
        <Slider
          label="Nightlife"
          stops={["None", "Some", "Lots"]}
          value={p.nightlife}
          onChange={(v) => set({ nightlife: v })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Preferred start time"
          name="wakeUpTime"
          type="time"
          value={p.wakeUpTime}
          onChange={(e) => set({ wakeUpTime: e.target.value })}
        />
        <Input
          label="Accessibility requirements (optional)"
          name="accessibility"
          placeholder="e.g. wheelchair access, minimal walking"
          value={p.accessibility}
          onChange={(e) => set({ accessibility: e.target.value })}
        />
      </div>

      <WizardNav onBack={back} onNext={next} nextLabel="Review & generate" />
    </div>
  );
}

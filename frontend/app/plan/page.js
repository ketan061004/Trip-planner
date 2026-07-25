"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTrip } from "../../context/TripContext";
import StepDestination from "../../components/wizard/StepDestination";
import StepInterests from "../../components/wizard/StepInterests";
import StepPreferences from "../../components/wizard/StepPreferences";
import StepGenerate from "../../components/wizard/StepGenerate";

const STEPS = [StepDestination, StepInterests, StepPreferences, StepGenerate];

function Wizard() {
  const { data, patch } = useTrip();
  const params = useSearchParams();

  // Allow deep-linking a destination via /plan?to=Goa (from Explore/Home cards).
  const to = params.get("to");
  useEffect(() => {
    if (to && !data.destination) patch({ destination: to });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);

  const Step = STEPS[data.step] || StepDestination;
  return <Step />;
}

export default function PlanPage() {
  return (
    <Suspense fallback={null}>
      <Wizard />
    </Suspense>
  );
}

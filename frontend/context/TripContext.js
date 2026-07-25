"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

const STORAGE_KEY = "tp_wizard";
export const TOTAL_STEPS = 4; // Trip Essentials → Interests → Preferences → Generate

const EMPTY = {
  step: 0,
  fromCity: "",
  destination: "",
  startDate: "",
  endDate: "",
  durationDays: 3,
  adults: 2,
  children: 0,
  budget: "",
  currency: "USD",
  tripType: "Couple",
  interests: [],
  preferences: {
    pace: "Balanced",
    budgetLevel: "Moderate",
    transport: "Mixed",
    food: "No restriction",
    accommodation: "Mid-range",
    wakeUpTime: "08:00",
    indoorOutdoor: "Mix",
    shopping: "Some",
    nightlife: "Some",
    adventureLevel: "Moderate",
    accessibility: "",
  },
  plan: null,
  coverImage: "",
};

const TripContext = createContext(null);

/** Read the current wizard snapshot from sessionStorage (outside the provider). */
export function readWizard() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : { ...EMPTY };
  } catch {
    return { ...EMPTY };
  }
}

/** Overwrite the stored wizard snapshot (e.g. after regenerating a fresh plan). */
export function writeWizard(partial) {
  try {
    const current = readWizard();
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...partial }));
  } catch {
    /* ignore */
  }
}

/**
 * Seed the wizard from outside the provider (e.g. the home page "From/To"
 * form) by merging into sessionStorage. The /plan TripProvider hydrates from
 * this on mount. Resets step to 0 and clears any stale generated plan.
 */
export function seedWizard(partial) {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const current = raw ? JSON.parse(raw) : {};
    const nextState = { ...current, ...partial, step: 0, plan: null };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  } catch {
    /* ignore */
  }
}

export function TripProvider({ children }) {
  const [data, setData] = useState(EMPTY);
  const hydrated = useRef(false);

  // Hydrate from sessionStorage once on mount.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...EMPTY, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    hydrated.current = true;
  }, []);

  // Persist after hydration so we don't overwrite stored state with defaults.
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, [data]);

  const patch = useCallback((partial) => setData((d) => ({ ...d, ...partial })), []);
  const patchPreferences = useCallback(
    (partial) => setData((d) => ({ ...d, preferences: { ...d.preferences, ...partial } })),
    []
  );
  const goTo = useCallback((step) => setData((d) => ({ ...d, step })), []);
  const next = useCallback(
    () => setData((d) => ({ ...d, step: Math.min(TOTAL_STEPS - 1, d.step + 1) })),
    []
  );
  const back = useCallback(
    () => setData((d) => ({ ...d, step: Math.max(0, d.step - 1) })),
    []
  );
  const reset = useCallback(() => {
    setData(EMPTY);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  // Load a saved trip's input back into the wizard (edit flow).
  const loadFromTrip = useCallback((trip) => {
    const input = trip?.input || {};
    setData({ ...EMPTY, ...input, plan: trip?.plan || null, coverImage: trip?.coverImage || "", step: 0 });
  }, []);

  const value = { data, patch, patchPreferences, goTo, next, back, reset, loadFromTrip, setData };
  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used within <TripProvider>");
  return ctx;
}

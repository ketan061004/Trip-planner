"use client";

import { useEffect, useRef, useState } from "react";
import { suggestInterests } from "./api";

const GENERIC = [
  "History", "Food", "Nature", "Nightlife", "Art & Museums",
  "Adventure", "Shopping", "Beaches", "Photography", "Relaxation",
].map((label) => ({ label, emoji: "✨", reason: "", budgetFit: "mid" }));

/**
 * Debounced, destination + budget-aware interest suggestions.
 * Reused by the wizard's Interests step.
 */
export function useInterests({ destination, budget, currency, durationDays }) {
  const [interests, setInterests] = useState(GENERIC);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({ destination: null, budgetTier: "flexible" });
  const debounceRef = useRef(null);

  useEffect(() => {
    const dest = (destination || "").trim();
    if (!dest) {
      setInterests(GENERIC);
      setMeta({ destination: null, budgetTier: "flexible" });
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await suggestInterests({
          destination: dest,
          budget: budget ? Number(budget) : null,
          currency,
          durationDays: durationDays ? Number(durationDays) : null,
        });
        if (res.interests?.length) setInterests(res.interests);
        setMeta({ destination: res.destination, budgetTier: res.budgetTier });
      } catch {
        setInterests(GENERIC);
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [destination, budget, currency, durationDays]);

  return { interests, loading, meta };
}

import { generate } from "../providers/index.js";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt.js";
import { parseJsonLoose } from "../utils/json.js";

const DEFAULTS = {
  durationDays: 3,
  travelers: 1,
  currency: "USD",
};

/**
 * Normalize + validate incoming preferences.
 * @param {object} body raw request body
 */
export function normalizePreferences(body = {}) {
  const durationDays = clampInt(body.durationDays, 1, 30, DEFAULTS.durationDays);
  const travelers = clampInt(body.travelers, 1, 30, DEFAULTS.travelers);

  return {
    destination: str(body.destination),
    budget: body.budget != null ? Number(body.budget) || null : null,
    currency: str(body.currency) || DEFAULTS.currency,
    durationDays,
    travelers,
    travelStyle: str(body.travelStyle),
    interests: Array.isArray(body.interests) ? body.interests.filter(Boolean) : [],
    hotelPreference: str(body.hotelPreference),
    foodPreference: str(body.foodPreference),
    transportPreference: str(body.transportPreference),
    activityLevel: str(body.activityLevel),
    pace: str(body.pace),
    // Optional richer fields from the multi-step wizard (all default-safe).
    fromCity: str(body.fromCity),
    startDate: str(body.startDate),
    endDate: str(body.endDate),
    tripType: str(body.tripType),
    adults: body.adults != null ? clampInt(body.adults, 1, 30, 1) : null,
    children: body.children != null ? clampInt(body.children, 0, 30, 0) : null,
    budgetLevel: str(body.budgetLevel),
    wakeUpTime: str(body.wakeUpTime),
    indoorOutdoor: str(body.indoorOutdoor),
    shopping: str(body.shopping),
    nightlife: str(body.nightlife),
    accessibility: str(body.accessibility),
  };
}

/**
 * Generate a full trip plan from normalized preferences.
 */
export async function generatePlan(prefs) {
  const raw = await generate({
    system: SYSTEM_PROMPT,
    user: buildUserPrompt(prefs),
    json: true,
  });
  const plan = parseJsonLoose(raw);

  // Ensure the day count matches what was requested (models sometimes drift).
  if (Array.isArray(plan.days) && plan.days.length !== prefs.durationDays) {
    plan.days = plan.days.slice(0, prefs.durationDays);
  }
  return plan;
}

function clampInt(v, min, max, fallback) {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function str(v) {
  return typeof v === "string" ? v.trim() : "";
}

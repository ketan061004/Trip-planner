import { generate } from "../providers/index.js";
import { parseJsonLoose } from "../utils/json.js";

const SYSTEM = `You are a travel expert. Given a destination and budget, suggest the interests/activities
that this specific place is genuinely known for and that fit the traveler's budget.
Respond with ONLY valid JSON. No markdown, no commentary.`;

// A sensible default set when no destination is provided yet.
const GENERIC = [
  "History", "Food", "Nature", "Nightlife", "Art & Museums",
  "Adventure", "Shopping", "Beaches", "Photography", "Relaxation",
];

/**
 * Suggest interests tailored to a destination + budget.
 * Falls back to a generic list if no destination is given.
 * @param {{destination?: string, budget?: number, currency?: string, durationDays?: number}} input
 */
export async function suggestInterests({ destination, budget, currency = "USD", durationDays } = {}) {
  const dest = (destination || "").trim();
  if (!dest) {
    return { destination: null, budgetTier: budgetTier(budget, durationDays), interests: GENERIC.map(toChip) };
  }

  const tier = budgetTier(budget, durationDays);
  const user = `Destination: ${dest}
Budget: ${budget ? `${currency} ${budget} total` : "flexible"} (tier: ${tier})
Trip length: ${durationDays ? `${durationDays} days` : "unspecified"}

Return JSON EXACTLY as:
{
  "interests": [
    { "label": string, "emoji": string, "reason": string, "budgetFit": "low" | "mid" | "high" }
  ]
}
Rules:
- 8 to 12 interests, ordered by how iconic they are for THIS destination.
- "reason": max 6 words, specific to the destination (e.g. "Cherry blossoms in Ueno Park").
- "budgetFit": how affordable this activity generally is.
- Prefer things this place is famous for over generic categories.`;

  try {
    const raw = await generate({ system: SYSTEM, user, json: true });
    const data = parseJsonLoose(raw);
    const interests = Array.isArray(data.interests) ? data.interests.filter((i) => i && i.label) : [];
    if (interests.length === 0) throw new Error("empty");
    return { destination: dest, budgetTier: tier, interests };
  } catch (err) {
    console.error("[suggestInterests] falling back:", err.message);
    return { destination: dest, budgetTier: tier, interests: GENERIC.map(toChip), fallback: true };
  }
}

function budgetTier(budget, days = 1) {
  if (!budget) return "flexible";
  const perDay = days ? budget / days : budget;
  if (perDay < 80) return "budget";
  if (perDay < 250) return "mid";
  return "luxury";
}

function toChip(label) {
  return { label, emoji: "", reason: "", budgetFit: "mid" };
}

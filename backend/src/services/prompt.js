// Prompt design for the trip planner. This is the heart of the product:
// it constrains the model to return a strict JSON shape the frontend can render.

export const SYSTEM_PROMPT = `You are an expert travel planner. You create realistic, personalized, day-by-day trip itineraries.

RULES:
- Respond with ONLY a single valid JSON object. No markdown, no commentary.
- Keep every recommendation realistic for the given destination and budget.
- Attractions, neighborhoods, and dish names should be real and specific to the destination.
- For hotels and restaurants, give realistic NAMES and TYPES but never invent exact prices or star ratings as if verified — treat them as suggestions to verify.
- Budget numbers must add up and stay within the user's total budget when possible. If it is impossible, set "withinBudget": false and explain in "budgetNote".
- Currency: use the currency the user specifies, else USD.`;

/**
 * Build the user prompt from the preference object.
 * @param {object} p normalized preferences
 */
export function buildUserPrompt(p) {
  const schema = `Return JSON with EXACTLY this shape:
{
  "destination": { "city": string, "country": string, "summary": string },
  "tripMeta": { "durationDays": number, "travelers": number, "currency": string, "bestFor": string[] },
  "transport": { "gettingAround": string, "fromAirport": string, "estimatedCost": number },
  "days": [
    {
      "day": number,
      "date": string,
      "title": string,
      "morning": { "activity": string, "detail": string },
      "afternoon": { "activity": string, "detail": string },
      "evening": { "activity": string, "detail": string },
      "night": { "activity": string, "detail": string },
      "estimatedTime": string,
      "travelTimeToNext": string,
      "dailyCost": number,
      "recommendedTransport": string,
      "meals": { "breakfast": string, "lunch": string, "dinner": string }
    }
  ],
  "budget": {
    "currency": string,
    "total": number,
    "withinBudget": boolean,
    "budgetNote": string,
    "breakdown": {
      "accommodation": number,
      "transportation": number,
      "food": number,
      "attractions": number,
      "miscellaneous": number
    }
  },
  "hotels": [ { "name": string, "type": string, "area": string, "whyItFits": string } ],
  "restaurants": [ { "name": string, "cuisine": string, "priceLevel": string, "mustTry": string } ],
  "tips": string[]
}`;

  const travelers = p.adults != null
    ? `${p.adults} adult(s)${p.children ? `, ${p.children} child(ren)` : ""}`
    : `${p.travelers}`;
  const dates = p.startDate && p.endDate ? `${p.startDate} to ${p.endDate}` : "flexible";

  const prefs = `USER PREFERENCES:
- Starting city: ${p.fromCity || "not specified"}
- Destination: ${p.destination || "not specified — recommend the best match for the preferences below"}
- Travel dates: ${dates}
- Budget (total): ${p.budget ? `${p.currency} ${p.budget}` : "flexible"}${p.budgetLevel ? ` (${p.budgetLevel} level)` : ""}
- Duration: ${p.durationDays} day(s)
- Travelers: ${travelers}
- Trip type: ${p.tripType || p.travelStyle || "any"}
- Interests: ${(p.interests && p.interests.join(", ")) || "general sightseeing"}
- Hotel preference: ${p.hotelPreference || "mid-range"}
- Food preference: ${p.foodPreference || "no restriction"}
- Transport preference: ${p.transportPreference || "any"}
- Activity level: ${p.activityLevel || "moderate"}
- Pace: ${p.pace || "balanced between relaxation and exploration"}${p.wakeUpTime ? `\n- Preferred start time: ${p.wakeUpTime}` : ""}${p.indoorOutdoor ? `\n- Indoor/outdoor lean: ${p.indoorOutdoor}` : ""}${p.shopping ? `\n- Shopping interest: ${p.shopping}` : ""}${p.nightlife ? `\n- Nightlife: ${p.nightlife}` : ""}${p.accessibility ? `\n- Accessibility needs: ${p.accessibility}` : ""}

When dates are given, set each day's "date" field to the actual calendar date.`;

  return `${prefs}\n\n${schema}`;
}

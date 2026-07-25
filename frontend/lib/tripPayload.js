// Map the wizard state into the /api/plan preferences payload.
export function wizardToPreferences(data) {
  const p = data.preferences || {};
  return {
    destination: data.destination,
    budget: data.budget ? Number(data.budget) : null,
    currency: data.currency,
    durationDays: Number(data.durationDays) || 3,
    travelers: (Number(data.adults) || 1) + (Number(data.children) || 0),
    travelStyle: data.tripType,
    interests: data.interests || [],
    hotelPreference: p.accommodation,
    foodPreference: p.food,
    transportPreference: p.transport,
    activityLevel: p.adventureLevel,
    pace: p.pace,
    // richer fields
    fromCity: data.fromCity,
    startDate: data.startDate,
    endDate: data.endDate,
    tripType: data.tripType,
    adults: data.adults,
    children: data.children,
    budgetLevel: p.budgetLevel,
    wakeUpTime: p.wakeUpTime,
    indoorOutdoor: p.indoorOutdoor,
    shopping: p.shopping,
    nightlife: p.nightlife,
    accessibility: p.accessibility,
  };
}

// The `input` object we persist on a saved Trip (full wizard snapshot).
export function wizardToInput(data) {
  return {
    fromCity: data.fromCity,
    destination: data.destination,
    startDate: data.startDate,
    endDate: data.endDate,
    durationDays: data.durationDays,
    adults: data.adults,
    children: data.children,
    budget: data.budget,
    currency: data.currency,
    tripType: data.tripType,
    interests: data.interests,
    preferences: data.preferences,
  };
}

import Trip from "../models/Trip.js";
import { asyncHandler, httpError } from "../utils/http.js";
import { normalizePreferences, generatePlan } from "../services/planService.js";

// Build a normalized preferences object the plan generator understands from
// the richer wizard `input` payload.
function inputToPreferences(input = {}) {
  const p = input.preferences || {};
  return normalizePreferences({
    destination: input.destination,
    budget: input.budget,
    currency: input.currency,
    durationDays: input.durationDays,
    travelers: (Number(input.adults) || 1) + (Number(input.children) || 0),
    travelStyle: input.tripType,
    interests: input.interests,
    hotelPreference: p.accommodation,
    foodPreference: p.food,
    transportPreference: p.transport,
    activityLevel: p.adventureLevel,
    pace: p.pace,
    fromCity: input.fromCity,
    startDate: input.startDate,
    endDate: input.endDate,
    tripType: input.tripType,
    adults: input.adults,
    children: input.children,
    budgetLevel: p.budgetLevel,
    wakeUpTime: p.wakeUpTime,
    indoorOutdoor: p.indoorOutdoor,
    shopping: p.shopping,
    nightlife: p.nightlife,
    accessibility: p.accessibility,
  });
}

function deriveTitle(input, plan) {
  const dest = input?.destination || plan?.destination?.city || "Trip";
  const days = input?.durationDays || plan?.tripMeta?.durationDays;
  return days ? `${dest} · ${days} day${days > 1 ? "s" : ""}` : dest;
}

// POST /api/trips
export const createTrip = asyncHandler(async (req, res) => {
  const { input = {}, plan = {}, coverImage = "" } = req.body || {};
  if (!plan || !plan.days) throw httpError(400, "A generated plan is required to save a trip.");

  const trip = await Trip.create({
    user: req.user.id,
    title: deriveTitle(input, plan),
    input,
    plan,
    coverImage,
    startDate: input.startDate ? new Date(input.startDate) : undefined,
  });
  res.status(201).json({ trip: trip.toJSON() });
});

// GET /api/trips
export const listTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();
  const now = new Date();
  const upcoming = trips.filter((t) => t.startDate && new Date(t.startDate) >= now);
  res.json({ trips, upcoming });
});

// GET /api/trips/:id
export const getTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) throw httpError(404, "Trip not found");
  if (trip.user.toString() !== req.user.id) throw httpError(403, "Not your trip");
  res.json({ trip: trip.toJSON() });
});

// GET /api/trips/public/:id  (no auth)
export const getPublicTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id).lean().catch(() => null);
  if (!trip || !trip.isPublic) throw httpError(404, "Trip not found or not shared");
  res.json({ trip });
});

// PUT /api/trips/:id
export const updateTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) throw httpError(404, "Trip not found");
  if (trip.user.toString() !== req.user.id) throw httpError(403, "Not your trip");

  const { input, plan, coverImage, isPublic } = req.body || {};
  if (input !== undefined) trip.input = input;
  if (plan !== undefined) trip.plan = plan;
  if (coverImage !== undefined) trip.coverImage = coverImage;
  if (isPublic !== undefined) trip.isPublic = !!isPublic;
  if (input?.startDate) trip.startDate = new Date(input.startDate);
  trip.title = deriveTitle(trip.input, trip.plan);
  await trip.save();

  res.json({ trip: trip.toJSON() });
});

// DELETE /api/trips/:id
export const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) throw httpError(404, "Trip not found");
  if (trip.user.toString() !== req.user.id) throw httpError(403, "Not your trip");
  await trip.deleteOne();
  res.json({ message: "Trip deleted" });
});

// POST /api/trips/:id/regenerate
export const regenerateTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) throw httpError(404, "Trip not found");
  if (trip.user.toString() !== req.user.id) throw httpError(403, "Not your trip");

  const prefs = inputToPreferences(trip.input);
  trip.plan = await generatePlan(prefs);
  trip.title = deriveTitle(trip.input, trip.plan);
  await trip.save();

  res.json({ trip: trip.toJSON() });
});

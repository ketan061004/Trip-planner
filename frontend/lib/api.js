import http from "./http";

// ---- AI + data (unauthenticated) ----
export function generatePlan(preferences) {
  return http.post("/plan", preferences).then((r) => r.data);
}

export function getWeather(place) {
  return http.get("/weather", { params: { place } }).then((r) => r.data);
}

export function suggestInterests({ destination, budget, currency, durationDays }) {
  return http
    .post("/interests", { destination, budget, currency, durationDays })
    .then((r) => r.data);
}

export function getImages(query, perPage = 6) {
  return http.get("/images", { params: { query, perPage } }).then((r) => r.data);
}

export function searchPlaces(q, count = 6) {
  return http.get("/geo/search", { params: { q, count } }).then((r) => r.data.results);
}

// ---- Auth ----
export const auth = {
  register: (payload) => http.post("/auth/register", payload).then((r) => r.data),
  login: (payload) => http.post("/auth/login", payload).then((r) => r.data),
  me: () => http.get("/auth/me").then((r) => r.data.user),
  forgotPassword: (email) =>
    http.post("/auth/forgot-password", { email }).then((r) => r.data),
  resetPassword: (payload) =>
    http.post("/auth/reset-password", payload).then((r) => r.data),
  logout: () => http.post("/auth/logout").then((r) => r.data),
};

// ---- Trips ----
export const trips = {
  list: () => http.get("/trips").then((r) => r.data),
  get: (id) => http.get(`/trips/${id}`).then((r) => r.data.trip),
  getPublic: (id) => http.get(`/trips/public/${id}`).then((r) => r.data.trip),
  create: (payload) => http.post("/trips", payload).then((r) => r.data.trip),
  update: (id, payload) => http.put(`/trips/${id}`, payload).then((r) => r.data.trip),
  remove: (id) => http.delete(`/trips/${id}`).then((r) => r.data),
  regenerate: (id) => http.post(`/trips/${id}/regenerate`).then((r) => r.data.trip),
};

import axios from "axios";

// In production (Vercel multi-service) the backend shares the same domain,
// so an empty base means "same origin". Local dev sets NEXT_PUBLIC_API_URL
// to http://localhost:5000 via .env.local.
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const TOKEN_KEY = "tp_token";

export const tokenStore = {
  get() {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },
  set(token) {
    if (typeof window !== "undefined") window.localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    if (typeof window !== "undefined") window.localStorage.removeItem(TOKEN_KEY);
  },
};

const http = axios.create({ baseURL: `${BASE}/api` });

// Inject the bearer token on every request.
http.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize errors and handle expired sessions.
http.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.error || error.message || "Request failed";

    if (status === 401 && typeof window !== "undefined") {
      // Session expired/invalid — drop the token. Guards handle redirects.
      tokenStore.clear();
    }
    return Promise.reject(new Error(message));
  }
);

export default http;

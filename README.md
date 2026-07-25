# ✈️ AI Smart Trip Planner

A premium, AI-powered travel planning app: accounts, a guided multi-step planner,
destination-based interests with photos, day-by-day itineraries, budgets, saved trips,
and a personal dashboard.

- **Frontend:** Next.js 14 (App Router) + Tailwind + framer-motion + lucide-react
- **Backend:** Express + MongoDB (Mongoose) + JWT auth
- **AI:** Groq or Gemini (swappable via `AI_PROVIDER`)
- **Images:** Pexels (proxied so the key stays server-side)
- **Weather / Geo autocomplete:** Open-Meteo (free, no key)

## Project structure

```
backend/    Express API (auth, trips, plan, interests, images, geo, weather)
frontend/   Next.js app (home, auth, /plan wizard, /trip/[id] results, /dashboard)
```

## Prerequisites

- Node.js 18+ (built with v24)
- MongoDB — local (`mongodb://127.0.0.1:27017`) or a free MongoDB Atlas cluster

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env    # if you don't already have a .env
```

Edit `backend/.env`:

- `MONGODB_URI` — local default works, or paste an Atlas connection string.
- `JWT_SECRET` — generate: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
- `AI_PROVIDER` + the matching key (`GROQ_API_KEY` or `GEMINI_API_KEY`).
- `PEXELS_API_KEY` — optional (https://www.pexels.com/api/). Blank → keyless fallback images.

Run it:

```bash
npm run dev         # http://localhost:5000  (logs "✅ MongoDB connected")
```

### MongoDB Atlas (free) — optional

1. Create a free **M0** cluster at https://cloud.mongodb.com.
2. **Database Access** → add a user + password.
3. **Network Access** → allow your IP (or `0.0.0.0/0` for dev).
4. **Connect → Drivers** → copy the `mongodb+srv://…` string, insert your password, set as `MONGODB_URI`.
5. Restart the backend — collections auto-create on first save.

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.local.example .env.local    # NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev                         # http://localhost:3000
```

## 3. Use it

1. Open http://localhost:3000
2. Enter a **From** and **To** on the hero → **Start Planning My Trip**
3. Walk the wizard: **Trip Essentials → Interests → Preferences → Generate**
4. View the itinerary, then **Sign up** to **Save / Share / Regenerate / Edit / Download PDF**
5. Manage everything from **Dashboard** (`/dashboard`, requires login)

## Password reset in dev

Without SMTP configured, `POST /api/auth/forgot-password` returns a `devResetLink`
(also logged to the backend console) so you can test the reset flow locally. Configure
`SMTP_*` in `.env` to send real emails.

## API overview

| Area  | Endpoints |
|-------|-----------|
| Auth  | `POST /api/auth/register\|login\|forgot-password\|reset-password\|logout`, `GET /api/auth/me` |
| Trips | `GET/POST /api/trips`, `GET/PUT/DELETE /api/trips/:id`, `POST /api/trips/:id/regenerate`, `GET /api/trips/public/:id` |
| AI    | `POST /api/plan`, `POST /api/interests` |
| Data  | `GET /api/images`, `GET /api/geo/search`, `GET /api/weather` |

Auth-protected routes require an `Authorization: Bearer <token>` header. The frontend
stores the JWT in `localStorage` and injects it automatically.

> Suggestions are AI-generated — verify hotels, prices, and availability before booking.

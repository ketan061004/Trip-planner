"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Plane, CalendarClock, Sparkles } from "lucide-react";
import Protected from "../../components/Protected";
import TripCard from "../../components/cards/TripCard";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import Alert from "../../components/ui/Alert";
import { useAuth } from "../../context/AuthContext";
import { trips as tripsApi } from "../../lib/api";

function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ trips: [], upcoming: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [regenId, setRegenId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await tripsApi.list();
      setData({ trips: res.trips || [], upcoming: res.upcoming || [] });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onDelete = async (trip) => {
    if (!confirm(`Delete "${trip.title}"? This can't be undone.`)) return;
    const prev = data;
    setData((d) => ({
      trips: d.trips.filter((t) => t._id !== trip._id),
      upcoming: d.upcoming.filter((t) => t._id !== trip._id),
    }));
    try {
      await tripsApi.remove(trip._id);
    } catch (err) {
      setError(err.message);
      setData(prev); // rollback
    }
  };

  const onRegenerate = async (id) => {
    setRegenId(id);
    try {
      const updated = await tripsApi.regenerate(id);
      setData((d) => ({
        ...d,
        trips: d.trips.map((t) => (t._id === id ? updated : t)),
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setRegenId(null);
    }
  };

  const upcomingIds = new Set(data.upcoming.map((t) => t._id));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-slate-500">Your saved trips and itineraries.</p>
        </div>
        <Button as={Link} href="/plan">
          <Plus className="h-4 w-4" /> New Trip
        </Button>
      </div>

      {error && <Alert type="error" className="mt-6">{error}</Alert>}

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner label="Loading your trips…" />
        </div>
      ) : data.trips.length === 0 ? (
        <div className="mt-10 card flex flex-col items-center px-6 py-16 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <Plane className="h-8 w-8" />
          </span>
          <h3 className="mt-5 font-display text-xl font-bold text-slate-900">No trips yet</h3>
          <p className="mt-2 max-w-sm text-slate-500">
            Plan your first AI-powered itinerary — it takes less than a minute.
          </p>
          <Button as={Link} href="/plan" className="mt-6">
            <Sparkles className="h-4 w-4" /> Plan your first trip
          </Button>
        </div>
      ) : (
        <>
          {/* Upcoming */}
          {data.upcoming.length > 0 && (
            <section className="mt-10">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                <CalendarClock className="h-5 w-5 text-brand-600" /> Upcoming trips
              </h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.upcoming.map((t) => (
                  <TripCard key={t._id} trip={t} onDelete={onDelete} onRegenerate={onRegenerate} regenerating={regenId === t._id} />
                ))}
              </div>
            </section>
          )}

          {/* All trips */}
          <section className="mt-10">
            <h2 className="font-display text-lg font-bold text-slate-900">All trips</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.trips
                .filter((t) => !upcomingIds.has(t._id))
                .map((t) => (
                  <TripCard key={t._id} trip={t} onDelete={onDelete} onRegenerate={onRegenerate} regenerating={regenId === t._id} />
                ))}
            </div>
            {data.trips.filter((t) => !upcomingIds.has(t._id)).length === 0 && (
              <p className="mt-2 text-sm text-slate-400">All your trips are upcoming — nice!</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Protected>
      <Dashboard />
    </Protected>
  );
}

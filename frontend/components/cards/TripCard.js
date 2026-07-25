"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, MoreVertical, Eye, RefreshCw, Trash2 } from "lucide-react";

export default function TripCard({ trip, onDelete, onRegenerate, regenerating }) {
  const router = useRouter();
  const [menu, setMenu] = useState(false);

  const meta = trip.plan?.tripMeta || {};
  const dest = trip.plan?.destination?.city || trip.input?.destination || trip.title;
  const days = meta.durationDays || trip.input?.durationDays;
  const dates = trip.input?.startDate
    ? `${trip.input.startDate}${trip.input.endDate ? ` → ${trip.input.endDate}` : ""}`
    : null;

  const open = () => router.push(`/trip/${trip._id}`);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card group relative overflow-hidden"
    >
      <button onClick={open} className="block w-full text-left">
        <div className="relative h-40 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-110"
            style={{
              backgroundImage: trip.coverImage
                ? `url('${trip.coverImage}')`
                : "linear-gradient(135deg,#4f46e5,#7c3aed)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 p-4 text-white">
            <p className="font-display text-lg font-bold">{dest}</p>
            {days && <p className="text-sm text-white/80">{days} day{days > 1 ? "s" : ""}</p>}
          </div>
        </div>
      </button>

      <div className="flex items-center justify-between p-4">
        <div className="min-w-0 text-sm text-slate-500">
          {dates ? (
            <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {dates}</span>
          ) : (
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {trip.input?.fromCity || "—"}</span>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setMenu((m) => !m)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Trip actions"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menu && (
            <div
              className="absolute right-0 z-10 mt-1 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card"
              onMouseLeave={() => setMenu(false)}
            >
              <button onClick={open} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                <Eye className="h-4 w-4" /> Open
              </button>
              <button
                onClick={() => { setMenu(false); onRegenerate?.(trip._id); }}
                disabled={regenerating}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} /> Regenerate
              </button>
              <button
                onClick={() => { setMenu(false); onDelete?.(trip); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";
import { seedImage } from "../../lib/img";

export const metadata = { title: "Explore · AI Trip Planner" };

const IDEAS = [
  { name: "Goa", country: "India", tag: "Beaches & nightlife", img: seedImage("goa-beach", 800, 600) },
  { name: "Jaipur", country: "India", tag: "Forts & heritage", img: seedImage("jaipur-fort", 800, 600) },
  { name: "Kyoto", country: "Japan", tag: "Temples & culture", img: seedImage("kyoto-temple", 800, 600) },
  { name: "Paris", country: "France", tag: "Art & romance", img: seedImage("paris-city", 800, 600) },
  { name: "Bali", country: "Indonesia", tag: "Nature & relaxation", img: seedImage("bali-nature", 800, 600) },
  { name: "Rome", country: "Italy", tag: "History & food", img: seedImage("rome-history", 800, 600) },
];

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
        <Compass className="h-4 w-4" /> Explore
      </span>
      <h1 className="mt-4 font-display text-4xl font-bold text-slate-900">Find your next destination</h1>
      <p className="mt-2 text-slate-600">Pick a spot to inspire you — the AI will plan the rest.</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {IDEAS.map((d) => (
          <Link
            key={d.name}
            href={`/plan?to=${encodeURIComponent(d.name)}`}
            className="group card overflow-hidden transition hover:-translate-y-1 hover:shadow-soft"
          >
            <div className="relative h-48 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url('${d.img}')` }}
              />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-display text-lg font-bold text-slate-900">{d.name}, {d.country}</p>
                <p className="text-sm text-slate-500">{d.tag}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-brand-600 transition group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

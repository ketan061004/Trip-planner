import Link from "next/link";
import { Sparkles, Wallet, CloudSun, MapPinned, CalendarDays, ShieldCheck } from "lucide-react";
import Hero from "../components/home/Hero";
import { seedImage } from "../lib/img";

const FEATURES = [
  { icon: Sparkles, title: "AI Itineraries", desc: "Personalized day-by-day plans tuned to your interests and pace." },
  { icon: Wallet, title: "Smart Budgets", desc: "Clear cost breakdowns with optimization when you're over budget." },
  { icon: MapPinned, title: "Local Gems", desc: "Destination-based interests, hotels, and restaurant picks." },
  { icon: CloudSun, title: "Weather-Aware", desc: "Suggestions adapt to the forecast for a smoother trip." },
  { icon: CalendarDays, title: "Save & Revisit", desc: "Keep every trip in your dashboard, edit or regenerate anytime." },
  { icon: ShieldCheck, title: "Yours Securely", desc: "Your account and trips are stored safely behind login." },
];

const DESTINATIONS = [
  { name: "Goa", country: "India", img: seedImage("goa-beach", 800, 600) },
  { name: "Kyoto", country: "Japan", img: seedImage("kyoto-temple", 800, 600) },
  { name: "Paris", country: "France", img: seedImage("paris-city", 800, 600) },
  { name: "Bali", country: "Indonesia", img: seedImage("bali-nature", 800, 600) },
];

export default function Home() {
  return (
    <div>
      <Hero />

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900">Everything you need to plan smarter</h2>
          <p className="mx-auto mt-2 max-w-2xl text-slate-600">
            From the first spark of an idea to a complete itinerary — the AI handles the heavy lifting.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6 transition hover:-translate-y-1 hover:shadow-soft">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular destinations */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl font-bold text-slate-900">Popular destinations</h2>
          <p className="mt-2 text-slate-600">Get inspired — then let the AI build your plan.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DESTINATIONS.map((d) => (
              <Link
                key={d.name}
                href={`/plan?to=${encodeURIComponent(d.name)}`}
                className="group relative h-56 overflow-hidden rounded-2xl shadow-card"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${d.img}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 p-4 text-white">
                  <p className="font-display text-xl font-bold">{d.name}</p>
                  <p className="text-sm text-white/80">{d.country}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-violet-600 p-10 text-center text-white shadow-soft sm:p-16">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to plan your next adventure?</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            Start with a destination and let AI do the rest — in under a minute.
          </p>
          <Link
            href="/plan"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            <Sparkles className="h-5 w-5" /> Start planning free
          </Link>
        </div>
      </section>
    </div>
  );
}

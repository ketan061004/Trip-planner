"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { searchPlaces } from "../../lib/api";

/**
 * Debounced place autocomplete backed by /api/geo/search (Open-Meteo).
 * Controlled: value is the text; onChange(text); onSelect(place) when a
 * suggestion is chosen.
 */
export default function LocationAutocomplete({
  label,
  icon: Icon = MapPin,
  placeholder,
  value,
  onChange,
  onSelect,
  name,
}) {
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef(null);
  const debounceRef = useRef(null);
  const justSelected = useRef(false);

  useEffect(() => {
    if (justSelected.current) {
      justSelected.current = false;
      return;
    }
    const q = (value || "").trim();
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchPlaces(q, 6);
        setResults(res || []);
        setOpen(true);
        setActive(-1);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [value]);

  // Close on outside click.
  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const choose = (place) => {
    justSelected.current = true;
    onChange(place.name);
    onSelect?.(place);
    setOpen(false);
    setResults([]);
  };

  const onKeyDown = (e) => {
    if (!open || !results.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(results.length - 1, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === "Enter" && active >= 0) { e.preventDefault(); choose(results[active]); }
    else if (e.key === "Escape") setOpen(false);
  };

  return (
    <div className="relative" ref={boxRef}>
      {label && <label className="label">{label}</label>}
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          name={name}
          className="field pl-9"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => results.length && setOpen(true)}
          autoComplete="off"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-card">
          {results.map((p, i) => (
            <li key={`${p.lat},${p.lon}`}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(p)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${
                  i === active ? "bg-brand-50 text-brand-800" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                <span className="min-w-0 flex-1 truncate">{p.label}</span>
                {p.type && (
                  <span className="flex-shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    {p.type}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

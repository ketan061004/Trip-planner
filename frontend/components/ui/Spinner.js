"use client";

import { Loader2 } from "lucide-react";

export default function Spinner({ className = "", label }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-slate-500 ${className}`}>
      <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}

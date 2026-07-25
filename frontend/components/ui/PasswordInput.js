"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ label, error, className = "", id, ...props }) {
  const [show, setShow] = useState(false);
  const inputId = id || props.name || "password";

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          id={inputId}
          type={show ? "text" : "password"}
          className={`field pl-9 pr-10 ${error ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-600"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

"use client";

import { CheckCircle2, AlertCircle, Info } from "lucide-react";

const STYLES = {
  error: { wrap: "border-red-200 bg-red-50 text-red-700", Icon: AlertCircle },
  success: { wrap: "border-emerald-200 bg-emerald-50 text-emerald-700", Icon: CheckCircle2 },
  info: { wrap: "border-brand-200 bg-brand-50 text-brand-700", Icon: Info },
};

export default function Alert({ type = "info", children, className = "" }) {
  if (!children) return null;
  const { wrap, Icon } = STYLES[type] || STYLES.info;
  return (
    <div className={`flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-sm ${wrap} ${className}`}>
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <div>{children}</div>
    </div>
  );
}

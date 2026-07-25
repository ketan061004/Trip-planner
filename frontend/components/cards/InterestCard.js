"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const FIT_LABEL = { low: "$", mid: "$$", high: "$$$" };

export default function InterestCard({ interest, image, selected, onToggle }) {
  const { label, emoji, reason, budgetFit } = interest;
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative h-40 w-full overflow-hidden rounded-2xl text-left shadow-card ring-2 transition ${
        selected ? "ring-brand-600" : "ring-transparent hover:ring-brand-200"
      }`}
    >
      {/* Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-110"
        style={{ backgroundImage: image ? `url('${image}')` : "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

      {/* Selected check */}
      <div
        className={`absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full transition ${
          selected ? "bg-brand-600 text-white" : "bg-white/30 text-white backdrop-blur"
        }`}
      >
        {selected && <Check className="h-4 w-4" />}
      </div>

      {/* Text */}
      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
        <div className="flex items-center gap-1.5">
          {emoji && <span className="text-lg leading-none">{emoji}</span>}
          <span className="font-semibold">{label}</span>
          {budgetFit && FIT_LABEL[budgetFit] && (
            <span className="ml-auto rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-bold backdrop-blur">
              {FIT_LABEL[budgetFit]}
            </span>
          )}
        </div>
        {reason && <p className="mt-0.5 text-xs text-white/80">{reason}</p>}
      </div>
    </motion.button>
  );
}

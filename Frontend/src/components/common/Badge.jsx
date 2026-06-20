import React from "react";

/**
 * Badge — small status/label pill. STOCK_TONES covers the stock states
 * used across the catalog; pass `tone` directly for anything else (e.g. a
 * "New" or "Sale" badge later).
 */
const TONES = {
  success: "bg-emerald-400/10 text-emerald-400 ring-emerald-400/30",
  warning: "bg-amber-400/10 text-amber-400 ring-amber-400/30",
  neutral: "bg-slate-700/30 text-slate-400 ring-slate-600/40",
  info: "bg-cyan-400/10 text-cyan-300 ring-cyan-400/30",
};

export default function Badge({ children, tone = "neutral", className = "" }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ring-1 ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

import React from "react";

/**
 * Button — the one place every button's visual language is defined.
 * New CTAs reach for this instead of re-typing the same Tailwind string,
 * so a future brand tweak (accent color, radius) is a one-file change.
 *
 * variant: "primary" | "secondary" | "ghost"
 * size:    "md" | "sm"
 */
const VARIANTS = {
  primary:
    "bg-cyan-400 text-slate-950 hover:bg-cyan-300 hover:shadow-[0_0_20px_2px_rgba(34,211,238,0.3)]",
  secondary:
    "border border-slate-700 bg-slate-900/40 text-slate-200 hover:border-slate-500 hover:bg-slate-800",
  ghost: "text-slate-300 hover:bg-slate-800 hover:text-slate-50",
};

const SIZES = {
  md: "px-6 py-3 text-sm",
  sm: "px-4 py-2 text-xs",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

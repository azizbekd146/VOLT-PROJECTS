import React from "react";

export default function Spinner({ size = 28, label = "Loading" }) {
  return (
    <div role="status" aria-label={label} className="flex items-center justify-center py-12">
      <div
        className="animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400"
        style={{ width: size, height: size }}
      />
    </div>
  );
}

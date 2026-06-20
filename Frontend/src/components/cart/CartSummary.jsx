import React from "react";
import { formatCurrency } from "../../utils/formatCurrency";

/**
 * CartSummary — totals + checkout CTA. Split out from CartDrawer so a
 * future Checkout page can reuse the exact same totals block.
 */
export default function CartSummary({ total, onCheckout, placing }) {
  return (
    <div className="mt-5 border-t border-slate-800 pt-4">
      <div className="flex items-center justify-between text-base font-semibold text-slate-50">
        <span>Total</span>
        <span className="font-mono">{formatCurrency(total)}</span>
      </div>
      <button
        onClick={onCheckout}
        disabled={placing}
        className="mt-4 w-full rounded-lg bg-cyan-400 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {placing ? "Placing order…" : "Place order"}
      </button>
    </div>
  );
}

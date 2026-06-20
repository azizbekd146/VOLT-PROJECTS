import React from "react";
import { CheckCircle2, X, Truck, ArrowRight } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

/**
 * OrderConfirmationModal — shown after checkout completes.
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: handler
 *  - order: { id, items: [{ name, brand, qty, price }], shipping }
 */
export default function OrderConfirmationModal({
  isOpen = false,
  onClose = () => {},
  order = { id: "", items: [], shipping: 0 },
}) {
  if (!isOpen) return null;

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal + order.shipping;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm font-body"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/10 ring-1 ring-emerald-400/40">
            <CheckCircle2 className="h-7 w-7 text-emerald-400" />
          </div>
          <h2 className="font-display mt-4 text-xl font-bold text-slate-50">Order confirmed</h2>
          <p className="font-mono mt-1 text-xs uppercase tracking-wide text-slate-500">
            Order #{order.id}
          </p>
        </div>

        <div className="mt-6 space-y-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          {order.items.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div>
                <p className="text-slate-200">{item.name}</p>
                <p className="text-xs text-slate-500">
                  {item.brand} · Qty {item.qty}
                </p>
              </div>
              <span className="font-mono text-slate-300">
                {formatCurrency(item.price * item.qty)}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-sm text-slate-400">
            <span>Shipping</span>
            <span className="font-mono">
              {order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-base font-semibold text-slate-50">
            <span>Total</span>
            <span className="font-mono">{formatCurrency(total)}</span>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-lg bg-cyan-400/10 px-3 py-2 text-xs text-cyan-300">
          <Truck className="h-3.5 w-3.5" />
          Estimated dispatch within 48 hours
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
          >
            Continue shopping
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
            Track order <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

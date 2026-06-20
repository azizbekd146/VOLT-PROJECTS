import React from "react";
import { Minus, Plus, Trash2, Package } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

/**
 * CartItem — single row inside the cart drawer. Pure presentational +
 * three callbacks; all the actual state lives in CartContext.
 */
export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-800 p-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-800">
        <Package className="h-5 w-5 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm text-slate-200">{item.name}</p>
        <p className="font-mono text-xs text-slate-500">
          {formatCurrency(item.price)} · {item.brand}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onDecrease}
          aria-label={`Decrease quantity of ${item.name}`}
          className="flex h-6 w-6 items-center justify-center rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-5 text-center text-sm">{item.qty}</span>
        <button
          onClick={onIncrease}
          aria-label={`Increase quantity of ${item.name}`}
          className="flex h-6 w-6 items-center justify-center rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
      <button
        onClick={onRemove}
        aria-label={`Remove ${item.name} from cart`}
        className="text-slate-500 hover:text-rose-400"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

import React, { useState } from "react";
import { X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import { placeOrder } from "../../services/orderService";

/**
 * CartDrawer — slide-in panel reading directly from CartContext.
 * Checkout goes through orderService (api -> service -> UI), and on
 * success hands the confirmed order up to the page via onOrderPlaced
 * so OrderConfirmationModal can render it and the cart can be cleared.
 */
export default function CartDrawer({ isOpen, onClose, onOrderPlaced }) {
  const { items, totalPrice, removeItem, updateQty, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setPlacing(true);
    const order = await placeOrder(items, { shipping: 0 });
    setPlacing(false);
    clearCart();
    onOrderPlaced(order);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-sm flex-col border-l border-slate-800 bg-slate-900 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-slate-50">Your cart</h3>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 flex-1 space-y-4 overflow-y-auto">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-sm text-slate-500">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={() => updateQty(item.id, item.qty + 1)}
                onDecrease={() => updateQty(item.id, item.qty - 1)}
                onRemove={() => removeItem(item.id)}
              />
            ))
          )}
        </div>

        {items.length > 0 && (
          <CartSummary total={totalPrice} onCheckout={handleCheckout} placing={placing} />
        )}
      </div>
    </div>
  );
}

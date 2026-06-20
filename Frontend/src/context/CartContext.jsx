import React, { createContext, useContext, useReducer, useEffect, useMemo } from "react";

/**
 * CartContext — global cart state via Context + useReducer.
 *
 * Usage:
 *   1. Wrap the app once:        <CartProvider><App /></CartProvider>
 *   2. Read/write from anywhere: const { items, totalItems, totalPrice, addItem } = useCart();
 *
 * Why this pattern (see README for the full comparison):
 *   - Zero extra dependencies — fine for a single global slice like "cart".
 *   - useReducer keeps every state transition (add/remove/update/clear) in one
 *     place, which is exactly what you want when an order-management flow
 *     starts adding more actions later (e.g. APPLY_COUPON, SET_SHIPPING_METHOD).
 *   - localStorage persistence means refreshing the page won't empty the cart
 *     mid-checkout, which matters a lot for a live demo.
 */

const CartContext = createContext(undefined);
const STORAGE_KEY = "voltparts_cart";

function loadInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { items: [] };
  } catch {
    return { items: [] };
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, qty: i.qty + (action.payload.qty || 1) } : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, qty: action.payload.qty || 1 }],
      };
    }

    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload.id) };

    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items
          .map((i) => (i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i))
          .filter((i) => i.qty > 0),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState);

  // Persist on every change so a refresh mid-session doesn't lose the cart.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const totals = useMemo(() => {
    const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = state.items.reduce((sum, i) => sum + i.qty * i.price, 0);
    return { totalItems, totalPrice };
  }, [state.items]);

  const value = useMemo(
    () => ({
      items: state.items,
      ...totals,
      addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
      removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: { id } }),
      updateQty: (id, qty) => dispatch({ type: "UPDATE_QTY", payload: { id, qty } }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
    }),
    [state.items, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

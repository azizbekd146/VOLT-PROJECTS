import { submitOrder } from "../api/ordersApi";

/**
 * orderService — turns cart line items into an order payload and submits
 * it. Keeping this out of the cart drawer component means the same logic
 * can be reused from a future Checkout page without duplication.
 */
export async function placeOrder(cartItems, { shipping = 0 } = {}) {
  const order = {
    id: `VP-${Math.floor(10000 + Math.random() * 89999)}`,
    items: cartItems.map(({ name, brand, qty, price }) => ({ name, brand, qty, price })),
    shipping,
  };
  return submitOrder(order);
}

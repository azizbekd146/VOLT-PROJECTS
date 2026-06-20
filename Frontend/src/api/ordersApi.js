/**
 * ordersApi — placeholder for the real order-write path. Swap for a POST
 * to your REST/Express layer, a Supabase insert into an `orders` table, or
 * a MongoDB `orders.insertOne(...)` call behind your own service.
 */
export async function submitOrder(order) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { ...order, status: "confirmed", placedAt: new Date().toISOString() };
}

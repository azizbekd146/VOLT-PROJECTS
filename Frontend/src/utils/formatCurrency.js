/**
 * formatCurrency — single source of truth for money formatting.
 * Centralizing this means a future currency switch (USD -> local currency)
 * is a one-file change instead of a grep through every component.
 */
export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

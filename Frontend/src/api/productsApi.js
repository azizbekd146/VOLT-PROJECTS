import { PRODUCTS } from "../data/products";

/**
 * productsApi — today this resolves mock data with a small artificial
 * delay so loading states are real and testable. Swap the body for:
 *   return apiClient.get("/products")
 * or, on Supabase:
 *   const { data } = await supabase.from("products").select("*");
 *   return data;
 * The rest of the app (productService, ProductGrid) never has to change.
 */
export async function fetchProducts() {
  await new Promise((resolve) => setTimeout(resolve, 450));
  return PRODUCTS;
}

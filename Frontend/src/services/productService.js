import { fetchProducts } from "../api/productsApi";

/**
 * productService — business logic lives here, not in components and not
 * in the raw API layer. UI code calls `productService.getProducts(...)`
 * instead of constructing fetch calls or filtering logic inline, which is
 * what lets the data source change later without touching ProductGrid.
 */
export async function getProducts() {
  return fetchProducts();
}

export function filterProducts(products, { brand = "All", search = "" } = {}) {
  const term = search.trim().toLowerCase();
  return products.filter((p) => {
    const matchesBrand = brand === "All" || p.brand === brand;
    const matchesSearch =
      !term ||
      p.name.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.model.toLowerCase().includes(term) ||
      p.partNumber.toLowerCase().includes(term);
    return matchesBrand && matchesSearch;
  });
}

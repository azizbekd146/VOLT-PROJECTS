# VoltParts — EV Spare Parts Storefront

A working Vite + React + Tailwind storefront: browse a catalog, filter by
brand, search, add to cart, check out, and see an order confirmation —
organized into a feature-based structure that scales past a single demo.

## 1. Project structure

```
voltparts/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/                     # fetch/axios instances + endpoint definitions
│   │   ├── client.js
│   │   ├── productsApi.js
│   │   └── ordersApi.js
│   ├── components/
│   │   ├── common/              # Button, Badge, Spinner — generic, reused everywhere
│   │   ├── layout/               # Navbar.jsx, Footer.jsx
│   │   ├── sections/               # Hero.jsx
│   │   ├── product/                 # ProductCard.jsx, ProductGrid.jsx, BrandFilter.jsx
│   │   ├── cart/                      # CartDrawer.jsx, CartItem.jsx, CartSummary.jsx
│   │   └── order/                      # OrderConfirmationModal.jsx
│   ├── context/                          # CartContext.jsx
│   ├── data/                               # products.js (mock catalog)
│   ├── hooks/                                # useDebounce.js
│   ├── pages/                                  # Home.jsx
│   ├── routes/                                   # AppRouter.jsx
│   ├── services/                                   # productService.js, orderService.js
│   ├── utils/                                        # formatCurrency.js, constants.js
│   ├── styles/                                         # index.css (Tailwind + fonts, defined once)
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── vite.config.js
```

`components/` is organized by *domain* (product, cart, order) rather than
one flat folder, so it stays searchable as it grows past a handful of
files. `api/` is kept separate from `services/` so UI code calls
`orderService.placeOrder(items)` instead of constructing fetch calls
directly — that indirection is what lets a REST backend become Supabase
or MongoDB later without touching a single component.

## 2. Run it

```bash
npm install
npm run dev
```

Open the printed local URL. Everything works without any backend or env
vars — `productsApi` and `ordersApi` resolve mock data with a small
artificial delay so loading states are real.

## 3. How the pieces connect

- **`CartContext`** (Context + `useReducer`) is the single source of truth
  for cart state, persisted to `localStorage` so a refresh mid-checkout
  doesn't lose items.
- **`ProductGrid`** fetches through `productService.getProducts()`, filters
  by brand + the debounced search term from the navbar, and dispatches
  `addItem` from `useCart()` — `ProductCard` itself stays presentational.
- **`CartDrawer`** reads cart state directly from context and calls
  `orderService.placeOrder(items)` on checkout, which talks to `ordersApi`.
  On success it clears the cart and hands the confirmed order up to
  `Home`, which renders `OrderConfirmationModal`.
- **`Home`** is the only place that wires these together — it holds no
  business logic of its own.

## 4. Going to a real backend

Two files are the entire surface area for swapping mock data for Supabase
or MongoDB:

```js
// src/api/productsApi.js
export async function fetchProducts() {
  const { data } = await supabase.from("products").select("*");
  return data;
}

// src/api/ordersApi.js
export async function submitOrder(order) {
  return apiClient.post("/orders", order); // -> your Express/Mongo route
}
```

`productService`, `ProductGrid`, `CartDrawer`, and `Home` don't change.

## 5. State management note

Cart state uses Context + `useReducer` — zero dependencies, every
transition (add/remove/update/clear) lives in one reducer, which is the
right call for a single global slice like "cart." If the app grows to
juggle cart *and* auth *and* a wishlist at once, Zustand is a clean
upgrade — the actions here map almost 1:1 to store methods, no rewrite
needed.

## 6. Before presenting / shipping

Swap in real product photos via the `image` prop on `ProductCard` (the
placeholder package icon is intentionally neutral so it never looks
broken). Keep the brand chips (`BYD`, `Leapmotor`, `Deepal`) as plain text
badges rather than logo images — recreating official logos risks
trademark issues, and clean typographic badges read as more deliberate in
a dark UI anyway.

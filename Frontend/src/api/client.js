/**
 * apiClient — thin fetch wrapper. Every real network call in the app goes
 * through this one place, so swapping the backend (REST -> Supabase ->
 * MongoDB-backed service) later means editing this file and the two
 * `*Api.js` modules, not every component that happens to need data.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://volt-projects-production.up.railway.app";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  return res.json();
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
};

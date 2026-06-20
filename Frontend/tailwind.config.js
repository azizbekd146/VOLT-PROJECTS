/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0B1120",     // page background
        midnight: "#0F172A", // surfaces / cards
        steel: "#1E293B",    // elevated surfaces
        volt: "#22D3EE",     // primary accent — "charge" cyan
        current: "#34D399",  // success / in-stock
        spark: "#FBBF24",    // warning / low-stock
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

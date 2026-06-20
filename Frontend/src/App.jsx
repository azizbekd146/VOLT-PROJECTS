import React, { useState, useEffect } from "react";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ThemeProvider } from "./context/ThemeContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import AppRouter from "./routes/AppRouter";
import { Send } from "lucide-react";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { validateEnvironment } from "./utils/envValidator";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Environment o'zgaruvchilarini tekshiring
    validateEnvironment();

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-950 font-body text-cyan-400">
        <div className="flex flex-col items-center gap-6">
          <svg
            className="h-12 w-12 animate-spin text-cyan-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <h1 className="font-display text-xl font-semibold tracking-widest animate-pulse text-slate-50">
            Sayt ishga tushyapti...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider>
          <CurrencyProvider>
            <CartProvider>
              <WishlistProvider>
                <AppRouter />

                {/* O'ng tarafda doim turadigan dumaloq Telegram tugmasi */}
                <a
                  href="https://t.me/VoltParts_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fixed bottom-6 right-6 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-[#229ED9] text-white shadow-[0_4px_20px_rgba(34,158,217,0.4)] transition-all hover:-translate-y-1 hover:scale-110 active:scale-95 animate-in fade-in zoom-in duration-500"
                  title="Bizga yozing"
                >
                  <Send className="h-6 w-6 pr-0.5" />
                </a>
              </WishlistProvider>
            </CartProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

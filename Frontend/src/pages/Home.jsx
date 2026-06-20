import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";
import ProductGrid from "../components/product/ProductGrid";
import BrandsSection from "../components/sections/BrandsSection";
import ReviewSection from "../components/sections/ReviewSection";
import AdvantagesSection from "../components/sections/AdvantagesSection";
import Footer from "../components/layout/Footer";
import WishlistDrawer from "../components/cart/WishlistDrawer";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useDebounce } from "../hooks/useDebounce";
import { useLanguage } from "../context/LanguageContext";
import { useCurrency } from "../context/CurrencyContext";
import { Menu, X, ShoppingCart, User, LogOut, Settings } from "lucide-react";

export default function Home({ theme = "dark", onThemeToggle = () => { } }) {
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [myOrders, setMyOrders] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { lang, switchLanguage, t } = useLanguage();
  const { formatPrice } = useCurrency();

  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    let isBackendOffline = false;
    // Har 2 soniyada backenddan buyurtmalar holatini tekshirib turish
    const fetchOrders = () => {
      const localOrders = JSON.parse(localStorage.getItem("volt_orders") || "[]");
      if (isBackendOffline) {
        setMyOrders(localOrders);
        return;
      }
      fetch("http://localhost:5000/api/orders")
        .then((res) => {
          if (!res.ok) throw new Error("Tarmoq xatosi");
          return res.json();
        })
        .then((data) => setMyOrders(data.length > 0 ? data : localOrders))
        .catch((err) => {
          isBackendOffline = true; // Xato bo'lsa, konsolni to'ldirmaslik uchun so'rovni to'xtatamiz
          setMyOrders(localOrders);
        });
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen ${theme === "light" ? "bg-slate-50" : "bg-slate-950"}`}>
      {/* 3 ta chiziq (Gamburger menyu) tugmasi - Chap tepa tarafda */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-24 left-0 z-40 bg-cyan-500 text-slate-950 p-3 rounded-r-xl shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:bg-cyan-400 hover:pr-4 transition-all"
        title="Menyuni ochish"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar (Yon panel) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="fixed top-0 left-0 bottom-0 w-72 bg-slate-900 border-r border-slate-800 shadow-2xl animate-in slide-in-from-left duration-300 p-6 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-10">
              <span className="font-display text-xl font-bold tracking-tight text-slate-50 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-cyan-400/10 flex items-center justify-center ring-1 ring-cyan-400/40">
                  <Menu className="h-4 w-4 text-cyan-400" />
                </div>
                VOLT<span className="text-cyan-400">MENYU</span>
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  navigate("/profile", { state: { activeTab: "orders" } });
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" /> Mening Buyurtmalarim
              </button>

              <button
                onClick={() => {
                  setSidebarOpen(false);
                  navigate("/profile", { state: { activeTab: "settings" } });
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
              >
                <User className="h-5 w-5" /> Mening Hisobim
              </button>

              <button
                onClick={() => {
                  setSidebarOpen(false);
                  navigate("/profile", { state: { activeTab: "settings" } });
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
              >
                <Settings className="h-5 w-5" /> Sozlamalar
              </button>
            </nav>

            <div className="pt-6 border-t border-slate-800 mt-auto">
              <button
                onClick={() => {
                  localStorage.removeItem("isAuthenticated");
                  localStorage.removeItem("role");
                  navigate("/");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
              >
                <LogOut className="h-5 w-5" /> Tizimdan chiqish
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar
        cartCount={totalItems}
        onCartClick={() => navigate("/cart")}
        wishlistCount={wishlist?.length || 0}
        onWishlistClick={() => setWishlistOpen(true)}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        lang={lang} // Pass lang prop
        switchLanguage={switchLanguage} // Pass switchLanguage prop
        theme={theme}
        onThemeToggle={onThemeToggle}
      />

      <Hero
        onBrowseClick={() =>
          document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })
        }
      />
      <BrandsSection />
      <ProductGrid searchTerm={debouncedSearch} />
      <AdvantagesSection />
      <ReviewSection />

      <Footer />

      <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />

      {/* Foydalanuvchiga buyurtma tayyor bo'lganini ko'rsatish oynasi */}
      {myOrders.some((o) => o.status === "ready") && (
        <div className="fixed bottom-24 right-6 z-50 bg-cyan-500 text-slate-950 px-6 py-5 rounded-2xl shadow-2xl flex flex-col gap-2 max-w-sm animate-in slide-in-from-bottom-5">
          <h3 className="font-bold text-lg">🎉 Buyurtma qabul qilindi!</h3>
          <p className="text-sm font-medium">
            Tez orada admin sizga bog'lanadi.
          </p>
          <button
            onClick={() => {
              const readyOrder = myOrders.find((o) => o.status === "ready");
              if (readyOrder) {
                const updatedOrders = myOrders.map((o) =>
                  o.status === "ready" ? { ...o, status: "completed" } : o
                );
                localStorage.setItem("volt_orders", JSON.stringify(updatedOrders));
                fetch(`http://localhost:5000/api/orders/${readyOrder.id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ status: "completed" }),
                })
                  .then(() => setMyOrders(updatedOrders))
                  .catch(() => setMyOrders(updatedOrders));
              }
            }}
            className="bg-white text-black font-bold hover:bg-slate-100 px-4 py-2 rounded-lg mt-2 text-sm transition shadow-sm"
          >
            Tushunarli
          </button>
        </div>
      )}
    </div>
  );
}

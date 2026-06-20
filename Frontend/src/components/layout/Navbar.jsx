import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, LogOut, Heart, ChevronDown } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../context/CurrencyContext";

export default function Navbar({
  cartCount,
  onCartClick,
  wishlistCount,
  onWishlistClick,
  searchValue,
  onSearchChange,
  theme,
  onThemeToggle,
  lang,
  switchLanguage,
}) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [isFocused, setIsFocused] = useState(false);
  const [products, setProducts] = useState([]);
  const { currency, switchCurrency, formatPrice } = useCurrency();

  const [langOpen, setLangOpen] = useState(false);
  const langDropdownRef = useRef(null);

  const [currencyOpen, setCurrencyOpen] = useState(false);
  const currencyDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangOpen(false);
      }
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target)) {
        setCurrencyOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // `.env.local` dagi Railway manzilini o'qiydi, agar u yo'q bo'lsa fallback qilinadi
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
        const res = await fetch(`${baseUrl}/api/products`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          return;
        }
      } catch (e) {
        console.error("Xatolik yuz berdi, local xotiradan o'qiladi:", e);
      }
      const local = localStorage.getItem("volt_products");
      if (local) setProducts(JSON.parse(local));
    };
    fetchProducts();
  }, []);

  const searchResults = products
    .filter(
      (p) =>
        p.name?.toLowerCase().includes((searchValue || "").toLowerCase()) ||
        p.brand?.toLowerCase().includes((searchValue || "").toLowerCase()) ||
        p.model?.toLowerCase().includes((searchValue || "").toLowerCase())
    )
    .slice(0, 5);

  // Chiqish tugmasi to'liq ishlashi uchun handleLogout funksiyasi mukammallashtirildi
  const handleLogout = () => {
    // Brauzer xotirasidagi barcha ma'lumotlarni (token, role, auth holati) tozalaymiz
    localStorage.clear();

    // Foydalanuvchini bosh sahifaga (yoki login sahifasiga) yo'naltiramiz
    navigate("/");

    // Sahifa to'liq yangilanib, eski sessiya qoldiqlari qolib ketmasligi uchun:
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold tracking-tight text-slate-50">
            VOLT<span className="text-cyan-400">PARTS</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/home"
            className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors"
          >
            {t("navCatalog")}
          </Link>
          <a
            href="#brands"
            className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors"
          >
            {t("navBrands")}
          </a>
          <a
            href="#reviews"
            className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors"
          >
            {t("navReviews")}
          </a>
        </nav>

        {/* Right Section: Search, Cart, Theme Toggle, Language Switch */}
        <div className="flex items-center gap-4">
          {/* Search Input with Live Autocomplete */}
          <div className="relative hidden sm:block z-50">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${isFocused ? "text-cyan-400" : "text-slate-500"}`}
            />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="w-48 lg:w-64 focus:w-64 lg:focus:w-80 rounded-full border border-slate-700 bg-slate-800 py-2 pl-9 pr-4 text-sm text-slate-50 placeholder-slate-500 focus:border-cyan-400 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
            />

            {/* Jonli Qidiruv Natijalari (Live Search Dropdown) */}
            {isFocused && searchValue.trim().length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-full bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {searchResults.length > 0 ? (
                  <div className="flex flex-col max-h-[350px] overflow-y-auto">
                    {searchResults.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSearchChange(p.name);
                          setIsFocused(false);
                          document
                            .getElementById("catalog")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-slate-700/80 transition-colors cursor-pointer border-b border-slate-700/50 last:border-0"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-slate-600 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-100 truncate">
                            {p.name}
                          </h4>
                          <p className="text-xs text-cyan-400 font-mono mt-0.5">
                            {formatPrice(p.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-sm text-slate-400 text-center flex flex-col items-center gap-2">
                    <Search className="h-6 w-6 text-slate-500 opacity-50" />
                    {lang === "uz"
                      ? "Hech narsa topilmadi"
                      : lang === "ru"
                        ? "Ничего не найдено"
                        : "No results found"}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={onWishlistClick}
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-colors hover:bg-slate-700 hover:text-rose-400"
            title="Sevimlilar"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onCartClick}
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Yaxshilangan Til o'zgartirgich (Hover + Click) */}
          <div
            className="relative z-50"
            ref={langDropdownRef}
            onMouseEnter={() => setLangOpen(true)}
            onMouseLeave={() => setLangOpen(false)}
          >
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-slate-300 hover:text-cyan-400 transition-colors font-bold uppercase text-sm px-2 py-1"
            >
              {lang}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${langOpen ? "rotate-180 text-cyan-400" : ""}`}
              />
            </button>

            <div
              className={`absolute right-0 top-full mt-1 w-36 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-2xl transition-all duration-200 origin-top-right ${langOpen ? "scale-100 opacity-100 visible" : "scale-95 opacity-0 invisible"}`}
            >
              <div className="py-2">
                {["uz", "en", "ru"]
                  .filter((l) => l !== lang)
                  .map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        switchLanguage(l);
                        setLangOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-3"
                    >
                      <span className="uppercase text-xs font-bold text-slate-500">{l}</span>
                      <span className="font-medium">
                        {l === "uz" ? "O'zbek" : l === "ru" ? "Русский" : "English"}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Yaxshilangan Valyuta o'zgartirgich (Hover + Click) */}
          <div
            className="relative z-50 hidden lg:block"
            ref={currencyDropdownRef}
            onMouseEnter={() => setCurrencyOpen(true)}
            onMouseLeave={() => setCurrencyOpen(false)}
          >
            <button
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 transition-all rounded-full px-3 py-1.5 text-xs font-bold tracking-wide shadow-sm"
            >
              <span className="text-cyan-500 mr-0.5">
                {currency === "USD" ? "$" : currency === "RUB" ? "₽" : "S"}
              </span>
              {currency}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${currencyOpen ? "rotate-180 text-cyan-400" : ""}`}
              />
            </button>

            <div
              className={`absolute right-0 top-full mt-2 w-32 overflow-hidden rounded-xl border border-slate-700 bg-slate-900/95 backdrop-blur-md shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transition-all duration-200 origin-top-right ${currencyOpen ? "scale-100 opacity-100 visible" : "scale-95 opacity-0 invisible"}`}
            >
              <div className="p-1.5">
                {["USD", "UZS", "RUB"]
                  .filter((c) => c !== currency)
                  .map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        switchCurrency(c);
                        setCurrencyOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-between"
                    >
                      <span>{c}</span>
                      <span className="text-slate-500 font-normal">
                        {c === "USD" ? "$" : c === "RUB" ? "₽" : "so'm"}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-all hover:bg-rose-500 hover:text-white shadow-sm"
            title={lang === "uz" ? "Tizimdan chiqish" : lang === "ru" ? "Выйти" : "Logout"}
          >
            <LogOut className="h-5 w-5 ml-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

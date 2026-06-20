import React, { useState } from "react";
import { ShoppingCart, Check, Star, Package, Heart, X, ShieldCheck, Wrench } from "lucide-react";
import Badge from "../common/Badge";
import { useWishlist } from "../../context/WishlistContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useLanguage } from "../../context/LanguageContext";

/**
 * ProductCard — reusable EV spare-part card.
 *
 * Props:
 *  - image: product photo URL (falls back to a placeholder icon if omitted)
 *  - name, brand, model, partNumber, price, originalPrice, rating, stock
 *  - onAddToCart: handler fired when the button is pressed (wired to CartContext by ProductGrid)
 */
const STOCK_TONE = {
  "In Stock": "success",
  "Low Stock": "warning",
  "Out of Stock": "neutral",
};

export default function ProductCard({
  id,
  image = "https://placehold.co/400x400/1e293b/cyan?text=EV+Part",
  name = "Battery Module Cell Pack",
  brand = "BYD",
  model = "Atto 3",
  partNumber = "BMS-2201",
  price = 1249,
  originalPrice = null,
  rating = 4.8,
  stock = "In Stock",
  isOriginal = false,
  quality = "Original",
  salesCount = 0,
  onAddToCart = () => { },
  onCardClick = () => { },
}) {
  const [added, setAdded] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const { lang } = useLanguage();
  const isFav = isInWishlist(id);

  const actualQuality = quality || (isOriginal ? "Original" : "Aftermarket");

  const handleAdd = () => {
    if (stock === "Out of Stock") return;
    onAddToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div onClick={onCardClick} className="group relative flex w-full max-w-xs cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 font-body transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_8px_30px_-8px_rgba(34,211,238,0.25)]">
      {/* charge-pulse top accent — the card's signature detail */}
      <div className="h-[3px] w-full bg-gradient-to-r from-cyan-400 via-cyan-400/40 to-transparent" />

      {/* image */}
      <div className="relative flex h-52 w-full shrink-0 items-center justify-center bg-slate-800/60 overflow-hidden">
        <Badge tone={STOCK_TONE[stock]} className="absolute left-3 top-3">
          {stock}
        </Badge>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist({
              id,
              image,
              name,
              brand,
              model,
              partNumber,
              price,
              originalPrice,
              rating,
              stock,
            });
          }}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/50 backdrop-blur-md transition-all hover:bg-slate-900 hover:scale-110 active:scale-95"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${isFav ? "fill-rose-500 text-rose-500" : "text-slate-400"}`}
          />
        </button>
        {image ? (
          <img src={image} alt={name} className="h-full w-full object-cover" />
        ) : (
          <Package className="h-16 w-16 text-slate-600" strokeWidth={1.5} />
        )}

        {actualQuality === "Original" && (
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-md bg-cyan-500/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-950 backdrop-blur-md shadow-lg border border-cyan-400/50">
            <ShieldCheck className="h-3 w-3" /> {lang === "uz" ? "Original" : lang === "ru" ? "Оригинал" : "Original"}
          </div>
        )}
        {actualQuality === "Aftermarket" && (
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-md bg-purple-500/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md shadow-lg border border-purple-400/50">
            <Wrench className="h-3 w-3" /> Aftermarket
          </div>
        )}
        {actualQuality === "Padelka" && (
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-md bg-rose-500/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md shadow-lg border border-rose-400/50">
            <X className="h-3 w-3" /> {lang === "uz" ? "Nusxa (Padelka)" : lang === "ru" ? "Копия" : "Replica"}
          </div>
        )}
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="font-mono flex items-center justify-between text-[11px] uppercase tracking-wide text-slate-500">
          <span>
            {brand} {model ? `· ${model}` : ""}
          </span>
          <span>{partNumber ? `#${partNumber}` : ""}</span>
        </div>

        <h3 className="font-display text-base font-semibold leading-snug text-slate-50">{name}</h3>

        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-medium text-slate-300">{rating.toFixed(1)}</span>
          <span className="mx-1.5 opacity-50">•</span>
          <span className="text-cyan-400 font-medium">{salesCount} {lang === "uz" ? "ta sotilgan" : "sold"}</span>
        </div>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-mono text-lg font-bold text-slate-50">{formatPrice(price)}</span>
          {originalPrice && (
            <span className="font-mono text-sm text-slate-500 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAdd();
          }}
          disabled={stock === "Out of Stock"}
          className={`mt-auto flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.96] ${stock === "Out of Stock"
            ? "cursor-not-allowed bg-slate-800 text-slate-500"
            : added
              ? "bg-emerald-400 text-slate-950"
              : "bg-cyan-400 text-slate-950 hover:bg-cyan-300 hover:shadow-[0_0_20px_2px_rgba(34,211,238,0.3)]"
            }`}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" /> {lang === "uz" ? "Tanlanmoqda..." : lang === "ru" ? "Выбирается..." : "Selecting..."}
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              {stock === "Out of Stock"
                ? (lang === "uz" ? "Sotuvda yo'q" : lang === "ru" ? "Нет в наличии" : "Unavailable")
                : (lang === "uz" ? "Savatchaga qo'shish" : lang === "ru" ? "В корзину" : "Add to cart")}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

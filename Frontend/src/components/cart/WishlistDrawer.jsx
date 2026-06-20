import React from "react";
import { X, Heart, ShoppingCart } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

export default function WishlistDrawer({ isOpen, onClose }) {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-950 border-l border-slate-800 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
            <h2 className="text-xl font-bold text-slate-50">Sevimlilar</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-50 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
              <Heart className="h-16 w-16 opacity-20" />
              <p>Hozircha sevimlilar ro'yxati bo'sh</p>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-slate-900 p-3 rounded-xl border border-slate-800 relative group transition-colors hover:border-rose-500/30"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-lg object-cover bg-slate-800"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200 line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {item.brand} • {item.model}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-mono font-bold text-cyan-400">
                        ${item.price?.toLocaleString()}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            addItem({
                              id: item.id,
                              name: item.name,
                              brand: item.brand,
                              price: item.price,
                            })
                          }
                          className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-md hover:bg-cyan-500 hover:text-slate-950 transition-colors"
                          title="Savatchaga qo'shish"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="p-1.5 bg-rose-500/10 text-rose-500 rounded-md hover:bg-rose-500 hover:text-slate-50 transition-colors"
                          title="Sevimlilardan olib tashlash"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

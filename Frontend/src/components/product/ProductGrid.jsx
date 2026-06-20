import React, { useEffect, useState } from "react";
import { PackageSearch, X } from "lucide-react";
import ProductCard from "./ProductCard";
import BrandFilter from "./BrandFilter";
import Spinner from "../common/Spinner";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";
import { PRODUCTS } from "../../data/products";

const getDynamicParts = (product) => {
  if (!product) return [];
  const basePrice = Number(product.price) || 0;
  const brand = (product.brand || "").toLowerCase();

  // 1. UMUMIY (Boshqa barcha moshinalar uchun) rasmlar:
  let batteryImg = "https://upload.wikimedia.org/wikipedia/commons/8/82/Tesla_Model_S_battery_pack_under_development_%2814323145461%29.jpg";
  let headlightImg = "https://upload.wikimedia.org/wikipedia/commons/4/47/2018_Toyota_Camry_headlight.jpg";
  let doorImg = "https://upload.wikimedia.org/wikipedia/commons/3/3b/Car_door_inside.JPG";

  // 2. TESLA uchun maxsus rasmlar:
  if (brand.includes("tesla")) {
    headlightImg = "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800";
    doorImg = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800";
  }
  // 3. BYD uchun maxsus rasmlar:
  else if (brand.includes("byd")) {
    batteryImg = "https://images.unsplash.com/photo-1620050853535-c081e7d206f4?auto=format&fit=crop&q=80&w=800";
    headlightImg = "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800";
  }

  return [
    { name: "Standart Qism", image: product.image, price: basePrice },
    { name: "Batareya", image: batteryImg, price: Math.round(basePrice * 4.5) }, // Batareya narxi (4.5 barobar)
    { name: "Old Fara", image: headlightImg, price: Math.round(basePrice * 0.85) }, // Fara narxi
    { name: "Yon Eshik", image: doorImg, price: Math.round(basePrice * 1.2) } // Eshik narxi
  ];
};

export default function ProductGrid({ searchTerm = "" }) {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brand, setBrand] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPartIndex, setSelectedPartIndex] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const loadData = () => {
      // Eng oxirgi saqlangan mahsulotlarni localdan o'qish (eng ishonchli usul)
      const savedProducts = localStorage.getItem("volt_products");
      const dataToUse = savedProducts ? JSON.parse(savedProducts) : PRODUCTS;

      setProducts(dataToUse);
      setMaxPrice(Math.max(...dataToUse.map((p) => Number(p.price) || 0), 100));
      setLoading(false);
    };

    loadData();

    // Admin paneldan yangi qo'shilganda darhol yangilanishi uchun (jonli aloqa)
    const handleStorage = () => {
      const savedProducts = localStorage.getItem("volt_products");
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        setProducts(parsed);
        setMaxPrice(Math.max(...parsed.map((p) => Number(p.price) || 0), 100));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const visible = products.filter((p) => {
    const matchBrand =
      brand === "All" || String(p.brand || "").trim().toLowerCase() === String(brand).trim().toLowerCase();
    const matchSearch =
      String(p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.brand || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.model || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchBrand && matchSearch;
  });
  const finalVisible = visible.filter((p) => Number(p.price || 0) <= Number(maxPrice));

  const activeParts = selectedProduct ? getDynamicParts(selectedProduct) : [];
  const currentPart = activeParts[selectedPartIndex] || activeParts[0];

  const actualQuality = selectedProduct ? (selectedProduct.quality || (selectedProduct.isOriginal ? "Original" : "Aftermarket")) : "Original";

  return (
    <section id="catalog" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* CHAP SIDEBAR (Filtrlar) */}
        <aside className="w-full lg:w-72 shrink-0 space-y-6">
          <div className="mb-6">
            <h2 className="font-display text-3xl font-bold text-slate-50 mb-2">Katalog</h2>
            <p className="text-sm text-slate-400 font-medium">
              {loading
                ? "Yuklanmoqda…"
                : `Jami ${finalVisible.length} ta ehtiyot qism`}
            </p>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 shadow-xl backdrop-blur-sm sticky top-24">
            {/* Brand filtri */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                <PackageSearch className="w-4 h-4 text-cyan-400" /> Brendlar
              </h3>
              <BrandFilter value={brand} onChange={setBrand} />
            </div>
          </div>
        </aside>

        {/* ASOSIY OYNA (Mahsulotlar) */}
        <div className="flex-1">
          {loading ? (
            <div className="py-20 flex justify-center">
              <Spinner label="Katalog yuklanmoqda..." />
            </div>
          ) : finalVisible.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-800 py-32 text-center bg-slate-900/20">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-800/50 mb-2">
                <PackageSearch className="h-10 w-10 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-300">
                Hech qanday mahsulot topilmadi
              </h3>
              <p className="text-slate-500 max-w-sm">
                {brand !== "All" ? `"${brand}" brendiga tegishli` : ""} {formatPrice(maxPrice)} dan arzonroq ehtiyot qismlar yo'q. Qidiruv parametrlarini o'zgartirib ko'ring.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {finalVisible.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onCardClick={() => {
                    setSelectedProduct(product);
                    setSelectedPartIndex(0);
                  }}
                  onAddToCart={() => {
                    const parts = getDynamicParts(product);
                    addItem({
                      id: `${product.id}-0`,
                      name: product.name,
                      brand: product.brand,
                      price: parts[0].price,
                      image: parts[0].image || product.image,
                    });
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Kengaytirilgan Mahsulot Modali (Siz bergan dizayn asosida) */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl animate-in fade-in zoom-in-95 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Rasm qismi (Kichik rasmlar va Asosiy rasm) */}
              <div className="flex flex-col-reverse md:flex-row gap-4">
                <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible no-scrollbar">
                  {activeParts.map((part, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedPartIndex(idx)}
                      className={`w-20 h-20 md:w-24 md:h-24 bg-slate-800 rounded-2xl overflow-hidden shrink-0 border-2 ${selectedPartIndex === idx ? "border-cyan-400" : "border-transparent"} hover:border-cyan-400 cursor-pointer transition-colors`}
                    >
                      <img
                        src={part.image}
                        alt={part.name}
                        className="w-full h-full object-cover transition-all duration-300"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex-1 bg-slate-800 rounded-3xl h-[300px] md:h-[450px] border border-slate-700 overflow-hidden">
                  <img
                    src={currentPart.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover hover:scale-105 transition-all duration-500"
                  />
                </div>
              </div>

              {/* Mahsulot ma'lumotlari */}
              <div className="flex flex-col justify-center">
                <nav className="text-sm text-slate-500 mb-4 font-medium uppercase tracking-wider flex items-center gap-2">
                  <span>{selectedProduct.brand}</span>
                  <span>&gt;</span>
                  <span className="text-cyan-400">{selectedProduct.model}</span>
                </nav>

                <h1 className="text-3xl md:text-4xl font-bold text-slate-50 mb-3">
                  {selectedProduct.name}
                </h1>

                <div className="flex items-center gap-2 mb-6">
                  <span className="text-yellow-400 text-lg tracking-widest">★★★★☆</span>
                  <span className="text-sm text-slate-400 font-medium">
                    4.5/5 (128 sharh) <span className="mx-2 opacity-30">|</span>
                    <span className="text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-md">{selectedProduct.salesCount || 0} ta sotilgan</span>
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl font-bold text-cyan-400">
                    {formatPrice(currentPart.price)}
                  </span>
                  <span className="text-xl text-slate-500 line-through">
                    {formatPrice(currentPart.price * 1.4)}
                  </span>
                  <span className="bg-rose-500/10 text-rose-500 px-2.5 py-1 rounded-md text-sm font-bold border border-rose-500/20">
                    -40%
                  </span>
                </div>

                <p className="text-slate-400 mb-8 border-b border-slate-800 pb-8 leading-relaxed">
                  {selectedProduct.brand} {selectedProduct.model} avtomobili uchun maxsus ishlangan
                  premium <b>{selectedProduct.name.toLowerCase()}</b>. Ushbu ehtiyot qism zamonaviy
                  dizayn va yuqori sifatni o'zida mujassam etgan bo'lib, avtomobilingizning uzoq
                  muddatli hamda mukammal ishlashini ta'minlaydi.
                </p>

                {/* Ehtiyot qismini tanlash qismi */}
                <div className="mb-6">
                  <h3 className="mb-3 text-slate-400 text-sm font-medium uppercase tracking-wider">
                    Ehtiyot qismini tanlang
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {activeParts.map((part, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPartIndex(idx)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${selectedPartIndex === idx ? "border-cyan-400 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]" : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200"}`}
                      >
                        {part.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="mb-3 text-slate-400 text-sm font-medium uppercase tracking-wider">
                    Xususiyatlar
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {actualQuality === "Original" && (
                      <span className="px-4 py-2 rounded-xl bg-slate-800 border border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.1)] text-sm font-medium flex items-center gap-1">
                        ✓ Original (OEM)
                      </span>
                    )}
                    {actualQuality === "Aftermarket" && (
                      <span className="px-4 py-2 rounded-xl bg-slate-800 border border-purple-500/50 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.1)] text-sm font-medium flex items-center gap-1">
                        🛠 Aftermarket (Yaxshi nusxa)
                      </span>
                    )}
                    {actualQuality === "Padelka" && (
                      <span className="px-4 py-2 rounded-xl bg-slate-800 border border-rose-500/50 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.1)] text-sm font-medium flex items-center gap-1">
                        ⚠️ Padelka (Arzon nusxa)
                      </span>
                    )}
                    <span className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium">
                      1 Yil Kafolat
                    </span>
                    <span className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium">
                      Oson o'rnatish
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addItem({
                      id: `${selectedProduct.id}-${selectedPartIndex}`,
                      name: currentPart.name === "Standart Qism" ? selectedProduct.name : `${selectedProduct.name} - ${currentPart.name}`,
                      brand: selectedProduct.brand,
                      price: currentPart.price,
                      image: currentPart.image,
                    });
                    setSelectedProduct(null);
                  }}
                  className="w-full bg-cyan-500 text-slate-950 py-4 mt-auto rounded-2xl font-bold text-lg hover:bg-cyan-400 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  Savatchaga qo'shish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import WishlistDrawer from "../components/cart/WishlistDrawer";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { useCurrency } from "../context/CurrencyContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { PRODUCTS } from "../data/products";

export default function CartPage() {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const { items, updateQty, removeItem, clearCart, totalPrice, totalItems } = useCart();
    const { formatPrice } = useCurrency();
    const { lang, switchLanguage } = useLanguage();
    const { wishlist } = useWishlist();

    const [wishlistOpen, setWishlistOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const [showCheckout, setShowCheckout] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [cardNumber, setCardNumber] = useState("");
    const [paymentError, setPaymentError] = useState("");
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [promoMessage, setPromoMessage] = useState({ type: "", text: "" });

    const handleApplyPromo = () => {
        if (!promoCode.trim()) return;
        if (promoCode === "VOLT20") {
            const discountAmount = totalPrice * 0.2;
            setDiscount(discountAmount);
            setPromoMessage({ type: "success", text: `🎉 20% chegirma qo'llanildi!` });
        } else if (promoCode === "VOLT50") {
            const discountAmount = 50;
            setDiscount(discountAmount > totalPrice ? totalPrice : discountAmount);
            setPromoMessage({ type: "success", text: `🎉 ${formatPrice(50)} chegirma qo'llanildi!` });
        } else {
            setDiscount(0);
            setPromoMessage({ type: "error", text: "❌ Noto'g'ri promokod!" });
        }
    };

    const handleOrderPlaced = (purchasedItems) => {
        const finalTotal = Math.max(0, totalPrice - discount);

        const formattedItems = purchasedItems.map(item => ({
            ...item,
            quantity: item.qty // Admin va Profile sahifalari o'qiy olishi uchun 'qty' ni 'quantity' ga o'tkazish
        }));

        const newOrder = {
            id: Date.now().toString(),
            items: formattedItems,
            total: finalTotal,
            discount: discount,
            shipping: 0,
            date: new Date().toISOString(),
            status: "new",
        };

        // Mahsulotlarning "sotilganlar soni"ni (Sales Count) avtomatik oshirish
        try {
            const savedStr = localStorage.getItem("volt_products");
            let savedProducts = PRODUCTS; // Xotira bo'sh bo'lsa default o'qiydi
            if (savedStr && savedStr !== "null" && savedStr !== "[]") {
                try {
                    savedProducts = JSON.parse(savedStr);
                } catch (e) {
                    console.error("Xotirani o'qishda xatolik:", e);
                }
            }
            let isProductsChanged = false;

            const updatedProducts = savedProducts.map((p) => {
                const matchingItems = formattedItems.filter((cartItem) => {
                    const cId = String(cartItem.id);
                    const pId = String(p.id);
                    // ID to'ppa-to'g'ri bo'lishi yoki "p1-0" kabi qo'shimchali bo'lishi mumkin
                    return cId === pId || cId.startsWith(pId + "-");
                });

                if (matchingItems.length > 0) {
                    isProductsChanged = true;
                    const addedQty = matchingItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
                    const newSalesCount = (Number(p.salesCount) || 0) + addedQty;

                    fetch(`http://localhost:5000/api/products/${p.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...p, salesCount: newSalesCount }),
                    }).catch(() => { });

                    return { ...p, salesCount: newSalesCount };
                }
                return p;
            });

            if (isProductsChanged) {
                localStorage.setItem("volt_products", JSON.stringify(updatedProducts));
                window.dispatchEvent(new Event("storage"));
            }
        } catch (err) {
            console.error(err);
        }

        const BOT_TOKEN = "8984745030:AAHjdWf2ALdv2G6OV-DC6UpMCVmX9dnUVUQ";
        const CHAT_ID = "8167467055";

        let text = `📦 <b>Yangi buyurtma!</b>\n\n`;
        text += `🆔 Buyurtma raqami: <b>#${newOrder.id}</b>\n`;
        text += `💰 Jami summa: <b>${formatPrice(newOrder.total)}</b>\n`;
        text += `💳 To'lov turi: <b>${paymentMethod === "paynet" ? "Paynet" : "Karta"}</b>\n\n`;
        text += `🛒 <b>Mahsulotlar:</b>\n`;
        formattedItems.forEach((item, index) => {
            text += `${index + 1}. ${item.name} (x${item.quantity || 1}) - ${formatPrice(item.price)}\n`;
        });

        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: "HTML" }),
        }).catch(err => console.error(err));

        const savedOrders = JSON.parse(localStorage.getItem("volt_orders") || "[]");
        localStorage.setItem("volt_orders", JSON.stringify([newOrder, ...savedOrders]));

        fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newOrder),
        }).catch(err => console.error(err));
    };

    const handleProcessPayment = (e) => {
        e.preventDefault();

        if (paymentMethod === "card") {
            const rawCardNumber = cardNumber.replace(/\s/g, "");
            if (rawCardNumber.length !== 16) {
                setPaymentError("Iltimos, yaroqli 16 xonali karta raqamini kiriting!");
                return;
            }
        }

        setIsProcessingPayment(true);
        const currentCartItems = [...items]; // Savatdagi mahsulotlarni o'chib ketmasligi uchun saqlab qolamiz

        if (paymentMethod === "paynet") {
            handleOrderPlaced(currentCartItems);
            clearCart();
            setTimeout(() => {
                window.location.href = "https://paynet.uz";
            }, 1500);
            return;
        }

        setTimeout(() => {
            setIsProcessingPayment(false);
            setPaymentSuccess(true);
            handleOrderPlaced(currentCartItems);
            clearCart();
        }, 2000);
    };

    return (
        <div className={`min-h-screen flex flex-col font-body ${theme === "light" ? "bg-slate-50 text-slate-900" : "bg-slate-950 text-slate-50"}`}>
            <Navbar
                cartCount={totalItems}
                onCartClick={() => { }}
                wishlistCount={wishlist?.length || 0}
                onWishlistClick={() => setWishlistOpen(true)}
                searchValue={searchInput}
                onSearchChange={setSearchInput}
                lang={lang}
                switchLanguage={switchLanguage}
                theme={theme}
                onThemeToggle={toggleTheme}
            />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Link to="/home" className="inline-flex items-center gap-2 text-cyan-500 hover:text-cyan-400 font-medium mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" /> {lang === "uz" ? "Katalogga qaytish" : lang === "ru" ? "Вернуться в каталог" : "Back to Catalog"}
                </Link>

                <h1 className="text-3xl font-bold mb-8">{lang === "uz" ? "Savatcha" : lang === "ru" ? "Корзина" : "Cart"}</h1>

                {items.length === 0 && !paymentSuccess ? (
                    <div className={`flex flex-col items-center justify-center py-20 text-center border rounded-3xl border-dashed ${theme === "light" ? "bg-slate-100 border-slate-300" : "bg-slate-900/20 border-slate-800"}`}>
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${theme === "light" ? "bg-white shadow-sm" : "bg-slate-800/50"}`}>
                            <ShoppingBag className="w-10 h-10 text-slate-500" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">{lang === "uz" ? "Savatchangiz bo'sh" : lang === "ru" ? "Ваша корзина пуста" : "Your cart is empty"}</h2>
                        <p className="text-slate-500 mb-8 max-w-md">{lang === "uz" ? "Katalogdan o'zingizga kerakli ehtiyot qismlarni tanlang va savatchaga qo'shing." : "Choose the spare parts you need from the catalog and add them to the cart."}</p>
                        <Link to="/home" className="bg-cyan-500 text-slate-950 px-8 py-3.5 rounded-xl font-bold hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20">
                            {lang === "uz" ? "Xaridni boshlash" : "Start Shopping"}
                        </Link>
                    </div>
                ) : paymentSuccess ? (
                    <div className={`flex flex-col items-center justify-center py-20 text-center border rounded-3xl ${theme === "light" ? "bg-white border-slate-200" : "bg-slate-900/20 border-slate-800"}`}>
                        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold mb-4">{lang === "uz" ? "To'lov muvaffaqiyatli!" : "Payment Successful!"}</h2>
                        <p className="text-slate-500 mb-8 max-w-md text-lg">{lang === "uz" ? "Buyurtmangiz qabul qilindi. Admin tez orada siz bilan bog'lanadi." : "Your order has been received. Admin will contact you soon."}</p>
                        <Link to="/profile" state={{ activeTab: "orders" }} className="bg-cyan-500 text-slate-950 px-8 py-3.5 rounded-xl font-bold hover:bg-cyan-400 transition-colors">
                            {lang === "uz" ? "Buyurtmalarimni ko'rish" : "View my orders"}
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-8 space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border ${theme === "light" ? "bg-white border-slate-200" : "bg-slate-900 border-slate-800"}`}>
                                    <img src={item.image} alt={item.name} className={`w-24 h-24 rounded-xl object-cover border shrink-0 ${theme === "light" ? "bg-slate-100 border-slate-200" : "bg-slate-800 border-slate-700/50"}`} />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                                        <p className="text-sm text-slate-500 mb-3">{item.brand}</p>
                                        <div className="flex items-center gap-4">
                                            <div className={`flex items-center gap-3 rounded-lg px-3 py-1.5 border ${theme === "light" ? "bg-slate-50 border-slate-300" : "bg-slate-950 border-slate-800"}`}>
                                                <button onClick={() => updateQty(item.id, item.qty - 1)} className="text-slate-500 hover:text-cyan-500 disabled:opacity-50 transition-colors">
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="font-bold text-sm w-5 text-center">{item.qty}</span>
                                                <button onClick={() => updateQty(item.id, item.qty + 1)} className="text-slate-500 hover:text-cyan-500 transition-colors">
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <button onClick={() => removeItem(item.id)} className="text-rose-500 hover:bg-rose-500/10 p-2 rounded-lg transition-colors">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="sm:text-right mt-2 sm:mt-0">
                                        <p className="font-mono text-xl font-bold text-cyan-500">{formatPrice(item.price * item.qty)}</p>
                                        {item.qty > 1 && <p className="text-xs text-slate-500 font-mono mt-1">{formatPrice(item.price)} / dona</p>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-4">
                            <div className={`sticky top-24 rounded-3xl border p-6 shadow-xl ${theme === "light" ? "bg-white border-slate-200" : "bg-slate-900 border-slate-800"}`}>
                                <h3 className="text-xl font-bold mb-6">{lang === "uz" ? "Buyurtma xulosasi" : "Order Summary"}</h3>

                                <div className="space-y-4 mb-6 text-sm font-medium">
                                    <div className="flex justify-between text-slate-500">
                                        <span>{lang === "uz" ? "Mahsulotlar" : "Products"} ({totalItems} ta)</span>
                                        <span className="font-mono">{formatPrice(totalPrice)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-emerald-500">
                                            <span>{lang === "uz" ? "Chegirma" : "Discount"}</span>
                                            <span className="font-mono">-{formatPrice(discount)}</span>
                                        </div>
                                    )}
                                    <div className={`flex justify-between items-center pt-4 border-t ${theme === "light" ? "border-slate-200" : "border-slate-800"}`}>
                                        <span className="font-bold text-base">{lang === "uz" ? "Jami" : "Total"}:</span>
                                        <span className="text-2xl font-bold font-mono text-cyan-500">
                                            {formatPrice(Math.max(0, totalPrice - discount))}
                                        </span>
                                    </div>
                                </div>

                                {!showCheckout ? (
                                    <button
                                        onClick={() => setShowCheckout(true)}
                                        className="w-full bg-cyan-500 text-slate-950 py-4 rounded-xl font-bold text-lg hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] active:scale-95"
                                    >
                                        {lang === "uz" ? "To'lovga o'tish" : "Proceed to Checkout"}
                                    </button>
                                ) : (
                                    <form onSubmit={handleProcessPayment} className={`animate-in fade-in slide-in-from-top-4 space-y-5 border-t pt-6 mt-2 ${theme === "light" ? "border-slate-200" : "border-slate-800"}`}>
                                        <div className={`flex gap-2 p-1 rounded-lg border ${theme === "light" ? "bg-slate-100 border-slate-200" : "bg-slate-950 border-slate-800"}`}>
                                            <button type="button" onClick={() => setPaymentMethod("card")} className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${paymentMethod === "card" ? (theme === "light" ? "bg-white text-cyan-600 shadow-sm" : "bg-slate-800 text-cyan-400 shadow-sm") : "text-slate-500 hover:text-slate-400"}`}>Karta</button>
                                            <button type="button" onClick={() => setPaymentMethod("paynet")} className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${paymentMethod === "paynet" ? (theme === "light" ? "bg-white text-emerald-600 shadow-sm" : "bg-slate-800 text-emerald-400 shadow-sm") : "text-slate-500 hover:text-slate-400"}`}>Paynet</button>
                                        </div>

                                        {paymentMethod === "card" && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-500 mb-1">Karta raqami</label>
                                                    <input type="text" required value={cardNumber} onChange={(e) => {
                                                        const formatted = e.target.value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ").slice(0, 19);
                                                        setCardNumber(formatted);
                                                        setPaymentError("");
                                                    }} placeholder="0000 0000 0000 0000" className={`w-full rounded-lg border ${paymentError ? "border-rose-500" : (theme === "light" ? "border-slate-300 bg-white" : "border-slate-700 bg-slate-950")} py-2.5 px-3 text-sm focus:border-cyan-500 outline-none`} />
                                                    {paymentError && <p className="mt-1 text-xs text-rose-500">{paymentError}</p>}
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-medium text-slate-500 mb-1">Muddati</label>
                                                        <input type="text" required maxLength="5" onChange={(e) => {
                                                            let val = e.target.value.replace(/\D/g, "");
                                                            if (val.length > 2) val = val.substring(0, 2) + "/" + val.substring(2, 4);
                                                            e.target.value = val;
                                                        }} placeholder="MM/YY" className={`w-full rounded-lg border py-2.5 px-3 text-sm focus:border-cyan-500 outline-none ${theme === "light" ? "border-slate-300 bg-white" : "border-slate-700 bg-slate-950"}`} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-slate-500 mb-1">CVV</label>
                                                        <input type="password" required maxLength="3" onChange={(e) => e.target.value = e.target.value.replace(/\D/g, "")} placeholder="123" className={`w-full rounded-lg border py-2.5 px-3 text-sm focus:border-cyan-500 outline-none ${theme === "light" ? "border-slate-300 bg-white" : "border-slate-700 bg-slate-950"}`} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 mb-1.5">Promokod (ixtiyoriy)</label>
                                            <div className="flex gap-2">
                                                <input type="text" value={promoCode} onChange={(e) => {
                                                    setPromoCode(e.target.value.toUpperCase());
                                                    setPromoMessage({ type: "", text: "" });
                                                }} placeholder="VOLT20" className={`flex-1 rounded-lg border py-2 px-3 text-sm outline-none uppercase ${theme === "light" ? "border-slate-300 bg-white" : "border-slate-700 bg-slate-950"}`} />
                                                <button type="button" onClick={handleApplyPromo} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors border ${theme === "light" ? "bg-slate-100 border-slate-300 text-cyan-600 hover:bg-slate-200" : "bg-slate-800 border-slate-700 text-cyan-400 hover:bg-slate-700"}`}>Qo'llash</button>
                                            </div>
                                            {promoMessage.text && <p className={`mt-1.5 text-xs font-medium ${promoMessage.type === "success" ? "text-emerald-500" : "text-rose-500"}`}>{promoMessage.text}</p>}
                                        </div>

                                        <button type="submit" disabled={isProcessingPayment} className="w-full rounded-xl bg-cyan-500 py-3.5 text-slate-950 font-bold hover:bg-cyan-400 transition-all flex justify-center items-center gap-2 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                            {isProcessingPayment ? "Kutilmoqda..." : `To'lash (${formatPrice(Math.max(0, totalPrice - discount))})`}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />

            <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
        </div>
    );
}
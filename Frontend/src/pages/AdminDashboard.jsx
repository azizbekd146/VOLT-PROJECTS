import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Settings,
  Wallet,
  Sparkles,
  Bot,
  Send,
  Layers,
  AlertTriangle,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { PRODUCTS } from "../data/products";
import { useLanguage } from "../context/LanguageContext";
import { useCurrency } from "../context/CurrencyContext";
import { geminiClient } from "../api/geminiApi";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { lang, switchLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("volt_products");
    return savedProducts ? JSON.parse(savedProducts) : PRODUCTS;
  });
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [aiReport, setAiReport] = useState(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [brands, setBrands] = useState(() => {
    const saved = localStorage.getItem("volt_brands");
    return saved ? JSON.parse(saved) : ["BYD", "Leapmotor", "Deepal", "Other EV"];
  });
  const [newBrand, setNewBrand] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    price: "",
    image: "",
    partNumber: `PN-${Math.floor(100000 + Math.random() * 900000)}`,
    stock: "In Stock",
    quality: "Original"
  });
  const { formatPrice } = useCurrency();

  useEffect(() => {
    document.documentElement.classList.add("is-admin");

    const handleStorageChange = () => {
      const savedStr = localStorage.getItem("volt_products");
      if (savedStr) {
        setProducts(JSON.parse(savedStr));
      }
    };
    window.addEventListener("storage", handleStorageChange);

    let isBackendOffline = false;

    const fetchOrders = () => {
      const localOrders = JSON.parse(localStorage.getItem("volt_orders") || "[]");
      fetch("http://localhost:5000/api/orders")
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          // Backend va LocalStorage ma'lumotlarini birlashtirish (yo'qolib qolmasligi uchun)
          const allOrders = [...data, ...localOrders];
          const uniqueOrders = Array.from(new Map(allOrders.map((item) => [item.id, item])).values());
          uniqueOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
          setOrders(uniqueOrders);
          localStorage.setItem("volt_orders", JSON.stringify(uniqueOrders));
        })
        .catch((err) => {
          setOrders(localOrders);
        });
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
      document.documentElement.classList.remove("is-admin");
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("volt_products", JSON.stringify(products));
  }, [products]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleDeleteProduct = (id) => {
    setDeleteModalId(id);
  };

  const confirmDelete = () => {
    setProducts((prev) => prev.filter((p) => String(p.id) !== String(deleteModalId)));
    fetch(`http://localhost:5000/api/products/${deleteModalId}`, { method: "DELETE" });
    setDeleteModalId(null);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    localStorage.setItem("volt_orders", JSON.stringify(updatedOrders));

    fetch(`http://localhost:5000/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(() => {
        setOrders(updatedOrders);
      })
      .catch(() => {
        setOrders(updatedOrders);
      });

    // Qabul qilinganda Telegramga xabar yuborish
    if (newStatus === "ready") {
      const BOT_TOKEN = "8984745030:AAHjdWf2ALdv2G6OV-DC6UpMCVmX9dnUVUQ";
      const CHAT_ID = "8167467055";
      const text = `✅ <b>Buyurtma qabul qilindi!</b>\n\n🆔 Buyurtma raqami: <b>#${orderId}</b>\n\nAdmin xabaringizni oldi, tayyorgarlik ketyapti 📦`;

      fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: "HTML" }),
      })
        .then((res) => res.json())
        .catch((err) => console.error("Telegram bot ulanish xatosi:", err));
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name || "",
      brand: product.brand || "",
      model: product.model || "",
      price: product.price || "",
      image: product.image || "",
      partNumber: product.partNumber || "",
      stock: product.stock || "In Stock",
      quality: product.quality || (product.isOriginal ? "Original" : "Aftermarket")
    });
    setShowModal(true);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert(t("productNameAndPriceRequired"));
      return;
    }

    if (editingProductId) {
      // Tahrirlash (Edit)
      const updatedProduct = {
        ...formData,
        price: parseInt(formData.price)
      };

      setProducts((prev) =>
        prev.map((p) =>
          String(p.id) === String(editingProductId) ? { ...p, ...updatedProduct, id: p.id } : p
        )
      );

      fetch(`http://localhost:5000/api/products/${editingProductId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });
    } else {
      // Yangi qo'shish (Add)
      const newProduct = {
        id: Date.now(),
        ...formData,
        price: parseInt(formData.price),
        salesCount: 0
      };

      setProducts((prev) => [...prev, newProduct]);

      fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
    }

    setFormData({
      name: "",
      brand: "",
      model: "",
      price: "",
      image: "",
      partNumber: `PN-${Math.floor(100000 + Math.random() * 900000)}`,
      stock: "In Stock",
      quality: "Original"
    });
    setEditingProductId(null);
    setShowModal(false);
  };

  // Tizimdagi jami tushumni hisoblash
  const totalBalance = orders.reduce((acc, order) => {
    let orderTotal = Number(order.total) || 0;
    if (order.items && Array.isArray(order.items)) {
      orderTotal = order.items.reduce(
        (sum, item) => sum + Number(item.price) * (Number(item.quantity) || 1),
        Number(order.shipping) || 0
      );
    }
    return acc + orderTotal;
  }, 0);

  const handleGenerateAIReport = () => {
    setIsAILoading(true);
    setAiReport(null);

    // AI o'ylash jarayonini simulyatsiya qilish (2.5 soniya)
    setTimeout(() => {
      const lowStock = products.filter(
        (p) => p.stock === "Low Stock" || p.stock === "Out of Stock"
      );
      const topProducts = orders
        .flatMap((o) => o.items)
        .reduce((acc, item) => {
          if (!item) return acc;
          acc[item.name] = (acc[item.name] || 0) + (item.quantity || 1);
          return acc;
        }, {});
      const bestSeller =
        Object.keys(topProducts).sort((a, b) => topProducts[b] - topProducts[a])[0] ||
        (lang === "uz" ? "Hozircha yo'q" : lang === "ru" ? "Пока нет" : "None yet");

      let report = "";
      if (lang === "uz") {
        report = `📈 **Biznes Tahlili:**\nSizning do'koningizda jami ${formatPrice(totalBalance)} daromad va ${orders.length} ta xarid amalga oshirilgan. Eng xaridorgir mahsulotingiz: "${bestSeller}".\n\n`;
        report +=
          lowStock.length > 0
            ? `⚠️ **Kam qolgan zaxiralar:**\nHozirda ${lowStock.length} ta mahsulot omborda tugamoqda. Mijozlar ularni so'rab kelganda yo'qotib qo'ymaslik uchun zaxirani darhol yangilang.\n\n`
            : `✅ **Zaxiralar holati:**\nBarcha mahsulotlar yetarli darajada omborda mavjud.\n\n`;
        report += `💡 **Sun'iy Intellekt Maslahati:**\nElektromobillar bozori tez o'smoqda. Daromadni kamida 20% ga oshirish uchun "Aksessuarlar" kabi yangi toifalar qo'shishni va xarid qilgan mijozlarga Telegram orqali promokodlar yuborishni tavsiya qilaman!`;
      } else if (lang === "ru") {
        report = `📈 **Бизнес-Анализ:**\nВаш магазин заработал ${formatPrice(totalBalance)} с ${orders.length} покупками. Самый продаваемый товар: "${bestSeller}".\n\n`;
        report +=
          lowStock.length > 0
            ? `⚠️ **Заканчивающиеся запасы:**\nВ настоящее время ${lowStock.length} товаров заканчиваются на складе. Обновите запасы, чтобы не потерять продажи.\n\n`
            : `✅ **Состояние запасов:**\nВсе товары в достаточном количестве на складе.\n\n`;
        report += `💡 **Совет ИИ:**\nРынок электромобилей быстро растет. Рекомендую добавить новые категории, такие как "Аксессуары", и отправлять промокоды клиентам через Telegram для увеличения продаж!`;
      } else {
        report = `📈 **Business Analysis:**\nYour store has generated ${formatPrice(totalBalance)} in revenue across ${orders.length} orders. Your best seller is: "${bestSeller}".\n\n`;
        report +=
          lowStock.length > 0
            ? `⚠️ **Low Stock Alert:**\nCurrently, ${lowStock.length} products are running low. Restock them soon to avoid losing sales.\n\n`
            : `✅ **Stock Status:**\nAll products are sufficiently stocked in the inventory.\n\n`;
        report += `💡 **AI Recommendation:**\nThe EV market is booming. I recommend adding new categories like "Accessories" and sending promo codes to existing customers via Telegram to boost sales!`;
      }

      // Markdown qalin yozuvlarini HTML ga o'tkazish
      setAiReport(report.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"));
      setIsAILoading(false);
    }, 2500);
  };

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    const userQuestion = aiPrompt;
    setAiPrompt("");
    setIsAIResponding(true);

    const currentReport = aiReport || "";
    const separator = currentReport ? "<br/><br/><hr class='border-slate-800'/><br/>" : "";
    const updatedReportWithUser =
      currentReport +
      separator +
      `<div class='bg-slate-800/50 p-4 rounded-lg inline-block border border-slate-700'><strong>Siz:</strong> ${userQuestion}</div>`;
    setAiReport(updatedReportWithUser);

    try {
      const promptContext = `Sen avtoehtiyot qismlari do'konining aqlli yordamchisisan. Hozirgi statistika: Jami daromad ${totalBalance} USD, Jami buyurtmalar ${orders.length} ta, Mahsulotlar soni ${products.length} ta. Mijoz savoli: "${userQuestion}". Javobni ${lang} tilida, qisqa va aniq qilib, HTML formatida (<b>, <i>, <br> kabi taglar bilan) ber. Markdown yulduzchalarini (**) ishlatma.`;

      const aiAnswer = await geminiClient.generateText(promptContext);
      const formattedAnswer = aiAnswer
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br/>");

      setAiReport(
        updatedReportWithUser +
        `<br/><br/><div class='text-purple-300'>💡 <strong>AI:</strong> ${formattedAnswer}</div>`
      );
    } catch (error) {
      console.error("Gemini API xatosi:", error);
      setAiReport(
        updatedReportWithUser +
        `<br/><br/><div class='text-rose-400'>💡 <strong>Xatolik:</strong> ${error.message}</div>`
      );
    } finally {
      setIsAIResponding(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 font-body text-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col">
        <div className="mb-10 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 ring-1 ring-cyan-400/40">
            <Settings className="h-4 w-4 text-cyan-400" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-slate-50">
            VOLT<span className="text-cyan-400">{t("adminTitle").replace("VOLT", "")}</span>
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${activeTab === "products"
              ? "bg-cyan-500/10 text-cyan-400"
              : "text-slate-400 hover:bg-slate-800 hover:text-slate-50"
              }`}
          >
            <Package className="h-5 w-5" /> {t("adminProducts")}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${activeTab === "orders"
              ? "bg-cyan-500/10 text-cyan-400"
              : "text-slate-400 hover:bg-slate-800 hover:text-slate-50"
              }`}
          >
            <ShoppingCart className="h-5 w-5" /> {t("adminOrders")}
          </button>
          <button
            onClick={() => setActiveTab("brands")}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${activeTab === "brands"
              ? "bg-cyan-500/10 text-cyan-400"
              : "text-slate-400 hover:bg-slate-800 hover:text-slate-50"
              }`}
          >
            <Layers className="h-5 w-5" /> {lang === "uz" ? "Katalog Brendlari" : lang === "ru" ? "Бренды каталога" : "Catalog Brands"}
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${activeTab === "ai"
              ? "bg-purple-500/10 text-purple-400"
              : "text-slate-400 hover:bg-slate-800 hover:text-slate-50"
              }`}
          >
            <Sparkles className="h-5 w-5" /> {t("adminAIAssistant")}
          </button>
          <button
            onClick={() => setActiveTab("account")}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${activeTab === "account"
              ? "bg-cyan-500/10 text-cyan-400"
              : "text-slate-400 hover:bg-slate-800 hover:text-slate-50"
              }`}
          >
            <Wallet className="h-5 w-5" /> {t("adminAccount")}
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
        >
          <LogOut className="h-5 w-5" /> {t("adminLogout")}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Tilni o'zgartirish tugmalari Dashboardda ham */}
        <div className="flex justify-end gap-2 mb-8">
          {["uz", "en", "ru"].map((l) => (
            <button
              key={l}
              onClick={() => switchLanguage(l)}
              className={`px-2 py-1 rounded-lg text-lg transition-all border ${lang === l
                ? "bg-cyan-500 border-cyan-500"
                : "bg-slate-900 border-slate-800 hover:border-slate-700"
                }`}
            >
              {l === "uz" ? "🇺🇿" : l === "en" ? "🇺🇸" : "🇷🇺"}
            </button>
          ))}
        </div>

        {activeTab === "products" && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-50">{t("adminProductTitle")}</h1>
                <p className="text-slate-400 mt-1">{t("adminProductDesc")}</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setEditingProductId(null);
                    setFormData({
                      name: "",
                      brand: "",
                      model: "",
                      price: "",
                      image: "",
                      partNumber: `PN-${Math.floor(100000 + Math.random() * 900000)}`,
                      stock: "In Stock",
                      quality: "Original"
                    });
                    setShowModal(true);
                  }}
                  className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 active:scale-95"
                >
                  <Plus className="h-4 w-4" /> {t("adminAddNew")}
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4 font-medium">{t("tableProduct")}</th>
                      <th className="px-6 py-4 font-medium">{t("tableBrand")}</th>
                      <th className="px-6 py-4 font-medium">{t("tablePrice")}</th>
                      <th className="px-6 py-4 font-medium">{t("tableStatus")}</th>
                      <th className="px-6 py-4 font-medium text-right">{t("tableActions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {products.length > 0 ? (
                      products.map((product) => (
                        <tr key={product.id} className="transition-colors hover:bg-slate-800/30">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-10 w-10 shrink-0 rounded-lg object-cover bg-slate-800 border border-slate-700"
                              />
                              <div>
                                <div className="font-medium text-slate-200">{product.name}</div>
                                <div className="text-xs text-slate-500 font-mono mt-0.5">
                                  #{product.partNumber} •{" "}
                                  <span className="text-cyan-400">{product.salesCount || 0} sotilgan</span> •{" "}
                                  <span className={`${product.quality === "Original" ? "text-emerald-400" :
                                    product.quality === "Padelka" ? "text-rose-400" : "text-purple-400"
                                    }`}>
                                    {product.quality || "Original"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-300">
                            <span className="font-medium text-slate-200">{product.brand}</span>
                            <span className="text-slate-500 ml-1">· {product.model}</span>
                          </td>
                          <td className="px-6 py-4 font-mono text-cyan-400 font-medium">
                            {formatPrice(product.price)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium uppercase tracking-wider ${product.stock === "In Stock"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : product.stock === "Low Stock"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                }`}
                            >
                              {t(`status${product.stock.replace(/\s/g, "")}`)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
                                title="Tahrirlash"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
                                title="O'chirish"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                          Hech narsa topilmadi
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div>
              <h1 className="text-3xl font-bold text-slate-50">{t("adminOrders")}</h1>
              <p className="text-slate-400 mt-1">{t("noOrdersDesc")}</p>
            </div>
            {orders.length > 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden shadow-xl mt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-4 font-medium">
                          {lang === "uz" ? "Buyurtma ID" : lang === "ru" ? "ID Заказа" : "Order ID"}
                        </th>
                        <th className="px-6 py-4 font-medium">
                          {lang === "uz" ? "Sana" : lang === "ru" ? "Дата" : "Date"}
                        </th>
                        <th className="px-6 py-4 font-medium">
                          {lang === "uz" ? "Mahsulotlar" : lang === "ru" ? "Товары" : "Products"}
                        </th>
                        <th className="px-6 py-4 font-medium">
                          {lang === "uz" ? "Summa" : lang === "ru" ? "Сумма" : "Total"}
                        </th>
                        <th className="px-6 py-4 font-medium text-right">{t("tableStatus")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {orders.map((order, idx) => {
                        const total = order.items?.reduce(
                          (acc, item) => acc + item.price * (item.quantity || 1),
                          order.shipping || 0
                        );
                        return (
                          <tr
                            key={order.id || idx}
                            className="transition-colors hover:bg-slate-800/30"
                          >
                            <td className="px-6 py-4 font-mono text-cyan-400">
                              #{order.id || `ORD-${idx + 1000}`}
                            </td>
                            <td className="px-6 py-4 text-slate-300">
                              {order.date
                                ? new Date(order.date)
                                  .toLocaleString("ru-RU", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                  .replace(",", "")
                                : new Date()
                                  .toLocaleString("ru-RU", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                  .replace(",", "")}
                            </td>
                            <td className="px-6 py-4 text-slate-300">
                              {order.items?.map((item, i) => (
                                <div key={i} className="text-xs mb-1">
                                  {item.name}{" "}
                                  <span className="text-slate-500">x{item.quantity || 1}</span>
                                </div>
                              ))}
                            </td>
                            <td className="px-6 py-4 font-mono font-medium text-slate-200">
                              {formatPrice(total || order.total || 0)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium uppercase tracking-wider ${order.status === "ready"
                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    : order.status === "completed"
                                      ? "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                                      : order.status === "cancelled"
                                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    }`}
                                >
                                  {order.status === "ready"
                                    ? lang === "uz"
                                      ? "Tayyor"
                                      : lang === "ru"
                                        ? "Готово"
                                        : "Ready"
                                    : order.status === "completed"
                                      ? lang === "uz"
                                        ? "Tasdiqlandi✅"
                                        : lang === "ru"
                                          ? "Завершено"
                                          : "Completed"
                                      : order.status === "cancelled"
                                        ? lang === "uz"
                                          ? "Bekor qilingan❌"
                                          : lang === "ru"
                                            ? "Отменен"
                                            : "Cancelled"
                                        : lang === "uz"
                                          ? "Yangi🆕"
                                          : lang === "ru"
                                            ? "Новый"
                                            : "New"}
                                </span>
                                {order.status !== "ready" &&
                                  order.status !== "completed" &&
                                  order.status !== "cancelled" && (
                                    <button
                                      onClick={() => handleUpdateOrderStatus(order.id, "ready")}
                                      className="rounded bg-slate-800 px-2 py-1.5 text-xs font-semibold text-slate-300 hover:bg-cyan-500 hover:text-slate-950 transition-colors"
                                    >
                                      {lang === "uz"
                                        ? "Qabul qilish"
                                        : lang === "ru"
                                          ? "Принять"
                                          : "Accept"}
                                    </button>
                                  )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 py-24 text-center bg-slate-900/20">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50 mb-4">
                  <ShoppingCart className="h-8 w-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-200">{t("noOrdersYet")}</h3>
                <p className="mt-1 text-sm text-slate-500 max-w-sm">{t("noOrdersDesc")}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "brands" && (
          <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-3xl font-bold text-slate-50">
                {lang === "uz" ? "Katalog Brendlari" : lang === "ru" ? "Бренды каталога" : "Catalog Brands"}
              </h1>
              <p className="text-slate-400 mt-1">
                {lang === "uz" ? "Asosiy sahifadagi chap menyu uchun avtomobil brendlarini boshqaring." : lang === "ru" ? "Управляйте автомобильными брендами для левого меню на главной странице." : "Manage car brands for the left menu on the main page."}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 shadow-xl">
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newBrand.trim()) return;
                if (!brands.includes(newBrand.trim())) {
                  const updated = [...brands, newBrand.trim()];
                  setBrands(updated);
                  localStorage.setItem("volt_brands", JSON.stringify(updated));
                }
                setNewBrand("");
              }} className="flex flex-col sm:flex-row gap-4 mb-8">
                <input
                  type="text"
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  placeholder={lang === "uz" ? "Yangi brend nomi (Masalan: Tesla, Voyah)" : lang === "ru" ? "Новое имя бренда (Например: Tesla)" : "New brand name (e.g. Tesla)"}
                  className="flex-1 rounded-xl bg-slate-800 border border-slate-700 px-5 py-3.5 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />
                <button type="submit" className="px-8 py-3.5 bg-cyan-500 text-slate-950 font-bold rounded-xl hover:bg-cyan-400 transition-colors flex justify-center items-center gap-2 active:scale-95 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                  <Plus className="w-5 h-5" /> {lang === "uz" ? "Qo'shish" : lang === "ru" ? "Добавить" : "Add"}
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {brands.map((b, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-800 border border-slate-700 p-4 rounded-2xl group hover:border-cyan-500/50 transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                    <span className="font-bold text-slate-200">{b}</span>
                    <button
                      onClick={() => {
                        const updated = brands.filter(item => item !== b);
                        setBrands(updated);
                        localStorage.setItem("volt_brands", JSON.stringify(updated));
                      }}
                      className="text-slate-500 hover:text-rose-500 transition-colors p-2 bg-slate-900 rounded-lg group-hover:bg-slate-950"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "account" && (
          <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-3xl font-bold text-slate-50">{t("adminAccountTitle")}</h1>
              <p className="text-slate-400 mt-1">{t("adminAccountDesc")}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl flex flex-col justify-center relative overflow-hidden">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none"></div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-cyan-500/20 rounded-lg text-cyan-400">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <p className="text-slate-300 font-medium text-sm">{t("adminTotalBalance")}</p>
                </div>
                <h2 className="text-3xl font-mono font-bold text-cyan-400">
                  {formatPrice(totalBalance)}
                </h2>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl flex flex-col justify-center relative overflow-hidden">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none"></div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-emerald-500/20 rounded-lg text-emerald-400">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                  <p className="text-slate-300 font-medium text-sm">{t("adminTotalOrders")}</p>
                </div>
                <h2 className="text-3xl font-mono font-bold text-slate-50">{orders.length}</h2>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl flex flex-col justify-center relative overflow-hidden">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl pointer-events-none"></div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-purple-500/20 rounded-lg text-purple-400">
                    <Package className="h-5 w-5" />
                  </div>
                  <p className="text-slate-300 font-medium text-sm">{lang === "uz" ? "Jami Mahsulotlar" : lang === "ru" ? "Всего продуктов" : "Total Products"}</p>
                </div>
                <h2 className="text-3xl font-mono font-bold text-slate-50">{products.length}</h2>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl flex flex-col justify-center relative overflow-hidden">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl pointer-events-none"></div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-amber-500/20 rounded-lg text-amber-400">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <p className="text-slate-300 font-medium text-sm">{lang === "uz" ? "Kam qolgan / Yo'q" : lang === "ru" ? "Мало / Нет в наличии" : "Low / Out of Stock"}</p>
                </div>
                <h2 className="text-3xl font-mono font-bold text-slate-50">{products.filter((p) => p.stock === "Low Stock" || p.stock === "Out of Stock").length}</h2>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-bold text-slate-50 mb-4">{lang === "uz" ? "Buyurtmalar holati" : lang === "ru" ? "Статус заказов" : "Orders Status"}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{lang === "uz" ? "Yangi" : lang === "ru" ? "Новые" : "New"}</p>
                    <p className="text-2xl font-bold text-slate-50">{orders.filter(o => !o.status || o.status === "new").length}</p>
                  </div>
                  <div className="h-10 w-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400">
                    <Package className="h-5 w-5" />
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{lang === "uz" ? "Yo'lda" : lang === "ru" ? "В пути" : "On the way"}</p>
                    <p className="text-2xl font-bold text-slate-50">{orders.filter(o => o.status === "ready").length}</p>
                  </div>
                  <div className="h-10 w-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400">
                    <Truck className="h-5 w-5" />
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{lang === "uz" ? "Yetkazilgan" : lang === "ru" ? "Доставленные" : "Delivered"}</p>
                    <p className="text-2xl font-bold text-slate-50">{orders.filter(o => o.status === "completed").length}</p>
                  </div>
                  <div className="h-10 w-10 bg-slate-500/10 rounded-full flex items-center justify-center text-slate-400">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{lang === "uz" ? "Bekor qilingan" : lang === "ru" ? "Отмененные" : "Cancelled"}</p>
                    <p className="text-2xl font-bold text-slate-50">{orders.filter(o => o.status === "cancelled").length}</p>
                  </div>
                  <div className="h-10 w-10 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-400">
                    <XCircle className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ai" && (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
                <Sparkles className="text-purple-400 h-8 w-8" />
                {t("adminAITitle")}
              </h1>
              <p className="text-slate-400 mt-1">{t("adminAIDesc")}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-2xl relative overflow-hidden flex flex-col min-h-[500px]">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex-1 overflow-y-auto mb-4 pr-2">
                {!aiReport && !isAILoading && !isAIResponding && (
                  <div className="text-center py-10">
                    <Bot className="h-20 w-20 mx-auto text-slate-600 mb-6 drop-shadow-lg" />
                    <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                      Bu bo'limda Sun'iy Intellekt do'koningizdagi barcha buyurtmalar, daromadlar va
                      zaxiralarni tahlil qilib, biznesingizni o'stirish bo'yicha maxsus hisobot
                      tayyorlaydi.
                    </p>
                    <button
                      onClick={handleGenerateAIReport}
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-3 font-bold text-white shadow-lg hover:from-purple-500 hover:to-cyan-400 transition-all hover:scale-105 active:scale-95"
                    >
                      <Sparkles className="h-5 w-5" /> {t("adminAIGenerate")}
                    </button>
                  </div>
                )}

                {isAILoading && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="h-12 w-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-purple-400 font-medium animate-pulse">
                      {t("adminAILoading")}
                    </p>
                  </div>
                )}

                {aiReport && (
                  <div
                    className="prose prose-invert max-w-none text-slate-300 leading-loose text-lg"
                    dangerouslySetInnerHTML={{ __html: aiReport }}
                  />
                )}

                {isAIResponding && (
                  <div className="mt-6 flex items-center gap-3 text-purple-400">
                    <div className="h-5 w-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                    <span className="text-sm font-medium animate-pulse">
                      {t("adminAIThinking")}
                    </span>
                  </div>
                )}
              </div>

              {/* Chat form for AI */}
              <form
                onSubmit={handleAskAI}
                className="relative z-10 flex gap-3 border-t border-slate-800 pt-4 mt-auto"
              >
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder={t("adminAIPlaceholder")}
                  disabled={isAILoading || isAIResponding}
                  className="flex-1 rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-slate-50 placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isAILoading || isAIResponding || !aiPrompt.trim()}
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-bold text-white hover:bg-purple-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("adminAIAsk")} <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Modal Forma */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-50 mb-6">
              {editingProductId
                ? lang === "uz"
                  ? "Mahsulotni tahrirlash"
                  : lang === "ru"
                    ? "Редактировать продукт"
                    : "Edit Product"
                : t("modalAddTitle")}
            </h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t("modalLabelName")} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder={t("modalLabelNamePlaceholder")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t("modalLabelBrand")}
                  </label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="">{lang === "uz" ? "Brendni tanlang..." : lang === "ru" ? "Выберите бренд..." : "Select brand..."}</option>
                    {brands.map((b, idx) => (
                      <option key={idx} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t("modalLabelModel")}
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder={t("modalLabelModelPlaceholder")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t("modalLabelPrice")} *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder={t("modalLabelPricePlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t("modalLabelPart")}
                  </label>
                  <input
                    type="text"
                    value={formData.partNumber}
                    onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder={t("modalLabelPartPlaceholder")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t("modalLabelImage")} (Fayl tanlang)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({ ...formData, image: reader.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400"
                />
                {formData.image && (
                  <div className="mt-3 flex justify-center">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="h-24 w-24 object-cover rounded-lg border border-slate-700 bg-slate-950" 
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t("modalLabelStatus")}
                </label>
                <select
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="In Stock">{t("statusInStock")}</option>
                  <option value="Low Stock">{t("statusLowStock")}</option>
                  <option value="Out of Stock">{t("statusOutOfStock")}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Sifat (Original / Nusxa)</label>
                <select
                  value={formData.quality}
                  onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Original">Original (OEM)</option>
                  <option value="Aftermarket">Aftermarket (Yaxshi nusxa)</option>
                  <option value="Padelka">Padelka (Arzon nusxa)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition"
                >
                  {editingProductId
                    ? lang === "uz"
                      ? "Saqlash"
                      : lang === "ru"
                        ? "Сохранить"
                        : "Save"
                    : t("modalBtnAdd")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 text-slate-50 font-semibold hover:bg-slate-700 transition"
                >
                  {t("modalBtnCancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* O'chirishni tasdiqlash modali */}
      {deleteModalId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 max-w-sm w-full mx-4 shadow-2xl text-center animate-in fade-in zoom-in duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 mb-4">
              <Trash2 className="h-7 w-7 text-rose-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-50 mb-2">{t("deleteTitle")}</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">{t("deleteDesc")}</p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-600 transition active:scale-95"
              >
                {t("deleteBtnYes")}
              </button>
              <button
                onClick={() => setDeleteModalId(null)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 text-slate-50 font-semibold hover:bg-slate-700 transition active:scale-95"
              >
                {t("deleteBtnNo")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
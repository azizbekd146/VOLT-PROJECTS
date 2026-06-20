import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Package,
  MapPin,
  Settings,
  LogOut,
  ShoppingBag,
  ArrowLeft,
  XCircle,
  Plus,
  Trash2,
  Truck,
  CheckCircle,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { useCurrency } from "../context/CurrencyContext";

export default function UserProfile() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "orders");
  const [myOrders, setMyOrders] = useState([]);
  const [cancelModalId, setCancelModalId] = useState(null);
  const [user, setUser] = useState({ name: "Foydalanuvchi", email: "mijoz@volt.uz" });
  const { theme, toggleTheme } = useTheme();
  const { formatPrice } = useCurrency();

  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem("volt_addresses");
    return saved
      ? JSON.parse(saved)
      : [
        {
          id: 1,
          title: "Uy manzili",
          text: "Toshkent shahar, Yunusobod tumani, 19-kvartal, 42-uy, 15-xonadon",
          isMain: true,
        },
        {
          id: 2,
          title: "Ish manzili",
          text: "Toshkent shahar, Mirobod tumani, Amir Temur shoh ko'chasi, 107B",
          isMain: false,
        },
      ];
  });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ title: "", text: "" });

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    // Registratsiya qilingan ma'lumotlarni o'qish (simulyatsiya)
    const savedUser = JSON.parse(
      localStorage.getItem("user_account") || '{"name": "Xaridor", "email": "mijoz@volt.uz"}'
    );
    setUser(savedUser);

    // Har 2 soniyada buyurtmalar holatini yangilab turish
    const fetchOrders = () => {
      const localOrders = JSON.parse(localStorage.getItem("volt_orders") || "[]");
      setMyOrders(localOrders);
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem("volt_addresses", JSON.stringify(addresses));
  }, [addresses]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    navigate("/");
  };

  const confirmCancel = () => {
    if (!cancelModalId) return;
    const orderId = cancelModalId;

    const updatedOrders = myOrders.map((o) =>
      o.id === orderId ? { ...o, status: "cancelled" } : o
    );
    setMyOrders(updatedOrders);
    localStorage.setItem("volt_orders", JSON.stringify(updatedOrders));

    fetch(`http://localhost:5000/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    }).catch((err) => console.log("Backend ulanmadi"));

    // Telegram orqali adminga xabar berish
    const BOT_TOKEN = "8984745030:AAHjdWf2ALdv2G6OV-DC6UpMCVmX9dnUVUQ";
    const CHAT_ID = "8167467055";
    const text = `❌ <b>Mijoz buyurtmani bekor qildi!</b>\n\n🆔 Buyurtma raqami: <b>#${orderId}</b>\n👤 Mijoz: <b>${user.name}</b>`;

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: "HTML" }),
    }).catch((err) => console.log(err));

    setCancelModalId(null);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.title || !newAddress.text) return;
    setAddresses([...addresses, { id: Date.now(), ...newAddress, isMain: addresses.length === 0 }]);
    setNewAddress({ title: "", text: "" });
    setShowAddressModal(false);
  };

  const handleDeleteAddress = (id, e) => {
    e.stopPropagation();
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  return (
    <div
      className={`min-h-screen font-body pt-10 pb-12 transition-colors duration-300 ${theme === "light" ? "bg-slate-50 text-slate-900" : "bg-slate-950 text-slate-50"}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/home"
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 w-fit transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {lang === "uz"
            ? "Bosh sahifaga qaytish"
            : lang === "ru"
              ? "Вернуться на главную"
              : "Back to Home"}
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Chap taraf - Sidebar */}
          <div className="w-full md:w-64 shrink-0 space-y-2">
            <div
              className={`mb-6 p-4 rounded-xl border flex items-center gap-4 shadow-lg transition-colors ${theme === "light" ? "bg-white border-slate-200" : "bg-slate-900 border-slate-800"}`}
            >
              <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xl shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3
                  className={`font-semibold ${theme === "light" ? "text-slate-800" : "text-slate-200"}`}
                >
                  {user.name}
                </h3>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "orders" ? "bg-cyan-500/10 text-cyan-500 font-medium" : `text-slate-400 ${theme === "light" ? "hover:bg-slate-200 hover:text-slate-700" : "hover:bg-slate-900 hover:text-slate-200"}`}`}
              >
                <Package className="h-5 w-5" /> {t("profileOrders")}
              </button>
              <button
                onClick={() => setActiveTab("addresses")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "addresses" ? "bg-cyan-500/10 text-cyan-500 font-medium" : `text-slate-400 ${theme === "light" ? "hover:bg-slate-200 hover:text-slate-700" : "hover:bg-slate-900 hover:text-slate-200"}`}`}
              >
                <MapPin className="h-5 w-5" /> {t("profileAddresses")}
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "settings" ? "bg-cyan-500/10 text-cyan-500 font-medium" : `text-slate-400 ${theme === "light" ? "hover:bg-slate-200 hover:text-slate-700" : "hover:bg-slate-900 hover:text-slate-200"}`}`}
              >
                <Settings className="h-5 w-5" /> {t("profileSettings")}
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-rose-500 transition-colors hover:bg-rose-500/10 hover:text-rose-600 mt-4"
              >
                <LogOut className="h-5 w-5" /> {t("profileLogout")}
              </button>
            </nav>
          </div>

          {/* O'ng taraf - Asosiy Kontent */}
          <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold mb-6">
              {t(
                activeTab === "orders"
                  ? "profileOrders"
                  : activeTab === "addresses"
                    ? "profileAddresses"
                    : "profileSettings"
              )}
            </h2>

            {activeTab === "orders" && (
              <div className="space-y-4">
                {myOrders.length > 0 ? (
                  myOrders.map((order, idx) => {
                    const total =
                      order.items?.reduce(
                        (acc, item) => acc + item.price * (item.quantity || 1),
                        order.shipping || 0
                      ) || order.total;

                    const currentStatus = order.status || "new";
                    let stepIndex = 0;
                    if (currentStatus === "ready") stepIndex = 1;
                    if (currentStatus === "completed") stepIndex = 2;

                    return (
                      <div
                        key={order.id || idx}
                        className={`border rounded-xl p-5 shadow-sm transition-colors ${theme === "light" ? "bg-white border-slate-200 hover:border-slate-300" : "bg-slate-900 border-slate-800 hover:border-slate-700"}`}
                      >
                        <div
                          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b ${theme === "light" ? "border-slate-100" : "border-slate-800"}`}
                        >
                          <div>
                            <p className="text-sm text-slate-400">
                              {t("orderDate")}:{" "}
                              <span
                                className={`font-medium ${theme === "light" ? "text-slate-700" : "text-slate-200"}`}
                              >
                                {new Date(order.date || Date.now())
                                  .toLocaleString("ru-RU", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                  .replace(",", "")}
                              </span>
                            </p>
                            <p className="text-sm text-slate-400 mt-0.5">
                              {t("orderId")}:{" "}
                              <span
                                className={`font-mono ${theme === "light" ? "text-slate-700" : "text-slate-200"}`}
                              >
                                #{order.id || `ORD-${idx + 1000}`}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase ${order.status === "completed"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                                : order.status === "ready"
                                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                                  : order.status === "cancelled"
                                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_10px_rgba(243,24,70,0.2)]"
                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                                }`}
                            >
                              {t(`status${order.status || "new"}`)}
                            </span>
                            <span className="font-bold text-cyan-400 font-mono text-lg">
                              {formatPrice(total)}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 border rounded flex items-center justify-center ${theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"}`}
                                >
                                  <ShoppingBag className="w-4 h-4 text-slate-500" />
                                </div>
                                <span
                                  className={`font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}
                                >
                                  {item.name}
                                </span>
                              </div>
                              <div className="text-slate-400 font-mono">
                                {item.quantity || 1} x {formatPrice(item.price)}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Buyurtmani jonli kuzatish (Order Tracker) progress qismi */}
                        {currentStatus !== "cancelled" ? (
                          <div className="mt-10 mb-6 px-2 sm:px-4">
                            <div className="relative flex items-center justify-between">
                              {/* Orqa fon chizig'i */}
                              <div
                                className={`absolute left-0 top-4 -translate-y-1/2 w-full h-1.5 rounded-full ${theme === "light" ? "bg-slate-200" : "bg-slate-800"}`}
                              ></div>
                              {/* Faol (To'lgan) chiziq */}
                              <div
                                className="absolute left-0 top-4 -translate-y-1/2 h-1.5 bg-cyan-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                style={{ width: `${(stepIndex / 2) * 100}%` }}
                              ></div>

                              {[
                                {
                                  id: "new",
                                  icon: Package,
                                  label:
                                    lang === "uz"
                                      ? "Qabul qilindi"
                                      : lang === "ru"
                                        ? "Принят"
                                        : "Accepted",
                                },
                                {
                                  id: "ready",
                                  icon: Truck,
                                  label:
                                    lang === "uz"
                                      ? "Yo'lda"
                                      : lang === "ru"
                                        ? "В пути"
                                        : "On the way",
                                },
                                {
                                  id: "completed",
                                  icon: CheckCircle,
                                  label:
                                    lang === "uz"
                                      ? "Yetkazildi"
                                      : lang === "ru"
                                        ? "Доставлен"
                                        : "Delivered",
                                },
                              ].map((step, index) => {
                                const Icon = step.icon;
                                const isActive = index <= stepIndex;
                                const isCurrent = index === stepIndex;
                                return (
                                  <div
                                    key={step.id}
                                    className="relative z-10 flex flex-col items-center"
                                  >
                                    <div
                                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${isActive ? "border-cyan-500 bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.5)]" : theme === "light" ? "border-slate-300 bg-white text-slate-400" : "border-slate-700 bg-slate-900 text-slate-500"} ${isCurrent ? "scale-125 ring-4 ring-cyan-500/30" : ""}`}
                                    >
                                      <Icon className="w-4 h-4" />
                                    </div>
                                    <span
                                      className={`absolute top-12 whitespace-nowrap text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors duration-700 ${isActive ? "text-cyan-500" : theme === "light" ? "text-slate-400" : "text-slate-500"} ${index === 0 ? "left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0" : index === 2 ? "left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0" : "left-1/2 -translate-x-1/2"}`}
                                    >
                                      {step.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : null}

                        {order.status === "new" && (
                          <div
                            className={`mt-8 pt-4 border-t text-right ${theme === "light" ? "border-slate-100" : "border-slate-800"}`}
                          >
                            <button
                              onClick={() => setCancelModalId(order.id)}
                              className="w-full sm:w-auto px-5 py-2.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg text-sm font-semibold hover:bg-rose-500 hover:text-white transition-colors"
                            >
                              {t("btnCancelOrder")}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div
                    className={`text-center py-16 border border-dashed rounded-xl ${theme === "light" ? "bg-slate-50 border-slate-300" : "bg-slate-900/50 border-slate-800"}`}
                  >
                    <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">{t("noOrders")}</p>
                  </div>
                )}
              </div>
            )}
            {activeTab === "settings" && (
              <div className="space-y-8">
                {/* Profil Ma'lumotlari va Sozlamalar */}
                <div
                  className={`border rounded-xl p-8 shadow-lg transition-colors ${theme === "light" ? "bg-white border-slate-200" : "bg-slate-900 border-slate-800"}`}
                >
                  <div className="flex items-center gap-5 mb-8 border-b pb-8 border-slate-800">
                    <div className="h-16 w-16 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-2xl shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${theme === "light" ? "text-slate-800" : "text-slate-100"}`}>
                        {user.name}
                      </h3>
                      <p className={`text-sm mt-1 ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-6">{t("profileSettings") || "Sozlamalar"}</h3>

                  <div className="space-y-6">
                    {/* Mavzu o'zgartirish qismi */}
                    <div
                      className={`flex items-center justify-between pb-6 border-b ${theme === "light" ? "border-slate-100" : "border-slate-800"}`}
                    >
                      <div>
                        <h4 className="font-semibold">
                          {lang === "uz" ? "Mavzu (Theme)" : lang === "ru" ? "Тема" : "Theme"}
                        </h4>
                        <p
                          className={`text-sm mt-1 ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}
                        >
                          {lang === "uz"
                            ? "Saytning yorug' yoki qorong'i rejimini tanlang"
                            : lang === "ru"
                              ? "Выберите светлый или темный режим сайта"
                              : "Choose the light or dark mode of the site"}
                        </p>
                      </div>
                      <div
                        className={`flex p-1 rounded-lg border ${theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"}`}
                      >
                        <button
                          onClick={() => toggleTheme("light")}
                          className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${theme === "light" ? "bg-cyan-500 text-white shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                        >
                          {lang === "uz" ? "Yorug'" : lang === "ru" ? "Светлая" : "Light"}
                        </button>
                        <button
                          onClick={() => toggleTheme("dark")}
                          className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${theme === "dark" ? "bg-slate-800 text-cyan-400 shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
                        >
                          {lang === "uz" ? "Qorong'i" : lang === "ru" ? "Темная" : "Dark"}
                        </button>
                      </div>
                    </div>

                    {/* Parolni o'zgartirish (Tez kunda) */}
                    <div
                      className={`flex items-center justify-between pb-6 border-b opacity-50 cursor-not-allowed ${theme === "light" ? "border-slate-100" : "border-slate-800"}`}
                    >
                      <div>
                        <h4 className="font-semibold">
                          {lang === "uz"
                            ? "Parolni o'zgartirish"
                            : lang === "ru"
                              ? "Изменить пароль"
                              : "Change Password"}
                        </h4>
                        <p
                          className={`text-sm mt-1 ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}
                        >
                          {lang === "uz"
                            ? "Akkaunt parolini yangilash (Tez kunda)"
                            : lang === "ru"
                              ? "Обновить пароль (Скоро)"
                              : "Update account password (Coming soon)"}
                        </p>
                      </div>
                      <button
                        disabled
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${theme === "light" ? "bg-slate-200 text-slate-400" : "bg-slate-800 text-slate-400"}`}
                      >
                        {lang === "uz" ? "O'zgartirish" : lang === "ru" ? "Изменить" : "Change"}
                      </button>
                    </div>

                    {/* Logout Button */}
                    <div className="pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-5 py-3 rounded-lg text-rose-500 font-bold transition-colors hover:bg-rose-500/10 hover:text-rose-600"
                      >
                        <LogOut className="h-5 w-5" /> {t("profileLogout")}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Manzillar qismi */}
                <div
                  className={`border rounded-xl p-8 shadow-lg transition-colors ${theme === "light" ? "bg-white border-slate-200" : "bg-slate-900 border-slate-800"}`}
                >
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-bold">{t("profileAddresses")}</h3>
                      <p
                        className={`text-sm mt-1 ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}
                      >
                        {lang === "uz"
                          ? "Yetkazib berish manzillaringizni boshqaring"
                          : lang === "ru"
                            ? "Управляйте своими адресами доставки"
                            : "Manage your delivery addresses"}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddressModal(true)}
                      className="flex items-center gap-2 bg-cyan-500 text-slate-950 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-cyan-400 transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4" />{" "}
                      {lang === "uz"
                        ? "Yangi qo'shish"
                        : lang === "ru"
                          ? "Добавить новый"
                          : "Add New"}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border rounded-xl p-5 hover:border-cyan-500/50 transition-colors cursor-pointer group relative ${theme === "light" ? "bg-white border-slate-200" : "bg-slate-900 border-slate-800"}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div
                            className={`flex items-center gap-2 font-medium transition-colors ${address.isMain ? "text-cyan-400" : theme === "light" ? "text-slate-800 group-hover:text-cyan-500" : "text-slate-200 group-hover:text-cyan-400"}`}
                          >
                            <MapPin className="w-4 h-4" /> {address.title}
                          </div>
                          <div className="flex items-center gap-2">
                            {address.isMain && (
                              <span
                                className={`text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider ${theme === "light" ? "bg-slate-100 text-slate-500" : "bg-slate-800 text-slate-400"}`}
                              >
                                {lang === "uz" ? "Asosiy" : lang === "ru" ? "Основной" : "Main"}
                              </span>
                            )}
                            <button
                              onClick={(e) => handleDeleteAddress(address.id, e)}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                              title="O'chirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p
                          className={`text-sm mt-3 leading-relaxed ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}
                        >
                          {address.text}
                        </p>
                      </div>
                    ))}
                  </div>
                  {addresses.length === 0 && (
                    <div
                      className={`text-center py-10 border border-dashed rounded-xl mt-4 ${theme === "light" ? "border-slate-300 text-slate-500" : "border-slate-800 text-slate-400"}`}
                    >
                      {lang === "uz"
                        ? "Hozircha manzillar yo'q."
                        : lang === "ru"
                          ? "Пока нет адресов."
                          : "No addresses yet."}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bekor qilishni tasdiqlash modali */}
        {cancelModalId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
            <div
              className={`rounded-xl border p-8 max-w-sm w-full mx-4 shadow-2xl text-center animate-in fade-in zoom-in duration-200 ${theme === "light" ? "bg-white border-slate-200" : "bg-slate-900 border-slate-800"}`}
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 mb-4">
                <XCircle className="h-7 w-7 text-rose-500" />
              </div>
              <h2
                className={`text-xl font-bold mb-2 ${theme === "light" ? "text-slate-900" : "text-slate-50"}`}
              >
                {lang === "uz"
                  ? "Buyurtmani bekor qilish"
                  : lang === "ru"
                    ? "Отменить заказ"
                    : "Cancel Order"}
              </h2>
              <p
                className={`mb-8 leading-relaxed ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}
              >
                {lang === "uz"
                  ? "Rostdan ham ushbu buyurtmani bekor qilmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi."
                  : lang === "ru"
                    ? "Вы уверены, что хотите отменить этот заказ? Это действие нельзя отменить."
                    : "Are you sure you want to cancel this order? This action cannot be undone."}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmCancel}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-600 transition active:scale-95"
                >
                  {lang === "uz"
                    ? "Ha, bekor qilish"
                    : lang === "ru"
                      ? "Да, отменить"
                      : "Yes, cancel"}
                </button>
                <button
                  onClick={() => setCancelModalId(null)}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition active:scale-95 ${theme === "light" ? "bg-slate-200 text-slate-800 hover:bg-slate-300" : "bg-slate-800 text-slate-50 hover:bg-slate-700"}`}
                >
                  {lang === "uz" ? "Yo'q, qolsin" : lang === "ru" ? "Нет, оставить" : "No, keep it"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Yangi Manzil Qo'shish Modali */}
        {showAddressModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] px-4">
            <div
              className={`rounded-xl border p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200 ${theme === "light" ? "bg-white border-slate-200" : "bg-slate-900 border-slate-800"}`}
            >
              <h2
                className={`text-xl font-bold mb-4 ${theme === "light" ? "text-slate-900" : "text-slate-50"}`}
              >
                {lang === "uz"
                  ? "Yangi manzil qo'shish"
                  : lang === "ru"
                    ? "Добавить новый адрес"
                    : "Add New Address"}
              </h2>
              <form onSubmit={handleAddAddress} className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}
                  >
                    {lang === "uz"
                      ? "Manzil nomi"
                      : lang === "ru"
                        ? "Название адреса"
                        : "Address Title"}
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddress.title}
                    onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                    placeholder={
                      lang === "uz"
                        ? "Masalan: Uy yoki Ish"
                        : lang === "ru"
                          ? "Например: Дом или Работа"
                          : "E.g. Home or Work"
                    }
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-cyan-500 focus:outline-none ${theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-slate-950 border-slate-800 text-slate-50"}`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}
                  >
                    {lang === "uz"
                      ? "To'liq manzil"
                      : lang === "ru"
                        ? "Полный адрес"
                        : "Full Address"}
                  </label>
                  <textarea
                    required
                    value={newAddress.text}
                    onChange={(e) => setNewAddress({ ...newAddress, text: e.target.value })}
                    rows="3"
                    placeholder={
                      lang === "uz"
                        ? "Shahar, tuman, ko'cha, uy..."
                        : lang === "ru"
                          ? "Город, район, улица, дом..."
                          : "City, district, street, house..."
                    }
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none ${theme === "light" ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-slate-950 border-slate-800 text-slate-50"}`}
                  ></textarea>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-cyan-500 text-slate-950 rounded-lg text-sm font-semibold hover:bg-cyan-400 transition-colors"
                  >
                    {lang === "uz" ? "Saqlash" : lang === "ru" ? "Сохранить" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${theme === "light" ? "bg-slate-200 text-slate-800 hover:bg-slate-300" : "bg-slate-800 text-slate-50 hover:bg-slate-700"}`}
                  >
                    {lang === "uz" ? "Bekor qilish" : lang === "ru" ? "Отмена" : "Cancel"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
      );
}

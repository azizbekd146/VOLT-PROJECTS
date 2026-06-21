import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, Chrome } from "lucide-react";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();

  // API URL - Buni kelajakda .env faylidan olish tavsiya qilinadi
  const API_BASE_URL = "https://volt-projects-production-e550.up.railway.app";

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const googleEmail = queryParams.get("email");
    const googleName = queryParams.get("name");

    if (googleEmail && googleName) {
      setEmail(googleEmail);
      setName(decodeURIComponent(googleName));
      setIsRegister(true);
      setMessage({ type: "success", text: "Google tasdiqladi! Endi o'zingizga parol o'rnating." });

      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    // ADMIN BYPASS
    if (!isRegister && email === "admin@gmail.com") {
      if (password === "Alabas78.") {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user_name", "Admin");
        localStorage.setItem("user_email", "admin@gmail.com");
        localStorage.setItem("role", "admin");
        setMessage({
          type: "success",
          text: "Admin tizimda aniqlandi. Admin sahifasiga kirilmoqda...",
        });

        setTimeout(() => {
          setIsLoading(false);
          navigate("/admin");
          window.location.reload();
        }, 1500);
      } else {
        setIsLoading(false);
        setMessage({
          type: "error",
          text: "Admin paroli noto'g'ri! Qaytadan urinib ko'ring.",
        });
      }
      return;
    }

    // ODDIY FOYDALANUVCHILAR (TO'G'RILANGAN JONLI BACKEND URL)
    try {
      if (isRegister) {
        const response = await fetch(
          `${API_BASE_URL}/api/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          }
        );
        const data = await response.json();

        if (response.ok && data.status === "success") {
          setTimeout(() => {
            setMessage({ type: "success", text: data.message });
            setIsRegister(false);
            setPassword("");
            setIsLoading(false);
          }, 1500);
        } else {
          setIsLoading(false);
          setMessage({ type: "error", text: data.message || "Xatolik yuz berdi!" });
        }
      } else {
        const response = await fetch(
          `${API_BASE_URL}/api/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          }
        );
        const data = await response.json();

        if (response.ok && data.status === "success") {
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("user_name", data.name);
          localStorage.setItem("user_email", data.email || email);
          localStorage.setItem("role", data.role || "user");

          setMessage({ type: "success", text: "Tizimga kirilmoqda..." });

          setTimeout(() => {
            setIsLoading(false);
            navigate("/");
            window.location.reload();
          }, 2000);
        } else {
          setIsLoading(false);
          setMessage({ type: "error", text: data.message || "Email yoki parol noto'g'ri!" });
        }
      }
    } catch (error) {
      setIsLoading(false);
      setMessage({ type: "error", text: "Backend serverga ulanib bo'lmadi!" });
    }
  };

  // TO'G'RILANGAN GOOGLE AUTH YO'NALTIRISH LINKI
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">
            {isRegister ? "Yangi akkaunt yaratish" : "Tizimga kirish"}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isRegister
              ? "Barcha imkoniyatlardan foydalanish uchun ro'yxatdan o'ting"
              : "Loyihaga qaytganingizdan xursandmiz"}
          </p>
        </div>

        {message.text && (
          <div
            className={`p-3 rounded-lg mb-4 flex items-center gap-2 text-sm ${
              message.type === "success"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs text-slate-400 block mb-1">Ism va familiya</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-500" size={18} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="To'liq ismingizni kiriting"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-slate-400 block mb-1">Elektron pochta</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Parol</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition mt-2"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                {isRegister ? "Akkaunt yaratilmoqda..." : "Tizimga kirilmoqda..."}
              </div>
            ) : (
              <>
                {isRegister ? "Ro'yxatdan o'tish" : "Tizimga kirish"}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="relative my-5 text-center">
          <hr className="border-slate-800" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-3 text-xs text-slate-500">
            Yoki bu orqali davom eting
          </span>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-800 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition"
        >
          <Chrome size={16} className="text-rose-500" />
          Google
        </button>

        <div className="text-center mt-5 text-xs text-slate-400">
          {isRegister ? "Akkauntingiz bormi? " : "Akkauntingiz yo'qmi? "}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage({ type: "", text: "" });
            }}
            className="text-cyan-400 hover:underline font-medium"
          >
            {isRegister ? "Tizimga kiring" : "Ro'yxatdan o'ting"}
          </button>
        </div>
      </div>
    </div>
  );
}

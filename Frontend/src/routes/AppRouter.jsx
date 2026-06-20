import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import UserProfile from "../pages/UserProfile";
import GeminiExample from "../components/common/GeminiExample";
import CartPage from "../pages/CartPage";

// BARCHA PROVAYDERLAR
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";
import { LanguageProvider } from "../context/LanguageContext";
import { CurrencyProvider } from "../context/CurrencyContext";
import { ThemeProvider } from "../context/ThemeContext";

const MainRouteWrapper = () => {
  const navigate = useNavigate();
  // State orqali login holatini boshqaramiz (shunda sahifa chalkashmaydi)
  const [auth, setAuth] = useState(localStorage.getItem("isAuthenticated") === "true");

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const googleEmail = queryParams.get("email");
    const googleName = queryParams.get("name");
    const googleRole = queryParams.get("role");

    if (googleEmail && googleName) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user_name", decodeURIComponent(googleName));
      localStorage.setItem("user_email", googleEmail);
      localStorage.setItem("role", googleRole || "admin");

      setAuth(true); // Tizimga kirdi deb holatni yangilaymiz
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // Agar login qilgan bo'lsa Home sahifasiga, kirmagan bo'lsa Login sahifasiga yo'naltiramiz
  return auth ? <Home /> : <Navigate to="/login" replace />;
};

// Himoyalangan sahifalar filtri (Profil, Savat kabilar uchun)
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Adminlar uchun maxsus filtr
const AdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const isAdmin = localStorage.getItem("role") === "admin";
  return isAuthenticated && isAdmin ? children : <Navigate to="/login" replace />;
};

export default function AppRouter() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <CartProvider>
          <WishlistProvider>
            <ThemeProvider>
              <BrowserRouter>
                <Routes>
                  {/* Asosiy manzilga kirganda tekshiruv ishlaydi */}
                  <Route path="/" element={<MainRouteWrapper />} />

                  {/* Login sahifasini alohida yo'nalish qilib belgilaymiz */}
                  <Route path="/login" element={<Login />} />

                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <UserProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/gemini"
                    element={
                      <ProtectedRoute>
                        <GeminiExample />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <CartPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Noto'g'ri url yozilsa ham asosiysiga qaytarib yuboradi */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </BrowserRouter>
            </ThemeProvider>
          </WishlistProvider>
        </CartProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}

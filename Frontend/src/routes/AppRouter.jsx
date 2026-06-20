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

      setAuth(true);
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return auth ? <Home /> : <Navigate to="/login" replace />;
};

// Himoyalangan sahifalar filtri (Faqat tizimga kirganlar uchun)
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Adminlar uchun maxsus filtr
const AdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const isAdmin = localStorage.getItem("role") === "admin";

  // Agar login qilmagan bo'lsa yoki admin bo'lmasa - login sahifasiga otib yuboradi
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
                  {/* Asosiy sahifa */}
                  <Route path="/" element={<MainRouteWrapper />} />

                  {/* Login sahifasi alohida yozilishi shart */}
                  <Route path="/login" element={<Login />} />

                  {/* Himoyalangan sahifalar */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <UserProfile />
                      </ProtectedRoute>
                    }
                  />

                  {/* ADMIN SAHIFASI FAQAT ADMIN ROUTE ICHIDA */}
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

                  {/* Noto'g'ri url yozilsa asosiysiga qaytaradi */}
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

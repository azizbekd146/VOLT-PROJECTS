import React, { useEffect } from "react";
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
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const googleEmail = queryParams.get("email");
    const googleName = queryParams.get("name");
    const googleRole = queryParams.get("role"); // <--- Backenddan kelgan rolni ham o'qiymiz

    if (googleEmail && googleName) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user_name", decodeURIComponent(googleName));
      localStorage.setItem("user_email", googleEmail);

      // Google orqali kirganda rolni saqlaymiz (agar kelmasa, vaqtincha admin deb ketamiz)
      localStorage.setItem("role", googleRole || "admin");

      window.history.replaceState({}, document.title, window.location.pathname);
      navigate("/", { replace: true });
    }
  }, [navigate]);

  if (isAuthenticated) {
    return <Home />;
  }

  return <Login />;
};

// Himoyalangan sahifalar filtri (Profil, Savat kabilar uchun)
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// Adminlar uchun maxsus filtr
const AdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const isAdmin = localStorage.getItem("role") === "admin";
  return isAuthenticated && isAdmin ? children : <Navigate to="/" replace />;
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
                  {/* Asosiy manzil ("/") kirgan/kirmaganlikka qarab Home yoki Loginni ko'rsatadi */}
                  <Route path="/" element={<MainRouteWrapper />} />

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
                </Routes>
              </BrowserRouter>
            </ThemeProvider>
          </WishlistProvider>
        </CartProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}

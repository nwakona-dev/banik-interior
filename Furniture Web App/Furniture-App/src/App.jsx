import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Header from "./Components/Header";
import Hero from "./Components/Hero";
import Features from "./Components/Features";
import SignaturePieces from "./Components/SignaturePiece";
import WhyChooseUs from "./Components/WhyChooseUs";
import OurSpace from "./Components/OurSpace";
import Testimonial from "./Components/Testimonial";
import Craftmanship from "./Components/Craftmanship";
import NationwideDelivery from "./Components/NationwideDelivery";
import ConsultationCTA from "./Components/ConsultationCTA";
import Footer from "./Components/Footer";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./Components/admin/ProtectedRoute";
import AdminLayout from "./Components/admin/AdminLayout";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminSetup from "./pages/admin/AdminSetup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";

import Collections from "./pages/Collections";

import "./styles/admin.css";
import "./App.css";

function FurnitureHome() {
  return (
    <div className="home">
      <Header />
      <Hero />
      <Features />
      <SignaturePieces />
      <WhyChooseUs />
      <OurSpace />
      <Testimonial />
      <Craftmanship />
      <NationwideDelivery />
      <ConsultationCTA />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public furniture storefront */}
          <Route
            path="/"
            element={
              <CartProvider>
                <FurnitureHome />
              </CartProvider>
            }
          />

          {/* Public collections page */}
          <Route
            path="/collections"
            element={
              <CartProvider>
                <Collections />
              </CartProvider>
            }
          />

          {/* Admin authentication */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/setup" element={<AdminSetup />} />

          {/* Protected admin dashboard */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />

              <Route path="products" element={<AdminProducts />} />

              <Route
                path="products/new"
                element={<AdminProductForm />}
              />

              <Route
                path="products/:id/edit"
                element={<AdminProductForm />}
              />
            </Route>
          </Route>

          {/* Redirect unknown routes */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
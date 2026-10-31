import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  X,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import CartModal from "./CartModal";
import "../styles/header.css";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { cartCount } = useCart();

  const closeMenu = () => {
    setShowMenu(false);
  };

  const openCart = () => {
    setIsCartOpen(true);
    setShowMenu(false);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const toggleMenu = () => {
    setShowMenu((current) => !current);
  };

  const navigationLinks = [
    { name: "Collections", path: "/collections" },
    { name: "Living", path: "/collections?category=SITTING" },
    { name: "Dining", path: "/collections?category=DINING" },
    { name: "Bedroom", path: "/collections?category=BEDROOM" },
    { name: "Our Space", path: "/#our-spaces" },
  ];

  return (
    <>
      {/* Main Header */}
      <header className="header">

        {/* Logo */}
        <Link
          to="/"
          className="logo"
          aria-label="Banik Interior homepage"
        >
          <img src="/logo.png" alt="Banik Interior" />
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="nav-links desktop-nav"
          aria-label="Main navigation"
        >
          {navigationLinks.map((link) =>
            link.name === "Our Space" ? (
              <a
                key={link.name}
                href="/#our-spaces"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.path}
              >
                {link.name}
              </Link>
            )
          )}
        </nav>

        {/* Header Action Icons */}
        <div className="header-icons">

          {/* Shopping Cart Button */}
          <button
            type="button"
            className="header-icon-button cart-button"
            onClick={openCart}
            aria-label={`Open shopping cart with ${cartCount} ${
              cartCount === 1 ? "item" : "items"
            }`}
            title={`Cart (${cartCount})`}
            aria-haspopup="dialog"
            aria-expanded={isCartOpen}
          >
            <ShoppingCart />

            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                className="cart-count"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 20,
                }}
              >
                {cartCount > 99 ? "99+" : cartCount}
              </motion.span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="menu-button"
            onClick={toggleMenu}
            aria-label={showMenu ? "Close menu" : "Open menu"}
            aria-expanded={showMenu}
            aria-controls="mobile-navigation"
          >
            {showMenu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Clickable Backdrop */}
            <motion.div
              className="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Mobile Drawer */}
            <motion.nav
              id="mobile-navigation"
              className="mobile-nav"
              aria-label="Mobile navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >

              {/* Mobile Menu Header */}
              <div className="mobile-nav-header">
                <Link
                  to="/"
                  className="mobile-nav-brand"
                  onClick={closeMenu}
                  aria-label="Banik Interior homepage"
                >
                  <img src="/logo.png" alt="Banik Interior" />
                </Link>

                <button
                  type="button"
                  className="mobile-close-button"
                  onClick={closeMenu}
                  aria-label="Close navigation menu"
                >
                  <X size={30} strokeWidth={1.8} />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <div className="mobile-nav-links">
                {navigationLinks.map((link) =>
                  link.name === "Our Space" ? (
                    <a
                      key={link.name}
                      href="/#our-spaces"
                      onClick={closeMenu}
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={closeMenu}
                    >
                      {link.name}
                    </Link>
                  )
                )}
              </div>

              {/* Footer */}
              <div className="mobile-nav-footer">
                <span>BANIK INTERIOR</span>
                <p>Timeless design. Exceptional living.</p>
              </div>

            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Shopping Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={closeCart}
      />
    </>
  );
};

export default Header;
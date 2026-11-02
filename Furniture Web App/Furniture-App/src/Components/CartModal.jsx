import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingCart,
  X,
  ArrowRight,
  Trash2,
  Minus,
  Plus,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import "../styles/cart-modal.css";

// Replace this with your agent's WhatsApp number.
// Use international format without +, spaces, or dashes.
const AGENT_WHATSAPP_NUMBER = "+2349133488474";

const CartModal = ({ isOpen, onClose }) => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const [itemToRemove, setItemToRemove] = useState(null);

  // Count all individual units in the cart.
  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  // Close with Escape and prevent background scrolling.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        if (itemToRemove) {
          setItemToRemove(null);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose, itemToRemove]);

  // Convert formatted prices into numbers.
  const getPrice = (price) =>
    Number(String(price).replace(/[^0-9.]/g, "")) || 0;

  // Calculate subtotal.
  const subtotal = cartItems.reduce(
    (total, item) =>
      total + getPrice(item.price) * (item.quantity || 1),
    0
  );

  // Format prices as Nigerian Naira.
  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);

  // Change quantity without allowing it below one.
  const handleQuantityChange = (item, change) => {
    const currentQuantity = item.quantity || 1;
    const nextQuantity = currentQuantity + change;

    if (nextQuantity < 1) return;

    updateQuantity(item.name, nextQuantity);
  };

  const requestRemove = (productName) => {
    setItemToRemove(productName);
  };

  const confirmRemove = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove);
      setItemToRemove(null);
    }
  };

  const cancelRemove = () => {
    setItemToRemove(null);
  };

  // Send cart details to the agent through WhatsApp.
  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const orderDetails = cartItems
      .map((item, index) => {
        const quantity = item.quantity || 1;
        const unitPrice = getPrice(item.price);
        const lineTotal = unitPrice * quantity;

        return (
          `${index + 1}. ${item.name}\n` +
          `   Quantity: ${quantity}\n` +
          `   Price: ${formatPrice(unitPrice)} each\n` +
          `   Total: ${formatPrice(lineTotal)}`
        );
      })
      .join("\n\n");

    const message =
      `Hello Banik Interior,\n\n` +
      `I would like to place an order for the following items:\n\n` +
      `${orderDetails}\n\n` +
      `Total Items: ${cartCount}\n` +
      `Subtotal: ${formatPrice(subtotal)}\n\n` +
      `Please provide me with the next steps for completing my order. Thank you.`;

    const whatsappUrl =
      `https://wa.me/${AGENT_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="cart-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              if (itemToRemove) {
                cancelRemove();
              } else {
                onClose();
              }
            }
          }}
        >
          <motion.div
            className="cart-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-modal-title"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Header */}
            <div className="cart-modal-header">
              <div className="cart-modal-heading">
                <span className="cart-modal-eyebrow">
                  YOUR SELECTION
                </span>

                <h2 id="cart-modal-title">
                  Shopping Cart
                </h2>

                <p>
                  {cartCount}{" "}
                  {cartCount === 1 ? "item" : "items"} in your cart
                </p>
              </div>

              <button
                type="button"
                className="cart-modal-close"
                onClick={onClose}
                aria-label="Close shopping cart"
              >
                <X size={22} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="cart-modal-body">
              {cartItems.length === 0 ? (
                <div className="cart-empty">
                  <div className="cart-empty-icon">
                    <ShoppingCart
                      size={32}
                      strokeWidth={1.2}
                    />
                  </div>

                  <h3>Your cart is waiting</h3>

                  <p>
                    You haven't added any pieces yet.
                    Discover furniture designed to elevate
                    your space.
                  </p>

                  <button
                    type="button"
                    className="cart-continue-btn"
                    onClick={onClose}
                  >
                    Explore Collection
                    <ArrowRight size={17} />
                  </button>
                </div>
              ) : (
                <div className="cart-items-list">
                  {cartItems.map((item) => {
                    const quantity = item.quantity || 1;
                    const unitPrice = getPrice(item.price);

                    return (
                      <div
                        className="cart-item"
                        key={item.name}
                      >
                        <div className="cart-item-image">
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>

                        <div className="cart-item-details">
                          <h3>{item.name}</h3>

                          {item.description && (
                            <p className="cart-item-description">
                              {item.description}
                            </p>
                          )}

                          <span className="cart-item-price">
                            {formatPrice(unitPrice)} each
                          </span>

                          {/* Quantity Controls */}
                          <div className="cart-quantity-row">
                            <span className="cart-quantity-label">
                              Quantity
                            </span>

                            <div
                              className="cart-quantity-control"
                              aria-label={`Quantity for ${item.name}`}
                            >
                              <button
                                type="button"
                                className="cart-quantity-btn"
                                onClick={() =>
                                  handleQuantityChange(item, -1)
                                }
                                disabled={quantity <= 1}
                                aria-label={`Decrease ${item.name} quantity`}
                              >
                                <Minus size={14} />
                              </button>

                              <span
                                className="cart-quantity-value"
                                aria-live="polite"
                              >
                                {quantity}
                              </span>

                              <button
                                type="button"
                                className="cart-quantity-btn"
                                onClick={() =>
                                  handleQuantityChange(item, 1)
                                }
                                aria-label={`Increase ${item.name} quantity`}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Remove Product */}
                          <button
                            type="button"
                            className="cart-remove-btn"
                            onClick={() =>
                              requestRemove(item.name)
                            }
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <Trash2 size={14} />
                            Remove item
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="cart-item-total">
                          {formatPrice(unitPrice * quantity)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="cart-modal-footer">
                <div className="cart-subtotal-row">
                  <span>Subtotal</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>

                <p className="cart-shipping-note">
                  Shipping and any applicable taxes will be
                  discussed with our sales representative.
                </p>

                <button
                  type="button"
                  className="cart-checkout-btn"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </button>

                <button
                  type="button"
                  className="cart-continue-shopping"
                  onClick={onClose}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>

          {/* Remove Confirmation */}
          <AnimatePresence>
            {itemToRemove && (
              <motion.div
                className="cart-confirm-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) {
                    cancelRemove();
                  }
                }}
              >
                <motion.div
                  className="cart-confirm-modal"
                  role="alertdialog"
                  aria-modal="true"
                  aria-labelledby="remove-confirm-title"
                  aria-describedby="remove-confirm-description"
                  initial={{ opacity: 0, y: 15, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="cart-confirm-icon">
                    <Trash2 size={23} />
                  </div>

                  <h3 id="remove-confirm-title">
                    Remove this piece?
                  </h3>

                  <p id="remove-confirm-description">
                    Are you sure you want to remove{" "}
                    <strong>{itemToRemove}</strong> from your
                    shopping cart?
                  </p>

                  <div className="cart-confirm-actions">
                    <button
                      type="button"
                      className="cart-confirm-cancel"
                      onClick={cancelRemove}
                    >
                      Keep Item
                    </button>

                    <button
                      type="button"
                      className="cart-confirm-remove"
                      onClick={confirmRemove}
                    >
                      <Trash2 size={15} />
                      Remove
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
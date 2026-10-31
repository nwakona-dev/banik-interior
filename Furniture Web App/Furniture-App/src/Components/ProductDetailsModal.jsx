import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingCart, Check, ArrowUpRight } from "lucide-react";
import "../styles/product-details-modal.css";

const ProductDetailsModal = ({
  product,
  onClose,
  onAddToCart,
  isAdded,
}) => {
  useEffect(() => {
    if (!product) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="product-details-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="product-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-details-title"
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="product-details-close"
              onClick={onClose}
              aria-label="Close product details"
            >
              <X size={21} />
            </button>

            <div className="product-details-image">
              <img src={product.image} alt={product.name} />

              <span className="product-details-image-label">
                BANIK INTERIOR
              </span>
            </div>

            <div className="product-details-info">
              <p className="product-details-eyebrow">
                THE ART OF LIVING
              </p>

              <h2 id="product-details-title">{product.name}</h2>

              <p className="product-details-price">{product.price}</p>

              <div className="product-details-divider" />

              <p className="product-details-description">
                {product.description}
              </p>

              <p className="product-details-extra">
                Thoughtfully selected for refined living, this statement piece
                brings together timeless design, inviting comfort, and
                understated elegance.
              </p>

              <div className="product-details-features">
                <div>
                  <span className="feature-dot" />
                  <span>Timeless Design</span>
                </div>

                <div>
                  <span className="feature-dot" />
                  <span>Premium Style</span>
                </div>

                <div>
                  <span className="feature-dot" />
                  <span>Luxury Living</span>
                </div>
              </div>

              <button
                type="button"
                className={`product-details-cart-btn ${
                  isAdded ? "is-added" : ""
                }`}
                onClick={() => {
                  if (!isAdded) onAddToCart(product);
                }}
                disabled={isAdded}
              >
                {isAdded ? (
                  <>
                    <Check size={19} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={19} />
                    Add to Cart
                    <ArrowUpRight size={17} />
                  </>
                )}
              </button>

              <p className="product-details-note">
                A considered addition to your living space.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailsModal;
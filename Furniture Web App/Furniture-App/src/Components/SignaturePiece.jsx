
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import ProductDetailsModal from "./ProductDetailsModal";
import { apiRequest } from "../services/apiClient";
import "../App.css";

const headerVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
};

const slideVariants = (direction) => ({
  hidden: {
    opacity: 0,
    x: direction === "left" ? -60 : 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
});

const SignaturePieces = () => {
  const { addToCart, cartItems } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);

  // FORMAT PRICE
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  // FETCH FEATURED PRODUCTS FROM DATABASE
  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiRequest("/api/products/featured");

        const productsData = Array.isArray(response)
          ? response
          : response?.data || response?.products || [];

        if (isMounted) {
          const formattedProducts = productsData.map((product) => ({
            ...product,
            price: formatPrice(product.price),
            image: product.imageUrl,
          }));

          setProducts(formattedProducts);
        }
      } catch (err) {
        console.error("Failed to fetch featured products:", err);

        if (isMounted) {
          setError("Unable to load featured products. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFeaturedProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // VIEW PRODUCT DETAILS
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  // ADD PRODUCT TO CART
  const handleAddToCart = (product) => {
    const alreadyInCart = cartItems.some(
      (item) =>
        item.id === product.id ||
        item.name === product.name
    );

    if (alreadyInCart) return;

    addToCart(product);
  };

  // CHECK IF PRODUCT IS ALREADY IN CART
  const isProductAdded = (product) => {
    return cartItems.some(
      (item) =>
        item.id === product.id ||
        item.name === product.name
    );
  };

  return (
    <>
      <section className="signature-pieces">

        {/* SECTION HEADER */}
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={headerVariants}
        >
          <p className="section-label">
            Our Finest Selection
          </p>

          <h2 className="section-title">
            Signature Pieces
          </h2>
        </motion.div>

        {/* LOADING STATE */}
        {loading && (
          <p className="products-loading">
            Loading signature pieces...
          </p>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <p className="products-error">
            {error}
          </p>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && products.length === 0 && (
          <p className="products-empty">
            No featured products available at the moment.
          </p>
        )}

        {/* FEATURED PRODUCTS */}
        {!loading && !error && products.map((product, index) => {
          const isEven = index % 2 === 0;

          const imageDirection = isEven ? "left" : "right";
          const contentDirection = isEven ? "right" : "left";

          const isAdded = isProductAdded(product);

          return (
            <div
              key={product.id}
              className="signature-product"
            >

              {/* PRODUCT IMAGE */}
              <motion.div
                className="product-image"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={slideVariants(imageDirection)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>

              {/* PRODUCT CONTENT */}
              <motion.div
                className="product-content"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={slideVariants(contentDirection)}
              >
                <h3>{product.name}</h3>

                <p className="price">
                  {product.price}
                </p>

                <p className="description">
                  {product.description}
                </p>

                <div className="product-actions">

                  {/* VIEW DETAILS */}
                  <button
                    type="button"
                    className="view-details-btn"
                    onClick={() => handleViewDetails(product)}
                    aria-label={`View details for ${product.name}`}
                  >
                    View Details
                    <ArrowUpRight size={17} />
                  </button>

                  {/* ADD TO CART */}
                  <button
                    type="button"
                    className={`add-to-cart-btn ${
                      isAdded ? "is-added" : ""
                    }`}
                    onClick={() => handleAddToCart(product)}
                    disabled={isAdded}
                    aria-label={
                      isAdded
                        ? `${product.name} is already in your cart`
                        : `Add ${product.name} to cart`
                    }
                    title={isAdded ? "Already in cart" : "Add to cart"}
                  >
                    {isAdded ? (
                      <Check size={20} strokeWidth={1.8} />
                    ) : (
                      <ShoppingCart size={20} strokeWidth={1.8} />
                    )}
                  </button>

                </div>
              </motion.div>
            </div>
          );
        })}

      </section>

      {/* PRODUCT DETAILS MODAL */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={handleCloseDetails}
        onAddToCart={handleAddToCart}
        isAdded={
          selectedProduct
            ? isProductAdded(selectedProduct)
            : false
        }
      />
    </>
  );
};

export default SignaturePieces;

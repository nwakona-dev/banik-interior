import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ShoppingCart, Check, ArrowUpRight } from "lucide-react";

import { apiRequest } from "../services/apiClient";
import { useCart } from "../context/CartContext";

import Header from "../Components/Header";
import Footer from "../Components/Footer";
import ProductDetailsModal from "../Components/ProductDetailsModal";

import "../styles/collections.css";

const categories = [
  { label: "Bedroom", value: "BEDROOM" },
  { label: "Living Room", value: "SITTING" },
  { label: "Dining Room", value: "DINING" },
  { label: "Others", value: "OTHERS" },
];

const Collections = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { addToCart, cartItems } = useCart();

  const requestedCategory = searchParams.get("category");

  const initialCategory = categories.some(
    (category) => category.value === requestedCategory
  )
    ? requestedCategory
    : "BEDROOM";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Track images that have completely loaded.
  const [loadedImages, setLoadedImages] = useState({});

  // Keep the active tab synchronized with the URL.
  useEffect(() => {
    const validCategory = categories.some(
      (category) => category.value === requestedCategory
    );

    if (validCategory) {
      setActiveCategory(requestedCategory);
    } else {
      setActiveCategory("BEDROOM");
    }
  }, [requestedCategory]);

  // Fetch products from Spring Boot.
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/api/products");

        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Unable to load collections.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Change category and update URL.
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSearchParams({ category });
  };

  // Convert backend product response to the cart format.
  const prepareCartProduct = (product) => ({
    ...product,
    image: product.imageUrl,
    price: Number(product.price),
  });

  // Check whether a product is already in the cart.
  const isProductAdded = (product) => {
    return cartItems.some(
      (item) =>
        item.id === product.id ||
        item.name === product.name
    );
  };

  // Add product to cart.
  const handleAddToCart = (product) => {
    if (isProductAdded(product)) return;

    addToCart(prepareCartProduct(product));
  };

  // Open product details.
  const handleViewDetails = (product) => {
    setSelectedProduct(prepareCartProduct(product));
  };

  // Close product details.
  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  // Filter products by selected category.
  const filteredProducts = products.filter(
    (product) =>
      product.category === activeCategory &&
      product.published
  );

  const currentCategory = categories.find(
    (category) => category.value === activeCategory
  );

  // Mark an image as loaded only after it finishes loading.
  const handleImageLoaded = (productId) => {
    setLoadedImages((previous) => ({
      ...previous,
      [productId]: true,
    }));
  };

  // Handle image loading errors.
  const handleImageError = (event, productId) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = "/placeholder.png";

    setLoadedImages((previous) => ({
      ...previous,
      [productId]: true,
    }));
  };

  return (
    <>
      <div className="collections-page">
        <Header />

        {/* COLLECTION HERO */}
        <section className="collections-hero">
          <p className="collections-eyebrow">BANIK INTERIOR</p>

          <h1>Our Collections</h1>

          <p>
            Discover thoughtfully curated furniture designed
            to bring elegance, comfort and character into your space.
          </p>
        </section>

        <section className="collections-content">

          {/* CATEGORY TABS */}
          <div className="collections-tabs">
            {categories.map((category) => (
              <button
                key={category.value}
                type="button"
                className={
                  activeCategory === category.value
                    ? "collection-tab active"
                    : "collection-tab"
                }
                onClick={() =>
                  handleCategoryChange(category.value)
                }
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* CATEGORY HEADING */}
          <div className="collections-heading">
            <span>EXPLORE OUR FURNITURE</span>

            <h2>{currentCategory?.label} Collection</h2>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="collections-message">
              <p>Loading our collections...</p>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="collections-message error">
              <p>{error}</p>
            </div>
          )}

          {/* PRODUCTS */}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="collections-product-grid">
              {filteredProducts.map((product) => {
                const isAdded = isProductAdded(product);

                return (
                  <div
                    className="collections-product-card"
                    key={product.id}
                  >
                    {/* PRODUCT IMAGE */}
                    <div
                      className={`collections-product-image ${
                        loadedImages[product.id]
                          ? "image-loaded"
                          : "image-loading"
                      }`}
                    >
                      {!loadedImages[product.id] && (
                        <div className="image-placeholder" />
                      )}

                      <img
                        src={product.imageUrl || "/placeholder.png"}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        onLoad={() =>
                          handleImageLoaded(product.id)
                        }
                        onError={(event) =>
                          handleImageError(event, product.id)
                        }
                      />
                    </div>

                    {/* PRODUCT INFORMATION */}
                    <div className="collections-product-info">
                      <h3>{product.name}</h3>

                      <p>{product.description}</p>

                      <span className="collections-product-price">
                        {new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                        }).format(Number(product.price))}
                      </span>

                      {/* PRODUCT ACTIONS */}
                      <div className="collections-product-actions">

                        <button
                          type="button"
                          className="collections-view-btn"
                          onClick={() =>
                            handleViewDetails(product)
                          }
                          aria-label={`View details for ${product.name}`}
                        >
                          View Details
                          <ArrowUpRight size={17} />
                        </button>

                        <button
                          type="button"
                          className={`collections-cart-btn ${
                            isAdded ? "is-added" : ""
                          }`}
                          onClick={() =>
                            handleAddToCart(product)
                          }
                          disabled={isAdded}
                          aria-label={
                            isAdded
                              ? `${product.name} is already in your cart`
                              : `Add ${product.name} to cart`
                          }
                          title={
                            isAdded
                              ? "Already in cart"
                              : "Add to cart"
                          }
                        >
                          {isAdded ? (
                            <Check
                              size={20}
                              strokeWidth={1.8}
                            />
                          ) : (
                            <ShoppingCart
                              size={20}
                              strokeWidth={1.8}
                            />
                          )}
                        </button>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* EMPTY CATEGORY */}
          {!loading &&
            !error &&
            filteredProducts.length === 0 && (
              <div className="collections-message">
                <h3>Coming Soon</h3>

                <p>
                  We are currently curating our{" "}
                  {currentCategory?.label?.toLowerCase()} collection.
                  Check back soon for new arrivals.
                </p>
              </div>
            )}

        </section>

        <Footer />
      </div>

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

export default Collections;

import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  Package,
  Star,
} from "lucide-react";

import {
  getAllProducts,
  deleteProduct,
  updatePublishedStatus,
} from "../../services/productService";

import "../../styles/admin.css";

const formatPrice = (price) => {
  const amount = Number(price);

  if (!Number.isFinite(amount)) return "₦0";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getCategoryLabel = (category) => {
  if (!category) return "Others";

  return category
    .toString()
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [filter, setFilter] = useState("all");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAllProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handlePublishToggle = async (product) => {
    setBusyId(product.id);
    setError("");
    setNotice("");

    try {
      await updatePublishedStatus(
        product.id,
        !product.published
      );

      setNotice(
        product.published
          ? "Product moved back to drafts."
          : "Product published successfully."
      );

      await loadProducts();
    } catch (err) {
      setError(
        err.message || "Could not update product status."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setBusyId(product.id);
    setError("");
    setNotice("");

    try {
      await deleteProduct(product.id);

      setProducts((current) =>
        current.filter((item) => item.id !== product.id)
      );

      setNotice("Product deleted successfully.");
    } catch (err) {
      setError(err.message || "Could not delete product.");
    } finally {
      setBusyId(null);
    }
  };

  const filteredProducts = products.filter((product) => {
    if (filter === "published") return product.published;
    if (filter === "drafts") return !product.published;

    return true;
  });

  return (
    <section className="admin-products-page">
      <div className="admin-welcome-row">
        <div>
          <p className="admin-eyebrow">INVENTORY MANAGEMENT</p>
          <h2>Your Products</h2>
          <p className="admin-muted">
            Create, edit, publish, and manage your furniture
            collection.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="admin-primary-button"
          id="p-but"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {error && (
        <div
          className="admin-alert admin-alert-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {notice && (
        <div
          className="admin-alert admin-alert-success"
          role="status"
        >
          {notice}
        </div>
      )}

      <div className="admin-project-toolbar">
        <div
          className="admin-filter-group"
          aria-label="Filter products"
        >
          {[
            ["all", "All Products"],
            ["published", "Published"],
            ["drafts", "Drafts"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`admin-filter-button ${
                filter === value ? "selected" : ""
              }`}
              onClick={() => setFilter(value)}
            >
              {label}
              {value === "all" && ` (${products.length})`}
              {value === "published" &&
                ` (${products.filter((p) => p.published).length})`}
              {value === "drafts" &&
                ` (${products.filter((p) => !p.published).length})`}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="admin-secondary-button"
          onClick={loadProducts}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? "admin-spin" : ""}
          />
          Refresh
        </button>
      </div>

      <section className="admin-panel">
        {loading ? (
          <div className="admin-empty-state">
            <RefreshCw size={24} className="admin-spin" />
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="admin-empty-state">
            <Package size={34} />
            <h3>No products found</h3>
            <p>
              {filter === "published"
                ? "You have no published products yet."
                : filter === "drafts"
                  ? "You have no draft products."
                  : "Add your first furniture product to get started."}
            </p>

            {filter === "all" && (
              <Link
                to="/admin/products/new"
                className="admin-primary-button"
              >
                <Plus size={18} />
                Add Your First Product
              </Link>
            )}
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="admin-project-cell">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={`${product.name || "Product"} preview`}
                            className="admin-project-thumb"
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";

                              event.currentTarget.nextElementSibling?.removeAttribute(
                                "hidden"
                              );
                            }}
                          />
                        ) : null}

                        <div
                          className="admin-project-thumb admin-project-placeholder"
                          hidden={Boolean(product.imageUrl)}
                        >
                          <Package size={20} />
                        </div>

                        <div className="admin-product-details">
                          <strong>
                            {product.name || "Untitled Product"}
                          </strong>

                          {product.featured && (
                            <span className="admin-featured-label">
                              <Star size={12} />
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      {getCategoryLabel(product.category)}
                    </td>

                    <td className="admin-product-price">
                      {formatPrice(product.price)}
                    </td>

                    <td>
                      <span
                        className={
                          Number(product.stockQuantity) > 0
                            ? "admin-stock-in"
                            : "admin-stock-out"
                        }
                      >
                        {Number(product.stockQuantity) || 0}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`admin-status ${
                          product.published
                            ? "is-published"
                            : "is-draft"
                        }`}
                      >
                        {product.published
                          ? "Published"
                          : "Draft"}
                      </span>
                    </td>

                    <td>{formatDate(product.updatedAt)}</td>

                    <td>
                      <div className="admin-action-group">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="admin-icon-button"
                          aria-label={`Edit ${product.name}`}
                          title="Edit product"
                        >
                          <Pencil size={17} />
                        </Link>

                        <button
                          type="button"
                          className="admin-icon-button"
                          onClick={() =>
                            handlePublishToggle(product)
                          }
                          disabled={busyId === product.id}
                          aria-label={
                            product.published
                              ? "Unpublish product"
                              : "Publish product"
                          }
                          title={
                            product.published
                              ? "Move to drafts"
                              : "Publish product"
                          }
                        >
                          {product.published ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>

                        <button
                          type="button"
                          className="admin-icon-button danger"
                          onClick={() => handleDelete(product)}
                          disabled={busyId === product.id}
                          aria-label={`Delete ${product.name}`}
                          title="Delete product"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}

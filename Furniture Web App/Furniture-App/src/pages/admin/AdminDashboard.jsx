
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Eye,
  EyeOff,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { getAllProducts } from "../../services/productService";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getAllProducts()
      .then((data) => {
        if (active) {
          setProducts(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Could not load products.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const publishedCount = products.filter(
    (product) => product.published
  ).length;

  const draftCount = products.length - publishedCount;

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === "") {
      return "—";
    }

    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }).format(Number(price));
  };

  const recentProducts = [...products]
    .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
    .slice(0, 5);

  return (
    <section>
      {/* Dashboard Welcome */}
      <div className="admin-welcome-row">
        <div>
          <p className="admin-eyebrow">OVERVIEW</p>

          <h2>Welcome to your dashboard</h2>

          <p className="admin-muted">
            Manage your Banik Interior products and collections from one place.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="admin-primary-button"
          id="p-but"
        >
          <Plus size={18} />
          New Product
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="admin-alert admin-alert-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Dashboard Statistics */}
      <div className="admin-stats-grid">
        <article className="admin-stat-card">
          <div className="admin-stat-icon">
            <Package size={21} />
          </div>

          <p>Total Products</p>

          <strong>
            {loading ? "—" : products.length}
          </strong>

          <span>All products in your store</span>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-icon published">
            <Eye size={21} />
          </div>

          <p>Published</p>

          <strong>
            {loading ? "—" : publishedCount}
          </strong>

          <span>Visible to your customers</span>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-icon draft">
            <EyeOff size={21} />
          </div>

          <p>Drafts</p>

          <strong>
            {loading ? "—" : draftCount}
          </strong>

          <span>Not visible in your store</span>
        </article>
      </div>

      {/* Recent Products */}
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h3>Recent Products</h3>

            <p>
              Review the latest products added to your store.
            </p>
          </div>

          <Link
            to="/admin/products"
            className="admin-text-link"
          >
            View all <ArrowUpRight size={16} />
          </Link>
        </div>

        {loading ? (
          <p className="admin-empty-state">
            Loading products...
          </p>
        ) : products.length === 0 ? (
          <div className="admin-empty-state">
            <Package size={30} />

            <h4>No products yet</h4>

            <p>
              Add your first furniture product to get started.
            </p>

            <Link
              to="/admin/products/new"
              className="admin-primary-button"
            >
              <Plus size={18} />
              Create Product
            </Link>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {recentProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.name}</strong>

                      <span className="admin-table-subtext">
                        {product.description || "No description available"}
                      </span>
                    </td>

                    <td>
                      {product.category || "Others"}
                    </td>

                    <td>
                      {formatPrice(product.price)}
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

                    <td>
                      <Link
                        className="admin-table-action"
                        to={`/admin/products/${product.id}/edit`}
                      >
                        Edit
                      </Link>
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

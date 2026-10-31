
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ExternalLink,
  LogOut,
  X,
  ShoppingBag,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function AdminSidebar({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/admin/login", { replace: true });
    }
  };

  const navClass = ({ isActive }) =>
    `admin-nav-link${isActive ? " active" : ""}`;

  return (
    <>
      {open && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

      <aside
        className={`admin-sidebar${open ? " sidebar-open" : ""}`}
      >
        {/* BRAND */}
        <div className="admin-brand">
          <div className="admin-brand-mark">
            <ShoppingBag size={21} />
          </div>

          <div className="admin-brand-text">
            <strong>Banik Interior</strong>
            <span>Store Management</span>
          </div>

          <button
            type="button"
            className="admin-icon-button admin-sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION LABEL */}
        <div className="admin-sidebar-label">
          WORKSPACE
        </div>

        {/* NAVIGATION LINKS */}
        <nav
          className="admin-navigation"
          aria-label="Admin navigation"
        >
          <NavLink
            to="/admin"
            end
            className={navClass}
            onClick={onClose}
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/products"
            end
            className={navClass}
            onClick={onClose}
          >
            <Package size={19} />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/admin/products/new"
            className={navClass}
            onClick={onClose}
          >
            <ShoppingBag size={19} />
            <span>Add Product</span>
          </NavLink>
        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="admin-sidebar-bottom">
          <a
            className="admin-nav-link"
            href="/"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={19} />
            <span>View Store</span>
          </a>

          <button
            type="button"
            className="admin-nav-link admin-logout"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

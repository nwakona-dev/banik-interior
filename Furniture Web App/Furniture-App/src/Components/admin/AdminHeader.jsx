import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const pageTitles = {
  "/admin": "Dashboard",
  "/admin/projects": "Projects",
};

export default function AdminHeader({ onMenuClick }) {
  const location = useLocation();
  const { user } = useAuth();

  let title = pageTitles[location.pathname] || "Project editor";

  if (location.pathname === "/admin/projects/new") {
    title = "Create project";
  } else if (/^\/admin\/projects\/[^/]+\/edit$/.test(location.pathname)) {
    title = "Edit project";
  }

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button
          type="button"
          className="admin-icon-button admin-menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        <div>
          <span className="admin-breadcrumb">Admin / Portfolio</span>
          <h1>{title}</h1>
        </div>
      </div>

      <div className="admin-user">
        <div className="admin-avatar">
          {(user?.username || "A").charAt(0).toUpperCase()}
        </div>
        <div className="admin-user-details">
          <strong>{user?.username || "Administrator"}</strong>
          <span>Administrator</span>
        </div>
      </div>
    </header>
  );
}

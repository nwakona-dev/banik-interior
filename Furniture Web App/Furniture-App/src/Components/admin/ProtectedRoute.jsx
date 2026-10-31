
    import { Navigate, Outlet, useLocation } from "react-router-dom";
    import { useAuth } from "../../context/AuthContext";

    export default function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
        <div className="admin-loading">
            <div className="admin-spinner" />
            <p>Checking admin session...</p>
        </div>
        );
    }

    if (!isAuthenticated) {
        return (
        <Navigate
            to="/admin/login"
            replace
            state={{ from: location }}
        />
        );
    }

    return <Outlet />;
    }

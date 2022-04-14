import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../customHooks/useAuth";

export function RequireAuth() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}

import { Navigate, useLocation } from "react-router-dom";
import { path } from "../config/routes";
import { useAuth } from "../hooks/useRedux";

/**
 * ProtectedRoute
 * Props:
 * - children: React node
 * - allowedRoles: string or array of strings (e.g. 'faculty' or ['faculty'])
 *
 * Behavior:
 * - If not authenticated -> redirect to login
 * - If authenticated but user's role not in allowedRoles -> redirect to their dashboard
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={"/"} state={{ from: location }} replace />;
  }

  // If allowedRoles not provided, allow any authenticated user
  if (allowedRoles) {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const userRole = user?.role?.toString?.().toLowerCase();

    if (
      !userRole ||
      !roles.map((r) => r.toString().toLowerCase()).includes(userRole)
    ) {
      // Redirect to appropriate dashboard based on user role
      if (userRole === "faculty") {
        return <Navigate to={path.faculty.DASHBOARD} replace />;
      }
      if (userRole === "student") {
        return <Navigate to={path.student.DASHBOARD} replace />;
      }

      // Fallback to landing page
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

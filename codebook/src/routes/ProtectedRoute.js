import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute component - Protects routes that require authentication
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string} props.requiredRole - Optional role requirement (e.g., 'admin', 'user')
 * @returns {React.ReactNode} - Protected children or redirect to login
 */
export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const userRole = sessionStorage.getItem("userRole") || "user";

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If role is required, check if user has the required role
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate page based on user role
    // For now, redirect to products page (can be customized later)
    return <Navigate to="/products" />;
  }

  return children;
};

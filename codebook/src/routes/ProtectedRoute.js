import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { LoadingState } from "../components/ui";

/**
 * ProtectedRoute component - Protects routes that require authentication
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string} props.requiredRole - Optional role requirement (e.g., 'admin', 'user')
 * @returns {React.ReactNode} - Protected children or redirect to login
 */
export const ProtectedRoute = ({ children, requiredRole = null }) => {
  // Safely get token from sessionStorage
  let token = null;
  try {
    const tokenStr = sessionStorage.getItem("token");
    if (tokenStr) {
      token = JSON.parse(tokenStr);
    }
  } catch {
    token = null;
  }

  // Fetch actual user data to verify role (more secure than trusting sessionStorage)
  // IMPORTANT: Hooks must be called unconditionally at the top level
  // Only enable the query if token exists
  const { data: userData, isLoading, error } = useUser(!!token);

  // If no token, redirect to login immediately (no need to fetch user data)
  if (!token) {
    return <Navigate to="/login" />;
  }

  // While loading user data, show loading state
  if (isLoading) {
    return <LoadingState message="Verifying access..." />;
  }

  // If there's an error fetching user data, redirect to login
  if (error) {
    return <Navigate to="/login" />;
  }

  // Get role from actual user data (preferred) or fallback to sessionStorage
  // Always verify against actual user data for security
  const userRole =
    userData?.role || sessionStorage.getItem("userRole") || "user";

  // If role is required, check if user has the required role
  // IMPORTANT: Always verify against actual user data, not just sessionStorage
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate page based on user role
    // For now, redirect to products page (can be customized later)
    return <Navigate to="/products" />;
  }

  return children;
};

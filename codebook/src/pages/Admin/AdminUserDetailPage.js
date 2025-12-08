/**
 * AdminUserDetailPage Component
 *
 * User detail page for admin panel.
 * Displays full user information including orders and account details.
 * Uses React Query for efficient data fetching and caching.
 *
 * Features:
 * - Full user details view
 * - User account information
 * - Registration date and role
 * - Real-time updates with cache invalidation
 */

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTitle } from "../../hooks/useTitle";
import { useUser } from "../../hooks/useAdmin";
import { AdminLayout, useAdminLayout } from "../../components/Layouts/Admin";
import {
  PageHeader,
  StatusBadge,
  LoadingState,
  ErrorState,
  Card,
} from "../../components/ui";
import { formatDateLong } from "../../utils/formatDate";
import { isDemoAccount } from "../../utils/demoAccount";

// Inner component that uses the AdminLayout context
const AdminUserDetailContent = () => {
  const { toggleSidebar } = useAdminLayout();
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useUser(userId);

  // Show error toast if API call fails
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to load user details", {
        closeButton: true,
        position: "bottom-right",
      });
    }
  }, [error]);

  // Check if this is a demo account (protected from edit/delete)
  const demoAccount = user ? isDemoAccount(user.email) : false;

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Page Header */}
      <PageHeader
        title="User Details"
        description="View user account information"
        onToggleSidebar={toggleSidebar}
        showBackButton={true}
        onBack={() => navigate("/admin/users")}
      />

      {/* Loading State */}
      {isLoading && <LoadingState message="Loading user details..." />}

      {/* Error State */}
      {error && !isLoading && (
        <ErrorState message={error.message || "Failed to load user details"} />
      )}

      {/* User Details */}
      {!isLoading && !error && user && (
        <div className="space-y-6">
          {/* User Information Card */}
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Account Information
                </h2>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      User ID
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-white font-mono">
                      {user.id}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Name
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-white">
                      {user.name || "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-white">
                      {user.email || "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Role
                    </dt>
                    <dd className="mt-1">
                      <StatusBadge status={user.role || "user"} />
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Account Status */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Account Status
                </h2>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Registered
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-white">
                      {formatDateLong(user.createdAt)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Verified
                    </dt>
                    <dd className="mt-1">
                      <StatusBadge
                        status={user.verified ? "verified" : "unverified"}
                        customLabels={{
                          verified: "Yes",
                          unverified: "No",
                        }}
                      />
                    </dd>
                  </div>
                  {demoAccount && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Account Type
                      </dt>
                      <dd className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                          Demo Account (Protected)
                        </span>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/admin/users/${user.id}/edit`)}
              disabled={demoAccount}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                demoAccount
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
              }`}
              title={demoAccount ? "Demo accounts cannot be edited" : "Edit user"}
            >
              Edit User
            </button>
            <button
              onClick={() => navigate("/admin/users")}
              className="px-4 py-2 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Back to Users
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminUserDetailPage = () => {
  useTitle("Admin User Details");
  const navigate = useNavigate();

  // Check if user is admin before rendering
  useEffect(() => {
    const userRole = sessionStorage.getItem("userRole");
    if (userRole !== "admin") {
      toast.error("Admin access required", {
        closeButton: true,
        position: "bottom-right",
      });
      navigate("/products");
    }
  }, [navigate]);

  return (
    <AdminLayout>
      <AdminUserDetailContent />
    </AdminLayout>
  );
};


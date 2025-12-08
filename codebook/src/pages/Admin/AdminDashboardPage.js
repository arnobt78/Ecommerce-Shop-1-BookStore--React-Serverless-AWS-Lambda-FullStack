/**
 * AdminDashboardPage Component
 *
 * Main admin dashboard overview page displaying key metrics and recent orders.
 * Uses React Query for efficient data fetching and caching.
 *
 * Features:
 * - Total orders, revenue, products, users metrics
 * - Recent orders widget
 * - Order status distribution
 * - Real-time data updates
 */

import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTitle } from "../../hooks/useTitle";
import { useAdminStats } from "../../hooks/useAdmin";
import { AdminLayout, useAdminLayout } from "../../components/Layouts/Admin";
import { AdminMetricsCard } from "./components/AdminMetricsCard";
import { AdminRecentOrders } from "./components/AdminRecentOrders";
import { AdminStatsSkeleton } from "./components/AdminStatsSkeleton";
import { PageHeader, ErrorState, Card } from "../../components/ui";

// Inner component that uses the AdminLayout context
const AdminDashboardContent = () => {
  const { toggleSidebar } = useAdminLayout();
  const { data: stats, isLoading, error } = useAdminStats();

  // Show error toast if API call fails (use useEffect to avoid render-time side effects)
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to load admin statistics", {
        closeButton: true,
        position: "bottom-right",
      });
    }
  }, [error]);

  // Calculate additional metrics from stats
  const metrics = useMemo(() => {
    if (!stats) return null;

    return {
      totalOrders: stats.totalOrders || 0,
      totalRevenue: stats.totalRevenue || 0,
      totalProducts: stats.totalProducts || 0,
      totalUsers: stats.totalUsers || 0,
      averageOrderValue:
        stats.totalOrders > 0
          ? (stats.totalRevenue / stats.totalOrders).toFixed(2)
          : 0,
      recentOrders: stats.recentOrders || [],
      allOrders: stats.allOrders || [],
      ordersByStatus: stats.ordersByStatus || {},
    };
  }, [stats]);

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Page Header */}
      <PageHeader
        title="Dashboard Overview"
        description="Key metrics and recent activity"
        onToggleSidebar={toggleSidebar}
      />

      {/* Loading State */}
      {isLoading && <AdminStatsSkeleton />}

      {/* Error State */}
      {error && !isLoading && (
        <ErrorState
          message={error.message || "Failed to load dashboard data"}
        />
      )}

      {/* Metrics Cards */}
      {!isLoading && !error && metrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AdminMetricsCard
              title="Total Orders"
              value={metrics.totalOrders}
              icon="bi-cart-check"
              color="blue"
              subtitle="All time orders"
            />
            <AdminMetricsCard
              title="Total Revenue"
              value={`$${metrics.totalRevenue.toLocaleString()}`}
              icon="bi-currency-dollar"
              color="green"
              subtitle="Total sales"
            />
            <AdminMetricsCard
              title="Total Products"
              value={metrics.totalProducts}
              icon="bi-box-seam"
              color="purple"
              subtitle="Active products"
            />
            <AdminMetricsCard
              title="Total Users"
              value={metrics.totalUsers}
              icon="bi-people"
              color="orange"
              subtitle="Registered users"
            />
          </div>

          {/* Additional Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminMetricsCard
              title="Average Order Value"
              value={`$${metrics.averageOrderValue}`}
              icon="bi-graph-up"
              color="indigo"
              subtitle="Per order average"
            />
            <Card className="p-4 sm:p-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Orders by Status
              </h3>
              <div className="space-y-2">
                {Object.keys(metrics.ordersByStatus).length > 0 ? (
                  Object.entries(metrics.ordersByStatus).map(
                    ([status, count]) => (
                      <div
                        key={status}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {status}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {count}
                        </span>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No status data available
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Recent Orders */}
          <AdminRecentOrders orders={metrics.allOrders || []} />
        </>
      )}
    </div>
  );
};

export const AdminDashboardPage = () => {
  useTitle("Admin Dashboard");
  const navigate = useNavigate();

  // Check if user is admin before fetching data
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
      <AdminDashboardContent />
    </AdminLayout>
  );
};

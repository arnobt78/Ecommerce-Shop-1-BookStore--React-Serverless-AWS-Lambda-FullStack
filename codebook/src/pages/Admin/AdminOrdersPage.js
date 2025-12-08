/**
 * AdminOrdersPage Component
 *
 * Orders management page for admin panel.
 * Displays all orders in a table with search, filters, and status update.
 * Uses React Query for efficient data fetching and caching.
 *
 * Features:
 * - Orders list table with search and filters
 * - Status update functionality
 * - View order details
 * - Real-time updates with cache invalidation
 */

import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useTitle } from "../../hooks/useTitle";
import {
  useAllOrders,
  useUpdateOrderStatus,
  useAllUsers,
} from "../../hooks/useAdmin";
import { AdminLayout, useAdminLayout } from "../../components/Layouts/Admin";
import { formatPrice } from "../../utils/formatPrice";
import { formatDateLong } from "../../utils/formatDate";
import {
  SortableTable,
  PageHeader,
  SearchFilterBar,
  StatusBadge,
  LoadingState,
  ErrorState,
  EmptyState,
  Card,
  ResultsCount,
} from "../../components/ui";

// Helper function to format date for two-line display
const formatDateTwoLines = (dateString) => {
  if (!dateString) return { date: "N/A", time: "" };
  try {
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timePart = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date: datePart, time: timePart };
  } catch {
    return { date: "N/A", time: "" };
  }
};

// Inner component that uses the AdminLayout context
const AdminOrdersContent = () => {
  const { toggleSidebar } = useAdminLayout();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: orders, isLoading, error } = useAllOrders();
  const { data: users } = useAllUsers(); // Fetch all users to enrich order data
  const updateStatusMutation = useUpdateOrderStatus();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [filterStatus, setFilterStatus] = useState(
    searchParams.get("status") || "all"
  );

  // Create a user lookup map by userId for enriching order data
  const userLookup = useMemo(() => {
    if (!users) return {};
    const lookup = {};
    users.forEach((user) => {
      lookup[user.id] = user;
    });
    return lookup;
  }, [users]);

  // Enrich orders with user data from users table (for orders missing name)
  const enrichedOrders = useMemo(() => {
    if (!orders) return [];
    return orders.map((order) => {
      // If order doesn't have user name but we have user data in lookup, enrich it
      const userFromLookup = userLookup[order.userId || order.user?.id];
      if (userFromLookup && (!order.user?.name || order.user?.name === "")) {
        return {
          ...order,
          user: {
            ...order.user,
            name: userFromLookup.name || order.user?.name || "",
            email: order.user?.email || userFromLookup.email || "",
            id: order.userId || order.user?.id || userFromLookup.id,
          },
        };
      }
      return order;
    });
  }, [orders, userLookup]);

  // Sync search params with state
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (filterStatus !== "all") params.set("status", filterStatus);
    setSearchParams(params, { replace: true });
  }, [searchQuery, filterStatus, setSearchParams]);

  // Show error toast if API call fails
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to load orders", {
        closeButton: true,
        position: "bottom-right",
      });
    }
  }, [error]);

  // Filter orders based on search query and status filter
  const filteredOrders = useMemo(() => {
    if (!enrichedOrders) return [];

    let filtered = [...enrichedOrders];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (order) =>
          order.id?.toLowerCase().includes(query) ||
          order.user?.name?.toLowerCase().includes(query) ||
          order.user?.email?.toLowerCase().includes(query) ||
          order.userId?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (order) => (order.status || "pending") === filterStatus
      );
    }

    return filtered;
  }, [enrichedOrders, searchQuery, filterStatus]);

  // Handle status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ orderId, status: newStatus });
    } catch (error) {
      // Error toast is handled by the mutation hook
      console.error("Status update error:", error);
    }
  };

  // Define table columns configuration
  const tableColumns = [
    {
      key: "id",
      label: "Order ID",
      sortable: true,
      className: "",
    },
    {
      key: "user",
      label: "Customer",
      sortable: true,
      sortFn: (a, b) => {
        const aName = a.user?.name || a.user?.email || "";
        const bName = b.user?.name || b.user?.email || "";
        return aName.localeCompare(bName);
      },
      className: "",
    },
    {
      key: "amount_paid",
      label: "Amount",
      sortable: true,
      sortFn: (a, b) => Number(a.amount_paid || 0) - Number(b.amount_paid || 0),
      className: "",
    },
    {
      key: "quantity",
      label: "Items",
      sortable: true,
      sortFn: (a, b) => Number(a.quantity || 0) - Number(b.quantity || 0),
      className: "",
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      sortFn: (a, b) => {
        const aStatus = (a.status || "pending").toLowerCase();
        const bStatus = (b.status || "pending").toLowerCase();
        return aStatus.localeCompare(bStatus);
      },
      className: "",
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      sortFn: (a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateA - dateB;
      },
      className: "",
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      className: "",
    },
  ];

  // Available status options for filter dropdown
  const filterStatusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "refunded", label: "Refunded" }, // Added refunded status option
  ];

  // Status options for status badge select (without "all")
  const statusOptions = filterStatusOptions.filter(
    (opt) => opt.value !== "all"
  );

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Page Header */}
      <PageHeader
        title="Orders Management"
        description="Manage all orders in your store"
        onToggleSidebar={toggleSidebar}
      />

      {/* Loading State */}
      {isLoading && <LoadingState message="Loading orders..." />}

      {/* Error State */}
      {error && !isLoading && (
        <ErrorState message={error.message || "Failed to load orders"} />
      )}

      {/* Orders Table */}
      {!isLoading && !error && (
        <Card className="p-0">
          {/* Search and Filter Bar */}
          <SearchFilterBar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by order ID, customer name, or email..."
            filterValue={filterStatus}
            onFilterChange={setFilterStatus}
            filterOptions={filterStatusOptions}
          >
            <ResultsCount
              filteredCount={filteredOrders.length}
              totalCount={enrichedOrders?.length || 0}
              entityName="orders"
            />
          </SearchFilterBar>

          {/* Orders Table */}
          {filteredOrders.length === 0 ? (
            <EmptyState
              message={
                searchQuery || filterStatus !== "all"
                  ? "No orders found matching your filters"
                  : "No orders available"
              }
            />
          ) : (
            <SortableTable
              data={filteredOrders}
              columns={tableColumns}
              defaultSortColumn="createdAt"
              defaultSortDirection="desc"
              renderRow={(order, index) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-4 min-w-[200px] sm:min-w-[250px]">
                    <span className="text-sm font-medium text-gray-900 dark:text-white break-words">
                      {order.id || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {order.user?.name || order.user?.email || "N/A"}
                      </div>
                      {order.user?.email && order.user?.name && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {order.user.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${formatPrice(order.amount_paid)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {order.quantity || 0}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <StatusBadge
                      status={order.status || "pending"}
                      asSelect={true}
                      onChange={(newStatus) =>
                        handleStatusUpdate(order.id, newStatus)
                      }
                      options={statusOptions.filter(
                        (opt) => opt.value !== "all"
                      )}
                      disabled={updateStatusMutation.isPending}
                    />
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex flex-col">
                      {(() => {
                        const { date, time } = formatDateTwoLines(
                          order.createdAt
                        );
                        return (
                          <>
                            <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {date}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              at {time}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        aria-label="View order details"
                      >
                        <span className="bi-eye"></span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            />
          )}
        </Card>
      )}
    </div>
  );
};

export const AdminOrdersPage = () => {
  useTitle("Admin Orders");
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
      <AdminOrdersContent />
    </AdminLayout>
  );
};

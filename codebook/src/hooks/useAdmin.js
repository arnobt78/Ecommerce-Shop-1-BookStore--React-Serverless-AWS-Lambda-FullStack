/**
 * React Query hooks for admin-related API calls
 * Provides automatic caching, deduplication, and loading states for admin operations
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllOrders,
  getAllProducts,
  getAllUsers,
  getAdminStats,
  createProduct,
  updateProduct,
  deleteProduct,
  migrateFeaturedProducts,
  migrateFeaturedToNumber,
  updateOrderStatus,
  getOrderById,
  refundOrder,
  generateShippingLabel,
  addTrackingNumber,
  updateUser,
  deleteUser,
  getUserById,
  getActivityLogs,
} from "../services/adminService";
import {
  sendShippingNotificationEmail,
  sendDeliveryConfirmationEmail,
  sendOrderCanceledEmail,
  sendOrderRefundedEmail,
  sendAdminRefundProcessedEmail,
  sendAdminLowStockEmail,
  sendAdminOutOfStockEmail,
} from "../services/emailService";
import {
  invalidateAfterProductChange,
  invalidateAfterOrderStatusUpdate,
} from "../utils/queryInvalidation";
import { toast } from "react-toastify";

/**
 * Hook to fetch admin dashboard statistics
 * Only fetches if user is authenticated and has admin role
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with data, loading, error states
 */
export function useAdminStats(enabled = true) {
  // Check if user is logged in and is admin
  const hasToken =
    typeof window !== "undefined" && sessionStorage.getItem("token");
  const userRole =
    typeof window !== "undefined" ? sessionStorage.getItem("userRole") : null;
  const isAdmin = userRole === "admin";

  return useQuery({
    queryKey: ["admin-stats"], // Cache key for admin stats
    queryFn: getAdminStats, // API call function
    enabled: enabled && !!hasToken && isAdmin, // Only fetch if enabled, logged in, and admin
    staleTime: Infinity, // Data never becomes stale automatically - only invalidated manually
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1, // Retry once on failure
    // refetchOnMount: true allows refetching when data is stale (invalidated)
    // With staleTime: Infinity, data is only stale when manually invalidated
    // So: Normal visits use cache, after invalidation it refetches
    refetchOnMount: true, // Refetch if data is stale (invalidated) - won't refetch if fresh
  });
}

/**
 * Hook to fetch all orders (admin only)
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with data, loading, error states
 */
export function useAllOrders(enabled = true) {
  const hasToken =
    typeof window !== "undefined" && sessionStorage.getItem("token");
  const userRole =
    typeof window !== "undefined" ? sessionStorage.getItem("userRole") : null;
  const isAdmin = userRole === "admin";

  return useQuery({
    queryKey: ["admin-orders"], // Cache key for all orders
    queryFn: getAllOrders, // API call function
    enabled: enabled && !!hasToken && isAdmin, // Only fetch if enabled, logged in, and admin
    staleTime: Infinity, // Data never becomes stale automatically - only invalidated manually
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1, // Retry once on failure
    // refetchOnMount: true allows refetching when data is stale (invalidated)
    // With staleTime: Infinity, data is only stale when manually invalidated
    // So: Normal visits use cache, after invalidation it refetches
    refetchOnMount: true, // Refetch if data is stale (invalidated) - won't refetch if fresh
  });
}

/**
 * Hook to fetch all products (admin view)
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with data, loading, error states
 */
export function useAllProducts(enabled = true) {
  const hasToken =
    typeof window !== "undefined" && sessionStorage.getItem("token");
  const userRole =
    typeof window !== "undefined" ? sessionStorage.getItem("userRole") : null;
  const isAdmin = userRole === "admin";

  return useQuery({
    queryKey: ["admin-products"], // Cache key for all products
    queryFn: getAllProducts, // API call function
    enabled: enabled && !!hasToken && isAdmin, // Only fetch if enabled, logged in, and admin
    staleTime: Infinity, // Data never becomes stale automatically - only invalidated manually
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1, // Retry once on failure
    refetchOnMount: true, // Refetch if data is stale (invalidated) - won't refetch if fresh
    // Force refetch when window regains focus (helps catch updates from other tabs/windows)
    refetchOnWindowFocus: false, // Disable to prevent unnecessary refetches
    // Refetch when network reconnects (helps catch updates after connection issues)
    refetchOnReconnect: true,
  });
}

/**
 * Hook to create a new product (admin only)
 * Automatically invalidates product queries after successful creation
 * @returns {Object} Mutation object with mutate function and loading/error states
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct, // API call function
    onSuccess: (data) => {
      // Invalidate all product-related queries to refetch fresh data
      invalidateAfterProductChange(queryClient);
      
      // Invalidate activity logs to show new log entry
      queryClient.invalidateQueries({ queryKey: ["admin-activity-logs"] });

      // Show success toast
      toast.success("Product created successfully", {
        closeButton: true,
        position: "bottom-right",
      });

      // Check for low stock and send admin alert (async, don't block)
      const stock = data?.stock;
      const lowStockThreshold = data?.lowStockThreshold || 10; // Default threshold: 10
      if (stock !== undefined) {
        if (stock === 0) {
          // Send out-of-stock alert if stock is 0
          sendAdminOutOfStockEmail({
            productId: data?.id,
            productName: data?.name || "Product",
          }).catch((emailError) => {
            console.error(
              "Failed to send out-of-stock alert email:",
              emailError
            );
          });
        } else if (stock <= lowStockThreshold) {
          // Send low stock alert if stock is below threshold but not 0
          sendAdminLowStockEmail({
            productId: data?.id,
            productName: data?.name || "Product",
            currentStock: stock,
            lowStockThreshold,
          }).catch((emailError) => {
            console.error("Failed to send low stock alert email:", emailError);
          });
        }
      }
    },
    onError: (error) => {
      // Show error toast
      toast.error(error.message || "Failed to create product", {
        closeButton: true,
        position: "bottom-right",
      });
    },
  });
}

/**
 * Hook to update an existing product (admin only)
 * Automatically invalidates product queries after successful update
 * @returns {Object} Mutation object with mutate function and loading/error states
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, updates }) => updateProduct(productId, updates), // API call function
    onSuccess: (data, variables) => {
      // Debug logging to verify update response
      console.log("✅ useUpdateProduct - Mutation success:", {
        productId: variables.productId,
        updatesSent: variables.updates,
        dataReceived: data,
        stock: data?.stock,
        stockType: typeof data?.stock,
        lowStockThreshold: data?.lowStockThreshold,
        lowStockThresholdType: typeof data?.lowStockThreshold,
      });

      // Invalidate all product-related queries to refetch fresh data
      invalidateAfterProductChange(queryClient);

      // Also invalidate the specific product detail query
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });
      
      // Invalidate activity logs to show new log entry
      queryClient.invalidateQueries({ queryKey: ["admin-activity-logs"] });

      // Show success toast
      toast.success("Product updated successfully", {
        closeButton: true,
        position: "bottom-right",
      });

      // Check for low stock and send admin alert (async, don't block)
      // Check if stock was updated and if it's below threshold
      const stock = data?.stock;
      const lowStockThreshold = data?.lowStockThreshold || 10; // Default threshold: 10
      if (stock !== undefined) {
        if (stock === 0) {
          // Send out-of-stock alert if stock is 0
          sendAdminOutOfStockEmail({
            productId: variables.productId,
            productName: data?.name || "Product",
          }).catch((emailError) => {
            console.error(
              "Failed to send out-of-stock alert email:",
              emailError
            );
          });
        } else if (stock <= lowStockThreshold) {
          // Send low stock alert if stock is below threshold but not 0
          sendAdminLowStockEmail({
            productId: variables.productId,
            productName: data?.name || "Product",
            currentStock: stock,
            lowStockThreshold,
          }).catch((emailError) => {
            console.error("Failed to send low stock alert email:", emailError);
          });
        }
      }
    },
    onError: (error) => {
      // Show error toast
      toast.error(error.message || "Failed to update product", {
        closeButton: true,
        position: "bottom-right",
      });
    },
  });
}

/**
 * Hook to delete a product (admin only)
 * Automatically invalidates product queries after successful deletion
 * @returns {Object} Mutation object with mutate function and loading/error states
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct, // API call function
    onSuccess: (data, productId) => {
      // Invalidate all product-related queries to refetch fresh data
      invalidateAfterProductChange(queryClient);

      // Also invalidate the specific product detail query
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      
      // Invalidate activity logs to show new log entry
      queryClient.invalidateQueries({ queryKey: ["admin-activity-logs"] });

      // Show success toast
      toast.success("Product deleted successfully", {
        closeButton: true,
        position: "bottom-right",
      });
    },
    onError: (error) => {
      // Show error toast
      toast.error(error.message || "Failed to delete product", {
        closeButton: true,
        position: "bottom-right",
      });
    },
  });
}

/**
 * Hook to fetch all users (admin view)
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with data, loading, error states
 */
export function useAllUsers(enabled = true) {
  const hasToken =
    typeof window !== "undefined" && sessionStorage.getItem("token");
  const userRole =
    typeof window !== "undefined" ? sessionStorage.getItem("userRole") : null;
  const isAdmin = userRole === "admin";

  return useQuery({
    queryKey: ["admin-users"], // Cache key for all users
    queryFn: getAllUsers, // API call function
    enabled: enabled && !!hasToken && isAdmin, // Only fetch if enabled, logged in, and admin
    staleTime: Infinity, // Data never becomes stale automatically - only invalidated manually
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1, // Retry once on failure
    refetchOnMount: true, // Refetch if data is stale (invalidated) - won't refetch if fresh
  });
}

/**
 * Hook to migrate featured products from old table to products table
 * One-time migration - use this after deployment
 * @returns {Object} Mutation object with mutate function and loading/error states
 */
export function useMigrateFeaturedProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: migrateFeaturedProducts, // API call function
    onSuccess: (data) => {
      // Invalidate all product-related queries to refetch fresh data
      invalidateAfterProductChange(queryClient);

      // Mark migration as done in localStorage
      localStorage.setItem("featured-products-migrated", "true");

      // Show success toast with migration results
      const results = data.results || {};
      toast.success(
        `Migration completed! ${
          results.productsUpdated || 0
        } products updated. Check console for details.`,
        {
          closeButton: true,
          position: "bottom-right",
          autoClose: 5000,
        }
      );

      // Log full results to console for debugging
      console.log("Migration results:", data);
    },
    onError: (error) => {
      // Show error toast
      toast.error(error.message || "Failed to migrate featured products", {
        closeButton: true,
        position: "bottom-right",
      });
    },
  });
}

/**
 * Hook to migrate featured_product from Boolean to Number (1/0) for GSI support
 * One-time migration - run before creating GSI
 * @returns {Object} Mutation object with mutate, mutateAsync, isLoading, etc.
 */
export function useMigrateFeaturedToNumber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: migrateFeaturedToNumber, // API call function
    onSuccess: (data) => {
      // Invalidate all product-related queries to refetch fresh data
      invalidateAfterProductChange(queryClient);

      // Mark migration as done in localStorage
      localStorage.setItem("featured-to-number-migrated", "true");

      // Show success toast with migration results
      const results = data.results || {};
      toast.success(
        `Migration completed! ${
          results.productsUpdated || 0
        } products updated. You can now create the GSI.`,
        {
          closeButton: true,
          position: "bottom-right",
          autoClose: 5000,
        }
      );

      // Log full results to console for debugging
      console.log("Migration results:", data);
    },
    onError: (error) => {
      // Show error toast
      toast.error(
        error.message || "Failed to migrate featured products to Number",
        {
          closeButton: true,
          position: "bottom-right",
        }
      );
    },
  });
}

/**
 * Hook to fetch a single order by ID (admin only)
 * @param {string} orderId - Order ID
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with data, loading, error states
 */
export function useOrder(orderId, enabled = true) {
  const hasToken =
    typeof window !== "undefined" && sessionStorage.getItem("token");
  const userRole =
    typeof window !== "undefined" ? sessionStorage.getItem("userRole") : null;
  const isAdmin = userRole === "admin";

  return useQuery({
    queryKey: ["admin-order", orderId], // Cache key for specific order
    queryFn: () => getOrderById(orderId), // API call function
    enabled: enabled && !!hasToken && isAdmin && !!orderId, // Only fetch if enabled, logged in, admin, and orderId exists
    staleTime: Infinity, // Data never becomes stale automatically - only invalidated manually
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1, // Retry once on failure
    refetchOnMount: true, // Refetch if data is stale (invalidated) - won't refetch if fresh
  });
}

/**
 * Hook to update order status (admin only)
 * Automatically invalidates order queries after successful update
 * @returns {Object} Mutation object with mutate function and loading/error states
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status), // API call function
    onSuccess: (data, variables) => {
      // Get userId from the updated order to invalidate user-specific queries
      const userId = data?.userId || data?.user?.id || null;

      // Invalidate all order-related queries to refetch fresh data
      // This ensures both admin dashboard and user dashboard update immediately
      invalidateAfterOrderStatusUpdate(queryClient, userId);

      // Also invalidate specific admin order detail query
      queryClient.invalidateQueries({
        queryKey: ["admin-order", variables.orderId],
      });
      
      // Invalidate activity logs to show new log entry
      queryClient.invalidateQueries({ queryKey: ["admin-activity-logs"] });

      // Show success toast
      toast.success("Order status updated successfully", {
        closeButton: true,
        position: "bottom-right",
      });

      // Invalidate product queries if order is cancelled (stock is restored)
      if (variables.status === "cancelled") {
        // Log stock restoration for browser console
        if (data?._stockRestores && Array.isArray(data._stockRestores)) {
          console.log("📦 Order cancelled - Stock restored:", {
            orderId: variables.orderId,
            totalRestores: data._stockRestores.length,
            successful: data._stockRestores.filter((s) => s.success).length,
            failed: data._stockRestores.filter((s) => !s.success).length,
            restores: data._stockRestores,
          });
        }

        // Invalidate product cache to update UI immediately
        invalidateAfterProductChange(queryClient);

        // Explicitly refetch admin products to ensure stock updates are visible
        queryClient.invalidateQueries({
          queryKey: ["admin-products"],
          refetchType: "active", // Force immediate refetch of active queries
        });

        console.log(
          "🔄 Cache invalidated - Admin products should refetch automatically (cancelled order)"
        );
      }

      // Send email notifications based on status change (async, don't block)
      const { status: newStatus } = variables;
      const customerEmail = data?.user?.email || data?.userEmail;
      const customerName = data?.user?.name || data?.userName || "Customer";
      const orderId = variables.orderId;

      if (newStatus === "shipped" && customerEmail) {
        sendShippingNotificationEmail({
          customerEmail,
          customerName,
          orderId,
          trackingNumber: data?.trackingNumber, // Optional tracking number
        }).catch((emailError) => {
          console.error(
            "Failed to send shipping notification email:",
            emailError
          );
        });
      } else if (newStatus === "delivered" && customerEmail) {
        sendDeliveryConfirmationEmail({
          customerEmail,
          customerName,
          orderId,
        }).catch((emailError) => {
          console.error(
            "Failed to send delivery confirmation email:",
            emailError
          );
        });
      } else if (newStatus === "cancelled" && customerEmail) {
        sendOrderCanceledEmail({
          customerEmail,
          customerName,
          orderId,
          refundAmount: data?.refundAmount, // Optional refund amount (in cents)
        }).catch((emailError) => {
          console.error("Failed to send order cancellation email:", emailError);
        });
      }
    },
    onError: (error) => {
      // Show error toast
      toast.error(error.message || "Failed to update order status", {
        closeButton: true,
        position: "bottom-right",
      });
    },
  });
}

/**
 * Hook to process refund for an order (admin only)
 * Automatically invalidates order queries after successful refund
 * @returns {Object} Mutation object with mutate function and loading/error states
 */
export function useRefundOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, refundData = {} }) =>
      refundOrder(orderId, refundData), // API call function
    retry: false, // Don't retry refunds automatically - prevent duplicate refunds
    onSuccess: (data, variables) => {
      // Get userId from the updated order to invalidate user-specific queries
      const userId = data?.userId || data?.user?.id || null;

      // Invalidate all order-related queries to refetch fresh data
      invalidateAfterOrderStatusUpdate(queryClient, userId);

      // Also invalidate specific admin order detail query and refetch immediately
      queryClient.invalidateQueries({
        queryKey: ["admin-order", variables.orderId],
        refetchType: "active", // Refetch active queries immediately
      });

      // Explicitly invalidate and refetch admin orders list to ensure UI updates
      queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
        refetchType: "active", // Refetch active queries immediately
      });
      
      // Invalidate activity logs to show new log entry
      queryClient.invalidateQueries({ queryKey: ["admin-activity-logs"] });

      // Show success toast with refund details
      const refundAmount = data?.refundAmount
        ? `$${(data.refundAmount / 100).toFixed(2)}`
        : "full amount";
      toast.success(`Refund processed successfully (${refundAmount})`, {
        closeButton: true,
        position: "bottom-right",
        autoClose: 5000,
      });

      // Send refund confirmation email to customer (async, don't block)
      const customerEmail = data?.user?.email || data?.userEmail;
      const customerName = data?.user?.name || data?.userName || "Customer";
      if (customerEmail) {
        sendOrderRefundedEmail({
          customerEmail,
          customerName,
          orderId: variables.orderId,
          refundAmount: data?.refundAmount,
          refundId: data?.refundId,
        }).catch((emailError) => {
          console.error(
            "Failed to send refund confirmation email:",
            emailError
          );
        });
      }

      // Log stock restoration for browser console
      if (data?._stockRestores && Array.isArray(data._stockRestores)) {
        console.log("📦 Order refunded - Stock restored:", {
          orderId: variables.orderId,
          totalRestores: data._stockRestores.length,
          successful: data._stockRestores.filter((s) => s.success).length,
          failed: data._stockRestores.filter((s) => !s.success).length,
          restores: data._stockRestores,
        });
      } else {
        console.warn("⚠️ Order refunded but no stock restores in response:", {
          orderId: variables.orderId,
          hasStockRestores: !!data?._stockRestores,
        });
      }

      // Invalidate product cache to update UI immediately (stock is restored on refund)
      invalidateAfterProductChange(queryClient);

      // Explicitly refetch admin products to ensure stock updates are visible
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
        refetchType: "active", // Force immediate refetch of active queries
      });

      console.log(
        "🔄 Cache invalidated - Admin products should refetch automatically (refunded order)"
      );

      // Send admin alert email (async, don't block)
      sendAdminRefundProcessedEmail({
        orderId: variables.orderId,
        customerName,
        refundAmount: data?.refundAmount,
        refundId: data?.refundId,
      }).catch((emailError) => {
        console.error("Failed to send admin refund alert email:", emailError);
      });

      // Invalidate product queries since stock is restored when refunded
      invalidateAfterProductChange(queryClient);
    },
    onError: (error) => {
      // Show error toast
      toast.error(error.message || "Failed to process refund", {
        closeButton: true,
        position: "bottom-right",
      });
    },
  });
}

/**
 * Hook to generate shipping label via Shippo API (admin only)
 * @returns {Object} Mutation object with generate function and loading/error states
 */
export function useGenerateShippingLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, options = {} }) =>
      generateShippingLabel(orderId, options), // API call function
    onSuccess: (data, variables) => {
      // Get userId from the updated order to invalidate user-specific queries
      const userId = data?.userId || data?.user?.id || null;

      // Invalidate all order-related queries to refetch fresh data
      invalidateAfterOrderStatusUpdate(queryClient, userId);

      // Also invalidate specific admin order detail query and refetch immediately
      queryClient.invalidateQueries({
        queryKey: ["admin-order", variables.orderId],
        refetchType: "active", // Refetch active queries immediately
      });

      // Invalidate admin orders list to ensure UI updates
      queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
        refetchType: "active", // Refetch active queries immediately
      });
      
      // Invalidate activity logs to show new log entry
      queryClient.invalidateQueries({ queryKey: ["admin-activity-logs"] });

      // Show success toast with tracking information
      const trackingDisplay = data.trackingNumber 
        ? `Tracking: ${data.trackingNumber}` 
        : "Label generated (tracking pending)";
      toast.success(
        `Shipping label generated! ${trackingDisplay}`,
        {
          closeButton: true,
          position: "bottom-right",
          autoClose: 5000,
        }
      );

      // Enhanced console log for easy sharing/verification
      console.log("📦 SHIPPING LABEL GENERATION SUCCESS:", {
        "Order ID": variables.orderId,
        "Tracking Number": data.trackingNumber || "Pending (test mode)",
        "Carrier": data.trackingCarrier || "usps",
        "Label URL": data.labelUrl || "Not available",
        "Tracking URL": data.trackingUrl || "Not available",
        "Order Status": data.status || "shipped",
        "Updated At": data.updatedAt || new Date().toISOString(),
        "Customer Email": data?.user?.email || data?.userEmail || "N/A",
        "Customer Name": data?.user?.name || data?.userName || "N/A",
        "Timestamp": new Date().toISOString(),
      });

      // Send shipping notification email to customer (async, don't block)
      const customerEmail = data?.user?.email || data?.userEmail;
      const customerName = data?.user?.name || data?.userName || "Customer";
      if (customerEmail) {
        sendShippingNotificationEmail({
          customerEmail,
          customerName,
          orderId: variables.orderId,
          trackingNumber: data.trackingNumber,
          trackingCarrier: data.trackingCarrier,
          trackingUrl: data.trackingUrl,
        }).catch((emailError) => {
          console.error(
            "Failed to send shipping notification email:",
            emailError
          );
        });
      }
    },
    onError: (error) => {
      // Show error toast
      toast.error(error.message || "Failed to generate shipping label", {
        closeButton: true,
        position: "bottom-right",
      });
    },
  });
}

/**
 * Hook to add manual tracking number (admin only)
 * @returns {Object} Mutation object with addTracking function and loading/error states
 */
export function useAddTrackingNumber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, trackingNumber, trackingCarrier, status }) =>
      addTrackingNumber(orderId, trackingNumber, trackingCarrier, status), // API call function
    onSuccess: (data, variables) => {
      // Get userId from the updated order to invalidate user-specific queries
      const userId = data?.userId || data?.user?.id || null;

      // Invalidate all order-related queries to refetch fresh data
      invalidateAfterOrderStatusUpdate(queryClient, userId);

      // Also invalidate specific admin order detail query and refetch immediately
      queryClient.invalidateQueries({
        queryKey: ["admin-order", variables.orderId],
        refetchType: "active", // Refetch active queries immediately
      });

      // Invalidate admin orders list to ensure UI updates
      queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
        refetchType: "active", // Refetch active queries immediately
      });

      // Show success toast
      toast.success("Tracking number added successfully", {
        closeButton: true,
        position: "bottom-right",
      });

      // Send shipping notification email to customer (async, don't block)
      const customerEmail = data?.user?.email || data?.userEmail;
      const customerName = data?.user?.name || data?.userName || "Customer";
      if (customerEmail) {
        sendShippingNotificationEmail({
          customerEmail,
          customerName,
          orderId: variables.orderId,
          trackingNumber: data.trackingNumber,
          trackingCarrier: data.trackingCarrier,
        }).catch((emailError) => {
          console.error(
            "Failed to send shipping notification email:",
            emailError
          );
        });
      }
    },
    onError: (error) => {
      // Show error toast
      toast.error(error.message || "Failed to add tracking number", {
        closeButton: true,
        position: "bottom-right",
      });
    },
  });
}

/**
 * Hook to fetch a single user by ID (admin only)
 * @param {string} userId - User ID
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with data, loading, error states
 */
export function useUser(userId, enabled = true) {
  const hasToken =
    typeof window !== "undefined" && sessionStorage.getItem("token");
  const userRole =
    typeof window !== "undefined" ? sessionStorage.getItem("userRole") : null;
  const isAdmin = userRole === "admin";

  return useQuery({
    queryKey: ["admin-user", userId], // Cache key for specific user
    queryFn: () => getUserById(userId), // API call function
    enabled: enabled && !!hasToken && isAdmin && !!userId, // Only fetch if enabled, logged in, admin, and userId exists
    staleTime: Infinity, // Data never becomes stale automatically - only invalidated manually
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1, // Retry once on failure
    refetchOnMount: true, // Refetch if data is stale (invalidated) - won't refetch if fresh
  });
}

/**
 * Hook to update a user (admin only)
 * Automatically invalidates user queries after successful update
 * @returns {Object} Mutation object with mutate function and loading/error states
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, updates }) => updateUser(userId, updates), // API call function
    onSuccess: (data, variables) => {
      // Invalidate all user-related queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-user", variables.userId],
      });
      
      // Invalidate activity logs to show new log entry
      queryClient.invalidateQueries({ queryKey: ["admin-activity-logs"] });

      // Show success toast
      toast.success("User updated successfully", {
        closeButton: true,
        position: "bottom-right",
      });
    },
    onError: (error) => {
      // Show error toast
      toast.error(error.message || "Failed to update user", {
        closeButton: true,
        position: "bottom-right",
      });
    },
  });
}

/**
 * Hook to delete a user (admin only)
 * Automatically invalidates user queries after successful deletion
 * @returns {Object} Mutation object with mutate function and loading/error states
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser, // API call function
    onSuccess: (data, userId) => {
      // Invalidate all user-related queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user", userId] });
      
      // Invalidate activity logs to show new log entry
      queryClient.invalidateQueries({ queryKey: ["admin-activity-logs"] });

      // Show success toast
      toast.success("User deleted successfully", {
        closeButton: true,
        position: "bottom-right",
      });
    },
    onError: (error) => {
      // Show error toast
      toast.error(error.message || "Failed to delete user", {
        closeButton: true,
        position: "bottom-right",
      });
    },
  });
}

/**
 * Hook to fetch activity logs (admin only)
 * 
 * @param {Object} options - Query options
 * @param {string} options.entityType - Filter by entity type (optional)
 * @param {string} options.action - Filter by action (optional)
 * @param {number} options.limit - Limit results (optional, default: 100)
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with logs, loading, error states
 */
export function useActivityLogs(options = {}, enabled = true) {
  // Check if user is logged in and is admin
  const hasToken =
    typeof window !== "undefined" && sessionStorage.getItem("token");
  const userRole =
    typeof window !== "undefined" ? sessionStorage.getItem("userRole") : null;
  const isAdmin = userRole === "admin";

  return useQuery({
    queryKey: ["admin-activity-logs", options],
    queryFn: () => getActivityLogs(options),
    enabled: enabled && !!hasToken && isAdmin, // Only fetch if enabled, logged in, and admin
    staleTime: Infinity, // Cache forever until invalidated
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true, // Refetch when component mounts (after invalidation)
    retry: 1, // Retry once on failure
  });
}

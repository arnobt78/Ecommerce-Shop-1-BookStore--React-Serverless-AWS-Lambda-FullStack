/**
 * React Query Cache Invalidation Utilities
 *
 * Centralized functions for invalidating React Query caches when data changes.
 * This ensures admin dashboard and user dashboards update immediately after mutations.
 */

/**
 * Invalidate all admin-related queries
 * Call this when:
 * - New order is created
 * - New user registers
 * - Product is added/removed (when product management is implemented)
 * - Any admin-relevant data changes
 *
 * @param {QueryClient} queryClient - React Query client instance
 */
export function invalidateAdminQueries(queryClient) {
  // Invalidate admin stats (includes orders, users, products counts)
  queryClient.invalidateQueries({ queryKey: ["admin-stats"] });

  // Invalidate admin orders list
  queryClient.invalidateQueries({ queryKey: ["admin-orders"] });

  // Invalidate admin users list (when new user registers)
  queryClient.invalidateQueries({ queryKey: ["admin-users"] });

  // Invalidate admin products list (when product management is implemented)
  // Note: Currently products are static, but this will be needed when product CRUD is added
  queryClient.invalidateQueries({ queryKey: ["admin-products"] });
}

/**
 * Invalidate user orders query
 * Call this when:
 * - New order is created by the current user
 *
 * @param {QueryClient} queryClient - React Query client instance
 * @param {string|null} userId - User ID from sessionStorage (optional, will try to get it)
 */
export function invalidateUserOrders(queryClient, userId = null) {
  // Get user ID if not provided
  if (!userId) {
    try {
      userId = JSON.parse(sessionStorage.getItem("cbid"));
    } catch {
      userId = null;
    }
  }

  if (userId) {
    queryClient.invalidateQueries({ queryKey: ["user-orders", userId] });
  }
}

/**
 * Invalidate all queries after order creation
 * This is the most common use case - invalidates both user and admin queries
 * Also invalidates product queries since stock is decremented when order is created
 *
 * @param {QueryClient} queryClient - React Query client instance
 * @param {string|null} userId - User ID from sessionStorage (optional)
 */
export function invalidateAfterOrderCreation(queryClient, userId = null) {
  invalidateUserOrders(queryClient, userId);
  invalidateAdminQueries(queryClient);
  // Invalidate product queries since stock is decremented when order is created
  invalidateAfterProductChange(queryClient);
}

/**
 * Invalidate all queries after user registration
 * This ensures admin dashboard shows new user count immediately
 *
 * @param {QueryClient} queryClient - React Query client instance
 */
export function invalidateAfterUserRegistration(queryClient) {
  invalidateAdminQueries(queryClient);
}

/**
 * Invalidate all queries after product add/remove/update
 * Call this when product management features are implemented:
 * - Product is added
 * - Product is removed
 * - Product is updated (price, stock, etc.)
 *
 * This ensures BOTH admin and customer-facing pages update immediately.
 *
 * @param {QueryClient} queryClient - React Query client instance
 */
export function invalidateAfterProductChange(queryClient) {
  // Invalidate admin queries (affects "Total Products" metric and admin products list)
  invalidateAdminQueries(queryClient);

  // Invalidate admin products query (used by AdminProductsPage)
  queryClient.invalidateQueries({ 
    queryKey: ["admin-products"],
    exact: false, // Match all queries starting with ["admin-products"]
  });

  // Invalidate customer-facing product queries
  // Use prefix matching to catch all variations:
  // - ['products'] - base products query
  // - ['products', searchTerm] - products with search (customer-facing page)
  // - ['product', productId] - individual product detail pages
  // Note: Featured products are now filtered from products, so invalidating products
  // automatically updates featured products (no separate query needed)
  
  // Invalidate all products queries (with or without search term)
  // This also invalidates featured products since they're filtered from products
  queryClient.invalidateQueries({ 
    queryKey: ["products"],
    exact: false, // Match all queries starting with ["products"]
  });
  
  // Invalidate all product detail pages (any productId)
  queryClient.invalidateQueries({ 
    queryKey: ["product"],
    exact: false, // Match all queries starting with ["product"]
  });
}

/**
 * Invalidate all queries after order status update
 * This ensures both admin dashboard and user dashboard update immediately
 * when admin changes order status (pending, processing, shipped, delivered, cancelled)
 *
 * @param {QueryClient} queryClient - React Query client instance
 * @param {string|null} userId - User ID from the order (optional, will invalidate all user orders if not provided)
 */
export function invalidateAfterOrderStatusUpdate(queryClient, userId = null) {
  // Invalidate admin queries (orders list, stats)
  invalidateAdminQueries(queryClient);
  
  // Invalidate user orders for the specific user (if provided)
  if (userId) {
    invalidateUserOrders(queryClient, userId);
  } else {
    // If userId not provided, invalidate all user-orders queries
    // This is safer but less efficient - prefer passing userId when available
    queryClient.invalidateQueries({ 
      queryKey: ["user-orders"],
      exact: false, // Match all user-orders queries
    });
  }
  
  // Note: Product queries are invalidated when order status changes to "cancelled" or "refunded"
  // because stock is restored. This is handled in the Lambda function, but we should also
  // invalidate here to ensure UI updates immediately.
  // However, we only invalidate if status is cancelled/refunded to avoid unnecessary refetches.
  // This is handled by the specific hooks (useUpdateOrderStatus, useRefundOrder) that know the status.
}

/**
 * Invalidate all queries after review creation/update/deletion
 * This ensures product detail pages and admin review pages update immediately
 *
 * @param {QueryClient} queryClient - React Query client instance
 * @param {string} productId - Product ID (optional, will invalidate all reviews if not provided)
 */
export function invalidateAfterReviewChange(queryClient, productId = null) {
  // Invalidate admin reviews query
  queryClient.invalidateQueries({
    queryKey: ["admin-reviews"],
    exact: false, // Match all admin review queries
  });

  // Invalidate product reviews if productId is provided
  if (productId) {
    queryClient.invalidateQueries({
      queryKey: ["reviews", productId],
    });

    // Also invalidate product detail query to update rating
    queryClient.invalidateQueries({
      queryKey: ["product", productId],
    });
  } else {
    // If productId not provided, invalidate all review queries
    queryClient.invalidateQueries({
      queryKey: ["reviews"],
      exact: false, // Match all review queries
    });
  }
}

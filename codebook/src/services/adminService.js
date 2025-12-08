/**
 * Admin Service - Direct AWS Lambda API Calls for Admin Operations
 *
 * Admin-specific API calls for dashboard metrics and management.
 * All endpoints require admin authentication.
 */

import { ApiError } from "./apiError";

// AWS Lambda HTTP API Base URL
const LAMBDA_API_BASE =
  process.env.REACT_APP_LAMBDA_API_URL ||
  "https://d4vvkswb4a.execute-api.eu-north-1.amazonaws.com";

/**
 * Get session data from storage
 * @returns {Object} Session data with token and user ID
 */
function getSession() {
  try {
    const token = JSON.parse(sessionStorage.getItem("token"));
    const cbid = JSON.parse(sessionStorage.getItem("cbid"));
    return { token, cbid };
  } catch {
    return { token: null, cbid: null };
  }
}

/**
 * Get all orders (admin only)
 * Fetches all orders from the system for admin dashboard
 * @returns {Promise<Array>} Array of all orders
 * @throws {ApiError} Error object with message and status
 */
export async function getAllOrders() {
  const browserData = getSession();

  if (!browserData.token) {
    throw new ApiError("User not authenticated", 401);
  }

  // Check if user is admin
  const userRole = sessionStorage.getItem("userRole");
  if (userRole !== "admin") {
    throw new ApiError("Admin access required", 403);
  }

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
  };

  // Use dedicated admin endpoint to get all orders (admin panel)
  // This endpoint returns all orders regardless of user
  // User dashboard uses /orders endpoint (user-specific)
  const response = await fetch(`${LAMBDA_API_BASE}/admin/orders`, requestOptions);

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new ApiError(errorMessage, response.status);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

/**
 * Get all users (admin only)
 * @returns {Promise<Array>} Array of all users (without passwords)
 * @throws {ApiError} Error object with message and status
 */
export async function getAllUsers() {
  const browserData = getSession();

  if (!browserData.token) {
    throw new ApiError("User not authenticated", 401);
  }

  const userRole = sessionStorage.getItem("userRole");
  if (userRole !== "admin") {
    throw new ApiError("Admin access required", 403);
  }

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
  };

  const response = await fetch(`${LAMBDA_API_BASE}/admin/users`, requestOptions);

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new ApiError(errorMessage, response.status);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

/**
 * Get all products (admin view)
 * @returns {Promise<Array>} Array of all products
 * @throws {ApiError} Error object with message and status
 */
export async function getAllProducts() {
  const browserData = getSession();

  if (!browserData.token) {
    throw new ApiError("User not authenticated", 401);
  }

  const userRole = sessionStorage.getItem("userRole");
  if (userRole !== "admin") {
    throw new ApiError("Admin access required", 403);
  }

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
  };

  const response = await fetch(`${LAMBDA_API_BASE}/products`, requestOptions);

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new ApiError(errorMessage, response.status);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

/**
 * Create a new product (admin only)
 * @param {Object} productData - Product data (name, price, description, etc.)
 * @returns {Promise<Object>} Created product
 * @throws {ApiError} Error object with message and status
 */
export async function createProduct(productData) {
  const browserData = getSession();

  if (!browserData.token) {
    throw new ApiError("User not authenticated", 401);
  }

  const userRole = sessionStorage.getItem("userRole");
  if (userRole !== "admin") {
    throw new ApiError("Admin access required", 403);
  }

  /**
   * Include baseUrl for QR code generation
   * Priority: 1. REACT_APP_BASE_URL (production), 2. window.location.origin (localhost)
   * This ensures QR codes are generated with the correct URL in all environments
   */
  const baseUrl = process.env.REACT_APP_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "");
  const requestBody = {
    ...productData,
    ...(baseUrl && { baseUrl }), // Only include baseUrl if it exists (prevents null/undefined in request)
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
    body: JSON.stringify(requestBody),
  };

  const response = await fetch(`${LAMBDA_API_BASE}/admin/products`, requestOptions);

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new ApiError(errorMessage, response.status);
  }

  return await response.json();
}

/**
 * Update an existing product (admin only)
 * @param {string} productId - Product ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated product
 * @throws {ApiError} Error object with message and status
 */
export async function updateProduct(productId, updates) {
  const browserData = getSession();

  if (!browserData.token) {
    throw new ApiError("User not authenticated", 401);
  }

  const userRole = sessionStorage.getItem("userRole");
  if (userRole !== "admin") {
    throw new ApiError("Admin access required", 403);
  }

  /**
   * Include baseUrl for QR code generation
   * Priority: 1. REACT_APP_BASE_URL (production), 2. window.location.origin (localhost)
   * This ensures QR codes are auto-generated for existing products without QR codes
   * when they are updated (even if no other changes are made)
   */
  const baseUrl = process.env.REACT_APP_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "");
  const requestBody = {
    ...updates,
    ...(baseUrl && { baseUrl }), // Only include baseUrl if it exists (prevents null/undefined in request)
  };

  // Debug logging to verify data being sent to API
  console.log("📤 Admin Service - Updating product:", {
    productId,
    updates: requestBody,
    stock: requestBody.stock,
    stockType: typeof requestBody.stock,
    lowStockThreshold: requestBody.lowStockThreshold,
    lowStockThresholdType: typeof requestBody.lowStockThreshold,
  });

  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
    body: JSON.stringify(requestBody),
  };

  const response = await fetch(`${LAMBDA_API_BASE}/admin/products/${productId}`, requestOptions);
  
  // Debug logging to verify response
  if (response.ok) {
    const responseData = await response.json().catch(() => null);
    console.log("✅ Admin Service - Product updated successfully:", {
      productId,
      responseData,
      stock: responseData?.stock,
      stockType: typeof responseData?.stock,
      lowStockThreshold: responseData?.lowStockThreshold,
      lowStockThresholdType: typeof responseData?.lowStockThreshold,
    });
    return responseData;
  }

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new ApiError(errorMessage, response.status);
  }

  return await response.json();
}

/**
 * Get count of featured products (admin only)
 * Used to validate max 3 featured products limit
 * @returns {Promise<number>} Count of featured products
 * @throws {ApiError} Error object with message and status
 */
export async function getFeaturedProductsCount() {
  const browserData = getSession();

  if (!browserData.token) {
    throw new ApiError("User not authenticated", 401);
  }

  const userRole = sessionStorage.getItem("userRole");
  if (userRole !== "admin") {
    throw new ApiError("Admin access required", 403);
  }

  // Get all products and count featured ones (client-side filter)
  // This is efficient since we already have products cached
  // Handle both Number (1/0) and Boolean (true/false) for backward compatibility
  const products = await getAllProducts();
  const featuredCount = products.filter((p) => p.featured_product === 1 || p.featured_product === true).length;
  return featuredCount;
}

/**
 * Delete a product (admin only)
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Deletion confirmation
 * @throws {ApiError} Error object with message and status
 */
export async function deleteProduct(productId) {
  const browserData = getSession();

  if (!browserData.token) {
    throw new ApiError("User not authenticated", 401);
  }

  const userRole = sessionStorage.getItem("userRole");
  if (userRole !== "admin") {
    throw new ApiError("Admin access required", 403);
  }

  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
  };

  const response = await fetch(`${LAMBDA_API_BASE}/admin/products/${productId}`, requestOptions);

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new ApiError(errorMessage, response.status);
  }

  const responseData = await response.json();
  
  // Debug logging to verify response data
  console.log("✅ Admin Service - Product updated successfully:", {
    productId,
    responseData,
    stock: responseData?.stock,
    stockType: typeof responseData?.stock,
    lowStockThreshold: responseData?.lowStockThreshold,
    lowStockThresholdType: typeof responseData?.lowStockThreshold,
  });
  
  return responseData;
}

/**
 * Migrate featured products from old table to products table (admin only)
 * One-time migration function - run once after deployment
 * @returns {Promise<Object>} Migration results
 * @throws {ApiError} Error object with message and status
 */
export async function migrateFeaturedProducts() {
  const browserData = getSession();

  if (!browserData.token) {
    throw new ApiError("User not authenticated", 401);
  }

  const userRole = sessionStorage.getItem("userRole");
  if (userRole !== "admin") {
    throw new ApiError("Admin access required", 403);
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
  };

  const response = await fetch(`${LAMBDA_API_BASE}/admin/migrate-featured-products`, requestOptions);

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new ApiError(errorMessage, response.status);
  }

  return await response.json();
}

/**
 * Migrate featured_product from Boolean to Number (1/0) for GSI support (admin only)
 * One-time migration function - run once before creating GSI
 * @returns {Promise<Object>} Migration results
 * @throws {ApiError} Error object with message and status
 */
export async function migrateFeaturedToNumber() {
  const browserData = getSession();

  if (!browserData.token) {
    throw new ApiError("User not authenticated", 401);
  }

  const userRole = sessionStorage.getItem("userRole");
  if (userRole !== "admin") {
    throw new ApiError("Admin access required", 403);
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
  };

  const response = await fetch(`${LAMBDA_API_BASE}/admin/migrate-featured-to-number`, requestOptions);

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new ApiError(errorMessage, response.status);
  }

  return await response.json();
}

/**
 * Update order status (admin only)
 * @param {string} orderId - Order ID
 * @param {string} status - New status (e.g., "pending", "processing", "shipped", "delivered", "cancelled")
 * @returns {Promise<Object>} Updated order
 * @throws {ApiError} Error object with message and status
 */
export async function updateOrderStatus(orderId, status) {
  const browserData = getSession();

  if (!browserData.token) {
    throw new ApiError("User not authenticated", 401);
  }

  const userRole = sessionStorage.getItem("userRole");
  if (userRole !== "admin") {
    throw new ApiError("Admin access required", 403);
  }

  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
    body: JSON.stringify({ status }),
  };

  const response = await fetch(`${LAMBDA_API_BASE}/admin/orders/${orderId}/status`, requestOptions);

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new ApiError(errorMessage, response.status);
  }

  return await response.json();
}

/**
 * Process refund for an order (admin only)
 * @param {string} orderId - Order ID
 * @param {Object} refundData - Optional refund data (amount in cents, reason)
 * @param {number} refundData.amount - Optional: Amount in cents to refund (partial refund). If not provided, full refund.
 * @param {string} refundData.reason - Optional: Reason for refund (requested_by_customer, duplicate, fraudulent)
 * @returns {Promise<Object>} Updated order with refund information
 * @throws {ApiError} Error object with message and status
 */
export async function refundOrder(orderId, refundData = {}) {
  const browserData = getSession();

  if (!browserData.token) {
    throw new ApiError("User not authenticated", 401);
  }

  const userRole = sessionStorage.getItem("userRole");
  if (userRole !== "admin") {
    throw new ApiError("Admin access required", 403);
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
    body: JSON.stringify(refundData),
  };

  const response = await fetch(
    `${LAMBDA_API_BASE}/admin/orders/${orderId}/refund`,
    requestOptions
  );

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new ApiError(errorMessage, response.status);
  }

  return await response.json();
}

/**
 * Generate shipping label via Shippo API (admin only)
 * 
 * Creates a shipping label automatically using Shippo API integration.
 * Flow: Create shipment → Get rates → Purchase label → Update order.
 * 
 * @param {string} orderId - Order ID (UUID)
 * @param {Object} options - Optional label generation options
 *   - carrier: string - Carrier code (e.g., "usps", "ups")
 *   - service: string - Service level token (e.g., "usps_priority")
 *   - fromAddress: Object - Override sender address
 *   - toAddress: Object - Override recipient address
 *   - length/width/height: string - Parcel dimensions in inches
 * @returns {Promise<Object>} Label data with trackingNumber, trackingCarrier, labelUrl, trackingUrl
 * @throws {ApiError} Error object with message and status code
 * 
 * Note: Automatically updates order status to "shipped" when label is generated.
 * Customer receives shipping notification email with tracking information.
 */
export async function generateShippingLabel(orderId, options = {}) {
  const browserData = getSession();

  if (!browserData.token) {
    throw new ApiError("User not authenticated", 401);
  }

  const userRole = sessionStorage.getItem("userRole");
  if (userRole !== "admin") {
    throw new ApiError("Admin access required", 403);
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
    body: JSON.stringify(options),
  };

  const response = await fetch(
    `${LAMBDA_API_BASE}/admin/orders/${orderId}/generate-label`,
    requestOptions
  );

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new ApiError(errorMessage, response.status);
  }

  return await response.json();
}

/**
 * Add manual tracking number to order (admin only)
 * 
 * Fallback method when Shippo API is unavailable or admin prefers manual entry.
 * Updates order with tracking information and optionally changes status.
 * 
 * @param {string} orderId - Order ID (UUID)
 * @param {string} trackingNumber - Tracking number string (required, non-empty)
 * @param {string} trackingCarrier - Carrier name (default: "usps")
 *   Options: "usps", "ups", "fedex", "dhl", "other"
 * @param {string} status - Order status to set (default: "shipped")
 * @returns {Promise<Object>} Updated order with trackingNumber, trackingCarrier, status
 * @throws {ApiError} Error object with message and status code
 * 
 * Note: Automatically updates order status to "shipped" when tracking is added.
 * Customer receives shipping notification email with tracking information.
 */
export async function addTrackingNumber(orderId, trackingNumber, trackingCarrier = "usps", status = "shipped") {
  const browserData = getSession();

  if (!browserData.token) {
    throw new ApiError("User not authenticated", 401);
  }

  const userRole = sessionStorage.getItem("userRole");
  if (userRole !== "admin") {
    throw new ApiError("Admin access required", 403);
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
    body: JSON.stringify({
      trackingNumber,
      trackingCarrier,
      status,
    }),
  };

  const response = await fetch(
    `${LAMBDA_API_BASE}/admin/orders/${orderId}/tracking`,
    requestOptions
  );

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new ApiError(errorMessage, response.status);
  }

  return await response.json();
}

/**
 * Get order by ID (admin only)
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order object
 * @throws {ApiError} Error object with message and status
 */
export async function getOrderById(orderId) {
  const browserData = getSession();

  if (!browserData.token) {
    throw new ApiError("User not authenticated", 401);
  }

  const userRole = sessionStorage.getItem("userRole");
  if (userRole !== "admin") {
    throw new ApiError("Admin access required", 403);
  }

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
  };

  const response = await fetch(`${LAMBDA_API_BASE}/admin/orders/${orderId}`, requestOptions);

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new ApiError(errorMessage, response.status);
  }

  return await response.json();
}

/**
 * Update user (admin only)
 * @param {string} userId - User ID
 * @param {Object} updates - Fields to update (name, email, role)
 * @returns {Promise<Object>} Updated user
 * @throws {ApiError} Error object with message and status
 */
export async function updateUser(userId, updates) {
  const browserData = getSession();

  if (!browserData.token) {
    throw new ApiError("User not authenticated", 401);
  }

  const userRole = sessionStorage.getItem("userRole");
  if (userRole !== "admin") {
    throw new ApiError("Admin access required", 403);
  }

  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
    body: JSON.stringify(updates),
  };

  const response = await fetch(`${LAMBDA_API_BASE}/admin/users/${userId}`, requestOptions);

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new ApiError(errorMessage, response.status);
  }

  return await response.json();
}

/**
 * Delete user (admin only)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Deletion confirmation
 * @throws {ApiError} Error object with message and status
 */
export async function deleteUser(userId) {
  const browserData = getSession();

  if (!browserData.token) {
    throw new ApiError("User not authenticated", 401);
  }

  const userRole = sessionStorage.getItem("userRole");
  if (userRole !== "admin") {
    throw new ApiError("Admin access required", 403);
  }

  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
  };

  const response = await fetch(`${LAMBDA_API_BASE}/admin/users/${userId}`, requestOptions);

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new ApiError(errorMessage, response.status);
  }

  return await response.json();
}

/**
 * Get user by ID (admin only)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User object
 * @throws {ApiError} Error object with message and status
 */
export async function getUserById(userId) {
  const browserData = getSession();

  if (!browserData.token) {
    throw new ApiError("User not authenticated", 401);
  }

  const userRole = sessionStorage.getItem("userRole");
  if (userRole !== "admin") {
    throw new ApiError("Admin access required", 403);
  }

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
  };

  const response = await fetch(`${LAMBDA_API_BASE}/admin/users/${userId}`, requestOptions);

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new ApiError(errorMessage, response.status);
  }

  return await response.json();
}

/**
 * Get admin dashboard statistics
 * Calculates metrics from orders and products data
 * @returns {Promise<Object>} Dashboard statistics
 * @throws {ApiError} Error object with message and status
 */
export async function getAdminStats() {
  const browserData = getSession();

  if (!browserData.token) {
    throw new ApiError("User not authenticated", 401);
  }

  const userRole = sessionStorage.getItem("userRole");
  if (userRole !== "admin") {
    throw new ApiError("Admin access required", 403);
  }

  try {
    // Fetch all orders, products, and users in parallel for faster loading
    const [orders, products, users] = await Promise.all([
      getAllOrders(),
      getAllProducts(),
      getAllUsers(), // Fetch all registered users from database
    ]);

    // Calculate statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.amount_paid || 0),
      0
    );
    const totalProducts = products.length;
    // Count total registered users from database (not just users who placed orders)
    // This shows all users who have registered, providing better admin insights
    const totalUsers = users.length;

    // All orders sorted by date (newest first)
    const allOrders = [...orders].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });

    // Recent orders (last 5, sorted by date)
    const recentOrders = allOrders.slice(0, 5);

    // Orders by status (if status field exists)
    const ordersByStatus = orders.reduce((acc, order) => {
      const status = order.status || "pending";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers,
      recentOrders,
      allOrders,
      ordersByStatus,
    };
  } catch (error) {
    // Re-throw ApiError as-is, wrap others
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error.message || "Failed to fetch admin statistics",
      500
    );
  }
}

/**
 * Get activity logs (admin only)
 *
 * @param {Object} options - Query options
 * @param {string} options.entityType - Filter by entity type (order, product, user) - optional
 * @param {string} options.action - Filter by action (create, update, delete, status_change) - optional
 * @param {number} options.limit - Limit results (default: 100) - optional
 * @returns {Promise<Object>} Activity logs array and count
 * @throws {ApiError} Error object with message and status
 */
export async function getActivityLogs(options = {}) {
  const browserData = getSession();

  if (!browserData.token) {
    throw new ApiError("User not authenticated", 401);
  }

  const userRole = sessionStorage.getItem("userRole");
  if (userRole !== "admin") {
    throw new ApiError("Admin access required", 403);
  }

  // Build query string
  const queryParams = new URLSearchParams();
  if (options.entityType) queryParams.set("entityType", options.entityType);
  if (options.action) queryParams.set("action", options.action);
  if (options.limit) queryParams.set("limit", options.limit.toString());

  const queryString = queryParams.toString();
  const url = `${LAMBDA_API_BASE}/admin/activity-logs${queryString ? `?${queryString}` : ""}`;

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new ApiError(errorMessage, response.status);
  }

  return await response.json();
}


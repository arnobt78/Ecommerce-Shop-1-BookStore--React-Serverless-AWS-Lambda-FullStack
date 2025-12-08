/**
 * Data Service - Direct AWS Lambda API Calls
 *
 * Direct fetch calls to Lambda endpoints for maximum speed.
 * No wrapper overhead - straight to Lambda.
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
 * Get user by ID (from session)
 * @returns {Promise<Object>} User object
 * @throws {Object} Error object with message and status
 *
 * Note: Lambda API doesn't have GET /users/{id} endpoint yet.
 * For now, returns user info from session storage (maintains compatibility).
 */
export async function getUser() {
  const browserData = getSession();

  if (!browserData.cbid) {
    throw new ApiError("User not authenticated", 401);
  }

  // Return user info from session storage (Lambda doesn't have user endpoint yet)
  const userEmail = sessionStorage.getItem("userEmail");
  const userName = sessionStorage.getItem("userName");
  const userRole = sessionStorage.getItem("userRole");

  if (!userEmail) {
    throw new ApiError("User data not found", 404);
  }

  return {
    id: browserData.cbid,
    email: userEmail,
    name: userName || null, // Include name if available
    role: userRole || "user",
  };
}

/**
 * Get all orders for the authenticated user
 * @returns {Promise<Array>} Array of orders
 * @throws {Object} Error object with message and status
 */
export async function getUserOrders() {
  const browserData = getSession();

  if (!browserData.cbid) {
    throw new ApiError("User not authenticated", 401);
  }

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
  };

  const response = await fetch(
    `${LAMBDA_API_BASE}/orders?user.id=${browserData.cbid}`,
    requestOptions
  );

  if (!response.ok) {
    // Try to parse error response body for better error message
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.error || response.statusText;
    } catch {
      // If JSON parsing fails, use statusText
      errorMessage = response.statusText;
    }
    throw new ApiError(errorMessage, response.status);
  }

  const data = await response.json();
  return data;
}

/**
 * Create a new order
 * @param {Array} cartList - Cart items
 * @param {number} total - Total amount paid
 * @param {Object} user - User information
 * @param {Object} paymentInfo - Optional payment information (paymentIntentId, paymentStatus)
 * @returns {Promise<Object>} Created order
 * @throws {Object} Error object with message and status
 */
export async function createOrder(cartList, total, user, paymentInfo = {}) {
  const browserData = getSession();

  if (!browserData.cbid) {
    throw new ApiError("User not authenticated", 401);
  }

  // Calculate total quantity (sum of all item quantities)
  const totalQuantity = cartList.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Ensure cartList items have quantity field (for backward compatibility)
  const cartListWithQuantities = cartList.map(item => ({
    ...item,
    quantity: item.quantity || 1, // Ensure quantity exists, default to 1
  }));

  const order = {
    cartList: cartListWithQuantities, // Include quantities in each item
    amount_paid: total,
    quantity: totalQuantity, // Total number of items (sum of all quantities)
    user: {
      name: user.name,
      email: user.email,
      id: user.id || browserData.cbid,
    },
    // Include payment information if provided
    ...(paymentInfo.paymentIntentId && { paymentIntentId: paymentInfo.paymentIntentId }),
    ...(paymentInfo.paymentStatus && { paymentStatus: paymentInfo.paymentStatus }),
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
    body: JSON.stringify(order),
  };

  const response = await fetch(`${LAMBDA_API_BASE}/orders`, requestOptions);

  if (!response.ok) {
    // Try to parse error response body for better error message
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.error || response.statusText;
    } catch {
      // If JSON parsing fails, use statusText
      errorMessage = response.statusText;
    }
    throw new ApiError(errorMessage, response.status);
  }

  const data = await response.json();
  return data;
}

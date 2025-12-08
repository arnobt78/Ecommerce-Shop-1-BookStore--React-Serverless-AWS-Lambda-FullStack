/**
 * Payment Service - Stripe Payment Integration
 *
 * Handles Stripe payment operations including payment intent creation
 * and payment status verification.
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
 * Create a Stripe payment intent
 * @param {number} amount - Total amount in cents (e.g., 1000 = $10.00)
 * @param {Array} cartList - Cart items for metadata
 * @param {Object} user - User information
 * @returns {Promise<Object>} Payment intent object with client_secret
 * @throws {Object} Error object with message and status
 */
export async function createPaymentIntent(amount, cartList, user) {
  const browserData = getSession();

  if (!browserData.cbid) {
    throw new ApiError("User not authenticated", 401);
  }

  // Convert amount to cents (Stripe uses cents)
  const amountInCents = Math.round(amount * 100);

  const requestBody = {
    amount: amountInCents,
    currency: "usd",
    metadata: {
      userId: user.id || browserData.cbid,
      userEmail: user.email,
      userName: user.name || "Guest",
      itemCount: cartList.length,
    },
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
    body: JSON.stringify(requestBody),
  };

  const response = await fetch(
    `${LAMBDA_API_BASE}/payment/create-intent`,
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

  const data = await response.json();
  return data;
}

/**
 * Verify payment status after Stripe redirect
 * @param {string} paymentIntentId - Stripe payment intent ID
 * @returns {Promise<Object>} Payment status object
 * @throws {Object} Error object with message and status
 */
export async function verifyPaymentStatus(paymentIntentId) {
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
    `${LAMBDA_API_BASE}/payment/verify/${paymentIntentId}`,
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

  const data = await response.json();
  return data;
}


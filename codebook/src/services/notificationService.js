/**
 * Notification Service - Frontend API calls for notifications
 *
 * Handles notification count retrieval and marking notifications as read.
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
 * Get unread notification count
 *
 * @returns {Promise<Object>} Notification count, order count, ticket count, and read timestamp
 * @returns {number} count - Total unread notification count
 * @returns {number} orderCount - Unread order notifications count
 * @returns {number} ticketCount - Unread ticket notifications count
 * @returns {string|null} notificationsReadAt - Timestamp when notifications were last read
 * @throws {ApiError} Error object with message and status
 */
export async function getNotificationCount() {
  const browserData = getSession();

  if (!browserData.token) {
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
    `${LAMBDA_API_BASE}/notifications/count`,
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
 * Mark notifications as read
 *
 * @returns {Promise<Object>} Updated notificationsReadAt timestamp
 * @throws {ApiError} Error object with message and status
 */
export async function markNotificationsRead() {
  const browserData = getSession();

  if (!browserData.token) {
    throw new ApiError("User not authenticated", 401);
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
  };

  const response = await fetch(
    `${LAMBDA_API_BASE}/notifications/mark-read`,
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


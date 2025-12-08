/**
 * Ticket Service - API functions for support tickets
 *
 * This service handles all API calls related to support tickets.
 * Pure functions - no React Query logic here.
 */

import { ApiError } from "./apiError";

// Base API URL from environment (use same env var as other services)
const API_BASE =
  process.env.REACT_APP_LAMBDA_API_URL ||
  "https://d4vvkswb4a.execute-api.eu-north-1.amazonaws.com";

/**
 * Get session token from storage
 * @returns {string|null} Auth token
 */
function getToken() {
  try {
    return JSON.parse(sessionStorage.getItem("token"));
  } catch {
    return null;
  }
}

/**
 * Create a new support ticket
 * @param {Object} ticketData - Ticket data
 * @param {string} ticketData.subject - Ticket subject
 * @param {string} ticketData.message - Initial message
 * @returns {Promise<Object>} Created ticket object
 * @throws {ApiError} Error with message and status
 */
export async function createTicket(ticketData) {
  const token = getToken();

  if (!token) {
    throw new ApiError("User not authenticated", 401);
  }

  const response = await fetch(`${API_BASE}/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(ticketData),
  });

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
 * Get all tickets (admin: all tickets, customer: own tickets)
 * @returns {Promise<Object>} Object with tickets array
 * @throws {ApiError} Error with message and status
 */
export async function getTickets() {
  const token = getToken();

  if (!token) {
    throw new ApiError("User not authenticated", 401);
  }

  const response = await fetch(`${API_BASE}/tickets`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

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
 * Get a single ticket by ID
 * @param {string} ticketId - Ticket ID
 * @returns {Promise<Object>} Ticket object
 * @throws {ApiError} Error with message and status
 */
export async function getTicket(ticketId) {
  const token = getToken();

  if (!token) {
    throw new ApiError("User not authenticated", 401);
  }

  const response = await fetch(`${API_BASE}/tickets/${ticketId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

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
  // API returns ticket object directly (not wrapped in { ticket: ... })
  return data.ticket || data;
}

/**
 * Add a reply to a ticket
 * @param {string} ticketId - Ticket ID
 * @param {string} message - Reply message
 * @returns {Promise<Object>} Updated ticket object
 * @throws {ApiError} Error with message and status
 */
export async function replyToTicket(ticketId, message) {
  const token = getToken();

  if (!token) {
    throw new ApiError("User not authenticated", 401);
  }

  const response = await fetch(`${API_BASE}/tickets/${ticketId}/reply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });

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
 * Update ticket status (admin only)
 * @param {string} ticketId - Ticket ID
 * @param {string} status - New status (open, in_progress, resolved, closed)
 * @returns {Promise<Object>} Updated ticket object
 * @throws {ApiError} Error with message and status
 */
export async function updateTicketStatus(ticketId, status) {
  const token = getToken();

  if (!token) {
    throw new ApiError("User not authenticated", 401);
  }

  const response = await fetch(`${API_BASE}/tickets/${ticketId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

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

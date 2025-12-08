/**
 * Auth Service - Direct AWS Lambda API Calls
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
 * Login user with email and password
 * @param {Object} authDetail - Authentication details
 * @param {string} authDetail.email - User email
 * @param {string} authDetail.password - User password
 * @returns {Promise<Object>} Response data with accessToken and user
 * @throws {Object} Error object with message and status
 */
export async function login(authDetail) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(authDetail),
  };

  const response = await fetch(`${LAMBDA_API_BASE}/login`, requestOptions);

  if (!response.ok) {
    throw new ApiError(response.statusText, response.status);
  }

  const data = await response.json();

  // Store token and user info on successful login
  if (data.accessToken) {
    sessionStorage.setItem("token", JSON.stringify(data.accessToken));
    sessionStorage.setItem("cbid", JSON.stringify(data.user.id));
    // Cache user email for instant display in dropdown
    if (data.user && data.user.email) {
      sessionStorage.setItem("userEmail", data.user.email);
      // Dispatch custom event to notify components of storage change
      window.dispatchEvent(new Event("sessionStorageChange"));
    }
    // Store user name if provided by backend
    if (data.user && data.user.name) {
      sessionStorage.setItem("userName", data.user.name);
    }
    // Store user role if provided by backend
    if (data.user && data.user.role) {
      sessionStorage.setItem("userRole", data.user.role);
    }
  }

  return data;
}

/**
 * Register new user
 * @param {Object} authDetail - Registration details
 * @param {string} authDetail.email - User email
 * @param {string} authDetail.password - User password
 * @param {string} authDetail.name - User name
 * @returns {Promise<Object>} Response data with accessToken and user
 * @throws {Object} Error object with message and status
 */
export async function register(authDetail) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(authDetail),
  };

  const response = await fetch(`${LAMBDA_API_BASE}/register`, requestOptions);

  if (!response.ok) {
    throw new ApiError(response.statusText, response.status);
  }

  const data = await response.json();

  // Store token and user info on successful registration
  if (data.accessToken) {
    sessionStorage.setItem("token", JSON.stringify(data.accessToken));
    sessionStorage.setItem("cbid", JSON.stringify(data.user.id));
    // Cache user email for instant display in dropdown
    if (data.user && data.user.email) {
      sessionStorage.setItem("userEmail", data.user.email);
      // Dispatch custom event to notify components of storage change
      window.dispatchEvent(new Event("sessionStorageChange"));
    }
    // Store user name if provided by backend
    if (data.user && data.user.name) {
      sessionStorage.setItem("userName", data.user.name);
    }
    // Store user role if provided by backend, otherwise default to 'user'
    if (data.user && data.user.role) {
      sessionStorage.setItem("userRole", data.user.role);
    } else {
      sessionStorage.setItem("userRole", "user");
    }
  }

  return data;
}

/**
 * Logout user (clears session storage)
 */
export function logout() {
  // Clear all session storage items in a specific order to prevent race conditions
  sessionStorage.removeItem("userRole"); // Clear role FIRST to prevent access issues
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("cbid");
  sessionStorage.removeItem("userEmail");
  sessionStorage.removeItem("userName");
  // Dispatch custom event to notify components of storage change
  window.dispatchEvent(new Event("sessionStorageChange"));
}

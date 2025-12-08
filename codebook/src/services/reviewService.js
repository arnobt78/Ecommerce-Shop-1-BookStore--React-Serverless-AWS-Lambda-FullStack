/**
 * Review Service - Pure API Functions
 *
 * These are pure functions that make API calls to the review endpoints.
 * NO React Query logic here - just fetch calls.
 */

// Base API URL from environment
const API_BASE = process.env.REACT_APP_LAMBDA_API_URL || "";

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
 * Get reviews for a product
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Object with reviews array and ratingStats
 * @throws {Error} Error with message and status
 */
export async function getReviewsByProduct(productId) {
  console.log("🔍 [ReviewService] getReviewsByProduct - Starting");
  console.log("🔍 [ReviewService] productId:", productId);
  console.log("🔍 [ReviewService] API_BASE:", API_BASE);
  
  if (!productId) {
    console.error("❌ [ReviewService] Product ID is required");
    throw new Error("Product ID is required");
  }

  const url = `${API_BASE}/reviews?productId=${productId}`;
  console.log("🔍 [ReviewService] Fetching from URL:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("🔍 [ReviewService] Response status:", response.status);
    console.log("🔍 [ReviewService] Response ok:", response.ok);

    if (!response.ok) {
      let errorMessage = response.statusText;
      let errorData = null;
      
      try {
        errorData = await response.json();
        console.error("❌ [ReviewService] Error response data:", errorData);
        // Use detailed error message if available
        errorMessage = errorData.message || errorData.error || response.statusText;
        // Include errorType if available
        if (errorData.errorType) {
          errorMessage = `${errorMessage} (${errorData.errorType})`;
        }
        // Include details in development
        if (errorData.details && process.env.NODE_ENV === "development") {
          console.error("❌ [ReviewService] Error details:", errorData.details);
        }
      } catch (parseError) {
        console.error("❌ [ReviewService] Failed to parse error response:", parseError);
        errorMessage = response.statusText;
      }
      
      console.error("❌ [ReviewService] Error message:", errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ [ReviewService] Success! Data received:", data);
    console.log("✅ [ReviewService] Reviews count:", data.reviews?.length || 0);
    console.log("✅ [ReviewService] Rating stats:", data.ratingStats);
    
    // API returns { reviews: [...], ratingStats: {...} }
    // Ensure we always return the expected structure
    const result = {
      reviews: data.reviews || [],
      ratingStats: data.ratingStats || { averageRating: 0, reviewCount: 0 },
    };
    
    console.log("✅ [ReviewService] Returning result:", result);
    return result;
  } catch (error) {
    console.error("❌ [ReviewService] Exception caught:", error);
    console.error("❌ [ReviewService] Error name:", error.name);
    console.error("❌ [ReviewService] Error message:", error.message);
    console.error("❌ [ReviewService] Error stack:", error.stack);
    throw error;
  }
}

/**
 * Create a new review
 * @param {Object} reviewData - Review data { productId, orderId, rating, comment }
 * @returns {Promise<Object>} Created review
 * @throws {Error} Error with message and status
 */
export async function createReview(reviewData) {
  const token = getToken();

  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.review || data;
}

/**
 * Update a review
 * @param {string} reviewId - Review ID
 * @param {Object} updates - Updates { rating?, comment? }
 * @returns {Promise<Object>} Updated review
 * @throws {Error} Error with message and status
 */
export async function updateReview(reviewId, updates) {
  const token = getToken();

  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE}/reviews/${reviewId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.review || data;
}

/**
 * Delete a review
 * @param {string} reviewId - Review ID
 * @returns {Promise<Object>} Deletion result
 * @throws {Error} Error with message and status
 */
export async function deleteReview(reviewId) {
  const token = getToken();

  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE}/reviews/${reviewId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data;
}

/**
 * Get all reviews (admin only)
 * @param {string} status - Optional status filter
 * @returns {Promise<Array>} Array of reviews
 * @throws {Error} Error with message and status
 */
export async function getAllReviews(status = null) {
  const token = getToken();

  if (!token) {
    throw new Error("User not authenticated");
  }

  const url = status
    ? `${API_BASE}/admin/reviews?status=${status}`
    : `${API_BASE}/admin/reviews`;

  const response = await fetch(url, {
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
      errorMessage = errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.reviews || data;
}

/**
 * Update review status (admin only)
 * @param {string} reviewId - Review ID
 * @param {string} status - New status (approved, pending, rejected)
 * @returns {Promise<Object>} Updated review
 * @throws {Error} Error with message and status
 */
export async function updateReviewStatus(reviewId, status) {
  const token = getToken();

  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE}/admin/reviews/${reviewId}`, {
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
      errorMessage = errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.review || data;
}


/**
 * Product Service - Direct AWS Lambda API Calls
 *
 * Direct fetch calls to Lambda endpoints for maximum speed.
 * No wrapper overhead - straight to Lambda.
 */

import { ApiError } from "./apiError";

// AWS Lambda HTTP API Base URL
const LAMBDA_API_BASE =
  process.env.REACT_APP_LAMBDA_API_URL ||
  "https://d4vvkswb4a.execute-api.eu-north-1.amazonaws.com";

export async function getProductList(searchTerm) {
  const url = searchTerm
    ? `${LAMBDA_API_BASE}/products?name_like=${encodeURIComponent(searchTerm)}`
    : `${LAMBDA_API_BASE}/products`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new ApiError(response.statusText, response.status);
  }

  const data = await response.json();
  return data;
}

export async function getProduct(id) {
  const response = await fetch(`${LAMBDA_API_BASE}/products/${id}`);

  if (!response.ok) {
    throw new ApiError(response.statusText, response.status);
  }

  const data = await response.json();
  return data;
}

/**
 * @deprecated This function is no longer used.
 * Featured products are now filtered from the products list.
 * Kept for backward compatibility during migration.
 * Will be removed after migration is complete.
 */
export async function getFeaturedList() {
  // For now, fetch from products and filter client-side
  // This maintains backward compatibility during migration
  // Handle both Number (1/0) and Boolean (true/false) for backward compatibility
  const products = await getProductList("");
  return products
    .filter((p) => p.featured_product === 1 || p.featured_product === true)
    .slice(0, 3);
}

/**
 * React Query hooks for product-related API calls
 * Provides automatic caching, deduplication, and loading states
 */

import { useQuery } from "@tanstack/react-query";
import { getProductList, getFeaturedList, getProduct } from "../services";

/**
 * Hook to fetch all products with optional search term
 * Automatically refetches when searchTerm changes
 * Uses Infinity staleTime with manual invalidation for optimal performance
 * @param {string} searchTerm - Optional search term from URL params
 * @returns {Object} Query result with data, loading, error states
 */
export function useProducts(searchTerm = "") {
  return useQuery({
    queryKey: ["products", searchTerm], // Unique key for caching
    queryFn: () => getProductList(searchTerm), // API call function
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
 * Hook to fetch featured products
 * Now filters from products list instead of separate API
 * Uses Infinity staleTime with manual invalidation for optimal performance
 * @returns {Object} Query result with data, loading, error states
 */
export function useFeaturedProducts() {
  // Use products query and filter for featured products
  // This ensures featured products are always in sync with products
  const { data: allProducts = [], isLoading, error } = useProducts("");

  // Filter featured products from all products
  // Handle both Number (1/0) and Boolean (true/false) for backward compatibility
  const featuredProducts = allProducts
    .filter(
      (product) =>
        product.featured_product === 1 || product.featured_product === true
    )
    .slice(0, 3);

  return {
    data: featuredProducts,
    isLoading,
    error,
  };
}

/**
 * Hook to fetch a single product by ID
 * Uses Infinity staleTime with manual invalidation for optimal performance
 * @param {string|number} productId - Product ID
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with data, loading, error states
 */
export function useProduct(productId, enabled = true) {
  return useQuery({
    queryKey: ["product", productId], // Unique key per product
    queryFn: () => getProduct(productId), // API call function
    enabled: enabled && !!productId, // Only fetch if enabled and ID exists
    staleTime: Infinity, // Data never becomes stale automatically - only invalidated manually
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1, // Retry once on failure
    // refetchOnMount: true allows refetching when data is stale (invalidated)
    // With staleTime: Infinity, data is only stale when manually invalidated
    // So: Normal visits use cache, after invalidation it refetches
    refetchOnMount: true, // Refetch if data is stale (invalidated) - won't refetch if fresh
  });
}

/**
 * React Query hooks for product-related API calls
 * Provides automatic caching, deduplication, and loading states
 */

import { useQuery } from '@tanstack/react-query';
import { getProductList, getFeaturedList, getProduct } from '../services';

/**
 * Hook to fetch all products with optional search term
 * Automatically refetches when searchTerm changes
 * @param {string} searchTerm - Optional search term from URL params
 * @returns {Object} Query result with data, loading, error states
 */
export function useProducts(searchTerm = '') {
  return useQuery({
    queryKey: ['products', searchTerm], // Unique key for caching
    queryFn: () => getProductList(searchTerm), // API call function
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    // Use cached data as placeholder while refetching in background
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to fetch featured products
 * Cached separately from all products
 * Featured products rarely change, so we use longer cache times
 * @returns {Object} Query result with data, loading, error states
 */
export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['featured-products'], // Unique key for caching
    queryFn: getFeaturedList, // API call function
    staleTime: 60 * 60 * 1000, // Consider data fresh for 1 hour (featured products rarely change)
    gcTime: 24 * 60 * 60 * 1000, // Keep in cache for 24 hours
    // Use cached data as placeholder while refetching in background
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to fetch a single product by ID
 * @param {string|number} productId - Product ID
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with data, loading, error states
 */
export function useProduct(productId, enabled = true) {
  return useQuery({
    queryKey: ['product', productId], // Unique key per product
    queryFn: () => getProduct(productId), // API call function
    enabled: enabled && !!productId, // Only fetch if enabled and ID exists
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    // Use cached data as placeholder while refetching in background
    placeholderData: (previousData) => previousData,
  });
}


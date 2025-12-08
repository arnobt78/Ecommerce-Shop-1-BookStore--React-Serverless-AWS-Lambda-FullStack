/**
 * React Query hooks for user-related API calls
 * Provides automatic caching, deduplication, and loading states
 */

import { useQuery } from "@tanstack/react-query";
import { getUser, getUserOrders } from "../services";

/**
 * Hook to fetch current user data
 * Only fetches if user is logged in (has token)
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with data, loading, error states
 */
export function useUser(enabled = true) {
  // Check if user is logged in and get user ID for cache key
  const hasToken =
    typeof window !== "undefined" && sessionStorage.getItem("token");
  let userId = null;
  try {
    userId = hasToken ? JSON.parse(sessionStorage.getItem("cbid")) : null;
  } catch {
    userId = null;
  }

  return useQuery({
    queryKey: ["user", userId], // Include user ID in key to prevent cross-user cache
    queryFn: getUser, // API call function
    enabled: enabled && !!hasToken, // Only fetch if enabled and user is logged in
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1, // Retry once on failure
  });
}

/**
 * Hook to fetch user orders
 * Only fetches if user is logged in (has token)
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with data, loading, error states
 */
export function useUserOrders(enabled = true) {
  // Check if user is logged in and get user ID for cache key
  const hasToken =
    typeof window !== "undefined" && sessionStorage.getItem("token");
  let userId = null;
  try {
    userId = hasToken ? JSON.parse(sessionStorage.getItem("cbid")) : null;
  } catch {
    userId = null;
  }

  return useQuery({
    queryKey: ["user-orders", userId], // Include user ID in key to prevent cross-user cache
    queryFn: getUserOrders, // API call function
    enabled: enabled && !!hasToken, // Only fetch if enabled and user is logged in
    staleTime: Infinity, // Data never becomes stale automatically - only invalidated manually
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1, // Retry once on failure
    // refetchOnMount: true allows refetching when data is stale (invalidated)
    // With staleTime: Infinity, data is only stale when manually invalidated
    // So: Normal visits use cache, after invalidation it refetches
    refetchOnMount: true, // Refetch if data is stale (invalidated) - won't refetch if fresh
  });
}

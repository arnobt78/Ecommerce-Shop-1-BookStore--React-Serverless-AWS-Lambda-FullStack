/**
 * React Query hooks for user-related API calls
 * Provides automatic caching, deduplication, and loading states
 */

import { useQuery } from '@tanstack/react-query';
import { getUser, getUserOrders } from '../services';

/**
 * Hook to fetch current user data
 * Only fetches if user is logged in (has token)
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with data, loading, error states
 */
export function useUser(enabled = true) {
  // Check if user is logged in
  const hasToken = typeof window !== 'undefined' && sessionStorage.getItem('token');
  
  return useQuery({
    queryKey: ['user'], // Unique key for caching
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
  // Check if user is logged in
  const hasToken = typeof window !== 'undefined' && sessionStorage.getItem('token');
  
  return useQuery({
    queryKey: ['user-orders'], // Unique key for caching
    queryFn: getUserOrders, // API call function
    enabled: enabled && !!hasToken, // Only fetch if enabled and user is logged in
    staleTime: 1 * 60 * 1000, // Consider data fresh for 1 minute (orders change frequently)
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1, // Retry once on failure
  });
}


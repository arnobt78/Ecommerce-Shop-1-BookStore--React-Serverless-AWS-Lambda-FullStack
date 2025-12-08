/**
 * React Query hooks for payment operations
 * Provides automatic caching, deduplication, and loading states for Stripe payments
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import { createPaymentIntent, verifyPaymentStatus } from "../services/paymentService";
import { toast } from "react-toastify";

/**
 * Hook to create a Stripe payment intent
 * @param {Object} options - Mutation options
 * @returns {Object} Mutation object with mutate, isLoading, error, etc.
 */
export function useCreatePaymentIntent(options = {}) {
  return useMutation({
    mutationFn: ({ amount, cartList, user }) =>
      createPaymentIntent(amount, cartList, user),
    retry: false, // Don't retry automatically - prevent hundreds of calls
    onSuccess: (data) => {
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      console.error("Payment intent creation error:", error);
      toast.error(error.message || "Failed to create payment intent", {
        closeButton: true,
        position: "bottom-right",
      });
      if (options.onError) {
        options.onError(error);
      }
    },
    ...options,
  });
}

/**
 * Hook to verify payment status
 * @param {string} paymentIntentId - Stripe payment intent ID
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with data, loading, error states
 */
export function usePaymentStatus(paymentIntentId, enabled = true) {
  return useQuery({
    queryKey: ["payment-status", paymentIntentId],
    queryFn: () => verifyPaymentStatus(paymentIntentId),
    enabled: enabled && !!paymentIntentId,
    staleTime: Infinity, // Payment status never changes once verified - only invalidated manually
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 2, // Retry twice on failure
    // refetchOnMount: true allows refetching when data is stale (invalidated)
    // With staleTime: Infinity, data is only stale when manually invalidated
    // So: Normal visits use cache, after invalidation it refetches
    refetchOnMount: true, // Refetch if data is stale (invalidated) - won't refetch if fresh
  });
}


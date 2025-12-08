/**
 * React Query hooks for review operations
 *
 * Caching Strategy:
 * - staleTime: Infinity = Data never becomes stale automatically
 * - refetchOnMount: true = Refetch ONLY when data is stale (invalidated)
 * - Result: Cache forever until manually invalidated, then refetch once
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReviewsByProduct,
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  updateReviewStatus,
} from "../services/reviewService";
import { toast } from "react-toastify";

/**
 * Hook to fetch reviews for a product
 *
 * @param {string} productId - Product ID
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with data, isLoading, error, etc.
 */
export function useReviewsByProduct(productId, enabled = true) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      console.log("🔄 [useReviews] useReviewsByProduct - queryFn called");
      console.log("🔄 [useReviews] productId:", productId);
      console.log("🔄 [useReviews] enabled:", enabled);
      
      try {
        const result = await getReviewsByProduct(productId);
        console.log("✅ [useReviews] Query successful:", result);
        return result;
      } catch (error) {
        console.error("❌ [useReviews] Query failed:", error);
        throw error;
      }
    },
    enabled: enabled && !!productId,
    staleTime: Infinity, // Cache forever until invalidated
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true, // Refetch when component mounts (after invalidation)
    retry: 1, // Retry once on failure
    onError: (error) => {
      console.error("❌ [useReviews] React Query onError:", error);
    },
  });
}

/**
 * Hook to create a new review
 *
 * @returns {Object} Mutation object with mutate, mutateAsync, isLoading, error, etc.
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: (data, variables) => {
      // Invalidate reviews for the product
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.productId],
      });

      // Also invalidate product detail query to update rating
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });

      toast.success("Review submitted successfully!", {
        closeButton: true,
        position: "bottom-right",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit review", {
        closeButton: true,
        position: "bottom-right",
      });
    },
  });
}

/**
 * Hook to update a review
 *
 * @returns {Object} Mutation object with mutate, mutateAsync, isLoading, error, etc.
 */
export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, updates }) => updateReview(reviewId, updates),
    onSuccess: (data, variables) => {
      // Extract productId from the returned review data or variables
      // Variables may include productId for cache invalidation
      const review = data?.review || data;
      const productId = variables?.productId || review?.productId;
      
      // Invalidate reviews queries (will refetch with updated data)
      if (productId) {
        // Invalidate specific product reviews
        queryClient.invalidateQueries({
          queryKey: ["reviews", productId],
        });
        
        // Also invalidate product detail to update rating
        queryClient.invalidateQueries({
          queryKey: ["product", productId],
        });
      } else {
        // If productId not available, invalidate all review queries
        queryClient.invalidateQueries({
          queryKey: ["reviews"],
          exact: false, // Match all review queries
        });
      }

      toast.success("Review updated successfully!", {
        closeButton: true,
        position: "bottom-right",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update review", {
        closeButton: true,
        position: "bottom-right",
      });
    },
  });
}

/**
 * Hook to delete a review
 *
 * @returns {Object} Mutation object with mutate, mutateAsync, isLoading, error, etc.
 */
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: (data, reviewId) => {
      // Extract productId from response for targeted cache invalidation
      const productId = data?.productId;
      
      if (productId) {
        // Invalidate specific product reviews
        queryClient.invalidateQueries({
          queryKey: ["reviews", productId],
        });
        
        // Also invalidate product detail to update rating
        queryClient.invalidateQueries({
          queryKey: ["product", productId],
        });
      } else {
        // If productId not available, invalidate all review queries
        queryClient.invalidateQueries({
          queryKey: ["reviews"],
          exact: false, // Match all review queries
        });
      }
      
      // Also invalidate admin reviews
      queryClient.invalidateQueries({
        queryKey: ["admin-reviews"],
        exact: false, // Match all admin review queries
      });

      toast.success("Review deleted successfully!", {
        closeButton: true,
        position: "bottom-right",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete review", {
        closeButton: true,
        position: "bottom-right",
      });
    },
  });
}

/**
 * Hook to fetch all reviews (admin only)
 *
 * @param {string} status - Optional status filter
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with data, isLoading, error, etc.
 */
export function useAllReviews(status = null, enabled = true) {
  // Check if user is authenticated
  const hasToken =
    typeof window !== "undefined" && sessionStorage.getItem("token");

  return useQuery({
    queryKey: ["admin-reviews", status],
    queryFn: async () => {
      const reviews = await getAllReviews(status);
      return reviews;
    },
    enabled: enabled && !!hasToken,
    staleTime: Infinity, // Cache forever until invalidated
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true, // Refetch when component mounts (after invalidation)
    retry: 1, // Retry once on failure
  });
}

/**
 * Hook to update review status (admin only)
 *
 * @returns {Object} Mutation object with mutate, mutateAsync, isLoading, error, etc.
 */
export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, status }) =>
      updateReviewStatus(reviewId, status),
    onSuccess: (data, variables) => {
      // Invalidate all review queries
      queryClient.invalidateQueries({
        queryKey: ["admin-reviews"],
        exact: false, // Match all admin review queries
      });

      // Extract productId from the returned review data
      // The API returns { review: {...} } or just the review object
      const review = data?.review || data;
      const productId = review?.productId;
      
      if (productId) {
        // Invalidate specific product reviews
        queryClient.invalidateQueries({
          queryKey: ["reviews", productId],
        });
        
        // Also invalidate product detail to update rating
        queryClient.invalidateQueries({
          queryKey: ["product", productId],
        });
      } else {
        // If productId not available, invalidate all product review queries
        queryClient.invalidateQueries({
          queryKey: ["reviews"],
          exact: false, // Match all review queries
        });
      }

      toast.success("Review status updated successfully!", {
        closeButton: true,
        position: "bottom-right",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update review status", {
        closeButton: true,
        position: "bottom-right",
      });
    },
  });
}


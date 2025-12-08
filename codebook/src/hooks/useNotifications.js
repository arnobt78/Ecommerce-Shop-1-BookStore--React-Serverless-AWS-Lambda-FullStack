/**
 * React Query hooks for notifications
 * Provides automatic caching, polling, and loading states for notification operations
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotificationCount,
  markNotificationsRead,
} from "../services/notificationService";
import { toast } from "react-toastify";

/**
 * Hook to get unread notification count
 * Polls every 30 seconds to keep count updated
 *
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with count, notificationsReadAt, loading, error states
 */
export function useNotificationCount(enabled = true) {
  // Check if user is logged in
  const hasToken =
    typeof window !== "undefined" && sessionStorage.getItem("token");

  return useQuery({
    queryKey: ["notification-count"],
    queryFn: getNotificationCount,
    enabled: enabled && !!hasToken, // Only fetch if enabled and user is logged in
    staleTime: 0, // Always consider stale to get fresh count
    refetchInterval: 30000, // Poll every 30 seconds
    refetchOnWindowFocus: true, // Refetch when window regains focus
    retry: 1, // Retry once on failure
  });
}

/**
 * Hook to mark notifications as read
 *
 * @returns {Object} Mutation result with mutate, mutateAsync, isPending, etc.
 */
export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationsRead,
    onMutate: async () => {
      // Optimistically update notification count to 0 immediately
      // This makes the badge disappear instantly when clicked
      await queryClient.cancelQueries({ queryKey: ["notification-count"] });
      
      // Snapshot previous value for rollback
      const previousData = queryClient.getQueryData(["notification-count"]);
      
      // Optimistically set count to 0
      queryClient.setQueryData(["notification-count"], (old) => ({
        ...old,
        count: 0,
        orderCount: 0,
        ticketCount: 0,
        notificationsReadAt: new Date().toISOString(),
      }));
      
      return { previousData };
    },
    onSuccess: (data) => {
      // Update with actual server response
      queryClient.setQueryData(["notification-count"], {
        count: 0,
        orderCount: 0,
        ticketCount: 0,
        notificationsReadAt: data.notificationsReadAt || new Date().toISOString(),
      });
      
      // Also invalidate user query to update notificationsReadAt
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update on error
      if (context?.previousData) {
        queryClient.setQueryData(["notification-count"], context.previousData);
      }
      
      console.error("Mark notifications read error:", error);
      toast.error(error.message || "Failed to mark notifications as read", {
        closeButton: true,
        position: "bottom-right",
      });
    },
  });
}


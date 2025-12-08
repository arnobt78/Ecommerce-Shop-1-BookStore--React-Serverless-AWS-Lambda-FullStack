/**
 * React Query hooks for ticket operations
 *
 * Caching Strategy:
 * - staleTime: Infinity = Data never becomes stale automatically
 * - refetchOnMount: true = Refetch ONLY when data is stale (invalidated)
 * - Result: Cache forever until manually invalidated, then refetch once
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTicket,
  getTickets,
  getTicket,
  replyToTicket,
  updateTicketStatus,
} from "../services/ticketService";
import { toast } from "react-toastify";

/**
 * Hook to fetch all tickets
 * - Admin: Gets all tickets
 * - Customer: Gets only their own tickets
 *
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with data, isLoading, error, etc.
 */
export function useTickets(enabled = true) {
  // Check if user is authenticated
  const hasToken = typeof window !== "undefined" && sessionStorage.getItem("token");

  return useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const data = await getTickets();
      return data.tickets || [];
    },
    enabled: enabled && !!hasToken,
    staleTime: Infinity, // Cache forever until invalidated
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true, // Refetch when component mounts (after invalidation)
    retry: 1, // Retry once on failure
  });
}

/**
 * Hook to fetch a single ticket by ID
 *
 * @param {string} ticketId - Ticket ID
 * @param {boolean} enabled - Whether to enable the query (default: true)
 * @returns {Object} Query result with data, isLoading, error, etc.
 */
export function useTicket(ticketId, enabled = true) {
  // Check if user is authenticated
  const hasToken = typeof window !== "undefined" && sessionStorage.getItem("token");

  return useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: async () => {
      const data = await getTicket(ticketId);
      // Ensure we return the ticket object (handle both wrapped and unwrapped responses)
      return data.ticket || data;
    },
    enabled: enabled && !!hasToken && !!ticketId,
    staleTime: Infinity, // Cache forever until invalidated
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true, // Refetch when component mounts (after invalidation)
    retry: 1, // Retry once on failure
  });
}

/**
 * Hook to create a new ticket
 *
 * @returns {Object} Mutation object with mutate, mutateAsync, isLoading, error, etc.
 */
export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTicket,
    onSuccess: (data) => {
      // Invalidate tickets list to refetch
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      // Invalidate notification count (new ticket creates notification for admin)
      queryClient.invalidateQueries({ queryKey: ["notification-count"] });
      // Invalidate activity logs
      queryClient.invalidateQueries({ queryKey: ["admin-activity-logs"] });

      toast.success("Ticket created successfully!", {
        closeButton: true,
        position: "bottom-right",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create ticket", {
        closeButton: true,
        position: "bottom-right",
      });
    },
  });
}

/**
 * Hook to reply to a ticket
 *
 * @returns {Object} Mutation object with mutate, mutateAsync, isLoading, error, etc.
 */
export function useReplyToTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, message }) => replyToTicket(ticketId, message),
    onSuccess: (data, variables) => {
      // Invalidate tickets list
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      // Invalidate specific ticket
      queryClient.invalidateQueries({ queryKey: ["ticket", variables.ticketId] });
      // Invalidate notification count (reply creates notification for customer/admin)
      queryClient.invalidateQueries({ queryKey: ["notification-count"] });
      // Invalidate activity logs
      queryClient.invalidateQueries({ queryKey: ["admin-activity-logs"] });

      toast.success("Reply sent successfully!", {
        closeButton: true,
        position: "bottom-right",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send reply", {
        closeButton: true,
        position: "bottom-right",
      });
    },
  });
}

/**
 * Hook to update ticket status (admin only)
 *
 * @returns {Object} Mutation object with mutate, mutateAsync, isLoading, error, etc.
 */
export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, status }) => updateTicketStatus(ticketId, status),
    onSuccess: (data, variables) => {
      // Invalidate tickets list
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      // Invalidate specific ticket
      queryClient.invalidateQueries({ queryKey: ["ticket", variables.ticketId] });
      // Invalidate notification count (status change creates notification for customer)
      queryClient.invalidateQueries({ queryKey: ["notification-count"] });
      // Invalidate activity logs
      queryClient.invalidateQueries({ queryKey: ["admin-activity-logs"] });

      toast.success("Ticket status updated successfully!", {
        closeButton: true,
        position: "bottom-right",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update ticket status", {
        closeButton: true,
        position: "bottom-right",
      });
    },
  });
}


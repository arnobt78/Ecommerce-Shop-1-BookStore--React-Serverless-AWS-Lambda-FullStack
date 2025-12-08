/**
 * Admin Reviews Page
 *
 * Admin-facing page to manage all product reviews.
 * Displays all reviews in a table with search, filters, and status management.
 * Uses reusable ShadCN UI components and React Query hooks.
 */

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTitle } from "../../hooks/useTitle";
import { useAllReviews, useUpdateReviewStatus } from "../../hooks/useReviews";
import { AdminLayout, useAdminLayout } from "../../components/Layouts/Admin";
import {
  SortableTable,
  PageHeader,
  SearchFilterBar,
  LoadingState,
  ErrorState,
  EmptyState,
  Card,
  ResultsCount,
  FormSelect,
} from "../../components/ui";
import { Rating } from "../../components/Elements/Rating";

// Memoized status options (static data - never changes)
const STATUS_OPTIONS = [
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
];

const FILTER_STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
];

// Inner component that uses the AdminLayout context
const AdminReviewsContent = () => {
  const { toggleSidebar } = useAdminLayout();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [filterStatus, setFilterStatus] = useState(
    searchParams.get("status") || "all"
  );

  // Fetch reviews (admin gets all reviews)
  const {
    data: reviews = [],
    isLoading,
    error,
  } = useAllReviews(filterStatus !== "all" ? filterStatus : null);
  const updateStatusMutation = useUpdateReviewStatus();

  // Sync search params with state
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (filterStatus !== "all") params.set("status", filterStatus);
    setSearchParams(params, { replace: true });
  }, [searchQuery, filterStatus, setSearchParams]);

  // Show error toast if API call fails
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to load reviews", {
        closeButton: true,
        position: "bottom-right",
      });
    }
  }, [error]);

  // Filter and search reviews
  const filteredReviews = useMemo(() => {
    let filtered = [...reviews];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (review) =>
          review.userName?.toLowerCase().includes(query) ||
          review.userEmail?.toLowerCase().includes(query) ||
          review.comment?.toLowerCase().includes(query) ||
          review.productId?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [reviews, searchQuery]);

  // Handle status update
  const handleStatusUpdate = useCallback(
    (reviewId, newStatus) => {
      updateStatusMutation.mutate(
        { reviewId, status: newStatus },
        {
          onSuccess: () => {
            // Cache invalidation handled by mutation hook
          },
        }
      );
    },
    [updateStatusMutation]
  );

  // Format date to two lines (date and time)
  const formatDateTwoLines = useCallback((dateString) => {
    if (!dateString) return { datePart: "N/A", timePart: "" };
    try {
      const date = new Date(dateString);
      const datePart = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const timePart = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return { datePart, timePart };
    } catch {
      return { datePart: "N/A", timePart: "" };
    }
  }, []);

  // Table columns
  const columns = useMemo(
    () => [
      {
        key: "userName",
        label: "User",
        sortable: true,
      },
      {
        key: "rating",
        label: "Rating",
        sortable: true,
      },
      {
        key: "comment",
        label: "Comment",
        sortable: false,
      },
      {
        key: "productId",
        label: "Product ID",
        sortable: true,
      },
      {
        key: "status",
        label: "Status",
        sortable: true,
      },
      {
        key: "createdAt",
        label: "Created",
        sortable: true,
      },
    ],
    []
  );

  // Render row function for SortableTable - memoized for performance
  const renderRow = useCallback(
    (review) => {
      const createdDate = formatDateTwoLines(review.createdAt);

      return (
        <tr
          key={review.id}
          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {/* User */}
          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
            <div>
              <div className="text-sm text-gray-900 dark:text-slate-200">
                {review.userName || "Anonymous"}
              </div>
              <div className="text-sm text-gray-500 dark:text-slate-400">
                {review.userEmail || ""}
              </div>
            </div>
          </td>

          {/* Rating */}
          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
            <div>
              <div className="">
                <Rating rating={review.rating} />
              </div>
              <div className="text-sm text-gray-600 dark:text-slate-400">
                {review.rating}/5
              </div>
            </div>
          </td>

          {/* Comment */}
          <td className="px-4 sm:px-6 py-4">
            <div className="max-w-lg">
              <p className="text-sm text-gray-700 dark:text-slate-300">
                {review.comment}
              </p>
            </div>
          </td>

          {/* Product ID */}
          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
            <span className="text-sm text-gray-600 dark:text-slate-400 font-mono">
              {review.productId?.substring(0, 8)}...
            </span>
          </td>

          {/* Status */}
          <td
            className="px-4 sm:px-6 py-4 whitespace-nowrap"
            onClick={(e) => e.stopPropagation()}
          >
            <FormSelect
              value={review.status || "pending"}
              onChange={(e) => handleStatusUpdate(review.id, e.target.value)}
              options={STATUS_OPTIONS}
              className="min-w-[140px]"
            />
          </td>

          {/* Created */}
          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-slate-400">
            {review.createdAt ? (
              <div>
                <div className="text-sm">{createdDate.datePart}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  at {createdDate.timePart}
                </div>
              </div>
            ) : (
              "N/A"
            )}
          </td>
        </tr>
      );
    },
    [handleStatusUpdate, formatDateTwoLines]
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingState message="Loading reviews..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          message="Failed to load reviews"
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="">
      <PageHeader
        title="Product Reviews"
        description="Manage and moderate product reviews"
        onToggleSidebar={toggleSidebar}
      />

      {/* Search and Filter Bar */}
      <Card className="my-3 p-0">
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by user, email, comment, or product ID..."
          filters={
            <FormSelect
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={FILTER_STATUS_OPTIONS}
              className="min-w-[150px]"
            />
          }
        />
      </Card>

      {/* Results Count */}
      <ResultsCount
        className="mb-3"
        filteredCount={filteredReviews.length}
        totalCount={reviews.length}
        entityName="reviews"
      />

      {/* Reviews Table */}
      {filteredReviews.length === 0 ? (
        <Card>
          <EmptyState
            title="No Reviews Found"
            description={
              searchQuery || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "No reviews have been submitted yet"
            }
          />
        </Card>
      ) : (
        <Card className="p-0">
          <SortableTable
            data={filteredReviews}
            columns={columns}
            renderRow={renderRow}
            defaultSortColumn="createdAt"
            defaultSortDirection="desc"
          />
        </Card>
      )}
    </div>
  );
};

// Main component that wraps AdminReviewsContent with AdminLayout
export const AdminReviewsPage = () => {
  useTitle("Admin - Reviews");
  return (
    <AdminLayout>
      <AdminReviewsContent />
    </AdminLayout>
  );
};

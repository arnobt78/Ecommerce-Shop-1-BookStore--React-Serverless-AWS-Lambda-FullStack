/**
 * ReviewList Component
 *
 * Displays a list of product reviews with sorting and pagination options.
 */

import { useState, useMemo, useCallback } from "react";
import { ReviewCard } from "./ReviewCard";
import { EmptyState } from "../ui/empty-state";
import { FormSelect } from "../ui/form-select";

// Memoized sort options (static data - never changes)
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest", label: "Highest Rated" },
  { value: "lowest", label: "Lowest Rated" },
];

/**
 * ReviewList component
 * @param {Object} props
 * @param {Array} props.reviews - Array of review objects
 * @param {boolean} props.isLoading - Loading state
 * @param {Function} props.onEdit - Edit handler
 * @param {Function} props.onDelete - Delete handler
 * @param {string} props.currentUserId - Current user ID
 */
export const ReviewList = ({
  reviews = [],
  isLoading = false,
  onEdit,
  onDelete,
  currentUserId,
}) => {
  const [sortBy, setSortBy] = useState("newest");

  // Sort reviews based on selected option
  const sortedReviews = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];

    const sorted = [...reviews];

    switch (sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return sorted.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "highest":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  }, [reviews, sortBy]);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);

  if (isLoading) {
    return <ReviewListSkeleton />;
  }

  if (sortedReviews.length === 0) {
    return (
      <EmptyState
        title="No Reviews Yet"
        description="Be the first to review this product!"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-slate-200">
          Reviews ({sortedReviews.length})
        </h3>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-slate-400 whitespace-nowrap">
            Sort by:
          </label>
          <FormSelect
            value={sortBy}
            onChange={handleSortChange}
            options={SORT_OPTIONS}
            className="w-full sm:w-auto sm:min-w-[150px]"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            showActions={true}
            onEdit={onEdit}
            onDelete={onDelete}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * ReviewListSkeleton Component
 * Skeleton loading state for review list
 */
export const ReviewListSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-8 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>

      {/* Review Cards Skeleton */}
      {Array.from({ length: count }).map((_, index) => (
        <ReviewCardSkeleton key={index} />
      ))}
    </div>
  );
};

/**
 * ReviewCardSkeleton Component
 * Skeleton loading state for a single review card
 */
export const ReviewCardSkeleton = () => {
  return (
    <div className="p-4 sm:p-6 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm dark:shadow-slate-900/50 bg-white dark:bg-slate-800 animate-pulse">
      <div className="space-y-3">
        {/* User Name and Rating Skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="flex items-center gap-1">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded"
                ></div>
              ))}
          </div>
        </div>

        {/* Comment Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-4/5 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Timestamp Skeleton */}
        <div className="h-3 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};


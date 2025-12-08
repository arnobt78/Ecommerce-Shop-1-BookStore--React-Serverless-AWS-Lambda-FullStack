/**
 * ReviewCard Component
 *
 * Displays a single product review with rating, comment, and user info.
 */

import { Rating } from "./Rating";

/**
 * Format date to relative time (e.g., "2 days ago")
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Formatted date string
 */
function formatRelativeTime(date) {
  if (!date) return "";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffMs = now - dateObj;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSecs < 60) return "just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffWeeks < 4)
      return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
    if (diffMonths < 12)
      return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
  } catch {
    return "";
  }
}

/**
 * ReviewCard component
 * @param {Object} review - Review object
 * @param {string} review.id - Review ID
 * @param {number} review.rating - Rating (1-5)
 * @param {string} review.comment - Review comment
 * @param {string} review.userName - User name
 * @param {string} review.createdAt - Creation timestamp
 * @param {boolean} showActions - Whether to show edit/delete actions
 * @param {Function} onEdit - Edit handler
 * @param {Function} onDelete - Delete handler
 * @param {string} currentUserId - Current user ID (to check if user owns the review)
 */
export const ReviewCard = ({
  review,
  showActions = false,
  onEdit,
  onDelete,
  currentUserId,
}) => {
  const isOwner = currentUserId && review.userId === currentUserId;
  const canEdit = showActions && isOwner;
  const canDelete = showActions && isOwner;

  return (
    <div className="p-4 sm:p-6 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm dark:shadow-slate-900/50 bg-white dark:bg-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          {/* User Name and Rating */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-slate-200">
              {review.userName || "Anonymous"}
            </h4>
            <div className="flex items-center">
              <Rating rating={review.rating} />
            </div>
          </div>

          {/* Comment */}
          <p className="text-sm sm:text-base text-gray-700 dark:text-slate-300 leading-relaxed mb-3 whitespace-pre-line">
            {review.comment}
          </p>

          {/* Timestamp */}
          <div className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
            {formatRelativeTime(review.createdAt)}
          </div>
        </div>

        {/* Actions */}
        {(canEdit || canDelete) && (
          <div className="flex items-center gap-2 sm:ml-4 flex-shrink-0">
            {canEdit && (
              <button
                onClick={() => onEdit && onEdit(review)}
                className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                aria-label="Edit review"
              >
                <i className="bi bi-pencil text-sm"></i>
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete && onDelete(review)}
                className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                aria-label="Delete review"
              >
                <i className="bi bi-trash3 text-sm"></i>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

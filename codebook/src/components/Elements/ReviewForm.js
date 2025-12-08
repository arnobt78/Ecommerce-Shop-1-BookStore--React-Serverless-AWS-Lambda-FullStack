/**
 * ReviewForm Component
 *
 * Form for creating or editing a product review.
 */

import { useState, useCallback } from "react";
import { Rating } from "./Rating";
import { FormTextarea } from "../ui/form-textarea";
import { FormError } from "../ui/form-error";

/**
 * ReviewForm component
 * @param {Object} props
 * @param {Function} props.onSubmit - Submit handler (receives { rating, comment })
 * @param {Function} props.onCancel - Cancel handler
 * @param {Object} props.initialData - Initial form data (for editing)
 * @param {boolean} props.isSubmitting - Whether form is submitting
 */
export const ReviewForm = ({
  onSubmit,
  onCancel,
  initialData = null,
  isSubmitting = false,
}) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [comment, setComment] = useState(initialData?.comment || "");
  const [errors, setErrors] = useState({});

  const handleRatingClick = useCallback((selectedRating) => {
    setRating(selectedRating);
    setErrors((prev) => ({ ...prev, rating: null }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      // Validation
      const newErrors = {};
      if (rating < 1 || rating > 5) {
        newErrors.rating = "Please select a rating";
      }
      if (!comment.trim()) {
        newErrors.comment = "Please enter a review comment";
      }
      if (comment.trim().length < 10) {
        newErrors.comment = "Review comment must be at least 10 characters";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});
      onSubmit({ rating, comment: comment.trim() });
    },
    [rating, comment, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Rating Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
          Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star)}
              disabled={isSubmitting}
              className={`transition-transform hover:scale-110 ${
                isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              <i
                className={`text-2xl ${
                  star <= rating
                    ? "bi bi-star-fill text-yellow-500"
                    : "bi bi-star text-gray-300 dark:text-gray-600"
                }`}
              ></i>
            </button>
          ))}
          {rating > 0 && (
            <span className="text-sm text-gray-600 dark:text-slate-400 ml-2">
              {rating} out of 5
            </span>
          )}
        </div>
        {errors.rating && <FormError message={errors.rating} />}
      </div>

      {/* Comment */}
      <div>
        <FormTextarea
          label="Review Comment"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            setErrors((prev) => ({ ...prev, comment: null }));
          }}
          placeholder="Share your experience with this product..."
          rows={5}
          required
          disabled={isSubmitting}
          error={errors.comment}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          }`}
        >
          {isSubmitting ? "Submitting..." : initialData ? "Update Review" : "Submit Review"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};


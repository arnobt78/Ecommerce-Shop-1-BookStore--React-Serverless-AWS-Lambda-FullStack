/**
 * ErrorState Component
 *
 * A reusable error state component.
 * Follows ShadCN UI patterns for consistency.
 *
 * @param {string} message - Error message
 * @param {Function} onRetry - Optional retry function
 * @param {string} className - Additional CSS classes
 */

export function ErrorState({ message, onRetry, className = "" }) {
  return (
    <div
      className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}
    >
      <p className="text-red-800 dark:text-red-200 mb-2">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm"
        >
          Retry
        </button>
      )}
    </div>
  );
}


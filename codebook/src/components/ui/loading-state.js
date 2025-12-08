/**
 * LoadingState Component
 *
 * A reusable loading state component.
 * Follows ShadCN UI patterns for consistency.
 *
 * @param {string} message - Loading message
 * @param {string} className - Additional CSS classes
 */

export function LoadingState({ message = "Loading...", className = "" }) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center ${className}`}
    >
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
}


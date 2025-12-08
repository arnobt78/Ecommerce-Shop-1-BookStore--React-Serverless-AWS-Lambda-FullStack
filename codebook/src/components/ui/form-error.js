/**
 * FormError Component
 *
 * A reusable form error message component with consistent styling.
 * Follows ShadCN UI patterns for consistency.
 *
 * @param {string} message - Error message to display
 * @param {string} className - Additional CSS classes
 */

export function FormError({ message, className = "" }) {
  if (!message) return null;

  return (
    <p className={`mt-1 text-sm text-red-600 dark:text-red-400 ${className}`}>
      {message}
    </p>
  );
}


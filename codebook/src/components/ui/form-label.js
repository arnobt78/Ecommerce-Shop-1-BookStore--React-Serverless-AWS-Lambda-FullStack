/**
 * FormLabel Component
 *
 * A reusable form label component with consistent styling.
 * Follows ShadCN UI patterns for consistency.
 *
 * @param {string} htmlFor - Label for attribute
 * @param {string} children - Label text
 * @param {boolean} required - Show required indicator
 * @param {string} className - Additional CSS classes
 */

export function FormLabel({ htmlFor, children, required = false, className = "" }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${className}`}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}


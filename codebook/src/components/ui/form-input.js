/**
 * FormInput Component
 *
 * A reusable form input component with consistent styling.
 * Follows ShadCN UI patterns for consistency.
 *
 * @param {string} id - Input ID
 * @param {string} name - Input name
 * @param {string} type - Input type (text, email, number, etc.)
 * @param {string} value - Input value
 * @param {Function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {boolean} required - Required field indicator
 * @param {boolean} disabled - Disable the input
 * @param {string} error - Error message (if any, adds error styling)
 * @param {string} className - Additional CSS classes
 * @param {Object} props - Additional input props
 */

export function FormInput({
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error = null,
  className = "",
  ...props
}) {
  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed ${
        error
          ? "border-red-500 dark:border-red-500"
          : "border-gray-300 dark:border-gray-600"
      } ${className}`}
      {...props}
    />
  );
}

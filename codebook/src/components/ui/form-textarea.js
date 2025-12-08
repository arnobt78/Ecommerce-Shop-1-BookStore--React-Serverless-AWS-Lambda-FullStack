/**
 * FormTextarea Component
 *
 * A reusable form textarea component with consistent styling.
 * Follows ShadCN UI patterns for consistency.
 *
 * @param {string} id - Textarea ID
 * @param {string} name - Textarea name
 * @param {string} value - Textarea value
 * @param {Function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {number} rows - Number of rows (default: 3)
 * @param {boolean} required - Required field indicator
 * @param {boolean} disabled - Disable the textarea
 * @param {string} className - Additional CSS classes
 * @param {Object} props - Additional textarea props
 */

export function FormTextarea({
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      rows={rows}
      className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed resize-y ${className}`}
      {...props}
    />
  );
}


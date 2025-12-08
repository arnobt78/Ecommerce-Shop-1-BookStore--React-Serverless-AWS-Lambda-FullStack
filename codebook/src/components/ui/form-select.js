/**
 * FormSelect Component
 *
 * A reusable form select component with consistent styling.
 * Follows ShadCN UI patterns for consistency.
 *
 * @param {string} id - Select ID
 * @param {string} name - Select name
 * @param {string} value - Selected value
 * @param {Function} onChange - Change handler
 * @param {Array} options - Array of {value, label} objects
 * @param {boolean} required - Required field indicator
 * @param {boolean} disabled - Disable the select
 * @param {string} className - Additional CSS classes
 * @param {Object} props - Additional select props
 */

export function FormSelect({
  id,
  name,
  value,
  onChange,
  options = [],
  required = false,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}


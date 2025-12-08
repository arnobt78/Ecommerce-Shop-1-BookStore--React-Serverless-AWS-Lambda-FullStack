/**
 * FormCheckbox Component
 *
 * A reusable form checkbox component with consistent styling.
 * Follows ShadCN UI patterns for consistency.
 *
 * @param {string} id - Checkbox ID
 * @param {string} name - Checkbox name
 * @param {boolean} checked - Checked state
 * @param {Function} onChange - Change handler
 * @param {string} label - Label text
 * @param {boolean} disabled - Disable the checkbox
 * @param {string} className - Additional CSS classes
 * @param {Object} props - Additional checkbox props
 */

export function FormCheckbox({
  id,
  name,
  checked,
  onChange,
  label,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        {...props}
      />
      {label && (
        <label
          htmlFor={id}
          className={`ml-2 text-sm font-medium ${
            disabled
              ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "text-gray-700 dark:text-gray-300 cursor-pointer"
          }`}
        >
          {label}
        </label>
      )}
    </div>
  );
}


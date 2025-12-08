/**
 * QuantityInput Component
 *
 * A reusable quantity input component with increase/decrease buttons.
 * Follows ShadCN UI patterns for consistency.
 *
 * @param {number} value - Current quantity value
 * @param {Function} onChange - Change handler (receives new quantity)
 * @param {number} min - Minimum quantity (default: 1)
 * @param {number} max - Maximum quantity (optional)
 * @param {boolean} disabled - Disable the input
 * @param {string} className - Additional CSS classes
 */

export function QuantityInput({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
  className = "",
}) {
  const handleDecrease = () => {
    if (!disabled && value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (!disabled && (!max || value < max)) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value.trim();
    
    // Handle empty input - allow it temporarily for better UX
    if (inputValue === "") {
      return; // Don't update, let user continue typing
    }
    
    const newValue = parseInt(inputValue, 10);
    
    // Handle invalid input
    if (isNaN(newValue)) {
      return; // Don't update if invalid
    }
    
    // Validate and update
    if (newValue >= min && (!max || newValue <= max)) {
      onChange(newValue);
    } else if (newValue < min) {
      onChange(min);
    } else if (max && newValue > max) {
      onChange(max);
    }
  };

  return (
    <div className={`flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={handleDecrease}
        disabled={disabled || value <= min}
        className="px-3 py-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        <span className="bi-dash text-lg"></span>
      </button>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        className="w-16 px-2 py-1.5 text-center text-sm border-0 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        type="button"
        onClick={handleIncrease}
        disabled={disabled || (max && value >= max)}
        className="px-3 py-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        <span className="bi-plus text-lg"></span>
      </button>
    </div>
  );
}


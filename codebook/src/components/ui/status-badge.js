/**
 * StatusBadge Component
 *
 * A reusable status badge component with predefined color schemes.
 * Follows ShadCN UI patterns for consistency.
 *
 * @param {string} status - Status value (pending, processing, shipped, delivered, cancelled, in_stock, out_of_stock, etc.)
 * @param {string} className - Additional CSS classes
 * @param {boolean} asSelect - Render as select dropdown instead of badge (for editable status)
 * @param {Function} onChange - Change handler (required if asSelect is true)
 * @param {Array} options - Options array for select (required if asSelect is true)
 * @param {boolean} disabled - Disable the select (if asSelect is true)
 * @param {Object} customLabels - Custom label mapping for status values
 */

export function StatusBadge({
  status,
  className = "",
  asSelect = false,
  onChange,
  options = [],
  disabled = false,
  customLabels = {},
}) {
  // Get status badge color based on status value
  const getStatusColor = (statusValue) => {
    const statusLower = (statusValue || "").toLowerCase();
    
    // Order statuses
    if (statusLower === "pending") {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
    if (statusLower === "processing") {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
    if (statusLower === "shipped") {
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    }
    if (statusLower === "delivered") {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
    if (statusLower === "cancelled") {
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    }
    if (statusLower === "refunded") {
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    }
    
    // Verification statuses
    if (statusLower === "verified") {
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    }
    if (statusLower === "unverified") {
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
    
    // Stock statuses
    if (statusLower === "in_stock" || statusLower === "in stock") {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
    if (statusLower === "out_of_stock" || statusLower === "out of stock") {
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    }
    
    // Product statuses
    if (statusLower === "best_seller" || statusLower === "best seller") {
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    }
    if (statusLower === "featured") {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
    
    // Role statuses
    if (statusLower === "admin") {
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    }
    if (statusLower === "user") {
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
    
    // Default
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  };

  // Format status label
  const formatStatusLabel = (statusValue) => {
    if (!statusValue) return "N/A";
    
    // Check for custom label first
    if (customLabels[statusValue]) {
      return customLabels[statusValue];
    }
    
    const statusLower = statusValue.toLowerCase();
    
    // Handle snake_case and camelCase
    if (statusLower.includes("_")) {
      return statusValue
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    
    return statusValue.charAt(0).toUpperCase() + statusValue.slice(1);
  };

  if (asSelect && onChange && options.length > 0) {
    return (
      <select
        value={status || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`text-xs font-medium px-2.5 py-0.5 rounded-full border-0 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${getStatusColor(
          status
        )} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
        status
      )} ${className}`}
    >
      {formatStatusLabel(status)}
    </span>
  );
}


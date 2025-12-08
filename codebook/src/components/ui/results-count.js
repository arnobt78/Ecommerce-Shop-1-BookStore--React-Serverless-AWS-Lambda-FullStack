/**
 * ResultsCount Component
 *
 * A reusable component to display filtered results count.
 * Follows ShadCN UI patterns for consistency.
 *
 * @param {number} filteredCount - Number of filtered results
 * @param {number} totalCount - Total number of results
 * @param {string} entityName - Entity name (e.g., "products", "orders", "users")
 * @param {string} className - Additional CSS classes
 */

export function ResultsCount({
  filteredCount,
  totalCount,
  entityName = "items",
  className = "",
}) {
  return (
    <div className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}>
      Showing {filteredCount} of {totalCount || 0} {entityName}
    </div>
  );
}


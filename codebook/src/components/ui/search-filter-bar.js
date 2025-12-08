/**
 * SearchFilterBar Component
 *
 * A reusable search and filter bar component.
 * Combines SearchInput and FilterSelect in a responsive layout.
 * Follows ShadCN UI patterns for consistency.
 *
 * @param {string} searchValue - Current search value
 * @param {Function} onSearchChange - Search change handler
 * @param {string} searchPlaceholder - Search placeholder text
 * @param {string} filterValue - Current filter value
 * @param {Function} onFilterChange - Filter change handler
 * @param {Array} filterOptions - Filter options array
 * @param {ReactNode} children - Optional additional content (e.g., ResultsCount)
 * @param {string} className - Additional CSS classes
 */

export function SearchFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterValue,
  onFilterChange,
  filterOptions = [],
  children,
  className = "",
}) {
  return (
    <div
      className={`p-4 sm:p-6 ${className}`}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <span className="bi-search text-sm"></span>
          </span>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear search"
            >
              <span className="bi-x-lg text-sm"></span>
            </button>
          )}
        </div>

        {/* Filter Select */}
        {filterOptions.length > 0 && (
          <div className="w-full sm:w-48 flex-shrink-0">
            <select
              value={filterValue}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Additional Content (e.g., ResultsCount) */}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}

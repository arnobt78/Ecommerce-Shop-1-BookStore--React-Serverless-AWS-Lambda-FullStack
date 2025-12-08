/**
 * SearchInput Component
 *
 * A reusable search input component with clear button and icon.
 * Follows ShadCN UI patterns for consistency.
 *
 * @param {string} value - Current search value
 * @param {Function} onChange - Change handler function
 * @param {string} placeholder - Placeholder text
 * @param {string} className - Additional CSS classes
 */

export function SearchInput({ value, onChange, placeholder = "Search...", className = "" }) {
  return (
    <div className={`flex-1 relative ${className}`}>
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
        <span className="bi-search text-sm"></span>
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Clear search"
        >
          <span className="bi-x-lg text-sm"></span>
        </button>
      )}
    </div>
  );
}


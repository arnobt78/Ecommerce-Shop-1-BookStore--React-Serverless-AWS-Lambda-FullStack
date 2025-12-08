/**
 * SortableTable Component
 *
 * A reusable table component with sortable columns.
 * Supports ascending/descending sorting with visual indicators.
 *
 * @param {Array} data - Array of data objects to display
 * @param {Array} columns - Array of column definitions
 * @param {Function} renderRow - Function to render each row (receives item and index)
 * @param {string} defaultSortColumn - Column key to sort by default
 * @param {string} defaultSortDirection - 'asc' or 'desc' for default sort direction
 *
 * Column definition format:
 * {
 *   key: 'columnKey',           // Unique key for the column
 *   label: 'Column Name',       // Display label
 *   sortable: true,             // Whether column is sortable
 *   sortFn: (a, b) => {...},   // Optional custom sort function
 *   className: '...'            // Optional className for header
 * }
 *
 * Usage:
 * <SortableTable
 *   data={products}
 *   columns={[
 *     { key: 'name', label: 'Name', sortable: true },
 *     { key: 'price', label: 'Price', sortable: true, sortFn: (a, b) => a.price - b.price }
 *   ]}
 *   renderRow={(item, index) => <tr>...</tr>}
 *   defaultSortColumn="name"
 *   defaultSortDirection="asc"
 * />
 */

import { useState, useMemo } from "react";

export function SortableTable({
  data = [],
  columns = [],
  renderRow,
  defaultSortColumn = null,
  defaultSortDirection = "asc",
  className = "",
  headerClassName = "",
  bodyClassName = "",
}) {
  const [sortColumn, setSortColumn] = useState(defaultSortColumn);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);

  // Handle column header click
  const handleSort = (column) => {
    if (!column.sortable) return;

    if (sortColumn === column.key) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new column and default to ascending
      setSortColumn(column.key);
      setSortDirection("asc");
    }
  };

  // Sort data based on current sort column and direction
  const sortedData = useMemo(() => {
    if (!sortColumn) return data;

    const column = columns.find((col) => col.key === sortColumn);
    if (!column || !column.sortable) return data;

    const sorted = [...data].sort((a, b) => {
      // Use custom sort function if provided
      if (column.sortFn) {
        return column.sortFn(a, b);
      }

      // Default sorting logic
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // String comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue);
      }

      // Number comparison
      if (typeof aValue === "number" && typeof bValue === "number") {
        return aValue - bValue;
      }

      // Fallback to string comparison
      return String(aValue).localeCompare(String(bValue));
    });

    // Reverse if descending
    return sortDirection === "desc" ? sorted.reverse() : sorted;
  }, [data, sortColumn, sortDirection, columns]);

  // Get sort icon for column
  const getSortIcon = (column) => {
    if (!column.sortable) return null;
    if (sortColumn !== column.key) {
      return (
        <span className="ml-2 text-gray-400 dark:text-gray-500 text-xs">
          <span className="bi-arrow-down-up"></span>
        </span>
      );
    }
    return (
      <span className="ml-2 text-blue-600 dark:text-blue-400 text-xs">
        {sortDirection === "asc" ? (
          <span className="bi-arrow-up"></span>
        ) : (
          <span className="bi-arrow-down"></span>
        )}
      </span>
    );
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead className={`bg-gray-50 dark:bg-gray-900 ${headerClassName}`}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => handleSort(column)}
                className={`${
                  headerClassName && headerClassName.includes("[&_th]:")
                    ? ""
                    : "px-4 sm:px-6"
                } py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                  column.sortable
                    ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none"
                    : ""
                } ${column.className || ""}`}
              >
                <div className="flex items-center">
                  <span>{column.label}</span>
                  {getSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className={`bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 ${bodyClassName}`}
        >
          {sortedData.map((item, index) => renderRow(item, index))}
        </tbody>
      </table>
    </div>
  );
}

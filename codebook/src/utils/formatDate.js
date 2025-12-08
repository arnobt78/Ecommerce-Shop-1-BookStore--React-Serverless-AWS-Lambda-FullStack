/**
 * Date Formatting Utility
 * 
 * Centralized utility for formatting dates consistently across the application.
 * Ensures consistent date display with proper formatting options.
 * 
 * @param {string|Date} dateString - Date value to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.includeTime - Include time in output (default: false)
 * @param {string} options.format - Format type: 'short' | 'long' | 'full' (default: 'short')
 * @returns {string} - Formatted date string
 */

/**
 * Format date with short format (e.g., "Nov 24, 2025")
 * @param {string|Date} dateString - Date to format
 * @returns {string} - Formatted date
 */
export function formatDateShort(dateString) {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
}

/**
 * Format date with long format including time (e.g., "November 24, 2025, 10:30 AM")
 * @param {string|Date} dateString - Date to format
 * @returns {string} - Formatted date with time
 */
export function formatDateLong(dateString) {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "N/A";
  }
}

/**
 * Format date with full format (e.g., "November 24, 2025, 10:30:45 AM")
 * @param {string|Date} dateString - Date to format
 * @returns {string} - Formatted date with full time
 */
export function formatDateFull(dateString) {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return "N/A";
  }
}

/**
 * Main formatDate function with options
 * @param {string|Date} dateString - Date to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.includeTime - Include time (default: false)
 * @param {string} options.format - Format type: 'short' | 'long' | 'full' (default: 'short')
 * @returns {string} - Formatted date
 */
export function formatDate(dateString, options = {}) {
  const { includeTime = false, format = "short" } = options;

  if (includeTime || format === "long") {
    return formatDateLong(dateString);
  }
  if (format === "full") {
    return formatDateFull(dateString);
  }
  return formatDateShort(dateString);
}


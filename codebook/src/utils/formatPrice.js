/**
 * Price Formatting Utility
 * 
 * Centralized utility for formatting prices consistently across the application.
 * Ensures consistent currency display with proper decimal places.
 * 
 * @param {number|string} price - Price value to format
 * @returns {string} - Formatted price string (e.g., "29.00")
 */

export function formatPrice(price) {
  if (price === null || price === undefined || isNaN(price)) {
    return "0.00";
  }
  
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return "0.00";
  }
  
  return numPrice.toFixed(2);
}


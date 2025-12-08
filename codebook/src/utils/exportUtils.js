/**
 * Export Utilities
 *
 * Functions for exporting analytics data to CSV and PDF formats.
 * All exports are done client-side without server calls.
 */

/**
 * Export data to CSV format
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {Array} columns - Array of { key, label } objects for column mapping
 */
export function exportToCSV(data, filename = "export", columns = null) {
  if (!data || data.length === 0) {
    // Silently return - error handling is done in the component
    return;
  }

  // If columns not provided, use all keys from first object
  const headers = columns
    ? columns.map((col) => col.label)
    : Object.keys(data[0]);

  // Create CSV rows
  const rows = data.map((item) => {
    if (columns) {
      return columns.map((col) => {
        const value = item[col.key];
        // Handle nested values and format
        if (value === null || value === undefined) return "";
        if (typeof value === "object") return JSON.stringify(value);
        // Escape commas and quotes in CSV
        const stringValue = String(value);
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
    } else {
      return Object.values(item).map((value) => {
        if (value === null || value === undefined) return "";
        if (typeof value === "object") return JSON.stringify(value);
        const stringValue = String(value);
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
    }
  });

  // Combine headers and rows
  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export revenue data to CSV
 * @param {Array} revenueData - Array of { date, revenue } objects
 * @param {string} period - Time period ('daily', 'weekly', 'monthly', 'yearly')
 */
export function exportRevenueToCSV(revenueData, period = "monthly") {
  exportToCSV(
    revenueData,
    `revenue-${period}`,
    [
      { key: "date", label: "Date" },
      { key: "revenue", label: "Revenue ($)" },
    ]
  );
}

/**
 * Export top products to CSV
 * @param {Array} topProducts - Array of { productId, productName, quantity, revenue } objects
 */
export function exportTopProductsToCSV(topProducts) {
  exportToCSV(
    topProducts,
    "top-products",
    [
      { key: "productName", label: "Product Name" },
      { key: "quantity", label: "Quantity Sold" },
      { key: "revenue", label: "Revenue ($)" },
    ]
  );
}

/**
 * Export user analytics to CSV
 * @param {Array} registrationTrends - Array of { date, count } objects
 */
export function exportUserAnalyticsToCSV(registrationTrends) {
  exportToCSV(
    registrationTrends,
    "user-registration-trends",
    [
      { key: "date", label: "Month" },
      { key: "count", label: "New Users" },
    ]
  );
}

/**
 * Export sales trends to CSV
 * @param {Array} trendsData - Array of { date, revenue, orders } objects
 */
export function exportSalesTrendsToCSV(trendsData) {
  exportToCSV(
    trendsData,
    "sales-trends",
    [
      { key: "date", label: "Date" },
      { key: "revenue", label: "Revenue ($)" },
      { key: "orders", label: "Orders" },
    ]
  );
}

/**
 * Export analytics summary to CSV
 * @param {Object} summary - Summary object with analytics metrics
 */
export function exportSummaryToCSV(summary) {
  const summaryArray = [
    { Metric: "Total Revenue", Value: `$${summary.totalRevenue?.toLocaleString() || 0}` },
    { Metric: "Total Orders", Value: summary.totalOrders || 0 },
    { Metric: "Total Products", Value: summary.totalProducts || 0 },
    { Metric: "Total Users", Value: summary.totalUsers || 0 },
    { Metric: "Average Order Value", Value: `$${summary.averageOrderValue?.toLocaleString() || 0}` },
  ];

  exportToCSV(summaryArray, "analytics-summary", [
    { key: "Metric", label: "Metric" },
    { key: "Value", label: "Value" },
  ]);
}

/**
 * Print analytics page to PDF (using browser print)
 * This function triggers the browser's print dialog
 * Users can save as PDF from the print dialog
 */
export function printToPDF() {
  window.print();
}


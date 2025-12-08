/**
 * TopProductsChart Component
 *
 * Reusable chart component for displaying top-selling products.
 * Shows revenue and quantity sold per product.
 *
 * @param {Array} data - Array of { productId, productName, quantity, revenue } objects
 * @param {number} limit - Number of products to display (default: 10)
 * @param {string} className - Additional CSS classes
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "./card";
import { LoadingState, ErrorState, EmptyState } from "./index";

export function TopProductsChart({
  data = [],
  limit = 10,
  isLoading = false,
  error = null,
  className = "",
}) {
  if (isLoading) {
    return (
      <Card className={`p-4 sm:p-6 ${className}`}>
        <LoadingState message="Loading top products..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-4 sm:p-6 ${className}`}>
        <ErrorState message={error.message || "Failed to load top products"} />
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className={`p-4 sm:p-6 ${className}`}>
        <EmptyState message="No product sales data available" />
      </Card>
    );
  }

  // Limit data and format for chart
  const chartData = data.slice(0, limit).map((item) => ({
    ...item,
    name: item.productName,
  }));

  // Format currency for tooltip
  const formatCurrency = (value) => {
    return `$${Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Custom tooltip component for better control
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3">
        <p className="font-semibold text-gray-900 dark:text-white mb-2">
          {label}
        </p>
        {payload.map((entry, index) => {
          const isRevenue = entry.dataKey === "revenue";
          return (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {isRevenue ? "Revenue" : "Quantity"}:{" "}
              {isRevenue ? formatCurrency(entry.value) : entry.value}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <Card className={`p-4 sm:p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Top {limit} Selling Products
      </h3>
      <div className="overflow-x-auto sm:overflow-x-visible -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="min-w-[600px] sm:min-w-0">
          <ResponsiveContainer width="100%" height={600}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              barCategoryGap="0%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-300 dark:stroke-gray-700"
              />
              <XAxis
                type="number"
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                className="text-xs text-gray-600 dark:text-gray-400"
              />
              <YAxis
                type="category"
                dataKey="name"
                width={140}
                className="text-xs text-gray-600 dark:text-gray-400"
                angle={0}
                textAnchor="end"
                tickFormatter={(value) => {
                  // Truncate long names but keep them on one line
                  return value.length > 40
                    ? `${value.substring(0, 40)}...`
                    : value;
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="revenue"
                fill="#3b82f6"
                name="Revenue"
                radius={[0, 8, 8, 0]}
              />
              <Bar
                dataKey="quantity"
                fill="#10b981"
                name="Quantity Sold"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

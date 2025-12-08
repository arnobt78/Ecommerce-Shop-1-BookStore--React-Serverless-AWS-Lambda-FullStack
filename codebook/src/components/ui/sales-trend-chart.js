/**
 * SalesTrendChart Component
 *
 * Reusable chart component for displaying sales trends over time.
 * Shows both revenue and order count trends.
 *
 * @param {Array} data - Array of { date, revenue, orders } objects
 * @param {string} className - Additional CSS classes
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "./card";
import { LoadingState, ErrorState, EmptyState } from "./index";

export function SalesTrendChart({ data = [], isLoading = false, error = null, className = "" }) {
  if (isLoading) {
    return (
      <Card className={`p-4 sm:p-6 ${className}`}>
        <LoadingState message="Loading sales trends..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-4 sm:p-6 ${className}`}>
        <ErrorState message={error.message || "Failed to load sales trends"} />
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className={`p-4 sm:p-6 ${className}`}>
        <EmptyState message="No sales trend data available" />
      </Card>
    );
  }

  // Format date labels
  const formatDateLabel = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Format currency for tooltip
  const formatCurrency = (value) => {
    return `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Custom tooltip component for better control
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3">
        <p className="font-semibold text-gray-900 dark:text-white mb-2">{formatDateLabel(label)}</p>
        {payload.map((entry, index) => {
          const isRevenue = entry.dataKey === "revenue";
          return (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {isRevenue ? "Revenue" : "Orders"}:{" "}
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
        Sales Trends (Last 30 Days)
      </h3>
      <div className="overflow-x-auto sm:overflow-x-visible -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="min-w-[600px] sm:min-w-0">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDateLabel}
                className="text-xs text-gray-600 dark:text-gray-400"
              />
              <YAxis
                yAxisId="left"
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                className="text-xs text-gray-600 dark:text-gray-400"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                className="text-xs text-gray-600 dark:text-gray-400"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Revenue"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="#10b981"
                strokeWidth={2}
                name="Orders"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}


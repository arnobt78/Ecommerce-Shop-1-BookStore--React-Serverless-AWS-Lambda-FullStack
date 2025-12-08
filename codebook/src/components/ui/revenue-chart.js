/**
 * RevenueChart Component
 *
 * Reusable chart component for displaying revenue by time period.
 * Uses Recharts library for visualization.
 *
 * @param {Array} data - Array of { date, revenue } objects
 * @param {string} period - Time period ('daily', 'weekly', 'monthly', 'yearly')
 * @param {string} className - Additional CSS classes
 */

import {
  LineChart,
  Line,
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

export function RevenueChart({ data = [], period = "monthly", isLoading = false, error = null, className = "" }) {
  if (isLoading) {
    return (
      <Card className={`p-4 sm:p-6 ${className}`}>
        <LoadingState message="Loading revenue data..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-4 sm:p-6 ${className}`}>
        <ErrorState message={error.message || "Failed to load revenue data"} />
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className={`p-4 sm:p-6 ${className}`}>
        <EmptyState message="No revenue data available" />
      </Card>
    );
  }

  // Format date labels based on period
  const formatDateLabel = (dateString) => {
    if (!dateString) return "";
    
    if (period === "yearly") {
      return dateString; // Just the year
    } else if (period === "monthly") {
      const [year, month] = dateString.split("-");
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    } else if (period === "weekly" || period === "daily") {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    return dateString;
  };

  // Format currency for tooltip
  const formatCurrency = (value) => {
    return `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Card className={`p-4 sm:p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Revenue by {period.charAt(0).toUpperCase() + period.slice(1)}
      </h3>
      <div className="overflow-x-auto sm:overflow-x-visible -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="min-w-[600px] sm:min-w-0">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDateLabel}
                className="text-xs text-gray-600 dark:text-gray-400"
              />
              <YAxis
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                className="text-xs text-gray-600 dark:text-gray-400"
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                labelFormatter={(label) => formatDateLabel(label)}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="revenue"
                fill="#3b82f6"
                name="Revenue"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}


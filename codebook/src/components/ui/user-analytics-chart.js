/**
 * UserAnalyticsChart Component
 *
 * Reusable chart component for displaying user registration trends.
 * Shows monthly user registration counts.
 *
 * @param {Array} data - Array of { date, count } objects
 * @param {string} className - Additional CSS classes
 */

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "./card";
import { LoadingState, ErrorState, EmptyState } from "./index";

export function UserAnalyticsChart({ data = [], isLoading = false, error = null, className = "" }) {
  if (isLoading) {
    return (
      <Card className={`p-4 sm:p-6 ${className}`}>
        <LoadingState message="Loading user analytics..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-4 sm:p-6 ${className}`}>
        <ErrorState message={error.message || "Failed to load user analytics"} />
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className={`p-4 sm:p-6 ${className}`}>
        <EmptyState message="No user registration data available" />
      </Card>
    );
  }

  // Format date labels (monthly)
  const formatDateLabel = (dateString) => {
    if (!dateString) return "";
    const [year, month] = dateString.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <Card className={`p-4 sm:p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        User Registration Trends
      </h3>
      <div className="overflow-x-auto sm:overflow-x-visible -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="min-w-[600px] sm:min-w-0">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDateLabel}
                className="text-xs text-gray-600 dark:text-gray-400"
              />
              <YAxis className="text-xs text-gray-600 dark:text-gray-400" />
              <Tooltip
                formatter={(value) => [value, "New Users"]}
                labelFormatter={(label) => formatDateLabel(label)}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUsers)"
                name="New Users"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}


/**
 * AdminMetricsCard Component
 * 
 * Reusable card component for displaying admin dashboard metrics.
 * 
 * @param {string} title - Card title
 * @param {string|number} value - Metric value to display
 * @param {string} icon - Bootstrap icon class name
 * @param {string} color - Color theme (blue, green, purple, orange, indigo)
 * @param {string} subtitle - Optional subtitle text
 */

export const AdminMetricsCard = ({ title, value, icon, color, subtitle }) => {
  // Color theme configuration
  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
    green: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
    purple: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
    orange: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
    indigo: "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300",
  };

  const iconBgClass = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgClass}`}
        >
          <span className={`bi ${icon} text-xl`}></span>
        </div>
      </div>
    </div>
  );
};


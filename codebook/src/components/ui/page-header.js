/**
 * PageHeader Component
 *
 * A reusable page header component with title, description, and action buttons.
 * Follows ShadCN UI patterns for consistency.
 *
 * @param {string} title - Page title
 * @param {string} description - Page description
 * @param {ReactNode} actions - Optional action buttons/elements
 * @param {Function} onToggleSidebar - Toggle sidebar function (for mobile)
 * @param {boolean} showBackButton - Show back button
 * @param {Function} onBack - Back button handler
 */

export function PageHeader({
  title,
  description,
  actions,
  onToggleSidebar,
  showBackButton = false,
  onBack,
}) {
  return (
    <div className="flex items-center gap-3">
      {/* Burger Menu Button - Only visible on mobile (sm and below) */}
      {onToggleSidebar && (
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          <span className="bi-list text-2xl"></span>
        </button>
      )}
      
      {/* Back Button */}
      {showBackButton && onBack && (
        <button
          onClick={onBack}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          aria-label="Go back"
        >
          <span className="bi-arrow-left text-xl"></span>
        </button>
      )}
      
      <div className="flex-1">
        <h1 className="text-xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-md">
            {description}
          </p>
        )}
      </div>
      
      {/* Action Buttons */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}


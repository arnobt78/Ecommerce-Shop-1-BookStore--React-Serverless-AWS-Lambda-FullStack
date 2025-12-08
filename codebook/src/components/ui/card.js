/**
 * Card Component
 *
 * A reusable card component container.
 * Follows ShadCN UI patterns for consistency.
 *
 * @param {ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 * @param {string} header - Optional header text
 * @param {ReactNode} headerAction - Optional action button/element in header
 * @param {Function} onClick - Optional click handler
 * @param {Object} props - Additional props to forward to the root div
 */

export function Card({ children, className = "", header, headerAction, onClick, ...props }) {
  // Check if className includes padding classes (p-*, px-*, py-*, pt-*, pb-*, pl-*, pr-*)
  // This includes responsive variants like sm:p-*, md:p-*, etc.
  const hasCustomPadding = /(^|\s)(p[xy]?|pt|pb|pl|pr)-[0-9]+|(^|\s)(sm|md|lg|xl|2xl):(p[xy]?|pt|pb|pl|pr)-[0-9]+/.test(className);
  
  // Extract padding classes from className to apply to header (remove from root className)
  let rootClassName = className;
  let headerPadding = "p-0 sm:p-6";
  
  if (hasCustomPadding) {
    // Extract padding classes
    const paddingMatches = className.match(/(?:^|\s)((?:p[xy]?|pt|pb|pl|pr)-[0-9]+|(?:sm|md|lg|xl|2xl):(?:p[xy]?|pt|pb|pl|pr)-[0-9]+)/g);
    if (paddingMatches) {
      headerPadding = paddingMatches.map(m => m.trim()).join(' ');
      // Remove padding classes from root className
      paddingMatches.forEach(match => {
        rootClassName = rootClassName.replace(new RegExp(`\\s*${match.trim()}\\s*`, 'g'), ' ').trim();
      });
    }
  }
  
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${rootClassName}`}
      onClick={onClick}
      {...props}
    >
      {header && (
        <div className={`${headerPadding} border-b border-gray-200 dark:border-gray-700 flex items-center justify-between`}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{header}</h2>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {!hasCustomPadding && (
        <div className={header ? "p-0 sm:p-6" : "p-0 sm:p-6"}>{children}</div>
      )}
      {hasCustomPadding && (
        <div className={headerPadding}>{children}</div>
      )}
    </div>
  );
}


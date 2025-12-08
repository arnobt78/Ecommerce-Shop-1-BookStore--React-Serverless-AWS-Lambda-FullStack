/**
 * AdminSettingsPage Component
 *
 * Settings page for admin panel.
 * Currently displays a note that settings features are not yet implemented,
 * except for the theme mode toggle which is available in the navbar.
 */

import { useTitle } from "../../hooks/useTitle";
import { AdminLayout, useAdminLayout } from "../../components/Layouts/Admin";
import { PageHeader, Card } from "../../components/ui";

// Inner component that uses the AdminLayout context
const AdminSettingsContent = () => {
  const { toggleSidebar } = useAdminLayout();

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Page Header */}
      <PageHeader
        title="Settings"
        description="Manage your admin panel settings"
        onToggleSidebar={toggleSidebar}
      />

      {/* Settings Content */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Note Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="bi-info-circle text-blue-600 dark:text-blue-400 text-xl flex-shrink-0 mt-0.5"></span>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Settings Features Coming Soon
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                  Currently, there are no settings features available in the admin panel.
                  The only setting currently available is the <strong>Theme Mode</strong> toggle
                  (Light/Dark mode), which can be accessed from the main navbar at the top of the page.
                </p>
              </div>
            </div>
          </div>

          {/* Theme Mode Info */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="bi-palette text-gray-600 dark:text-gray-400 text-xl flex-shrink-0 mt-0.5"></span>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Theme Mode (Light/Dark)
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                  You can toggle between light and dark mode using the gear icon (⚙️) in the main navigation bar.
                  The theme preference is saved in your browser's local storage and will persist across sessions.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Location:</strong> Main navigation bar (top right) → Gear icon (⚙️)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Future Features Placeholder */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 opacity-60">
            <div className="flex items-start gap-3">
              <span className="bi-clock-history text-gray-400 dark:text-gray-500 text-xl flex-shrink-0 mt-0.5"></span>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Future Settings Features
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Additional settings features such as profile management, notification preferences,
                  and system configuration will be added in future updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const AdminSettingsPage = () => {
  useTitle("Admin Settings");

  return (
    <AdminLayout>
      <AdminSettingsContent />
    </AdminLayout>
  );
};


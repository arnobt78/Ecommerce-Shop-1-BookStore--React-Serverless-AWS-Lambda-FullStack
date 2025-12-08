/**
 * AdminLayout Component
 *
 * Main layout wrapper for admin panel pages.
 * Provides sidebar and main content area.
 * Handles responsive behavior and sidebar state.
 * Uses only browser scrollbar (no inner scrollbars).
 *
 * @param {React.ReactNode} children - Child components to render in main content area
 */

import { useState, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminLayoutContext } from "./AdminLayoutContext";

export const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-close sidebar on mobile when switching to desktop
      if (!mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <AdminLayoutContext.Provider value={{ toggleSidebar }}>
      <div className="flex bg-gray-50 dark:bg-gray-950 min-h-screen">
        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} onMenuClick={toggleSidebar} />

        {/* Main Content Area - Full width, uses browser scrollbar only */}
        <div className="flex-1 w-full min-w-0 ml-0 md:ml-64">
          {/* Main Content - Full width, responsive padding, no inner scrollbar */}
          <main className="w-full p-4 md:p-6 lg:p-8">
            <div className="w-full max-w-full">{children}</div>
          </main>
        </div>
      </div>
    </AdminLayoutContext.Provider>
  );
};

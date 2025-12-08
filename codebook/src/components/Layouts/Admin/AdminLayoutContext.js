/**
 * AdminLayoutContext
 *
 * Context for sharing sidebar toggle function across admin pages.
 * Allows child components to access the sidebar toggle functionality.
 */

import { createContext, useContext } from "react";

const AdminLayoutContext = createContext(null);

export const useAdminLayout = () => {
  const context = useContext(AdminLayoutContext);
  if (!context) {
    throw new Error("useAdminLayout must be used within AdminLayout");
  }
  return context;
};

export { AdminLayoutContext };


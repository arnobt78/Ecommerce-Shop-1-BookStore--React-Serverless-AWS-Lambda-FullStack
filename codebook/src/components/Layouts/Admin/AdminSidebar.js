/**
 * AdminSidebar Component
 *
 * Collapsible sidebar navigation for admin panel.
 * Provides navigation links to all admin sections.
 * Includes logo, back to store link, and user info at bottom.
 *
 * @param {boolean} isOpen - Whether sidebar is open/expanded
 * @param {Function} setIsOpen - Function to toggle sidebar state
 * @param {Function} onMenuClick - Function to toggle sidebar (for mobile menu button)
 */

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "../../../services";
import { useUser } from "../../../hooks/useUser";
import Logo from "../../../assets/logo.png";

export const AdminSidebar = ({ isOpen, setIsOpen, onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: userData } = useUser();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Load cached user email from sessionStorage (reactive to changes)
  const [cachedEmail, setCachedEmail] = useState(() => {
    try {
      return sessionStorage.getItem("userEmail") || "";
    } catch {
      return "";
    }
  });

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update cached email when sessionStorage changes or user data is fetched
  useEffect(() => {
    const checkEmail = () => {
      const email = sessionStorage.getItem("userEmail") || "";
      setCachedEmail(email);
    };

    checkEmail();
    window.addEventListener("storage", checkEmail);
    window.addEventListener("sessionStorageChange", checkEmail);
    const interval = setInterval(checkEmail, 100);

    return () => {
      window.removeEventListener("storage", checkEmail);
      window.removeEventListener("sessionStorageChange", checkEmail);
      clearInterval(interval);
    };
  }, [userData]);

  useEffect(() => {
    if (userData?.email) {
      sessionStorage.setItem("userEmail", userData.email);
      setCachedEmail(userData.email);
    }
  }, [userData]);

  const userEmail = userData?.email || cachedEmail;

  // Handle logout
  const handleLogout = () => {
    logout();
    setCachedEmail("");
    queryClient.clear();
    toast.success("Logged out successfully", {
      closeButton: true,
      position: "bottom-right",
    });
    navigate("/");
  };

  // Navigation items configuration
  const navItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: "bi-speedometer2",
    },
    {
      path: "/admin/products",
      label: "Products",
      icon: "bi-box-seam",
    },
    {
      path: "/admin/orders",
      label: "Orders",
      icon: "bi-cart-check",
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: "bi-people",
    },
    {
      path: "/admin/business-insights",
      label: "Analytics",
      icon: "bi-graph-up",
    },
    {
      path: "/admin/management-history",
      label: "History",
      icon: "bi-clock-history",
    },
    {
      path: "/admin/tickets",
      label: "Support Tickets",
      icon: "bi-ticket-perforated",
    },
    {
      path: "/admin/reviews",
      label: "Product Reviews",
      icon: "bi-star",
    },
    {
      path: "/admin/settings",
      label: "Settings",
      icon: "bi-gear",
    },
  ];

  // Check if a nav item is active
  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay - closes sidebar when clicked */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 transition-transform duration-300 ease-in-out
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:z-40
          w-64 flex-shrink-0
          h-screen
          flex flex-col
        `}
      >
        {/* Top Section: Logo + CodeBook (clickable to home) */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Link
            to="/"
            className="flex items-center hover:opacity-80 transition-opacity"
            onClick={() => {
              if (isMobile) {
                setIsOpen(false);
              }
            }}
          >
            <img src={Logo} className="mr-3 h-10" alt="CodeBook Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              CodeBook
            </span>
          </Link>
        </div>

        {/* Back to Store Link - Close gap below logo */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-4 py-2 transition-colors"
            onClick={() => {
              if (isMobile) {
                setIsOpen(false);
              }
            }}
          >
            <span className="bi-arrow-left text-lg"></span>
            <span className="text-sm font-medium">Back to Store</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 overflow-hidden">
          <ul className="space-y-2 h-full">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => {
                    // Close sidebar on mobile when navigating
                    if (isMobile) {
                      setIsOpen(false);
                    }
                  }}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      isActive(item.path)
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                  `}
                >
                  <span className={`bi ${item.icon} text-lg`}></span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section: User Email and Logout Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {/* User Email */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <span className="bi-person-circle text-xl text-gray-700 dark:text-gray-300"></span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
              {userEmail || "Loading..."}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            aria-label="Logout"
          >
            <span className="bi-box-arrow-right"></span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

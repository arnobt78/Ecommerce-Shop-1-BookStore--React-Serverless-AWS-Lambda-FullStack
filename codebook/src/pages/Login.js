import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useTitle } from "../hooks/useTitle";
import { login } from "../services";
import { getNotificationCount } from "../services/notificationService";

export const Login = () => {
  useTitle("Login");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const email = useRef();
  const password = useRef();
  const [selectedRole, setSelectedRole] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Role-based test accounts configuration
  const testAccounts = [
    {
      value: "guest",
      label: "Guest User",
      email: process.env.REACT_APP_GUEST_LOGIN,
      password: process.env.REACT_APP_GUEST_PASSWORD,
    },
    {
      value: "admin",
      label: "Guest Admin",
      email: process.env.REACT_APP_ADMIN_LOGIN,
      password: process.env.REACT_APP_ADMIN_PASSWORD,
    },
  ];

  // Handle role selection from dropdown
  function handleRoleSelect(role) {
    setSelectedRole(role);
    setIsDropdownOpen(false);

    const account = testAccounts.find((acc) => acc.value === role);
    if (account) {
      email.current.value = account.email;
      password.current.value = account.password;
    }
  }

  // Handle clearing role selection
  function handleClearRole() {
    setSelectedRole("");
    email.current.value = "";
    password.current.value = "";
    setIsDropdownOpen(false);
  }

  async function handleLogin(event) {
    event.preventDefault();
    try {
      const authDetail = {
        email: email.current.value,
        password: password.current.value,
      };
      const data = await login(authDetail);
      if (data.accessToken) {
        // Store user role in sessionStorage for protected routes
        if (selectedRole) {
          sessionStorage.setItem("userRole", selectedRole);
        } else {
          // Default to 'user' for regular logins
          sessionStorage.setItem("userRole", "user");
        }
        // Clear React Query cache to prevent showing previous user's data
        queryClient.clear();
        
        // Prefetch notification count so it's ready when dropdown opens
        // This eliminates the 1-2ms delay when opening the dropdown
        queryClient.prefetchQuery({
          queryKey: ["notification-count"],
          queryFn: getNotificationCount,
          staleTime: 0, // Always fetch fresh count on login
        });
        
        navigate("/products");
      } else {
        toast.error(data);
      }
    } catch (error) {
      toast.error(error.message, {
        closeButton: true,
        position: "bottom-right",
      });
    }
  }

  return (
    <main>
      <section>
        <p className="text-2xl text-center font-semibold dark:text-slate-100 my-10 underline underline-offset-8">
          Login
        </p>
      </section>
      <form onSubmit={handleLogin}>
        {/* Role Selection Dropdown */}
        <div className="mb-6">
          <label
            htmlFor="role-select"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Select Role Based Test Account
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 flex items-center justify-between"
            >
              <span>
                {selectedRole
                  ? testAccounts.find((acc) => acc.value === selectedRole)
                      ?.label
                  : "Select Role Based Test Account"}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                {/* Backdrop to close dropdown */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                ></div>
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-700 dark:border-gray-600">
                  <div className="py-1">
                    {testAccounts.map((account) => (
                      <button
                        key={account.value}
                        type="button"
                        onClick={() => handleRoleSelect(account.value)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white ${
                          selectedRole === account.value
                            ? "bg-blue-50 dark:bg-blue-900"
                            : ""
                        }`}
                      >
                        {account.label}
                      </button>
                    ))}
                    {selectedRole && (
                      <button
                        type="button"
                        onClick={handleClearRole}
                        className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400"
                      >
                        Clear Selection
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Email Input */}
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Email
          </label>
          <input
            ref={email}
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="test@example.com"
            required
            autoComplete="off"
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Password
          </label>
          <input
            ref={password}
            type="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        {/* Register Link */}
        <div className="mb-6 text-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Don't have account yet?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline"
            >
              Register
            </Link>
          </span>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Log In
        </button>
      </form>
    </main>
  );
};

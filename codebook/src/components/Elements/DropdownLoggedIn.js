import { useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../../services";
import { useUser } from "../../hooks/useUser";

export const DropdownLoggedIn = ({setDropdown}) => {
    const navigate = useNavigate();
    
    // Load cached user email instantly from sessionStorage for immediate display
    const cachedUser = useMemo(() => {
        try {
            const cached = sessionStorage.getItem("userEmail");
            return cached ? { email: cached } : {};
        } catch {
            return {};
        }
    }, []);
    
    // Use React Query hook - automatically handles caching, deduplication, and loading states
    const { data: userData, error } = useUser();
    
    // Use cached email for instant display, fallback to fetched data
    const user = userData?.email ? userData : cachedUser;

    // Cache email when user data is fetched
    useEffect(() => {
        if (userData?.email) {
            sessionStorage.setItem("userEmail", userData.email);
        }
    }, [userData]);

    // Handle logout if user data fetch fails and no cached email
    useEffect(() => {
        if (error && !cachedUser.email) {
            toast.error(error.message, { closeButton: true, position: "bottom-center" });
        }
    }, [error, cachedUser.email]);

    function handleLogout(){
        logout();
        // Clear cached email on logout
        sessionStorage.removeItem("userEmail");
        setDropdown(false);
        navigate("/");
    }

  return (
    <div id="dropdownAvatar" className="select-none	absolute top-10 right-0 z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
        <div className="py-3 px-4 text-sm text-gray-900 dark:text-white">
            <div className="font-medium truncate">{user.email || "Loading..."}</div>
        </div>
        <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUserAvatarButton">
            <li>
                <Link onClick={() => setDropdown(false)} to="/products" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">All eBooks</Link>
            </li>
            <li>
                <Link onClick={() => setDropdown(false)} to="/dashboard" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</Link>
            </li>
        </ul>
        <div className="py-1">
            <span onClick={handleLogout} className="cursor-pointer block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Log out</span>
        </div>
    </div>
  )
}

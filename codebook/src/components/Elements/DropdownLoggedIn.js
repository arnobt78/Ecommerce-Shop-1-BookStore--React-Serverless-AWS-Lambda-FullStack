import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getUser, logout } from "../../services";

export const DropdownLoggedIn = ({setDropdown}) => {
    const navigate = useNavigate();
    
    // Load cached user email instantly from sessionStorage
    const cachedUser = useMemo(() => {
        try {
            const cached = sessionStorage.getItem("userEmail");
            return cached ? { email: cached } : {};
        } catch {
            return {};
        }
    }, []);
    
    const [user, setUser] = useState(cachedUser);

    function handleLogout(){
        logout();
        // Clear cached email on logout
        sessionStorage.removeItem("userEmail");
        setDropdown(false);
        navigate("/");
    }

    useEffect(() => {
        // Set cached email immediately for instant display
        if (cachedUser.email) {
            setUser(cachedUser);
        }
        
        // Fetch fresh data in background to update if needed
        async function fetchData(){
            try{
                const data = await getUser();
                if (data.email) {
                    setUser(data);
                    // Cache the email for instant display next time
                    sessionStorage.setItem("userEmail", data.email);
                } else {
                    handleLogout();
                }
            } catch(error){
                // If fetch fails but we have cached email, keep showing it
                if (!cachedUser.email) {
                    toast.error(error.message, { closeButton: true, position: "bottom-center" });
                }
            }            
        }
        fetchData();
    }, [cachedUser.email]); //eslint-disable-line

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

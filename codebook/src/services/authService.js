// Use relative URLs - works with any port automatically
// REACT_APP_HOST is only needed if API is on a different domain (e.g., production)
// Remove trailing slash if present to avoid double slashes in URLs
const API_HOST = process.env.REACT_APP_HOST 
  ? process.env.REACT_APP_HOST.replace(/\/$/, '') 
  : '';

export async function login(authDetail){
    const requestOptions = {
        method: "POST",
        headers: {"content-Type": "application/json"},
        body: JSON.stringify(authDetail)
    }
    const response = await fetch(`${API_HOST}/api/login`, requestOptions);
    if(!response.ok){
        throw { message: response.statusText, status: response.status }; //eslint-disable-line
    }
    const data = await response.json();

    if(data.accessToken){
        sessionStorage.setItem("token", JSON.stringify(data.accessToken));
        sessionStorage.setItem("cbid", JSON.stringify(data.user.id));
        // Cache user email for instant display in dropdown
        if(data.user && data.user.email){
            sessionStorage.setItem("userEmail", data.user.email);
        }
        // Store user role if provided by backend, otherwise keep existing role from frontend selection
        if(data.user && data.user.role){
            sessionStorage.setItem("userRole", data.user.role);
        }
    }

    return data;
}

export async function register(authDetail){
    const requestOptions = {
        method: "POST",
        headers: {"content-Type": "application/json"},
        body: JSON.stringify(authDetail)
    }  
    const response = await fetch(`${API_HOST}/api/register`, requestOptions);
    if(!response.ok){
        throw { message: response.statusText, status: response.status }; //eslint-disable-line
    }
    const data = await response.json();
    
    if(data.accessToken){
        sessionStorage.setItem("token", JSON.stringify(data.accessToken));
        sessionStorage.setItem("cbid", JSON.stringify(data.user.id));
        // Cache user email for instant display in dropdown
        if(data.user && data.user.email){
            sessionStorage.setItem("userEmail", data.user.email);
        }
        // Store user role if provided by backend, otherwise default to 'user'
        if(data.user && data.user.role){
            sessionStorage.setItem("userRole", data.user.role);
        } else {
            // Default to 'user' for new registrations
            sessionStorage.setItem("userRole", "user");
        }
    }

    return data;
}

export function logout(){
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("cbid");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userRole");
}
const API_HOST = process.env.REACT_APP_HOST || 'http://localhost:3001';

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
    }

    return data;
}

export function logout(){
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("cbid");
    sessionStorage.removeItem("userEmail");
}
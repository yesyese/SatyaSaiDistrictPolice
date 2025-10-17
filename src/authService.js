// src/authService.js
import { api, API_BASE_URL } from './apiConfig';
// WHAT CHANGED: Global variable to store the logout timer ID
let logoutTimerId = null;

/**
 * Helper for local logout actions (clears local storage).
 */
const logoutUserLocally = () => {
    console.log("authService: Clearing tokens from localStorage.");
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    // WHAT CHANGED: Clear any existing logout timer
    clearTimeout(logoutTimerId);
    logoutTimerId = null;
};

// WHAT CHANGED: Function to decode JWT token
const decodeJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error decoding JWT:", e);
        return null;
    }
};

// WHAT CHANGED: Function to set the automatic logout timer
const setAutoLogoutTimer = (token) => {
    // Clear any existing timer first
    clearTimeout(logoutTimerId);
    logoutTimerId = null;

    const decodedToken = decodeJwt(token);
    if (!decodedToken || !decodedToken.exp) {
        console.warn("JWT token is invalid or missing expiry. Auto-logout won't be set.");
        return;
    }

    // `exp` is in seconds, convert to milliseconds
    const expiryTimeMs = decodedToken.exp * 1000;
    const currentTimeMs = new Date().getTime();
    const timeUntilExpiry = expiryTimeMs - currentTimeMs;

    // Set timer slightly before expiry (e.g., 5 seconds before) to ensure smooth logout
    const logoutDelay = timeUntilExpiry - 5000; 

    if (logoutDelay > 0) {
        console.log(`Auto-logout scheduled in ${logoutDelay / 1000} seconds.`);
        logoutTimerId = setTimeout(() => {
            console.log("Auto-logout triggered due to token expiry.");
            logoutUser(); // Call the main logout function
            window.location.reload(); // Reload the page to reflect logout state
            // Optionally, show a toast about auto-logout
            // import { toast } from 'react-toastify'; // Would need to import here
            // toast.error("Your session has expired. You have been logged out automatically.");
        }, logoutDelay);
    } else {
        console.log("Token already expired or expires very soon. Logging out immediately.");
        logoutUser(); 
        window.location.reload(); // Reload the page to reflect logout state
        // Token already expired, logout immediately
    }
};


// --- AUTHENTICATION FUNCTIONS ---

// Function to handle login
export const loginUser = async (username, password) => {
    console.log("authService: Attempting login for", username);
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
        const response = await fetch(`${API_BASE_URL}/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("authService: Login API error status:", response.status, "detail:", errorData.detail);
            throw new Error(errorData.detail || 'Authentication failed');
        }

        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('token_type', data.token_type);
        console.log("authService: Token stored successfully:", data.access_token);

        // WHAT CHANGED: Set auto-logout timer after successful login
        setAutoLogoutTimer(data.access_token);

        return data; // Return token data
    } catch (error) {
        console.error('authService: Error during login fetch:', error);
        throw error;
    }
};

// Function to fetch current user details using the stored token
export const fetchCurrentUser = async () => {
    const token = localStorage.getItem('access_token');
    const tokenType = localStorage.getItem('token_type');
    console.log("authService: Fetching current user. Token present:", !!token);

    if (!token || !tokenType) {
        console.log("authService: No token found, returning null user.");
        return null; // No token found
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            method: 'GET',
            headers: {
                'Authorization': `${tokenType} ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('authService: Failed to fetch user data. Status:', response.status, "Response text:", await response.text());
            logoutUserLocally(); // Call local logout if token is invalid or request fails
            throw new Error('Failed to fetch user data with current token.'); // Throw error to be caught by App.js
        }

        const userData = await response.json();
        console.log("authService: User data fetched successfully:", userData);

        // WHAT CHANGED: Reset auto-logout timer on successful token validation/refresh
        setAutoLogoutTimer(token);

        return userData;
    } catch (error) {
        console.error('authService: Error fetching current user (network/parse error):', error);
        logoutUserLocally(); // Call local logout on network error
        throw error; // Re-throw to propagate to App.js
    }
};

// WHAT CHANGED: Function to handle logout, including API call to backend
export const logoutUser = async () => { // Made async
    console.log("authService: Attempting full logout (API + Local).");
    const token = localStorage.getItem('access_token');
    const tokenType = localStorage.getItem('token_type');

    if (token && tokenType) {
        try {
            const response = await fetch(`${API_BASE_URL}/logout`, { // Assuming POST /logout endpoint
                method: 'POST',
                headers: {
                    'Authorization': `${tokenType} ${token}`,
                    'Content-Type': 'application/json'
                },
                // body: JSON.stringify({}) // Send empty body if backend expects JSON
            });

            if (!response.ok && response.status !== 204) { // 204 No Content is also a success
                const errorData = await response.json().catch(() => ({ detail: 'Unknown error during logout' }));
                console.error("authService: Backend logout failed:", response.status, errorData.detail);
                // Even if API call fails, proceed with local logout for UX
            } else {
                console.log("authService: Backend logout successful.");
            }
        } catch (error) {
            console.error("authService: Network error during logout API call:", error);
            // Still proceed with local logout for UX
        }
    } else {
        console.log("authService: No token found locally, skipping backend logout API call.");
    }
    
    // Always perform local logout actions regardless of API call success/failure
    logoutUserLocally();
};


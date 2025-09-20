"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logoutUser = exports.fetchCurrentUser = exports.loginUser = void 0;
// src/authService.js
//const API_BASE_URL = 'http://10.111.4.221:8000'; // Your FastAPI backend URL - confirm this is correct!
var API_BASE_URL = 'https://priced-industrial-myspace-periodically.trycloudflare.com'; // Uncomment this if you want to use localhost for development
// WHAT CHANGED: Global variable to store the logout timer ID

var logoutTimerId = null;
/**
 * Helper function to get authorization headers from local storage.
 * @returns {HeadersInit | undefined} Authorization headers or undefined if no token.
 */

var getAuthHeaders = function getAuthHeaders() {
  var token = localStorage.getItem('access_token');

  if (!token) {
    return undefined;
  }

  return {
    'Authorization': "Bearer ".concat(token),
    'Content-Type': 'application/json'
  };
};
/**
 * Helper for local logout actions (clears local storage).
 */


var logoutUserLocally = function logoutUserLocally() {
  console.log("authService: Clearing tokens from localStorage.");
  localStorage.removeItem('access_token');
  localStorage.removeItem('token_type'); // WHAT CHANGED: Clear any existing logout timer

  clearTimeout(logoutTimerId);
  logoutTimerId = null;
}; // WHAT CHANGED: Function to decode JWT token


var decodeJwt = function decodeJwt(token) {
  try {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decoding JWT:", e);
    return null;
  }
}; // WHAT CHANGED: Function to set the automatic logout timer


var setAutoLogoutTimer = function setAutoLogoutTimer(token) {
  // Clear any existing timer first
  clearTimeout(logoutTimerId);
  logoutTimerId = null;
  var decodedToken = decodeJwt(token);

  if (!decodedToken || !decodedToken.exp) {
    console.warn("JWT token is invalid or missing expiry. Auto-logout won't be set.");
    return;
  } // `exp` is in seconds, convert to milliseconds


  var expiryTimeMs = decodedToken.exp * 1000;
  var currentTimeMs = new Date().getTime();
  var timeUntilExpiry = expiryTimeMs - currentTimeMs; // Set timer slightly before expiry (e.g., 5 seconds before) to ensure smooth logout

  var logoutDelay = timeUntilExpiry - 5000;

  if (logoutDelay > 0) {
    console.log("Auto-logout scheduled in ".concat(logoutDelay / 1000, " seconds."));
    logoutTimerId = setTimeout(function () {
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
}; // --- AUTHENTICATION FUNCTIONS ---
// Function to handle login


var loginUser = function loginUser(username, password) {
  var formData, response, errorData, data;
  return regeneratorRuntime.async(function loginUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("authService: Attempting login for", username);
          formData = new URLSearchParams();
          formData.append('username', username);
          formData.append('password', password);
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/token"), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString()
          }));

        case 7:
          response = _context.sent;

          if (response.ok) {
            _context.next = 14;
            break;
          }

          _context.next = 11;
          return regeneratorRuntime.awrap(response.json());

        case 11:
          errorData = _context.sent;
          console.error("authService: Login API error status:", response.status, "detail:", errorData.detail);
          throw new Error(errorData.detail || 'Authentication failed');

        case 14:
          _context.next = 16;
          return regeneratorRuntime.awrap(response.json());

        case 16:
          data = _context.sent;
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('token_type', data.token_type);
          console.log("authService: Token stored successfully:", data.access_token); // WHAT CHANGED: Set auto-logout timer after successful login

          setAutoLogoutTimer(data.access_token);
          return _context.abrupt("return", data);

        case 24:
          _context.prev = 24;
          _context.t0 = _context["catch"](4);
          console.error('authService: Error during login fetch:', _context.t0);
          throw _context.t0;

        case 28:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 24]]);
}; // Function to fetch current user details using the stored token


exports.loginUser = loginUser;

var fetchCurrentUser = function fetchCurrentUser() {
  var token, tokenType, response, userData;
  return regeneratorRuntime.async(function fetchCurrentUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          token = localStorage.getItem('access_token');
          tokenType = localStorage.getItem('token_type');
          console.log("authService: Fetching current user. Token present:", !!token);

          if (!(!token || !tokenType)) {
            _context2.next = 6;
            break;
          }

          console.log("authService: No token found, returning null user.");
          return _context2.abrupt("return", null);

        case 6:
          _context2.prev = 6;
          _context2.next = 9;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/users/me"), {
            method: 'GET',
            headers: {
              'Authorization': "".concat(tokenType, " ").concat(token),
              'Content-Type': 'application/json'
            }
          }));

        case 9:
          response = _context2.sent;

          if (response.ok) {
            _context2.next = 19;
            break;
          }

          _context2.t0 = console;
          _context2.t1 = response.status;
          _context2.next = 15;
          return regeneratorRuntime.awrap(response.text());

        case 15:
          _context2.t2 = _context2.sent;

          _context2.t0.error.call(_context2.t0, 'authService: Failed to fetch user data. Status:', _context2.t1, "Response text:", _context2.t2);

          logoutUserLocally(); // Call local logout if token is invalid or request fails

          throw new Error('Failed to fetch user data with current token.');

        case 19:
          _context2.next = 21;
          return regeneratorRuntime.awrap(response.json());

        case 21:
          userData = _context2.sent;
          console.log("authService: User data fetched successfully:", userData); // WHAT CHANGED: Reset auto-logout timer on successful token validation/refresh

          setAutoLogoutTimer(token);
          return _context2.abrupt("return", userData);

        case 27:
          _context2.prev = 27;
          _context2.t3 = _context2["catch"](6);
          console.error('authService: Error fetching current user (network/parse error):', _context2.t3);
          logoutUserLocally(); // Call local logout on network error

          throw _context2.t3;

        case 32:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[6, 27]]);
}; // WHAT CHANGED: Function to handle logout, including API call to backend


exports.fetchCurrentUser = fetchCurrentUser;

var logoutUser = function logoutUser() {
  var token, tokenType, response, errorData;
  return regeneratorRuntime.async(function logoutUser$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          // Made async
          console.log("authService: Attempting full logout (API + Local).");
          token = localStorage.getItem('access_token');
          tokenType = localStorage.getItem('token_type');

          if (!(token && tokenType)) {
            _context3.next = 23;
            break;
          }

          _context3.prev = 4;
          _context3.next = 7;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/logout"), {
            // Assuming POST /logout endpoint
            method: 'POST',
            headers: {
              'Authorization': "".concat(tokenType, " ").concat(token),
              'Content-Type': 'application/json'
            } // body: JSON.stringify({}) // Send empty body if backend expects JSON

          }));

        case 7:
          response = _context3.sent;

          if (!(!response.ok && response.status !== 204)) {
            _context3.next = 15;
            break;
          }

          _context3.next = 11;
          return regeneratorRuntime.awrap(response.json()["catch"](function () {
            return {
              detail: 'Unknown error during logout'
            };
          }));

        case 11:
          errorData = _context3.sent;
          console.error("authService: Backend logout failed:", response.status, errorData.detail); // Even if API call fails, proceed with local logout for UX

          _context3.next = 16;
          break;

        case 15:
          console.log("authService: Backend logout successful.");

        case 16:
          _context3.next = 21;
          break;

        case 18:
          _context3.prev = 18;
          _context3.t0 = _context3["catch"](4);
          console.error("authService: Network error during logout API call:", _context3.t0); // Still proceed with local logout for UX

        case 21:
          _context3.next = 24;
          break;

        case 23:
          console.log("authService: No token found locally, skipping backend logout API call.");

        case 24:
          // Always perform local logout actions regardless of API call success/failure
          logoutUserLocally();

        case 25:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[4, 18]]);
};

exports.logoutUser = logoutUser;
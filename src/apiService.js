// --- OUT OF VIEW CASES MANAGEMENT: UPDATE CASE ---
/**
 * Updates an Out of View case by ID.
 * @param {string|number} caseId - The ID of the case to update.
 * @param {object} updateData - The updated case data.
 * @returns {Promise<object>} The updated case object.
 */
export const addCitizenshipRequestApi = async (requestData) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/citizenship-requests/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData)
    });
    return handleResponse(response);
};
export const updateOutOfViewCaseApi = async (caseId, updateData) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/out-of-view-cases/${caseId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    return handleResponse(response);
};
// --- OUT OF VIEW CASES MANAGEMENT: ADD NEW CASE ---

// src/apiService.js
// This file centralizes all API calls to your FastAPI backend.
//const API_BASE_URL = 'https://ssp-backend-1.onrender.com'; // Your FastAPI backend URL
 const API_BASE_URL =  'https://sspbackend-production.up.railway.app';

// --- CACHING SYSTEM ---
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (url, params = {}) => {
    return `${url}_${JSON.stringify(params)}`;
};

const getCachedData = (cacheKey) => {
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    return null;
};

const setCachedData = (cacheKey, data) => {
    apiCache.set(cacheKey, {
        data,
        timestamp: Date.now()
    });
};

export const clearApiCache = () => {
    apiCache.clear();
};
// ''
//const API_BASE_URL = 'http://172.111.4.221:8000'
export const addComplaintApi = async (complaintData) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const formattedData = {
        ...complaintData,
        // Assume date is already in YYYY-MM-DD format
        DateOfIncident: complaintData.DateOfIncident || new Date().toISOString().split('T')[0],
    };
    const response = await fetch(`${API_BASE_URL}/complaints`, { // Assuming a new POST /complaints endpoint
        method: 'POST',
        headers,
        body: JSON.stringify(formattedData)
    });
    return handleResponse(response);
};
export const getCitizenshipRequestByIdApi = async (requestId) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/citizenship-requests/${requestId}`, {
        method: 'GET',
        headers
    });
    return handleResponse(response);
};
export const updateUserApi = async (userId, updateData) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, { // Endpoint is /users/{id} (PUT)
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    return handleResponse(response);
};
// WHAT CHANGED: New API for approving a Citizenship Request
/**
 * Approves a citizenship request.
 * @param {number} requestId - The ID of the request to approve.
 * @returns {Promise<void>}
 */
// DRY helper to update citizenship request status
const updateCitizenshipRequestStatus = async (request, newStatus) => {
  const headers = {
    ...getAuthHeaders(),
    'Content-Type': 'application/json'
  };

  if (!headers.Authorization) throw new Error("Authentication token not found.");

  // Merge with new status
  const body = {
    ...request,
    status: newStatus
  };

  const response = await fetch(`${API_BASE_URL}/citizenship-requests/${request.id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body)
  });

  return handleResponse(response);
};

// Approve a citizenship request
export const approveCitizenshipRequestApi = async (request) => {
  return updateCitizenshipRequestStatus(request, "Approved");
};

// Reject a citizenship request
export const rejectCitizenshipRequestApi = async (request) => {
  return updateCitizenshipRequestStatus(request, "Rejected");
};

// Request more info for a citizenship request
export const requestMoreInfoCitizenshipRequestApi = async (request) => {
  return updateCitizenshipRequestStatus(request, "Additional info needed");
};

export const updateRefugeeRecordApi = async (refugeeId, updateData) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const formattedUpdateData = {
        ...updateData,
        // Ensure DateRegistered is in ISO format if backend expects datetime
        DateRegistered: updateData.DateRegistered instanceof Date
            ? updateData.DateRegistered.toISOString()
            : updateData.DateRegistered // Assume it's already a string
    };
    const response = await fetch(`${API_BASE_URL}/refugees/${refugeeId}`, { // WHAT CHANGED: Endpoint is /refugees/{id} (PUT)
        method: 'PUT',
        headers,
        body: JSON.stringify(formattedUpdateData)
    });
    return handleResponse(response);
};
export const addRefugeeCaseApi = async (caseData) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/refugees/`, { // WHAT CHANGED: Endpoint is /refugees (POST)
        method: 'POST',
        headers,
        body: JSON.stringify(caseData)
    });
    return handleResponse(response);
};
const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    if (!token) return undefined;
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};
export const getRefugeeByIdApi = async (refugeeId) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/refugees/${refugeeId}`, {
        method: 'GET',
        headers
    });
    return handleResponse(response);
};
export const getOverstayRecordsApi = async () => {
    const cacheKey = getCacheKey('/overstays');
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/overstays`, { // WHAT CHANGED: Endpoint is now /overstays
        method: 'GET',
        headers
    });
    const data = await handleResponse(response);
    setCachedData(cacheKey, data);
    return data;
};

// --- INDIVIDUAL OVERSTAY RECORD ---
/**
 * Fetches a single overstay record by ID.
 * @param {string|number} id - The ID of the overstay record to fetch.
 * @returns {Promise<object>} The overstay record object.
 */
export const getOverstayRecordByIdApi = async (id) => {
    const cacheKey = getCacheKey(`/overstays/${id}`);
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    
    const response = await fetch(`${API_BASE_URL}/overstays/${id}`, {
        method: 'GET',
        headers
    });
    
    const data = await handleResponse(response);
    setCachedData(cacheKey, data);
    return data;
};
export const getSecurityMetricsApi = async () => {
    const cacheKey = getCacheKey('/security-metrics');
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/security-metrics`, { headers });
    const data = await handleResponse(response);
    setCachedData(cacheKey, data);
    return data;
};
export const logoutUserApi = async () => {
    const headers = getAuthHeaders();
    if (!headers) {
        // If no token exists locally, we can still proceed with local logout,
        // but log a warning if an API call was expected.
        console.warn("No authentication token found for logout API call.");
        return; // No API call needed if no token to invalidate on server.
    }
    try {
        const response = await fetch(`${API_BASE_URL}/logout`, {
            method: 'POST',
            headers: {
                'Authorization': headers.Authorization, // Pass the Authorization header
                'Content-Type': 'application/json' // Or 'application/x-www-form-urlencoded' if backend expects it
            },
            // body: JSON.stringify({}) // May not need a body for logout
        });
        // Handle 200 OK or 204 No Content for successful logout
        if (!response.ok && response.status !== 204) {
            const errorData = await response.json().catch(() => ({ detail: 'Unknown error during logout' }));
            throw new Error(errorData.detail || `Logout failed with status: ${response.status}`);
        }
        return; // Successfully logged out on server
    } catch (error) {
        console.error("Error during logout API call:", error);
        throw error; // Re-throw to be caught by the frontend
    }
};
// WHAT CHANGED: New API to fetch audit logs with filters
export const getAuditLogsApi = async (filters = {}) => {
    const cacheKey = getCacheKey('/audit-logs', filters);
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${API_BASE_URL}/audit-logs${queryParams ? `?${queryParams}` : ''}`;
    const response = await fetch(url, { headers });
    const data = await handleResponse(response);
    setCachedData(cacheKey, data);
    return data;
};
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `Server responded with status ${response.status}` }));
        const errorMessage = errorData.detail || `HTTP error! Status: ${response.status}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        throw error;
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }
    return null;
};

// --- AUTHENTICATION ---
export const loginUserApi = async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    const response = await fetch(`${API_BASE_URL}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
    });
    return handleResponse(response);
};
export const updateMyProfileApi = async (updateData) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/users/me`, { // Endpoint is /users/me (PUT)
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
    });
    return handleResponse(response);
};
export const fetchCurrentUserApi = async () => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/users/me`, { headers });
    return handleResponse(response);
};

export const getAllUsersApi = async () => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/users/`, { headers });
    return handleResponse(response);
};

export const addUserApi = async (userData) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(userData)
    });
    return handleResponse(response);
};

export const deleteUserApi = async (userId) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers
    });
    return ;
};

// --- FOREIGNER MANAGEMENT ---
export const getForeignersApi = async (params = {}) => {
    const cacheKey = getCacheKey('/foreigners-with-visas', params);
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");

    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/foreigners-with-visas${queryParams ? `?${queryParams}` : ''}`;

    const response = await fetch(url, { headers });
    const data = await handleResponse(response);
    setCachedData(cacheKey, data);
    return data;
};

export const getForeignerByIdApi = async (foreignerId) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/foreigners/${foreignerId}`, { headers });
    return handleResponse(response);
};

export const addForeignerApi = async (foreignerData) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const formattedData = { ...foreignerData };
    const response = await fetch(`${API_BASE_URL}/foreigners/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formattedData)
    });
    return handleResponse(response);
};

export const updateForeignerApi = async (foreignerId, updateData) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    // Remove serial number fields from update payload
    const { foreigner_id, id, serial_number, ...formattedUpdateData } = updateData;
    if (formattedUpdateData.passport_validity instanceof Date) {
        formattedUpdateData.passport_validity = formattedUpdateData.passport_validity.toISOString().split('T')[0];
    }
    const response = await fetch(`${API_BASE_URL}/foreigners/${foreignerId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(formattedUpdateData)
    });
    return handleResponse(response);
};
export const addUnregisteredCaseApi = async (caseData) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const formattedData = {
        ...caseData,
        reported_at: caseData.reported_at instanceof Date
            ? caseData.reported_at.toISOString().split('.')[0]
            : caseData.reported_at
    };
    const response = await fetch(`${API_BASE_URL}/unregistered-cases/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formattedData)
    });
    return handleResponse(response);
};

export const getOutOfViewCaseByIdApi = async (caseId) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/out-of-view-cases/${caseId}`, {
        method: 'GET',
        headers
    });
    return handleResponse(response);
};
export const deleteForeignerApi = async (foreignerId) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/foreigners/${foreignerId}`, {
        method: 'DELETE',
        headers
    });
    return ;
};

// --- VISA ---
export const addVisaForForeignerApi = async (foreignerId, visaData) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const formattedVisaData = { ...visaData };
    const response = await fetch(`${API_BASE_URL}/foreigners/${foreignerId}/visas/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formattedVisaData)
    });
    return handleResponse(response);
};

// --- DASHBOARD / REPORTS ---
export const getDashboardMetricsApi = async () => {
    const cacheKey = getCacheKey('/dashboard-metrics');
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/dashboard-metrics`, { headers });
    const data = await handleResponse(response);
    setCachedData(cacheKey, data);
    return data;
};
export const getUserByIdApi = async (userId) => {
  const headers = getAuthHeaders();
  if (!headers) throw new Error("Authentication token not found.");

  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'GET',
    headers
  });

  // Check and handle error
  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Failed to fetch user by ID ${userId}:`, errorBody);
    throw new Error(`Failed to fetch user. Status: ${response.status}`);
  }

  const data = await response.json();
  console.log("📦 User data fetched by ID:", data);

  // Ensure email exists or fallback to email_id
  return {
    ...data,
    email: data.email || data.email_id || null,
  };

};
export const getStatusSummaryApi = async () => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/reports/status-summary`, { headers });
    return handleResponse(response);
};

export const getExpiringVisasReportApi = async () => {
    const cacheKey = getCacheKey('/visa-expiry-metrics');
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/visa-expiry-metrics`, { 
        headers,
        method: 'GET'
    });
    const data = await handleResponse(response);
    setCachedData(cacheKey, data);
    return data;
};

export const exportAllCsvApi = async () => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/reports/export-all-csv`, { headers });
    if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error during CSV export.");
        throw new Error(`Failed to export CSV: ${errorText}`);
    }
    return response.blob();
};

// --- VISITOR NATIONALITY ---
export const getNationalityDistributionApi = async () => {
    const cacheKey = getCacheKey('/nationality-distribution');
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/nationality-distribution`, { headers });
    const data = await handleResponse(response);
    setCachedData(cacheKey, data);
    return data;
};

// --- GRIEVANCES ---
export const getGrievancesApi = async () => {
    const cacheKey = getCacheKey('/grievances');
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/grievances/`, {
        method: 'GET',
        headers
    });
    const rawData = await handleResponse(response);
    // WHAT CHANGED: Added fallback to 'N/A' directly in mapping
    const data = rawData.map((item, index) => ({
        id: item.id || index + 1,
        complainant_by: item.ComplaintBy || 'N/A', // Use 'N/A' fallback
        subject: item.Subject || 'N/A', // Use 'N/A' fallback
        date_submitted: item.DateSubmitted ? new Date(item.DateSubmitted).toISOString() : new Date().toISOString(),
        status: item.status || 'N/A', // Use 'N/A' fallback
        link: item.link || '#'
    }));
    setCachedData(cacheKey, data);
    return data;
};
export const exportDataApi = async (modulePath) => {
  const headers = getAuthHeaders();
  if (!headers) throw new Error("Authentication token not found.");

  const exportUrl = `${API_BASE_URL}/export/${modulePath}`;

  const response = await fetch(exportUrl, {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Export failed: ${errorData}`);
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get("Content-Disposition");
  const filename = contentDisposition?.split("filename=")[1]?.replace(/"/g, "") || `${modulePath}.csv`;

  // Create a download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
export const getGrievanceByIdApi = async (grievanceId) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/grievances/${grievanceId}`, {
        method: 'GET',
        headers
    });
    return handleResponse(response);
};

// --- NOTIFICATIONS ---
/**
 * Fetches a list of notifications.
 * @returns {Promise<Array>} List of notification objects.
 */
export const getNotificationsApi = async () => {
    const cacheKey = getCacheKey('/notifications');
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/notifications`, { headers });
    const rawNotifications = await handleResponse(response);

    const data = rawNotifications.map((notif, index) => {
        const messageLower = notif.message ? notif.message.toLowerCase() : '';
        let type = 'info';
        if (messageLower.includes('expire') || messageLower.includes('overstay') || messageLower.includes('problem') || messageLower.includes('alert')) {
            type = 'warning';
        } else if (messageLower.includes('new') || messageLower.includes('registered') || messageLower.includes('successful')) {
            type = 'success';
        }
        
        return {
            id: notif.id || index + 1,
            message: notif.message || 'No message provided',
            link: notif.link || '#',
            timestamp: notif.timestamp || new Date().toISOString(),
            is_read: notif.is_read || false,
            type: notif.type || type,
        };
    });
    setCachedData(cacheKey, data);
    return data;
};

/**
 * Marks a specific notification as read.
 * @param {number} notificationId - The ID of the notification to mark as read.
 * @returns {Promise<void>}
 */
export const markNotificationReadApi = async (notificationId) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/mark-read`, {
        method: 'PUT',
        headers
    });
    return handleResponse(response);
};

/**
 * Marks all notifications as read for the current user.
 * @returns {Promise<void>}
 */
export const markAllNotificationsReadApi = async () => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
        method: 'PUT',
        headers
    });
    return handleResponse(response);
};

// --- STATUS FILTERED FOREIGNERS ---
export const getForeignersByStatusApi = async (status) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const url = `${API_BASE_URL}/foreigners-by-status?status=${encodeURIComponent(status)}`;
    const response = await fetch(url, { headers });
    return handleResponse(response);
};

// --- OUT OF VIEW CASES MANAGEMENT (Second Table Data) ---
export const getOutOfViewCasesManagementApi = async () => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/out-of-view-cases/`, {
        method: 'GET',
        headers
    });
    return handleResponse(response);
};
export const getUnregisteredCaseByIdApi = async (id) => {
  const res = await fetch(`${API_BASE_URL}/unregistered-cases/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch report');
  }
  return await res.json();
};
export const getUnregisteredArrivalsManagementApi = async () => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/unregistered-cases/`, {
        method: 'GET',
        headers
    });
    return handleResponse(response);
};
export const addRefugeeRecordApi = async (recordData) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const formattedData = {
        ...recordData,
        // Ensure DateRegistered is in ISO format if backend expects datetime
        DateRegistered: recordData.DateRegistered instanceof Date
            ? recordData.DateRegistered.toISOString()
            : recordData.DateRegistered // Assume it's already a string
    };
    const response = await fetch(`${API_BASE_URL}/refugees`, { // WHAT CHANGED: Endpoint is /refugees (POST)
        method: 'POST',
        headers,
        body: JSON.stringify(formattedData)
    });
    return handleResponse(response);
};
export const getRefugeeCasesManagementApi = async () => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/refugees/`, {
        method: 'GET',
        headers
    });
    return handleResponse(response);
};
export const getCitizenshipRequestsManagementApi = async () => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/citizenship-requests/`, {
        method: 'GET',
        headers
    });
    return handleResponse(response);
};

// --- VISITOR REGISTRATIONS ---
export const getVisitorRegistrationsApi = async (params = {}) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");

    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/visitor-registrations/${queryParams ? `?${queryParams}` : ''}`;

    const response = await fetch(url, { headers });
    return handleResponse(response);
};
export const exportVisitorRegistrationsApi = async () => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");

    const response = await fetch(`${API_BASE_URL}/export/visitor-registrations`, {
        method: 'GET',
        headers
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error during export.");
        throw new Error(`Failed to export visitor registrations: ${errorText}`);
    }

    return response.blob();
};
export const getUsersByStationApi = async () => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/users-by-station`, {
        method: 'GET',
        headers
    });
    return handleResponse(response);
};
export const getVisitorAnalyticsApi = async () => {
    const cacheKey = getCacheKey('/visitor-analytics');
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/visitor-analytics`, { headers });
    const data = await handleResponse(response);
    setCachedData(cacheKey, data);
    return data;
};

// --- BATCHED DASHBOARD DATA ---
export const getDashboardDataBatchApi = async () => {
    const cacheKey = getCacheKey('/dashboard-batch');
    const cached = getCachedData(cacheKey);
    if (cached) {
        console.log('✅ Using cached dashboard batch data');
        return cached;
    }

    console.log('🔄 Fetching fresh dashboard data...');
    
    try {
        // Try to make parallel requests for better performance with individual error handling
        const results = await Promise.allSettled([
            getDashboardMetricsApi().catch(err => {
                console.error('❌ Dashboard metrics failed:', err);
                throw new Error(`Dashboard metrics: ${err.message}`);
            }),
            getNationalityDistributionApi().catch(err => {
                console.error('❌ Nationality distribution failed:', err);
                throw new Error(`Nationality distribution: ${err.message}`);
            }),
            getExpiringVisasReportApi().catch(err => {
                console.error('❌ Expiring visas failed:', err);
                throw new Error(`Expiring visas: ${err.message}`);
            }),
            getVisitorAnalyticsApi().catch(err => {
                console.error('❌ Visitor analytics failed:', err);
                throw new Error(`Visitor analytics: ${err.message}`);
            })
        ]);

        // Check for any failures
        const failures = results.filter(result => result.status === 'rejected');
        if (failures.length > 0) {
            console.error('❌ Some dashboard APIs failed:', failures);
            // Still try to return partial data if possible
        }

        const [metrics, nationality, visaExpiry, visitorAnalytics] = results.map(result => 
            result.status === 'fulfilled' ? result.value : null
        );

        const batchedData = {
            metrics: metrics || { total_foreigners: 0, total_organizations: 0, total_grievances: 0, total_overstayed: 0 },
            nationality: nationality || {},
            visaExpiry: visaExpiry || { visa_expires_in_2_days: 0, visa_expires_in_7_days: 0, visa_expires_in_30_days: 0, total_overstays: 0 },
            visitorAnalytics: visitorAnalytics || { total_visitors: 0, monthly_counts: [] }
        };

        console.log('✅ Dashboard data fetched successfully:', batchedData);
        setCachedData(cacheKey, batchedData);
        return batchedData;
    } catch (error) {
        console.error('❌ Failed to fetch batched dashboard data:', error);
        throw error;
    }
};
export const updateUnregisteredCaseStatusApi = async (caseId, statusObj) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/unregistered-cases/${caseId}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(statusObj)
    });
    return handleResponse(response);
};
export const updateGrievanceStatusApi = async ( grievanceId, statusObj) => {
  const headers = getAuthHeaders();
  if (!headers) throw new Error("Authentication token not found.");
  const response = await fetch(`${API_BASE_URL}/grievances/${grievanceId}/status`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(statusObj)
  });
  return handleResponse(response);
};
export const addOutOfViewCaseApi = async (caseData) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/out-of-view-cases/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(caseData)
    });
    return handleResponse(response);
};
export const updateForeignerFullDetailsApi = async (foreignerId, fullDetailsData) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/foreigners/${foreignerId}/full-details`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(fullDetailsData)
    });
    return handleResponse(response);
};
export const getVisitorRegistrationByIdApi = async (submissionId) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/visitor-registrations/${submissionId}`, {
        method: 'GET',
        headers
    });
    return handleResponse(response);
};

export const deleteVisitorRegistrationApi = async (submissionId) => {
    const headers = getAuthHeaders();
    if (!headers) throw new Error("Authentication token not found.");
    const response = await fetch(`${API_BASE_URL}/visitor-registrations/${submissionId}`, {
        method: 'DELETE',
        headers
    });
    if (!response.ok && response.status !== 204) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error during delete' }));
        throw new Error(errorData.detail || `Delete failed with status: ${response.status}`);
    }
    return;
};

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCitizenshipRequestsManagementApi = exports.getRefugeeCasesManagementApi = exports.addRefugeeRecordApi = exports.getUnregisteredArrivalsManagementApi = exports.getOutOfViewCasesManagementApi = exports.getForeignersByStatusApi = exports.markAllNotificationsReadApi = exports.markNotificationReadApi = exports.getNotificationsApi = exports.getGrievanceByIdApi = exports.getGrievancesApi = exports.getNationalityDistributionApi = exports.exportAllCsvApi = exports.getExpiringVisasReportApi = exports.getStatusSummaryApi = exports.getUserByIdApi = exports.getDashboardMetricsApi = exports.addVisaForForeignerApi = exports.deleteForeignerApi = exports.getOutOfViewCaseByIdApi = exports.addUnregisteredCaseApi = exports.updateForeignerApi = exports.addForeignerApi = exports.getForeignerByIdApi = exports.getForeignersApi = exports.deleteUserApi = exports.addUserApi = exports.getAllUsersApi = exports.fetchCurrentUserApi = exports.updateMyProfileApi = exports.loginUserApi = exports.getAuditLogsApi = exports.logoutUserApi = exports.getSecurityMetricsApi = exports.getOverstayRecordsApi = exports.getRefugeeByIdApi = exports.addRefugeeCaseApi = exports.updateRefugeeRecordApi = exports.requestMoreInfoCitizenshipRequestApi = exports.rejectCitizenshipRequestApi = exports.approveCitizenshipRequestApi = exports.updateUserApi = exports.getCitizenshipRequestByIdApi = exports.addComplaintApi = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// src/apiService.js
// This file centralizes all API calls to your FastAPI backend.
var API_BASE_URL = 'http://192.168.29.20:8000'; // ''
//const API_BASE_URL = 'http://172.111.4.221:8000'

var addComplaintApi = function addComplaintApi(complaintData) {
  var headers, formattedData, response;
  return regeneratorRuntime.async(function addComplaintApi$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          formattedData = _objectSpread({}, complaintData, {
            // Assume date is already in YYYY-MM-DD format
            DateOfIncident: complaintData.DateOfIncident || new Date().toISOString().split('T')[0]
          });
          _context.next = 6;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/complaints"), {
            // Assuming a new POST /complaints endpoint
            method: 'POST',
            headers: headers,
            body: JSON.stringify(formattedData)
          }));

        case 6:
          response = _context.sent;
          return _context.abrupt("return", handleResponse(response));

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.addComplaintApi = addComplaintApi;

var getCitizenshipRequestByIdApi = function getCitizenshipRequestByIdApi(requestId) {
  var headers, response;
  return regeneratorRuntime.async(function getCitizenshipRequestByIdApi$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context2.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context2.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/citizenship-requests/").concat(requestId), {
            method: 'GET',
            headers: headers
          }));

        case 5:
          response = _context2.sent;
          return _context2.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.getCitizenshipRequestByIdApi = getCitizenshipRequestByIdApi;

var updateUserApi = function updateUserApi(userId, updateData) {
  var headers, response;
  return regeneratorRuntime.async(function updateUserApi$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context3.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context3.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/users/").concat(userId), {
            // Endpoint is /users/{id} (PUT)
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(updateData)
          }));

        case 5:
          response = _context3.sent;
          return _context3.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
}; // WHAT CHANGED: New API for approving a Citizenship Request

/**
 * Approves a citizenship request.
 * @param {number} requestId - The ID of the request to approve.
 * @returns {Promise<void>}
 */
// DRY helper to update citizenship request status


exports.updateUserApi = updateUserApi;

var updateCitizenshipRequestStatus = function updateCitizenshipRequestStatus(request, newStatus) {
  var headers, body, response;
  return regeneratorRuntime.async(function updateCitizenshipRequestStatus$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          headers = _objectSpread({}, getAuthHeaders(), {
            'Content-Type': 'application/json'
          });

          if (headers.Authorization) {
            _context4.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          // Merge with new status
          body = _objectSpread({}, request, {
            status: newStatus
          });
          _context4.next = 6;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/citizenship-requests/").concat(request.id, "/"), {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(body)
          }));

        case 6:
          response = _context4.sent;
          return _context4.abrupt("return", handleResponse(response));

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  });
}; // Approve a citizenship request


var approveCitizenshipRequestApi = function approveCitizenshipRequestApi(request) {
  return regeneratorRuntime.async(function approveCitizenshipRequestApi$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          return _context5.abrupt("return", updateCitizenshipRequestStatus(request, "Approved"));

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
}; // Reject a citizenship request


exports.approveCitizenshipRequestApi = approveCitizenshipRequestApi;

var rejectCitizenshipRequestApi = function rejectCitizenshipRequestApi(request) {
  return regeneratorRuntime.async(function rejectCitizenshipRequestApi$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          return _context6.abrupt("return", updateCitizenshipRequestStatus(request, "Rejected"));

        case 1:
        case "end":
          return _context6.stop();
      }
    }
  });
}; // Request more info for a citizenship request


exports.rejectCitizenshipRequestApi = rejectCitizenshipRequestApi;

var requestMoreInfoCitizenshipRequestApi = function requestMoreInfoCitizenshipRequestApi(request) {
  return regeneratorRuntime.async(function requestMoreInfoCitizenshipRequestApi$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          return _context7.abrupt("return", updateCitizenshipRequestStatus(request, "Additional info needed"));

        case 1:
        case "end":
          return _context7.stop();
      }
    }
  });
};

exports.requestMoreInfoCitizenshipRequestApi = requestMoreInfoCitizenshipRequestApi;

var updateRefugeeRecordApi = function updateRefugeeRecordApi(refugeeId, updateData) {
  var headers, formattedUpdateData, response;
  return regeneratorRuntime.async(function updateRefugeeRecordApi$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context8.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          formattedUpdateData = _objectSpread({}, updateData, {
            // Ensure DateRegistered is in ISO format if backend expects datetime
            DateRegistered: updateData.DateRegistered instanceof Date ? updateData.DateRegistered.toISOString() : updateData.DateRegistered // Assume it's already a string

          });
          _context8.next = 6;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/refugees/").concat(refugeeId), {
            // WHAT CHANGED: Endpoint is /refugees/{id} (PUT)
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(formattedUpdateData)
          }));

        case 6:
          response = _context8.sent;
          return _context8.abrupt("return", handleResponse(response));

        case 8:
        case "end":
          return _context8.stop();
      }
    }
  });
};

exports.updateRefugeeRecordApi = updateRefugeeRecordApi;

var addRefugeeCaseApi = function addRefugeeCaseApi(caseData) {
  var headers, response;
  return regeneratorRuntime.async(function addRefugeeCaseApi$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context9.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context9.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/refugees"), {
            // WHAT CHANGED: Endpoint is /refugees (POST)
            method: 'POST',
            headers: headers,
            body: JSON.stringify(caseData)
          }));

        case 5:
          response = _context9.sent;
          return _context9.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context9.stop();
      }
    }
  });
};

exports.addRefugeeCaseApi = addRefugeeCaseApi;

var getAuthHeaders = function getAuthHeaders() {
  var token = localStorage.getItem('access_token');
  if (!token) return undefined;
  return {
    'Authorization': "Bearer ".concat(token),
    'Content-Type': 'application/json'
  };
};

var getRefugeeByIdApi = function getRefugeeByIdApi(refugeeId) {
  var headers, response;
  return regeneratorRuntime.async(function getRefugeeByIdApi$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context10.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context10.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/refugees/").concat(refugeeId), {
            method: 'GET',
            headers: headers
          }));

        case 5:
          response = _context10.sent;
          return _context10.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context10.stop();
      }
    }
  });
};

exports.getRefugeeByIdApi = getRefugeeByIdApi;

var getOverstayRecordsApi = function getOverstayRecordsApi() {
  var headers, response;
  return regeneratorRuntime.async(function getOverstayRecordsApi$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context11.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context11.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/overstays"), {
            // WHAT CHANGED: Endpoint is now /overstays
            method: 'GET',
            headers: headers
          }));

        case 5:
          response = _context11.sent;
          return _context11.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context11.stop();
      }
    }
  });
};

exports.getOverstayRecordsApi = getOverstayRecordsApi;

var getSecurityMetricsApi = function getSecurityMetricsApi() {
  var headers, response;
  return regeneratorRuntime.async(function getSecurityMetricsApi$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context12.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context12.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/security-metrics"), {
            headers: headers
          }));

        case 5:
          response = _context12.sent;
          return _context12.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context12.stop();
      }
    }
  });
};

exports.getSecurityMetricsApi = getSecurityMetricsApi;

var logoutUserApi = function logoutUserApi() {
  var headers, response, errorData;
  return regeneratorRuntime.async(function logoutUserApi$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context13.next = 4;
            break;
          }

          // If no token exists locally, we can still proceed with local logout,
          // but log a warning if an API call was expected.
          console.warn("No authentication token found for logout API call.");
          return _context13.abrupt("return");

        case 4:
          _context13.prev = 4;
          _context13.next = 7;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/logout"), {
            method: 'POST',
            headers: {
              'Authorization': headers.Authorization,
              // Pass the Authorization header
              'Content-Type': 'application/json' // Or 'application/x-www-form-urlencoded' if backend expects it

            } // body: JSON.stringify({}) // May not need a body for logout

          }));

        case 7:
          response = _context13.sent;

          if (!(!response.ok && response.status !== 204)) {
            _context13.next = 13;
            break;
          }

          _context13.next = 11;
          return regeneratorRuntime.awrap(response.json()["catch"](function () {
            return {
              detail: 'Unknown error during logout'
            };
          }));

        case 11:
          errorData = _context13.sent;
          throw new Error(errorData.detail || "Logout failed with status: ".concat(response.status));

        case 13:
          return _context13.abrupt("return");

        case 16:
          _context13.prev = 16;
          _context13.t0 = _context13["catch"](4);
          console.error("Error during logout API call:", _context13.t0);
          throw _context13.t0;

        case 20:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[4, 16]]);
}; // WHAT CHANGED: New API to fetch audit logs with filters


exports.logoutUserApi = logoutUserApi;

var getAuditLogsApi = function getAuditLogsApi() {
  var filters,
      headers,
      queryParams,
      url,
      response,
      _args14 = arguments;
  return regeneratorRuntime.async(function getAuditLogsApi$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          filters = _args14.length > 0 && _args14[0] !== undefined ? _args14[0] : {};
          headers = getAuthHeaders();

          if (headers) {
            _context14.next = 4;
            break;
          }

          throw new Error("Authentication token not found.");

        case 4:
          queryParams = new URLSearchParams(filters).toString();
          url = "".concat(API_BASE_URL, "/audit-logs").concat(queryParams ? "?".concat(queryParams) : '');
          _context14.next = 8;
          return regeneratorRuntime.awrap(fetch(url, {
            headers: headers
          }));

        case 8:
          response = _context14.sent;
          return _context14.abrupt("return", handleResponse(response));

        case 10:
        case "end":
          return _context14.stop();
      }
    }
  });
};

exports.getAuditLogsApi = getAuditLogsApi;

var handleResponse = function handleResponse(response) {
  var errorData, errorMessage, error, contentType;
  return regeneratorRuntime.async(function handleResponse$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          if (response.ok) {
            _context15.next = 8;
            break;
          }

          _context15.next = 3;
          return regeneratorRuntime.awrap(response.json()["catch"](function () {
            return {
              detail: "Server responded with status ".concat(response.status)
            };
          }));

        case 3:
          errorData = _context15.sent;
          errorMessage = errorData.detail || "HTTP error! Status: ".concat(response.status);
          error = new Error(errorMessage);
          error.status = response.status;
          throw error;

        case 8:
          contentType = response.headers.get("content-type");

          if (!(contentType && contentType.includes("application/json"))) {
            _context15.next = 11;
            break;
          }

          return _context15.abrupt("return", response.json());

        case 11:
          return _context15.abrupt("return", null);

        case 12:
        case "end":
          return _context15.stop();
      }
    }
  });
}; // --- AUTHENTICATION ---


var loginUserApi = function loginUserApi(username, password) {
  var formData, response;
  return regeneratorRuntime.async(function loginUserApi$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          formData = new URLSearchParams();
          formData.append('username', username);
          formData.append('password', password);
          _context16.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/token"), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString()
          }));

        case 5:
          response = _context16.sent;
          return _context16.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context16.stop();
      }
    }
  });
};

exports.loginUserApi = loginUserApi;

var updateMyProfileApi = function updateMyProfileApi(updateData) {
  var headers, response;
  return regeneratorRuntime.async(function updateMyProfileApi$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context17.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context17.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/users/me"), {
            // Endpoint is /users/me (PUT)
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(updateData)
          }));

        case 5:
          response = _context17.sent;
          return _context17.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context17.stop();
      }
    }
  });
};

exports.updateMyProfileApi = updateMyProfileApi;

var fetchCurrentUserApi = function fetchCurrentUserApi() {
  var headers, response;
  return regeneratorRuntime.async(function fetchCurrentUserApi$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context18.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context18.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/users/me"), {
            headers: headers
          }));

        case 5:
          response = _context18.sent;
          return _context18.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context18.stop();
      }
    }
  });
};

exports.fetchCurrentUserApi = fetchCurrentUserApi;

var getAllUsersApi = function getAllUsersApi() {
  var headers, response;
  return regeneratorRuntime.async(function getAllUsersApi$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context19.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context19.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/users/"), {
            headers: headers
          }));

        case 5:
          response = _context19.sent;
          return _context19.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context19.stop();
      }
    }
  });
};

exports.getAllUsersApi = getAllUsersApi;

var addUserApi = function addUserApi(userData) {
  var headers, response;
  return regeneratorRuntime.async(function addUserApi$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context20.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context20.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/users/"), {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(userData)
          }));

        case 5:
          response = _context20.sent;
          return _context20.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context20.stop();
      }
    }
  });
};

exports.addUserApi = addUserApi;

var deleteUserApi = function deleteUserApi(userId) {
  var headers, response;
  return regeneratorRuntime.async(function deleteUserApi$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context21.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context21.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/users/").concat(userId), {
            method: 'DELETE',
            headers: headers
          }));

        case 5:
          response = _context21.sent;
          return _context21.abrupt("return");

        case 7:
        case "end":
          return _context21.stop();
      }
    }
  });
}; // --- FOREIGNER MANAGEMENT ---


exports.deleteUserApi = deleteUserApi;

var getForeignersApi = function getForeignersApi() {
  var params,
      headers,
      queryParams,
      url,
      response,
      _args22 = arguments;
  return regeneratorRuntime.async(function getForeignersApi$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          params = _args22.length > 0 && _args22[0] !== undefined ? _args22[0] : {};
          headers = getAuthHeaders();

          if (headers) {
            _context22.next = 4;
            break;
          }

          throw new Error("Authentication token not found.");

        case 4:
          queryParams = new URLSearchParams(params).toString();
          url = "".concat(API_BASE_URL, "/foreigners-with-visas").concat(queryParams ? "?".concat(queryParams) : '');
          _context22.next = 8;
          return regeneratorRuntime.awrap(fetch(url, {
            headers: headers
          }));

        case 8:
          response = _context22.sent;
          return _context22.abrupt("return", handleResponse(response));

        case 10:
        case "end":
          return _context22.stop();
      }
    }
  });
};

exports.getForeignersApi = getForeignersApi;

var getForeignerByIdApi = function getForeignerByIdApi(foreignerId) {
  var headers, response;
  return regeneratorRuntime.async(function getForeignerByIdApi$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context23.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context23.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/foreigners/").concat(foreignerId), {
            headers: headers
          }));

        case 5:
          response = _context23.sent;
          return _context23.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context23.stop();
      }
    }
  });
};

exports.getForeignerByIdApi = getForeignerByIdApi;

var addForeignerApi = function addForeignerApi(foreignerData) {
  var headers, formattedData, response;
  return regeneratorRuntime.async(function addForeignerApi$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context24.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          formattedData = _objectSpread({}, foreignerData);
          _context24.next = 6;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/foreigners/"), {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(formattedData)
          }));

        case 6:
          response = _context24.sent;
          return _context24.abrupt("return", handleResponse(response));

        case 8:
        case "end":
          return _context24.stop();
      }
    }
  });
};

exports.addForeignerApi = addForeignerApi;

var updateForeignerApi = function updateForeignerApi(foreignerId, updateData) {
  var headers, formattedUpdateData, response;
  return regeneratorRuntime.async(function updateForeignerApi$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context25.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          formattedUpdateData = _objectSpread({}, updateData);

          if (formattedUpdateData.passport_validity instanceof Date) {
            formattedUpdateData.passport_validity = formattedUpdateData.passport_validity.toISOString().split('T')[0];
          }

          _context25.next = 7;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/foreigners/").concat(foreignerId), {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(formattedUpdateData)
          }));

        case 7:
          response = _context25.sent;
          return _context25.abrupt("return", handleResponse(response));

        case 9:
        case "end":
          return _context25.stop();
      }
    }
  });
};

exports.updateForeignerApi = updateForeignerApi;

var addUnregisteredCaseApi = function addUnregisteredCaseApi(caseData) {
  var headers, formattedData, response;
  return regeneratorRuntime.async(function addUnregisteredCaseApi$(_context26) {
    while (1) {
      switch (_context26.prev = _context26.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context26.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          formattedData = _objectSpread({}, caseData, {
            reported_at: caseData.reported_at instanceof Date ? caseData.reported_at.toISOString().split('.')[0] : caseData.reported_at
          });
          _context26.next = 6;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/unregistered-cases"), {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(formattedData)
          }));

        case 6:
          response = _context26.sent;
          return _context26.abrupt("return", handleResponse(response));

        case 8:
        case "end":
          return _context26.stop();
      }
    }
  });
};

exports.addUnregisteredCaseApi = addUnregisteredCaseApi;

var getOutOfViewCaseByIdApi = function getOutOfViewCaseByIdApi(caseId) {
  var headers, response;
  return regeneratorRuntime.async(function getOutOfViewCaseByIdApi$(_context27) {
    while (1) {
      switch (_context27.prev = _context27.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context27.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context27.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/out-of-view-cases/").concat(caseId), {
            method: 'GET',
            headers: headers
          }));

        case 5:
          response = _context27.sent;
          return _context27.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context27.stop();
      }
    }
  });
};

exports.getOutOfViewCaseByIdApi = getOutOfViewCaseByIdApi;

var deleteForeignerApi = function deleteForeignerApi(foreignerId) {
  var headers, response;
  return regeneratorRuntime.async(function deleteForeignerApi$(_context28) {
    while (1) {
      switch (_context28.prev = _context28.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context28.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context28.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/foreigners/").concat(foreignerId), {
            method: 'DELETE',
            headers: headers
          }));

        case 5:
          response = _context28.sent;
          return _context28.abrupt("return");

        case 7:
        case "end":
          return _context28.stop();
      }
    }
  });
}; // --- VISA ---


exports.deleteForeignerApi = deleteForeignerApi;

var addVisaForForeignerApi = function addVisaForForeignerApi(foreignerId, visaData) {
  var headers, formattedVisaData, response;
  return regeneratorRuntime.async(function addVisaForForeignerApi$(_context29) {
    while (1) {
      switch (_context29.prev = _context29.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context29.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          formattedVisaData = _objectSpread({}, visaData);
          _context29.next = 6;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/foreigners/").concat(foreignerId, "/visas/"), {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(formattedVisaData)
          }));

        case 6:
          response = _context29.sent;
          return _context29.abrupt("return", handleResponse(response));

        case 8:
        case "end":
          return _context29.stop();
      }
    }
  });
}; // --- DASHBOARD / REPORTS ---


exports.addVisaForForeignerApi = addVisaForForeignerApi;

var getDashboardMetricsApi = function getDashboardMetricsApi() {
  var headers, response;
  return regeneratorRuntime.async(function getDashboardMetricsApi$(_context30) {
    while (1) {
      switch (_context30.prev = _context30.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context30.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context30.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/dashboard-metrics"), {
            headers: headers
          }));

        case 5:
          response = _context30.sent;
          return _context30.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context30.stop();
      }
    }
  });
};

exports.getDashboardMetricsApi = getDashboardMetricsApi;

var getUserByIdApi = function getUserByIdApi(userId) {
  var headers, response, errorBody, data;
  return regeneratorRuntime.async(function getUserByIdApi$(_context31) {
    while (1) {
      switch (_context31.prev = _context31.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context31.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context31.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/users/").concat(userId), {
            method: 'GET',
            headers: headers
          }));

        case 5:
          response = _context31.sent;

          if (response.ok) {
            _context31.next = 12;
            break;
          }

          _context31.next = 9;
          return regeneratorRuntime.awrap(response.text());

        case 9:
          errorBody = _context31.sent;
          console.error("Failed to fetch user by ID ".concat(userId, ":"), errorBody);
          throw new Error("Failed to fetch user. Status: ".concat(response.status));

        case 12:
          _context31.next = 14;
          return regeneratorRuntime.awrap(response.json());

        case 14:
          data = _context31.sent;
          console.log("📦 User data fetched by ID:", data); // Ensure email exists or fallback to email_id

          return _context31.abrupt("return", _objectSpread({}, data, {
            email: data.email || data.email_id || null
          }));

        case 17:
        case "end":
          return _context31.stop();
      }
    }
  });
};

exports.getUserByIdApi = getUserByIdApi;

var getStatusSummaryApi = function getStatusSummaryApi() {
  var headers, response;
  return regeneratorRuntime.async(function getStatusSummaryApi$(_context32) {
    while (1) {
      switch (_context32.prev = _context32.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context32.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context32.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/reports/status-summary"), {
            headers: headers
          }));

        case 5:
          response = _context32.sent;
          return _context32.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context32.stop();
      }
    }
  });
};

exports.getStatusSummaryApi = getStatusSummaryApi;

var getExpiringVisasReportApi = function getExpiringVisasReportApi() {
  var headers, response;
  return regeneratorRuntime.async(function getExpiringVisasReportApi$(_context33) {
    while (1) {
      switch (_context33.prev = _context33.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context33.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context33.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/visa-expiry-metrics"), {
            headers: headers,
            method: 'GET'
          }));

        case 5:
          response = _context33.sent;
          return _context33.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context33.stop();
      }
    }
  });
};

exports.getExpiringVisasReportApi = getExpiringVisasReportApi;

var exportAllCsvApi = function exportAllCsvApi() {
  var headers, response, errorText;
  return regeneratorRuntime.async(function exportAllCsvApi$(_context34) {
    while (1) {
      switch (_context34.prev = _context34.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context34.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context34.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/reports/export-all-csv"), {
            headers: headers
          }));

        case 5:
          response = _context34.sent;

          if (response.ok) {
            _context34.next = 11;
            break;
          }

          _context34.next = 9;
          return regeneratorRuntime.awrap(response.text()["catch"](function () {
            return "Unknown error during CSV export.";
          }));

        case 9:
          errorText = _context34.sent;
          throw new Error("Failed to export CSV: ".concat(errorText));

        case 11:
          return _context34.abrupt("return", response.blob());

        case 12:
        case "end":
          return _context34.stop();
      }
    }
  });
}; // --- VISITOR NATIONALITY ---


exports.exportAllCsvApi = exportAllCsvApi;

var getNationalityDistributionApi = function getNationalityDistributionApi() {
  var headers, response;
  return regeneratorRuntime.async(function getNationalityDistributionApi$(_context35) {
    while (1) {
      switch (_context35.prev = _context35.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context35.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context35.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/nationality-distribution"), {
            headers: headers
          }));

        case 5:
          response = _context35.sent;
          return _context35.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context35.stop();
      }
    }
  });
}; // --- GRIEVANCES ---


exports.getNationalityDistributionApi = getNationalityDistributionApi;

var getGrievancesApi = function getGrievancesApi() {
  var headers, response, rawData;
  return regeneratorRuntime.async(function getGrievancesApi$(_context36) {
    while (1) {
      switch (_context36.prev = _context36.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context36.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context36.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/grievances"), {
            method: 'GET',
            headers: headers
          }));

        case 5:
          response = _context36.sent;
          _context36.next = 8;
          return regeneratorRuntime.awrap(handleResponse(response));

        case 8:
          rawData = _context36.sent;
          return _context36.abrupt("return", rawData.map(function (item, index) {
            return {
              id: item.id || index + 1,
              complainant_by: item.ComplaintBy || 'N/A',
              // Use 'N/A' fallback
              subject: item.Subject || 'N/A',
              // Use 'N/A' fallback
              date_submitted: item.DateSubmitted ? new Date(item.DateSubmitted).toISOString() : new Date().toISOString(),
              status: item.status || 'N/A',
              // Use 'N/A' fallback
              link: item.link || '#'
            };
          }));

        case 10:
        case "end":
          return _context36.stop();
      }
    }
  });
};

exports.getGrievancesApi = getGrievancesApi;

var getGrievanceByIdApi = function getGrievanceByIdApi(grievanceId) {
  var headers, response;
  return regeneratorRuntime.async(function getGrievanceByIdApi$(_context37) {
    while (1) {
      switch (_context37.prev = _context37.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context37.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context37.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/grievances/").concat(grievanceId), {
            method: 'GET',
            headers: headers
          }));

        case 5:
          response = _context37.sent;
          return _context37.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context37.stop();
      }
    }
  });
}; // --- NOTIFICATIONS ---

/**
 * Fetches a list of notifications.
 * @returns {Promise<Array>} List of notification objects.
 */


exports.getGrievanceByIdApi = getGrievanceByIdApi;

var getNotificationsApi = function getNotificationsApi() {
  var headers, response, rawNotifications;
  return regeneratorRuntime.async(function getNotificationsApi$(_context38) {
    while (1) {
      switch (_context38.prev = _context38.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context38.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context38.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/notifications"), {
            headers: headers
          }));

        case 5:
          response = _context38.sent;
          _context38.next = 8;
          return regeneratorRuntime.awrap(handleResponse(response));

        case 8:
          rawNotifications = _context38.sent;
          return _context38.abrupt("return", rawNotifications.map(function (notif, index) {
            var messageLower = notif.message ? notif.message.toLowerCase() : '';
            var type = 'info';

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
              type: notif.type || type
            };
          }));

        case 10:
        case "end":
          return _context38.stop();
      }
    }
  });
};
/**
 * Marks a specific notification as read.
 * @param {number} notificationId - The ID of the notification to mark as read.
 * @returns {Promise<void>}
 */


exports.getNotificationsApi = getNotificationsApi;

var markNotificationReadApi = function markNotificationReadApi(notificationId) {
  var headers, response;
  return regeneratorRuntime.async(function markNotificationReadApi$(_context39) {
    while (1) {
      switch (_context39.prev = _context39.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context39.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context39.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/notifications/").concat(notificationId, "/mark-read"), {
            method: 'PUT',
            headers: headers
          }));

        case 5:
          response = _context39.sent;
          return _context39.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context39.stop();
      }
    }
  });
};
/**
 * Marks all notifications as read for the current user.
 * @returns {Promise<void>}
 */


exports.markNotificationReadApi = markNotificationReadApi;

var markAllNotificationsReadApi = function markAllNotificationsReadApi() {
  var headers, response;
  return regeneratorRuntime.async(function markAllNotificationsReadApi$(_context40) {
    while (1) {
      switch (_context40.prev = _context40.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context40.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context40.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/notifications/mark-all-read"), {
            method: 'PUT',
            headers: headers
          }));

        case 5:
          response = _context40.sent;
          return _context40.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context40.stop();
      }
    }
  });
}; // --- STATUS FILTERED FOREIGNERS ---


exports.markAllNotificationsReadApi = markAllNotificationsReadApi;

var getForeignersByStatusApi = function getForeignersByStatusApi(status) {
  var headers, url, response;
  return regeneratorRuntime.async(function getForeignersByStatusApi$(_context41) {
    while (1) {
      switch (_context41.prev = _context41.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context41.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          url = "".concat(API_BASE_URL, "/foreigners-by-status?status=").concat(encodeURIComponent(status));
          _context41.next = 6;
          return regeneratorRuntime.awrap(fetch(url, {
            headers: headers
          }));

        case 6:
          response = _context41.sent;
          return _context41.abrupt("return", handleResponse(response));

        case 8:
        case "end":
          return _context41.stop();
      }
    }
  });
}; // --- OUT OF VIEW CASES MANAGEMENT (Second Table Data) ---


exports.getForeignersByStatusApi = getForeignersByStatusApi;

var getOutOfViewCasesManagementApi = function getOutOfViewCasesManagementApi() {
  var headers, response;
  return regeneratorRuntime.async(function getOutOfViewCasesManagementApi$(_context42) {
    while (1) {
      switch (_context42.prev = _context42.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context42.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context42.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/out-of-view-cases"), {
            method: 'GET',
            headers: headers
          }));

        case 5:
          response = _context42.sent;
          return _context42.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context42.stop();
      }
    }
  });
};

exports.getOutOfViewCasesManagementApi = getOutOfViewCasesManagementApi;

var getUnregisteredArrivalsManagementApi = function getUnregisteredArrivalsManagementApi() {
  var headers, response;
  return regeneratorRuntime.async(function getUnregisteredArrivalsManagementApi$(_context43) {
    while (1) {
      switch (_context43.prev = _context43.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context43.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context43.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/unregistered-cases"), {
            method: 'GET',
            headers: headers
          }));

        case 5:
          response = _context43.sent;
          return _context43.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context43.stop();
      }
    }
  });
};

exports.getUnregisteredArrivalsManagementApi = getUnregisteredArrivalsManagementApi;

var addRefugeeRecordApi = function addRefugeeRecordApi(recordData) {
  var headers, formattedData, response;
  return regeneratorRuntime.async(function addRefugeeRecordApi$(_context44) {
    while (1) {
      switch (_context44.prev = _context44.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context44.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          formattedData = _objectSpread({}, recordData, {
            // Ensure DateRegistered is in ISO format if backend expects datetime
            DateRegistered: recordData.DateRegistered instanceof Date ? recordData.DateRegistered.toISOString() : recordData.DateRegistered // Assume it's already a string

          });
          _context44.next = 6;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/refugees"), {
            // WHAT CHANGED: Endpoint is /refugees (POST)
            method: 'POST',
            headers: headers,
            body: JSON.stringify(formattedData)
          }));

        case 6:
          response = _context44.sent;
          return _context44.abrupt("return", handleResponse(response));

        case 8:
        case "end":
          return _context44.stop();
      }
    }
  });
};

exports.addRefugeeRecordApi = addRefugeeRecordApi;

var getRefugeeCasesManagementApi = function getRefugeeCasesManagementApi() {
  var headers, response;
  return regeneratorRuntime.async(function getRefugeeCasesManagementApi$(_context45) {
    while (1) {
      switch (_context45.prev = _context45.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context45.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context45.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/refugees"), {
            method: 'GET',
            headers: headers
          }));

        case 5:
          response = _context45.sent;
          return _context45.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context45.stop();
      }
    }
  });
};

exports.getRefugeeCasesManagementApi = getRefugeeCasesManagementApi;

var getCitizenshipRequestsManagementApi = function getCitizenshipRequestsManagementApi() {
  var headers, response;
  return regeneratorRuntime.async(function getCitizenshipRequestsManagementApi$(_context46) {
    while (1) {
      switch (_context46.prev = _context46.next) {
        case 0:
          headers = getAuthHeaders();

          if (headers) {
            _context46.next = 3;
            break;
          }

          throw new Error("Authentication token not found.");

        case 3:
          _context46.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(API_BASE_URL, "/citizenship-requests"), {
            method: 'GET',
            headers: headers
          }));

        case 5:
          response = _context46.sent;
          return _context46.abrupt("return", handleResponse(response));

        case 7:
        case "end":
          return _context46.stop();
      }
    }
  });
};

exports.getCitizenshipRequestsManagementApi = getCitizenshipRequestsManagementApi;
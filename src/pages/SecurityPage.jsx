// src/pages/SecurityPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { getSecurityMetricsApi, getAuditLogsApi, exportAllCsvApi } from '../apiService';
import { CustomScrollbarStyles } from '../components/CustomScrollbarStyles';
import { LoadingTableRow } from '../components/LoadingSpinner';
import { AlertTriangle, HardDrive, ShieldCheck, Mail } from 'lucide-react';

// Reusable Stat Card Component
const StatCard = ({ title, value, icon: Icon, imageSrc, iconBgColor, valueColor }) => (
  <div
    className={`bg-[#141824] p-4 rounded-lg shadow-xl border border-gray-800 flex items-center justify-between`}
  >
    <div className="flex items-center">
      <div
        className={`p-2 rounded-full mr-4 ${iconBgColor || 'bg-gray-800'}`}
      >
        {Icon ? (
          <Icon className={`w-7 h-7 ${valueColor}`} />
        ) : imageSrc ? (
          <img src={imageSrc} alt={title} className={`w-11 h-11 object-contain`}
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/24x24/1F2937/D1D5DB?text=!" }}
          />
        ) : null}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-400">{title}</span>
        <span
          className={`text-2xl font-bold mt-1 ${valueColor}`}
        >
          {value}
        </span>
      </div>
    </div>
  </div>
);

// Helper component for Audit Log table rows
const AuditLogTableRow = ({ log }) => {
  return (
    <tr className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200">
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">
        {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
      </td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{log.action || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{log.performed_by || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{log.details || 'N/A'}</td>
    </tr>
  );
};


function SecurityPage() {
  const [metrics, setMetrics] = useState({
    failed_logins: 0,
    active_sessions: 0,
    missing_cases_solved: 0,
    pending_cases: 0,
  });
  const [metricsLoading, setMetricsLoading] = useState(true);
  const hasShownToast = useRef(false);

  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLogsLoading, setAuditLogsLoading] = useState(true);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    action_type: 'All',
    username: '',
  });
  const auditLogsInitialFetchCompleted = useRef(false);

  // Fetch Security Metrics (runs once on mount)
  useEffect(() => {
    const fetchMetrics = async () => {
      setMetricsLoading(true);
      try {
        const data = await getSecurityMetricsApi();
        setMetrics(data);
        if (!hasShownToast.current) {
          toast.success('Security Page Loaded!');
          hasShownToast.current = true;
        }

      } catch (error) {
        console.error('Failed to fetch security metrics:', error);
        toast.error(`Failed to load security metrics: ${error.message}`);
      } finally {
        setMetricsLoading(false);
      }
    };
    fetchMetrics();
  }, []); // Empty dependency array means this runs once on mount

  // Fetch Audit Logs based on filters (triggered by handleApplyFilters or initial mount)
  const fetchAuditLogs = async (currentFilters, isInitialLoad = false) => {
    setAuditLogsLoading(true);
    try {
      const apiFilters = {};
      // Only add filters if they have a non-empty value or are not 'All'
      if (currentFilters.start_date) apiFilters.start_date = currentFilters.start_date;
      if (currentFilters.end_date) apiFilters.end_date = currentFilters.end_date;
      if (currentFilters.action_type !== 'All') apiFilters.action_type = currentFilters.action_type;
      if (currentFilters.username) apiFilters.username = currentFilters.username;
      // Removed status filter

      const data = await getAuditLogsApi(apiFilters);
      setAuditLogs(data);

      if (isInitialLoad && !auditLogsInitialFetchCompleted.current) {
        // toast.success('Audit logs loaded!');
        auditLogsInitialFetchCompleted.current = true;
      } else if (!isInitialLoad) {
        // Only show this toast if filters were explicitly applied (not initial load or clear)
        if (JSON.stringify(currentFilters) !== JSON.stringify(filters)) { // Avoid toast on clear/initial if current filters match cleared
          // toast.success('Audit logs updated with filters!');
        }
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      toast.error(`Failed to load audit logs: ${error.message}`);
    } finally {
      setAuditLogsLoading(false);
    }
  };

  // Initial fetch for audit logs on mount
  useEffect(() => {
    fetchAuditLogs(filters, true); // Pass initial filters and true for isInitialLoad
  }, []); // Run only once on mount

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    // WHAT CHANGED: Explicitly call fetchAuditLogs with current filters
    // This function now directly triggers the fetch.
    fetchAuditLogs(filters, false); // Not an initial load
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      start_date: '',
      end_date: '',
      action_type: 'All',
      username: '',
    };
    setFilters(clearedFilters); // Update state
    // WHAT CHANGED: Explicitly call fetchAuditLogs with cleared filters
    fetchAuditLogs(clearedFilters, false); // Not an initial load
  };

  const handleExportClick = async () => {
    toast.info('Export functionality not yet implemented for filtered data. Exporting all data.');
    try {
      const blob = await exportAllCsvApi();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `all_data_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('CSV export successful!');
    } catch (error) {
      console.error('Failed to export CSV:', error);
      toast.error(`CSV export failed: ${error.message}`);
    }
  };

  return (
    <>
      <CustomScrollbarStyles />
      <div className="flex-1 p-6 bg-[#070b13] text-gray-100 font-sans">
        <div className="bg-[#141824] p-6 rounded-lg shadow-xl border border-gray-800">
          {/* Top Row Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Failed Logins"
              value={metricsLoading ? '...' : metrics.failed_logins}
              icon={AlertTriangle}
              iconBgColor="bg-red-800 bg-opacity-30"
              valueColor="text-red-400"
            />
            <StatCard
              title="Active Sessions"
              value={metricsLoading ? '...' : metrics.active_sessions}
              icon={HardDrive}
              iconBgColor="bg-blue-800 bg-opacity-30"
              valueColor="text-blue-400"
            />
            <StatCard
              title="Missing Cases Solved"
              value={metricsLoading ? '...' : metrics.missing_cases_solved}
              icon={ShieldCheck}
              iconBgColor="bg-green-800 bg-opacity-30"
              valueColor="text-green-400"
            />
            <StatCard
              title="Pending Cases"
              value={metricsLoading ? '...' : metrics.pending_cases}
              icon={Mail}
              iconBgColor="bg-yellow-800 bg-opacity-30"
              valueColor="text-yellow-400"
            />
          </div>

          {/* Security and System Audit Section (Audit Log Filter Area) */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-semibold text-gray-50">Security and System Audit</h1>
              <button
                onClick={handleExportClick}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
              >
                Export
              </button>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label htmlFor="start_date" className="input-label">Date Range (Start)</label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={filters.start_date}
                  onChange={handleFilterChange}
                  className="input-field"
                  placeholder=""
                />
              </div>
              <div>
                <label htmlFor="end_date" className="input-label">Date Range (End)</label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={filters.end_date}
                  onChange={handleFilterChange}
                  className="input-field"
                  placeholder=""
                />
              </div>
              <div>
                <label htmlFor="action_type" className="input-label">Action Type</label>
                <select
                  id="action_type"
                  name="action_type"
                  value={filters.action_type}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="All">All</option>
                  <option value="LOGIN">Login</option>
                  <option value="CREATE_USER">Create User</option>
                  <option value="DELETE_USER">Delete User</option>
                  <option value="CREATE_FOREIGNER_WITH_VISA">Register Foreigner</option>
                  <option value="UPDATE_FOREIGNER">Update Foreigner</option>
                  <option value="DELETE_FOREIGNER">Delete Foreigner</option>
                  <option value="ADD_VISA">Add Visa</option>
                  <option value="CREATE_REFUGEE_CASE">Create Refugee Case</option>
                </select>
              </div>
              <div>
                <label htmlFor="username" className="input-label">User</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter User Name"
                  value={filters.username}
                  onChange={handleFilterChange}
                  className="input-field"
                />
              </div>
              {/* Status filter removed */}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleClearFilters}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
              >
                Cancel Filters
              </button>
              <button
                onClick={handleApplyFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Audit Log Table */}
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-450px)] rounded-lg shadow-lg border border-gray-800 custom-scrollbar">
            <table className="min-w-full bg-gray-900 text-left text-sm text-gray-300">
              <thead className="bg-gray-800 text-gray-100 uppercase text-xs sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left">Timestamp</th>
                  <th scope="col" className="px-6 py-3 text-left">Event Type</th>
                  <th scope="col" className="px-6 py-3 text-left">User</th>
                  <th scope="col" className="px-6 py-3 text-left">Description/Details</th>
                  {/* STATUS column removed */}
                </tr>
              </thead>
              <tbody>
                {auditLogsLoading ? (
                  <LoadingTableRow colSpan={4} message="Loading audit logs..." />
                ) : auditLogs.length > 0 ? (
                  auditLogs.map(log => (
                    <AuditLogTableRow key={log.id} log={log} />
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan="4" className="py-4 text-gray-400">No audit logs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* WHAT CHANGED: Custom Tailwind CSS classes (copied from AddForeignerPage for consistency) */}
      <style>{`
          .input-field {
              padding: 0.75rem;
              border-radius: 0.375rem; /* rounded-md */
              background-color: #374151; /* bg-gray-700 */
              color: #F3F4F6; /* text-white */
              border: 1px solid #4B5563; /* border-gray-600 */
              outline: none;
              box-shadow: none;
              width: 100%; /* Ensure it takes full column width */
          }
          .input-field::placeholder {
              color: #9CA3AF; /* placeholder-gray-400 */
          }
          .input-field:focus {
              ring-width: 2px;
              ring-color: #3B82F6; /* ring-blue-500 */
              border-color: #3B82F6;
          }
          .input-label {
              display: block;
              font-size: 0.875rem; /* text-sm */
              color: #9CA3AF; /* text-gray-400 */
              margin-bottom: 0.25rem;
              padding-left: 0.25rem;
          }
          /* Styling for select dropdown */
          select.input-field {
              background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%239CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>');
              background-repeat: no-repeat;
              background-position: right 0.75rem center;
              background-size: 1rem;
              -webkit-appearance: none;
              -moz-appearance: none;
              appearance: none;
          }
          /* Adjust date input appearance */
      input[type="date"] {
        /* Use default browser calendar picker, remove custom icon */
        -webkit-appearance: auto;
        -moz-appearance: auto;
        appearance: auto;
        background-image: none;
        padding-right: 0.75rem;
      }
          /* Placeholder for date inputs */
          input[type="date"]::-webkit-datetime-edit-text { color: #9CA3AF; }
          input[type="date"]::-webkit-datetime-edit-month-field { color: #9CA3AF; }
          input[type="date"]::-webkit-datetime-edit-day-field { color: #9CA3AF; }
          input[type="date"]::-webkit-datetime-edit-year-field { color: #9CA3AF; }
          input[type="date"]::-webkit-datetime-edit-fields-wrapper { color: #9CA3AF; }
          input[type="date"]::-webkit-inner-spin-button { display: none; }
      input[type="date"]::-webkit-calendar-picker-indicator {
        opacity: 1 !important;
        filter: invert(54%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(90%) !important;
        cursor: pointer !important;
        pointer-events: auto !important;
      }
      `}</style>
    </>
  );
}

export default SecurityPage;

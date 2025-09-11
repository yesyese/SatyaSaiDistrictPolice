// src/pages/OverstaysPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, Pencil, Trash2 } from 'lucide-react';
// WHAT CHANGED: Import the new API function for overstay records
import { getOverstayRecordsApi, getOverstayRecordByIdApi } from '../apiService';
import { CustomScrollbarStyles } from '../components/CustomScrollbarStyles';
import { LoadingTableRow } from '../components/LoadingSpinner';
import ForeignerDetailsPage from './ForeignerDetailsPage'; // Assuming you'll navigate to this for View Profile
import { exportDataApi } from '../apiService'; // Adjust the path

// WHAT CHANGED: Consolidated ForeignerTableRow into OverstayTableRow, adjusted for Overstays page specific columns
const OverstayManagementTableRow = ({ overstayData, onViewProfile, onIssueAlert }) => { // WHAT CHANGED: Renamed prop to overstayData
  const navigate = useNavigate();

  let statusText = 'N/A';
  let statusBgColor = 'bg-gray-700'; // Default background color
  let statusTextColor = 'text-gray-100'; // Fixed text color for the badge

  // WHAT CHANGED: Use VisaExpiryDate from overstayData
  const visaExpiryDate = overstayData.VisaExpiryDate ? new Date(overstayData.VisaExpiryDate) : null;

  if (visaExpiryDate) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const daysDiff = Math.ceil((visaExpiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) {
      statusText = `Overstayed (${Math.abs(daysDiff)} Days)`; // Format as per design
      statusBgColor = 'bg-red-800';
    } else if (daysDiff === 0) {
      statusText = 'Expires Today';
      statusBgColor = 'bg-red-800';
    } else if (daysDiff <= 7) {
      statusText = `${daysDiff} Days Left`;
      statusBgColor = 'bg-orange-800';
    } else if (daysDiff <= 30) {
      statusText = `${daysDiff} Days Left`;
      statusBgColor = 'bg-yellow-800';
    } else {
      statusText = `${daysDiff} Days Left`;
      statusBgColor = 'bg-green-800';
    }
  } else if (overstayData.status) { // Fallback to backend 'status' field if present
    statusText = overstayData.status;
    switch (overstayData.status) {
      case 'Overstay':
        statusBgColor = 'bg-red-800';
        break;
      case 'Pending Verification': // Example status from other tables, if it could appear here
        statusBgColor = 'bg-yellow-800';
        break;
      default:
        statusBgColor = 'bg-gray-700';
    }
  }


  return (
    <tr className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200">
      {/* WHAT CHANGED: Mapped to API fields exactly */}
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{overstayData.Name || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{overstayData.Nationality || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{overstayData.PassportNum || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">
        {visaExpiryDate ? visaExpiryDate.toLocaleDateString() : 'N/A'}
      </td>
      <td className="px-6 py-4 text-left whitespace-nowrap">
        <span className={`inline-block px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${statusBgColor} ${statusTextColor}`}>
          {statusText}
        </span>
      </td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewProfile(overstayData.id)} // WHAT CHANGED: Use overstay record id
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md text-xs transition-colors duration-200"
          >
            View Profile
          </button>

        </div>
      </td>
    </tr>
  );
};


const OverstaysPage = () => {
  // WHAT CHANGED: Only one data state for the main table
  const [overstayData, setOverstayData] = useState([]);
  const [loading, setLoading] = useState(true); // Single loading state for this page
  const handleExportClick = async () => {
    try {
      await exportDataApi('overstays');
    }
    catch (err) {
      toast.err('Export Failed');
    }
  };
  const [hasShownToast, setHasShownToast] = useState(false);

  const navigate = useNavigate();

  // WHAT CHANGED: Consolidated fetch function to call getOverstayRecordsApi
  const fetchOverstayRecords = async () => {
    setLoading(true);
    try {
      const data = await getOverstayRecordsApi(); // WHAT CHANGED: Call the new API endpoint
      setOverstayData(data);
    } catch (error) {
      console.error('Failed to fetch overstay records:', error);
      toast.info('No overstay records.');
    } finally {
      setLoading(false);
    }
  };

  // WHAT CHANGED: New function to handle View Profile with individual overstay record
  const handleViewProfile = async (overstayId) => {
    try {
      // Navigate directly to the overstay details page
      navigate(`/overstays/${overstayId}`);
    } catch (error) {
      console.error('Failed to navigate to overstay details:', error);
      toast.error('Failed to load overstay details.');
    }
  };

  useEffect(() => {
    fetchOverstayRecords();
  }, []);

  const handleIssueAlert = (foreignerId, foreignerName) => {
    toast.info(`Issue Alert for ${foreignerName} (ID: ${foreignerId}) functionality not yet implemented.`);
  };

  // const handleActiveCasesClick = () => {
  //   toast.info('Active Cases functionality not yet implemented.');
  // };

  return (
    <>
      <CustomScrollbarStyles />
      <div className="flex-1 p-6 bg-[#070b13] min-h-screen text-gray-100 font-sans">
        <div className="bg-[#141824] p-6 rounded-lg shadow-xl border border-gray-800">
          {/* Header for Overstays Management */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-50">
                Overstays Management
              </h1>

              <div className="flex space-x-2">
                <button
                  onClick={handleExportClick}
                  className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Export
                </button>
                <button
                  // onClick={handleActiveCasesClick}
                  className="flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                >
                  <span className="mr-1">{overstayData.length}</span> Active Cases
                </button>
              </div>
            </div>

            <div className="-mx-4 mt-4">
              <hr className="w-full border-t border-gray-700" />
            </div>
          </div>


          {/* Main Table: Overstays Management Data */}
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-250px)] rounded-lg shadow-lg border border-gray-800 custom-scrollbar">
            <table className="min-w-full bg-gray-900 text-left text-sm text-gray-300">
              <thead className="bg-gray-800 text-gray-100 uppercase text-xs sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left">NAME</th>
                  <th className="px-6 py-3 text-left">NATIONALITY</th>
                  <th className="px-6 py-3 text-left">PASSPORT</th>
                  <th className="px-6 py-3 text-left">VISA EXPIRY DATE</th>
                  <th className="px-6 py-3 text-left">STATUS</th>
                  <th className="px-6 py-3 text-left">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <LoadingTableRow colSpan={6} message="Loading overstay records..." />
                ) : overstayData.length > 0 ? (
                  overstayData.map(data => (
                    <OverstayManagementTableRow
                      key={data.id} // WHAT CHANGED: Use data.id for key
                      overstayData={data} // WHAT CHANGED: Pass data as overstayData prop
                      onViewProfile={handleViewProfile}
                      onIssueAlert={handleIssueAlert}
                    />
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan="6" className="py-4 text-gray-400">No overstay records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default OverstaysPage;

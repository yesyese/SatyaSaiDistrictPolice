// src/pages/CitizenshipRequestsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
// WHAT CHANGED: Removed unused icons as ForeignerTableRow is removed
// import { Eye, Pencil, Trash2 } from 'lucide-react';
// WHAT CHANGED: Removed getForeignersByStatusApi and deleteForeignerApi as the first table is removed.
import { getCitizenshipRequestsManagementApi } from '../apiService';
import { CustomScrollbarStyles } from '../components/CustomScrollbarStyles';
import CitizenshipRequestDetailsPage from './CitizenshipRequestDetailsPage'; // Import the new details page
import { exportDataApi } from '../apiService'; // Adjust the path
import NewCitizenshipRequestModal from '../components/NewCitizenshipRequestModal';

// WHAT CHANGED: Removed ForeignerTableRow as it's no longer used on this page.


// Helper component for the main table: Citizenship Requests Management
const CitizenshipRequestManagementTableRow = ({ requestData, onReviewApplication }) => {
  let statusBgColor = '';
  let statusTextColor = 'text-gray-100';

  switch (requestData.status) { // Mapped to status from backend
    case 'Pending Review':
      statusBgColor = 'bg-yellow-800';
      break;
    case 'Additional info needed':
      statusBgColor = 'bg-orange-800';
      break;
    case 'Rejected':
      statusBgColor = 'bg-red-800';
      break;
    case 'Approved':
      statusBgColor = 'bg-green-800';
      break;
    default:
      statusBgColor = 'bg-gray-700';
  }

  const handleReviewApplication = () => {
    onReviewApplication(requestData.id); // Pass ID to parent handler
  };

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200">
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{requestData.id || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{requestData.ApplicantName || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">
        {requestData.DateSubmitted ? new Date(requestData.DateSubmitted).toLocaleDateString() : 'N/A'}
      </td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{requestData.ReviewingOfficer || 'N/A'}</td>
      <td className="px-6 py-4 text-left">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBgColor} ${statusTextColor}`}>
          {requestData.status || 'N/A'}
        </span>
      </td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">
        <button
          onClick={handleReviewApplication}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded-md text-xs transition-colors duration-200"
        >
          Review Application
        </button>
      </td>
    </tr>
  );
};


// WHAT CHANGED: Removed AddRefugeeCaseModal as it's not used on this page.


const CitizenshipRequestsPage = () => {
  // State for Add Citizenship Request modal
  const [showAddModal, setShowAddModal] = useState(false);
  // WHAT CHANGED: Removed foreigners state and loadingForeigners as the first table is removed.
  // const [foreigners, setForeigners] = useState([]);
  // const [loadingForeigners, setLoadingForeigners] = useState(true);
  const handleExportClick = async () => {
    try {
      await exportDataApi('citizenship-requests')
    }
    catch (err) {
      toast.err('Export Failed');
    }
  };
  const [citizenshipRequests, setCitizenshipRequests] = useState([]); // Data for the main table
  const [loadingRequests, setLoadingRequests] = useState(true); // Loading state for the main table

  const hasShownToast = useRef(false);

  // WHAT CHANGED: State for View Citizenship Request Details modal
  const [showRequestDetailsModal, setShowRequestDetailsModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);


  // WHAT CHANGED: Removed fetchCitizenshipRequestForeigners as the first table is removed.

  // Function to fetch Citizenship Requests Management data (main table)
  const fetchCitizenshipRequestsManagement = async () => {
    setLoadingRequests(true);
    try {
      const data = await getCitizenshipRequestsManagementApi(); // This calls /citizenship-requests-management
      setCitizenshipRequests(data);
      if (!hasShownToast.current) {
        toast.success('Citizenship Requests data loaded!');
        hasShownToast.current = true;
      }
    } catch (error) {
      console.error('Failed to fetch Citizenship Requests Management data:', error);
      toast.error(`Failed to load citizenship requests: ${error.message}`);
    } finally {
      setLoadingRequests(false);
    }
  };

  // WHAT CHANGED: useEffect to fetch data for the main table only
  useEffect(() => {
    fetchCitizenshipRequestsManagement();
  }, []); // Run only once on mount

  // const handleAddNewCaseClick = () => {
  //   toast.info('Add New Case functionality not yet implemented.');
  //   // Example future navigation: navigate('/foreigners/add-citizenship-case');
  // };

  // WHAT CHANGED: Handler to open the View Citizenship Request Details modal
  const handleReviewApplication = (requestId) => {
    setSelectedRequestId(requestId);
    setShowRequestDetailsModal(true);
  };

  // WHAT CHANGED: Handler to close the View Citizenship Request Details modal
  const handleCloseRequestDetailsModal = () => {
    setShowRequestDetailsModal(false);
    setSelectedRequestId(null);
    fetchCitizenshipRequestsManagement(); // Refresh the table after closing modal
  };


  return (
    <>
      <CustomScrollbarStyles />
      <div className="flex-1 p-6 bg-[#070b13] min-h-screen text-gray-100 font-sans">
        <div className="bg-[#141824] p-6 rounded-lg shadow-xl border border-gray-800">
          {/* WHAT CHANGED: Header for Citizenship Requests Management (main table) */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-50">Citizenship Requests Management</h1>
            <div className="flex gap-3">
              <button
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                onClick={() => setShowAddModal(true)}
              >
                Add Case
              </button>
              <button
                onClick={handleExportClick}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
              >
                Export
              </button>
            </div>
            {/* Add Citizenship Request Modal */}
            {showAddModal && (
              <NewCitizenshipRequestModal
                onClose={() => setShowAddModal(false)}
                onRequestAdded={() => {
                  setShowAddModal(false);
                  fetchCitizenshipRequestsManagement();
                }}
              />
            )}
          </div>


          {/* WHAT CHANGED: Main Table Container (Citizenship Requests Management Data) */}
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-250px)] rounded-lg shadow-lg border border-gray-800 custom-scrollbar">
            <table className="min-w-full bg-gray-900 text-left text-sm text-gray-300">
              <thead className="bg-gray-800 text-gray-100 uppercase text-xs sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left">APPLICATION ID</th>
                  <th className="px-6 py-3 text-left">APPLICANT NAME</th>
                  <th className="px-6 py-3 text-left">DATE SUBMITTED</th>
                  <th className="px-6 py-3 text-left">REVIEWING OFFICER</th>
                  <th className="px-6 py-3 text-left">STATUS</th>
                  <th className="px-6 py-3 text-left">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loadingRequests ? (
                  <tr className="text-center">
                    <td colSpan="6" className="py-4 text-gray-400">Loading citizenship requests...</td>
                  </tr>
                ) : citizenshipRequests.length > 0 ? (
                  citizenshipRequests.map(request => (
                    <CitizenshipRequestManagementTableRow
                      key={request.id}
                      requestData={request}
                      onReviewApplication={handleReviewApplication}
                    />
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan="6" className="py-4 text-gray-400">No citizenship requests found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* WHAT CHANGED: Conditionally render CitizenshipRequestDetailsPage as a modal */}
      {showRequestDetailsModal && selectedRequestId && (
        <CitizenshipRequestDetailsPage requestId={selectedRequestId} onClose={handleCloseRequestDetailsModal} onActionSuccess={handleCloseRequestDetailsModal} />
      )}
    </>
  );
};

export default CitizenshipRequestsPage;

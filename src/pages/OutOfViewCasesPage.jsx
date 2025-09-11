// src/pages/OutOfViewCasesPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import OutOfViewCaseDetailsPage from './OutOfViewCaseDetailsPage'; // WHAT CHANGED: Import the new details page
import { exportDataApi } from '../apiService'; // Adjust the path

import { deleteForeignerApi, getOutOfViewCasesManagementApi, addOutOfViewCaseApi, updateOutOfViewCaseApi, getForeignerByIdApi } from '../apiService';
import { CustomScrollbarStyles } from '../components/CustomScrollbarStyles';
import LoadingSpinner, { PoliceFullPageLoading } from '../components/LoadingSpinner';
import { Eye, Pencil, Trash2 } from 'lucide-react';

// Helper component for the first table (Foreigners with 'OutOfView' status)


const OutOfViewCaseTableRow = ({ caseData, onViewCaseDetails, onEditCase }) => { // Added onEditCase prop
  const navigate = useNavigate();

  let statusBgColor = '';
  let statusTextColor = 'text-gray-100';

  switch (caseData.status) {
    case 'Active Search':
      statusBgColor = 'bg-yellow-800';
      break;
    case 'Cold Case':
      statusBgColor = 'bg-red-800';
      break;
    case 'Located':
      statusBgColor = 'bg-green-800';
      break;
    default:
      statusBgColor = 'bg-gray-700';
  }

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200">
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{caseData.id || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{caseData.ForeignerName || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">
        {caseData.foreigner_id || caseData.ForeignerId || caseData.Foreigner_ID || caseData.foreignerId || caseData.foreignerID || caseData.ForeignerID || caseData.foreign_id || caseData.foreignId || 'N/A'}
      </td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">
        {caseData.last_seen_date ? new Date(caseData.last_seen_date).toLocaleDateString() : 'N/A'}
      </td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{caseData.last_seen_location || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{caseData.AssignedOfficer || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap">
        <span className={`inline-block px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${statusBgColor} ${statusTextColor}`}>
          {caseData.status || 'N/A'}
        </span>
      </td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis flex gap-2">
        <button
          onClick={() => onViewCaseDetails(caseData.id)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded-md text-xs transition-colors duration-200"
        >
          View
        </button>
        <button
          onClick={() => onEditCase(caseData)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-1 px-4 rounded-md text-xs transition-colors duration-200"
        >
          Edit
        </button>
      </td>
    </tr>
  );
};
// Removed duplicate/erroneous JSX and misplaced code after OutOfViewCaseTableRow. Only one export default and correct component structure remain.
// WHAT CHANGED: New Helper component for the second table (Out of View Cases Management)



const OutOfViewCasesPage = () => {
  const handleExportClick = async () => {
    try {
      await exportDataApi('out-of-view-cases');
    }
    catch (err) {
      toast.err('Export Failed');
    }
  };
  const [outOfViewCases, setOutOfViewCases] = useState([]); // WHAT CHANGED: State for the second table's data
  const [loadingCases, setLoadingCases] = useState(true); // WHAT CHANGED: Separate loading state for second table
  const hasShownToast = useRef(false);
  const navigate = useNavigate();
  const [showCaseDetailsModal, setShowCaseDetailsModal] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  // Modal state for filing new case
  const [showFileCaseModal, setShowFileCaseModal] = useState(false);
  const [newCaseForm, setNewCaseForm] = useState({
    ForeignerId: '',
    ForeignerName: '',
    Nationality: '',
    last_seen_date: '',
    last_seen_location: '',
    AssignedOfficer: ''
  });

  // Modal state for editing a case
  const [showEditCaseModal, setShowEditCaseModal] = useState(false);
  const [editCaseForm, setEditCaseForm] = useState({
    id: '',
    ForeignerId: '',
    ForeignerName: '',
    Nationality: '',
    last_seen_date: '',
    last_seen_location: '',
    AssignedOfficer: '',
    status: ''
  });
  const [fetchingForeignerDetails, setFetchingForeignerDetails] = useState(false);
  // Function to fetch foreigners with 'OutOfView' status (first table)
  // const fetchOutOfViewForeigners = async () => {
  //   setLoadingForeigners(true);
  //   try {
  //     const data = await getOutOfViewCasesManagementApi();
  //     // Removed toast here to avoid duplication if both tables fetch
  //   } catch (error) {
  //     console.error('Failed to fetch Out of View foreigners (first table):', error);
  //     // toast.error(`Failed to load Out of View foreigners: ${error.message}`);
  //   } finally {
  //     setLoadingForeigners(false);
  //   }
  // };

  // WHAT CHANGED: New function to fetch Out of View Cases Management data (second table)
  const fetchOutOfViewManagementCases = async () => {
    setLoadingCases(true);
    try {
      const data = await getOutOfViewCasesManagementApi(); // This now calls /out-of-view-cases
      console.log('Out of View Cases API Response:', data);

      // Debug the structure and map foreign_id properly
      const processedData = data.map(item => {
        console.log('Individual case data:', item);

        // Map foreign_id from various possible field names
        const foreignId = item.foreigner_id ||
          item.foreign_id ||
          item.ForeignerId ||
          item.Foreigner_ID ||
          item.foreignerId ||
          item.foreignerID ||
          item.ForeignerID ||
          item.id || // fallback to case ID if no foreign_id
          'N/A';

        return {
          ...item,
          foreigner_id: foreignId
        };
      });

      setOutOfViewCases(processedData);
    } catch (error) {
      console.error('Failed to fetch Out of View Management cases (second table):', error);
      toast.error(`Failed to load Out of View Management cases: ${error.message}`);
    } finally {
      setLoadingCases(false);
    }
  };

  // WHAT CHANGED: useEffect to fetch data for both tables
  useEffect(() => {
    fetchOutOfViewManagementCases(); // Fetch data for the second table

    // Only show "records loaded" toast once for the page, after both potentially load
    // Using a timeout to ensure all fetches have *started* and to de-dupe
    const timeoutId = setTimeout(() => {
      if (!hasShownToast.current) {
        toast.success('Out of View page data loaded!');
        hasShownToast.current = true;
      }
    }, 500); // Small delay

    return () => clearTimeout(timeoutId);
  }, []);

  // Open the modal
  const handleOpenFileCaseModal = () => {
    setShowFileCaseModal(true);
    setNewCaseForm({
      ForeignerId: '',
      ForeignerName: '',
      Nationality: '',
      last_seen_date: '',
      last_seen_location: '',
      AssignedOfficer: ''
    });
  };

  // Close the modal
  const handleCloseFileCaseModal = () => {
    setShowFileCaseModal(false);
  };

  // Handle form input changes
  const handleNewCaseInputChange = async (e) => {
    const { name, value } = e.target;
    setNewCaseForm((prev) => ({ ...prev, [name]: value }));
    
    // Auto-fetch foreigner details when foreigner ID is entered
    if (name === 'ForeignerId' && value && value.trim() !== '') {
      await fetchForeignerDetailsForNewCase(value.trim());
    }
  };
  
  // Fetch foreigner details for edit form
  const fetchForeignerDetails = async (foreignerId) => {
    try {
      setFetchingForeignerDetails(true);
      const foreignerData = await getForeignerByIdApi(foreignerId);
      
      if (foreignerData) {
        setEditCaseForm((prev) => ({
          ...prev,
          ForeignerName: foreignerData.name || foreignerData.ForeignerName || '',
          Nationality: foreignerData.nationality || foreignerData.Nationality || ''
        }));
        toast.success('Foreigner details loaded successfully!');
      }
    } catch (error) {
      console.error('Failed to fetch foreigner details:', error);
      toast.error('Failed to load foreigner details. Please verify the ID.');
      // Clear the auto-populated fields on error
      setEditCaseForm((prev) => ({
        ...prev,
        ForeignerName: '',
        Nationality: ''
      }));
    } finally {
      setFetchingForeignerDetails(false);
    }
  };
  
  // Fetch foreigner details for new case form
  const fetchForeignerDetailsForNewCase = async (foreignerId) => {
    try {
      const foreignerData = await getForeignerByIdApi(foreignerId);
      
      if (foreignerData) {
        setNewCaseForm((prev) => ({
          ...prev,
          ForeignerName: foreignerData.name || foreignerData.ForeignerName || '',
          Nationality: foreignerData.nationality || foreignerData.Nationality || ''
        }));
        toast.success('Foreigner details loaded successfully!');
      }
    } catch (error) {
      console.error('Failed to fetch foreigner details:', error);
      toast.error('Failed to load foreigner details. Please verify the ID.');
      // Clear the auto-populated fields on error
      setNewCaseForm((prev) => ({
        ...prev,
        ForeignerName: '',
        Nationality: ''
      }));
    }
  };
  // Handle edit form input changes
  const handleEditCaseInputChange = async (e) => {
    const { name, value } = e.target;
    setEditCaseForm((prev) => ({ ...prev, [name]: value }));
    
    // Auto-fetch foreigner details when foreigner ID is entered
    if (name === 'ForeignerId' && value && value.trim() !== '') {
      await fetchForeignerDetails(value.trim());
    }
  };
  // Open edit modal with selected case data
  const handleEditCase = (caseData) => {
    setEditCaseForm({
      id: caseData.id,
      ForeignerId: caseData.ForeignerId || '',
      ForeignerName: caseData.ForeignerName || '',
      Nationality: caseData.Nationality || '',
      last_seen_date: caseData.last_seen_date ? caseData.last_seen_date.split('T')[0] : '',
      last_seen_location: caseData.last_seen_location || '',
      AssignedOfficer: caseData.AssignedOfficer || '',
      status: caseData.status || 'Active Search'
    });
    setShowEditCaseModal(true);
  };

  // Close edit modal
  const handleCloseEditCaseModal = () => {
    setShowEditCaseModal(false);
  };

  // Submit edit case
  const handleEditCaseSubmit = async (e) => {
    if (e) e.preventDefault();
    const { id, ForeignerId, ForeignerName, Nationality, last_seen_date, last_seen_location, AssignedOfficer, status } = editCaseForm;
    const updateData = {
      foreigner_id: ForeignerId ? parseInt(ForeignerId) : null,
      ForeignerName: ForeignerName || '',
      Nationality: Nationality || '',
      last_seen_date: last_seen_date || '',
      last_seen_location: last_seen_location || '',
      AssignedOfficer: AssignedOfficer || '',
      status: status || 'Active Search'
    };
    try {
      await updateOutOfViewCaseApi(id, updateData);
      toast.success('Case updated successfully!');
      fetchOutOfViewManagementCases();
      setShowEditCaseModal(false);
    } catch (err) {
      toast.error('Failed to update case: ' + (err.message || 'Unknown error'));
    }
  };

  // Submit the new case
  const handleFileNewCaseClick = async (e) => {
    if (e) e.preventDefault();
    const newCase = {
      foreigner_id: newCaseForm.ForeignerId ? parseInt(newCaseForm.ForeignerId) : null,
      ForeignerName: newCaseForm.ForeignerName || '',
      Nationality: newCaseForm.Nationality || '',
      last_seen_date: newCaseForm.last_seen_date || '',
      last_seen_location: newCaseForm.last_seen_location || '',
      AssignedOfficer: newCaseForm.AssignedOfficer || ''
    };
    try {
      await addOutOfViewCaseApi(newCase);
      toast.success('New Out of View case filed!');
      fetchOutOfViewManagementCases(); // Refresh the table
      setShowFileCaseModal(false);
    } catch (err) {
      toast.error('Failed to file new case: ' + (err.message || 'Unknown error'));
    }
  };
  const handleViewCaseDetails = (caseId) => {
    setSelectedCaseId(caseId);
    setShowCaseDetailsModal(true);
  };

  const handleCloseCaseDetailsModal = () => {
    setShowCaseDetailsModal(false);
    setSelectedCaseId(null);
  };

  return (
    <>
      <CustomScrollbarStyles />
      <div className="flex-1 p-6 bg-[#070b13] min-h-screen text-gray-100 font-sans custom-scrollbar">
        <div className="bg-[#141824] p-6 rounded-lg shadow-xl border border-gray-800">
          {/* WHAT CHANGED: Header for Out of View Cases Management table */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-50">Out of View Cases Management</h1>
            <div className="flex space-x-3">
              <button
                onClick={handleExportClick}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
              >
                Export
              </button>
              <button
                onClick={handleOpenFileCaseModal}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
              >
                + File New Case
              </button>
              {/* Modal for filing new Out of View case */}
              {showFileCaseModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                  <div className="bg-[#181c2a] rounded-lg shadow-lg p-8 w-full max-w-md relative">
                    <h2 className="text-lg font-semibold mb-6 text-gray-100">Open 'Out of View' Case</h2>
                    <form onSubmit={handleFileNewCaseClick}>
                      <div className="mb-4">
                        <label className="block text-gray-300 text-sm mb-2">Foreigner ID (from Registered Arrivals Table Only if Available)</label>
                        <input
                          type="text"
                          name="ForeignerId"
                          autoComplete="off"
                          value={typeof newCaseForm.ForeignerId === 'undefined' ? '' : newCaseForm.ForeignerId}
                          onChange={handleNewCaseInputChange}
                          className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter Foreigner ID to auto-load details"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-300 text-sm mb-2">Person's Fullname (Auto-populated)</label>
                        <input
                          type="text"
                          name="ForeignerName"
                          value={newCaseForm.ForeignerName}
                          readOnly
                          className="w-full px-3 py-2 rounded bg-gray-700 text-gray-300 cursor-not-allowed"
                          placeholder="Will be auto-populated when Foreigner ID is entered"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-300 text-sm mb-2">Nationality (Auto-populated)</label>
                        <input
                          type="text"
                          name="Nationality"
                          value={newCaseForm.Nationality}
                          readOnly
                          className="w-full px-3 py-2 rounded bg-gray-700 text-gray-300 cursor-not-allowed"
                          placeholder="Will be auto-populated when Foreigner ID is entered"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-300 text-sm mb-2">Last Seen Date</label>
                        <input
                          type="date"
                          name="last_seen_date"
                          value={newCaseForm.last_seen_date}
                          onChange={handleNewCaseInputChange}
                          className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-300 text-sm mb-2">Last Seen Location</label>
                        <input
                          type="text"
                          name="last_seen_location"
                          value={newCaseForm.last_seen_location}
                          onChange={handleNewCaseInputChange}
                          className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-6">
                        <label className="block text-gray-300 text-sm mb-2">Assigned Officer</label>
                        <input
                          type="text"
                          name="AssignedOfficer"
                          value={newCaseForm.AssignedOfficer}
                          onChange={handleNewCaseInputChange}
                          className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={handleCloseFileCaseModal}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center"
                        >
                          + File Case
                        </button>
                      </div>
                    </form>
                    <button
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 text-xl"
                      onClick={handleCloseFileCaseModal}
                      aria-label="Close"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>


          {/* WHAT CHANGED: Second Table Container */}
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-250px)] rounded-lg shadow-lg border border-gray-800 custom-scrollbar mb-6"> {/* Added mb-6 for spacing */}
            <table className="min-w-full bg-gray-900 text-left text-sm text-gray-300">
              <thead className="bg-gray-800 text-gray-100 uppercase text-xs sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left">CASE NO</th>
                  <th className="px-6 py-3 text-left">NAME</th>
                  <th className="px-6 py-3 text-left">FOREIGNER ID</th>
                  <th className="px-6 py-3 text-left">LAST SEEN DATE</th>
                  <th className="px-6 py-3 text-left">LAST SEEN LOCATION</th>
                  <th className="px-6 py-3 text-left">ASSIGNED OFFICER</th>
                  <th className="px-6 py-3 text-left">STATUS</th>
                  <th className="px-6 py-3 text-left">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {outOfViewCases.length > 0 ? (
                  outOfViewCases.map(caseData => (
                    <OutOfViewCaseTableRow
                      key={caseData.id}
                      caseData={caseData}
                      onViewCaseDetails={handleViewCaseDetails}
                      onEditCase={handleEditCase}
                    />
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan="8" className="py-4 text-gray-400">No management cases found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal for editing Out of View case */}
          {showEditCaseModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-[#181c2a] rounded-lg shadow-lg p-8 w-full max-w-md relative">
                <h2 className="text-lg font-semibold mb-6 text-gray-100">Edit 'Out of View' Case</h2>
                <form onSubmit={handleEditCaseSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm mb-2">Foreigner ID from Registered Arrivals Table Only if Available</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="ForeignerId"
                        value={editCaseForm.ForeignerId}
                        onChange={handleEditCaseInputChange}
                        className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Foreigner ID to auto-load details"
                      />
                      {fetchingForeignerDetails && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm mb-2">Person's Fullname (Auto-populated)</label>
                    <input
                      type="text"
                      name="ForeignerName"
                      value={editCaseForm.ForeignerName}
                      readOnly
                      className="w-full px-3 py-2 rounded bg-gray-700 text-gray-300 cursor-not-allowed"
                      placeholder="Will be auto-populated when Foreigner ID is entered"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm mb-2">Nationality (Auto-populated)</label>
                    <input
                      type="text"
                      name="Nationality"
                      value={editCaseForm.Nationality}
                      readOnly
                      className="w-full px-3 py-2 rounded bg-gray-700 text-gray-300 cursor-not-allowed"
                      placeholder="Will be auto-populated when Foreigner ID is entered"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm mb-2">Last Seen Date</label>
                    <input
                      type="date"
                      name="last_seen_date"
                      value={editCaseForm.last_seen_date}
                      onChange={handleEditCaseInputChange}
                      className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm mb-2">Last Seen Location</label>
                    <input
                      type="text"
                      name="last_seen_location"
                      value={editCaseForm.last_seen_location}
                      onChange={handleEditCaseInputChange}
                      className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm mb-2">Assigned Officer</label>
                    <input
                      type="text"
                      name="AssignedOfficer"
                      value={editCaseForm.AssignedOfficer}
                      onChange={handleEditCaseInputChange}
                      className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-300 text-sm mb-2">Status</label>
                    <select
                      name="status"
                      value={editCaseForm.status}
                      onChange={handleEditCaseInputChange}
                      className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Active Search">Active Search</option>
                      <option value="Located">Located</option>
                      <option value="Cold Case">Cold Case</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCloseEditCaseModal}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-md flex items-center"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 text-xl"
                  onClick={handleCloseEditCaseModal}
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
            </div>
          )}

          {/* WHAT CHANGED: Optional: Keeping the first table if 'Out of View' foreigners are still meant to be here */}


        </div>
        {showCaseDetailsModal && selectedCaseId && (
          <OutOfViewCaseDetailsPage caseId={selectedCaseId} onClose={handleCloseCaseDetailsModal} />
        )}
      </div>
    </>
  );
};

export default OutOfViewCasesPage;

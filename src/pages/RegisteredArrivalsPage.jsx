// src/pages/RegisteredArrivalsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getForeignersApi, deleteForeignerApi, getVisitorRegistrationsApi, getForeignersByStatusApi, exportVisitorRegistrationsApi } from '../apiService';
import { CustomScrollbarStyles } from '../components/CustomScrollbarStyles';
import LoadingSpinner, { PoliceFullPageLoading } from '../components/LoadingSpinner';
import ForeignerDetailsPage from './ForeignerDetailsPage';
import DeleteConfirmationModal from './DeleteConfirmationModal'; // WHAT CHANGED: Import DeleteConfirmationModal
import { exportDataApi } from '../apiService'; // Adjust the path

import EditForeignerPage from './EditForeignerPage'; // WHAT CHANGED: Import for Edit Details Modal

import { Eye, Pencil, Trash2 } from 'lucide-react'; // Importing icons from lucide-react
// Helper component for the table rows
const ForeignerTableRow = ({ foreigner, onDeleteSuccess, onViewDetails, onEditDetails, onDeleteRequest }) => {
  const navigate = useNavigate();

  let visaStatusText = 'N/A';
  let visaStatusColor = 'text-gray-400';
  let visaStatusBgColor = 'bg-gray-800'; // Default background color
  const visaExpiryDate = foreigner.expiry_date ? new Date(foreigner.expiry_date) : null;

  if (visaExpiryDate) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const timeDiff = visaExpiryDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) {
      visaStatusText = `Overstayed by ${Math.abs(daysDiff)} days`;
      visaStatusColor = 'text-red-400';
    } else if (daysDiff === 0) {
      visaStatusText = 'Expires Today';
      visaStatusColor = 'text-red-400';
    } else if (daysDiff <= 7) {
      visaStatusText = `${daysDiff} Days Left`;
      visaStatusColor = 'text-orange-400';
    } else if (daysDiff <= 30) {
      visaStatusText = `${daysDiff} Days Left`;
      visaStatusColor = 'text-yellow-400';
    } else {
      visaStatusText = `${daysDiff} Days Left`;
      visaStatusColor = 'text-green-400';
    }
  }
  const handleRequestDelete = () => {
    onDeleteRequest(foreigner.foreigner_id, foreigner.name); // Pass ID and name to parent
  };


  return (
    <tr className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200">
      <td className="px-6 py-6 text-left whitespace-nowrap overflow-hidden text-ellipsis">{foreigner.foreigner_id || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{foreigner.name || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{foreigner.nationality || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{foreigner.gender || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{foreigner.passport_number || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">
        {foreigner.passport_validity ? new Date(foreigner.passport_validity).toLocaleDateString() : 'N/A'}
      </td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{foreigner.visa_number || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{foreigner.visa_type || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">
        {visaExpiryDate ? visaExpiryDate.toLocaleDateString() : 'N/A'}
      </td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{foreigner.occupation || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{foreigner.employer || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{foreigner.indian_address || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${visaStatusBgColor} ${visaStatusColor}`}>
          {visaStatusText} {/* Display calculated text, not foreigner.status here for consistency with colors */}
        </span>
      </td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">
        <div className="flex flex-row space-x-4">
          <button
            onClick={() => onViewDetails(foreigner.foreigner_id)}
            className="text-gray-600 "
          >
            <Eye className="w-5 h-5 text-blue-400" /> {/* Larger size, blue color */}
          </button>
          <button
            onClick={() => onEditDetails(foreigner.foreigner_id)}
            className="text-white "
          >
            <Pencil className="w-4 h-4 text-yellow-400" /> {/* Larger size, yellow color */}
          </button>
          <button
            onClick={handleRequestDelete}
            className="text-white "
          >
            <Trash2 className="w-4 h-4 text-red-400" /> {/* Larger size, red color */}

          </button>
        </div>


      </td>
    </tr>
  );
};

const RegisteredArrivalsPage = () => {
  const navigate = useNavigate();
  const [foreigners, setForeigners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [filteredForeigners, setFilteredForeigners] = useState([]);
  const initialFetchCompleted = useRef(false);
  const tabDataCache = useRef(new Map()); // Cache for tab data to avoid redundant API calls
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedForeignerId, setSelectedForeignerId] = useState(null);
  // WHAT CHANGED: State for Edit Details modal
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [foreignerToDelete, setForeignerToDelete] = useState(null); // Stores { id, name } of foreigner to delete

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingForeignerId, setEditingForeignerId] = useState(null);
  const tabToBackendStatus = {
    'All': null,
    // 'Registered': 'Registered',
    'Unregistered': 'Unregistered',
    'Refugee': 'Refugee',
    'Overstay': 'Overstay',
    'Citizenship Requests': 'Citizenship_Request',
    'Out of View Cases': 'OutOfView'
  };

  const fetchForeignersData = async (tab = activeTab) => {
    setLoading(true);
    
    // Check if data is already cached for this tab
    if (tabDataCache.current.has(tab)) {
      const cachedData = tabDataCache.current.get(tab);
      setForeigners(cachedData);
      setFilteredForeigners(cachedData);
      setLoading(false);
      console.log(`✅ Using cached data for tab: ${tab}`);
      return;
    }
    
    let data = [];
    try {
      if (tab === 'All') {
        // Use getForeignersApi for "All"
        const apiData = await getForeignersApi();
        data = apiData.map(item => ({
          foreigner_id: item.foreigner_id,
          name: item.FullName || item.name,
          nationality: item.Nationality || item.nationality,
          gender: item.Gender || item.gender,
          passport_number: item.PassportNumber || item.passport_number,
          passport_validity: item.PassportValidity || item.passport_validity,
          visa_number: item.VisaNumber || item.visa_number,
          visa_type: item.VisaType || item.visa_type,
          expiry_date: item.VisaExpiry || item.visa_expiry_date,
          occupation: item.Occupation || item.occupation,
          employer: item.Employer || item.employer,
          indian_address: item.IndianAddress || item.indian_address,
          date_of_visit: item.DateOfVisit || item.date_of_visit,
          submitted_at: item.submitted_at
        }));
        setForeigners(data);
        setFilteredForeigners(data);
      } else if (tab === 'Registered By Visitor') {
        // Use getVisitorRegistrationsApi for "Registered By Visitor"
        const apiData = await getVisitorRegistrationsApi();
        data = apiData.map(item => ({
          foreigner_id: item.id,
          name: item.FullName,
          nationality: item.Nationality,
          gender: item.Gender,
          passport_number: item.PassportNumber,
          passport_validity: item.PassportValidity,
          visa_number: item.VisaNumber,
          visa_type: item.VisaType,
          expiry_date: item.VisaExpiry,
          occupation: item.Occupation,
          employer: item.Employer,
          indian_address: item.IndianAddress,
          date_of_visit: item.DateOfVisit,
          submitted_at: item.submitted_at
        }));
        setForeigners(data);
        setFilteredForeigners(data);
      } else if (
        tab === 'Expired in 7 days' ||
        tab === 'Expired in 30 days' ||
        tab === 'Expired in 90 days'
      ) {
        // Use getVisitorRegistrationsApi and filter by expiry logic for expiry tabs
        const apiData = await getForeignersApi();
        data = apiData.map(item => ({
          foreigner_id: item.foreigner_id,
          name: item.name,
          nationality: item.nationality,
          gender: item.gender,
          passport_number: item.passport_number,
          passport_validity: item.passport_validity,
          visa_number: item.visa_number,
          visa_type: item.visa_type,
          expiry_date: item.visa_expiry_date,
          occupation: item.occupation,
          employer: item.employer,
          indian_address: item.indian_address
        }));

        // Expiry logic
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        let min = 0, max = 0;
        if (tab === 'Expired in 7 days') { min = 1; max = 7; }
        if (tab === 'Expired in 30 days') { min = 8; max = 30; }
        if (tab === 'Expired in 90 days') { min = 31; max = 90; }

        data = data.filter(f => {
          const expiryDate = f.expiry_date ? new Date(f.expiry_date) : null;
          if (!expiryDate) return false;
          const daysToExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return daysToExpiry >= min && daysToExpiry <= max;
        });

        setForeigners(data);
        setFilteredForeigners(data);
      } else {
        // fallback
        setForeigners([]);
        setFilteredForeigners([]);
      }
      
      // Cache the fetched data for this tab
      tabDataCache.current.set(tab, data);
      console.log(`✅ Cached data for tab: ${tab}`);
      
    } catch (error) {
      console.error('Failed to fetch foreigners:', error);
      toast.info(`No data Found`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timeout;

    const initialLoad = async () => {
      const data = await fetchForeignersData('All');
      timeout = setTimeout(() => {
        if (!initialFetchCompleted.current) {
          toast.success('Foreigner records loaded!');
          initialFetchCompleted.current = true;
        }
      }, 0); // Delay execution to escape double invoke hell
    };

    initialLoad();

    return () => {
      clearTimeout(timeout); // Clean up to avoid lingering side effects
    };
  }, []);


  const applyFilter = (dataToFilter, currentTab) => {
    let result = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const getExpiryDate = (f) => {
      return f.expiry_date ? new Date(f.expiry_date) : null;
    };

    switch (currentTab) {
      case 'All':
        result = dataToFilter;
        break;
      case 'Registered By Visitor':
        result = dataToFilter.filter(f => f.registered_by_visitor === true);
        break;
      case 'Expired in 7 days':
        result = dataToFilter.filter(f => {
          const expiryDate = getExpiryDate(f);
          if (!expiryDate) return false;
          const daysToExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
          return daysToExpiry > 0 && daysToExpiry <= 7;
        });
        break;
      case 'Expired in 30 days':
        result = dataToFilter.filter(f => {
          const expiryDate = getExpiryDate(f);
          if (!expiryDate) return false;
          const daysToExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
          return daysToExpiry > 7 && daysToExpiry <= 30;
        });
        break;
      case 'Expired in 90 days':
        result = dataToFilter.filter(f => {
          const expiryDate = getExpiryDate(f);
          if (!expiryDate) return false;
          const daysToExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
          return daysToExpiry > 30 && daysToExpiry <= 90;
        });
        break;
      default:
        result = dataToFilter;
        break;

    }
    setFilteredForeigners(result);
  };






  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    // WHAT CHANGED: Pass tabName to fetchForeignersData
    fetchForeignersData(tabName);
  };

  const handleRegisterVisitorClick = () => {
    navigate('/foreigners/add');
  };
  // WHAT CHANGED: Handler to open the details modal
  const handleViewDetails = (foreignerId) => {
    setSelectedForeignerId(foreignerId);
    setShowDetailsModal(true);
  };

  // WHAT CHANGED: Handler to close the details modal


  // WHAT CHANGED: Handler to close the View Details modal
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedForeignerId(null);
  };

  // WHAT CHANGED: Handler to open the Edit Details modal
  const handleEditDetails = (foreignerId) => {
    setEditingForeignerId(foreignerId);
    setShowEditModal(true);
  };

  // WHAT CHANGED: Handler to close the Edit Details modal and refresh data
  const handleCloseEditModal = (foreignerId) => {
    setShowEditModal(false);
    setEditingForeignerId(foreignerId);
    fetchForeignersData(activeTab); // Refresh data after edit
  };
  const handleDeleteRequest = (id, name) => {
    setForeignerToDelete({ id, name });
    setShowDeleteConfirmModal(true);
  };

  // WHAT CHANGED: Handler for confirming deletion from modal
  const handleConfirmDelete = async () => {
    if (foreignerToDelete) {
      try {
        await deleteForeignerApi(foreignerToDelete.id);
        toast.success(`${foreignerToDelete.name}'s record deleted successfully!`);
        fetchForeignersData(activeTab); // Refresh data after deletion
      } catch (error) {
        console.error('Failed to delete foreigner:', error);
        toast.error(`Failed to delete record: ${error.message}`);
      } finally {
        setShowDeleteConfirmModal(false);
        setForeignerToDelete(null);
      }
    }
  };

  // WHAT CHANGED: Handler for canceling deletion from modal
  const handleCancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setForeignerToDelete(null);
  };
  const handleVisitorExportClick = async () => {
    try {
      const blob = await exportVisitorRegistrationsApi();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'visitor-registrations.csv'; // <-- use .csv
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Visitor registrations exported successfully!');

    } catch (error) {
      console.error('Failed to export visitor registrations:', error);
      toast.error(`Failed to export visitor registrations: ${error.message}`);
    }
  };
  const handleExportClick = async () => {
    try {
      // Map tab names to export slugs
      const tabSlugMap = {
        'All': 'registered-arrivals',
        'Expired in 7 days': 'expiring-in-7-days',
        'Expired in 30 days': 'expiring-in-30-days',
        'Expired in 90 days': 'expiring-in-90-days',
      };

      const exportSlug = tabSlugMap[activeTab] || 'registered-arrivals'; // Default fallback

      await exportDataApi(exportSlug);
      toast.success(`Exported ${activeTab} data successfully!`);
    } catch (err) {
      toast.error(err.message || "Export failed");
    }
  };

  return (
    <>
      <CustomScrollbarStyles />
      <div className="flex-1 p-6 bg-[#070b13] min-h-screen text-gray-100 font-sans custom-scrollbar">
        <div className="bg-[#141824] p-4 rounded-lg shadow-xl border border-gray-800">
          {/* Header Section */}
          <div className="mb-4">
            {/* Header row: title on left, buttons on right */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-50">
                Foreign Nationals Registered Arrivals
              </h1>

              <div className="flex space-x-2">
                <button
                  onClick={
                    activeTab === 'Registered By Visitor'
                      ? handleVisitorExportClick
                      : handleExportClick
                  }
                  className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Export
                </button>

                {activeTab !== 'Registered By Visitor' && (
                  <button
                    onClick={handleRegisterVisitorClick}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                  >
                    + Register Visitor
                  </button>
                )}
              </div>
            </div>

            {/* Full-width line that ignores padding */}
            <div className="-mx-4 mt-4">
              <hr className="w-full border-t border-gray-700" />
            </div>
          </div>



          {/* Tab-like navigation for filtering */}
          <div className="flex space-x-2 mb-6 ">
            {[
              'All',
              // 'Registered',

              'Registered By Visitor',
              'Expired in 7 days',
              'Expired in 30 days',
              'Expired in 90 days'
            ].map(tab => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`py-1 px-4 text-sm font-medium transition-colors duration-200
                ${activeTab === tab
                    ? 'bg-blue-500 rounded-md text-white'
                    : 'text-gray-400 bg-gray-800 rounded-md hover:text-white'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Data Table Container */}
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-250px)] rounded-lg shadow-lg border border-gray-800 custom-scrollbar">
            <table className="min-w-full bg-gray-900 text-left text-sm text-gray-300 ">
              <thead className="bg-gray-700 text-gray-100 uppercase text-xs sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left">CASE ID</th>
                  <th scope="col" className="px-6 py-3 text-left">NAME</th>
                  <th scope="col" className="px-6 py-3 text-left">NATIONALITY</th>
                  <th scope="col" className="px-6 py-3 text-left">GENDER</th>
                  <th scope="col" className="px-6 py-3 text-left">PASSPORT NUMBER</th>
                  <th scope="col" className="px-6 py-3 text-left">PASSPORT VALIDITY</th>
                  <th scope="col" className="px-6 py-3 text-left">VISA NUMBER</th>
                  <th scope="col" className="px-6 py-3 text-left">VISA TYPE</th>
                  <th scope="col" className="px-6 py-3 text-left">VISA EXPIRY</th>
                  <th scope="col" className="px-6 py-3 text-left">OCCUPATION</th>
                  <th scope="col" className="px-6 py-3 text-left">EMPLOYER</th>
                  <th scope="col" className="px-6 py-3 text-left">INDIAN ADDRESS</th>
                  <th scope="col" className="px-6 py-3 text-left">STATUS</th>
                  <th scope="col" className="px-6 py-3 text-left">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredForeigners.length > 0 ? (
                  filteredForeigners.map(foreigner => (
                    <ForeignerTableRow
                      key={foreigner.foreigner_id || foreigner.passport_number}
                      foreigner={foreigner}
                      onDeleteSuccess={fetchForeignersData}
                      onViewDetails={handleViewDetails} // WHAT CHANGED: Pass onViewDetails handler
                      onEditDetails={handleEditDetails}
                      onDeleteRequest={handleDeleteRequest}
                    // WHAT CHANGED: Pass onDeleteRequest handler
                    // WHAT CHANGED: Pass onEditDetails handler
                    />))
                ) : (
                  <tr className="text-center">
                    <td colSpan="14" className="py-4 text-gray-400">No records found for this category.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* WHAT CHANGED: Conditionally render ForeignerDetailsPage as a modal */}
      {showDetailsModal && selectedForeignerId && (
        <ForeignerDetailsPage foreignerId={selectedForeignerId} onClose={handleCloseDetailsModal} />
      )}
      {showEditModal && editingForeignerId && (
        <EditForeignerPage
          foreignerId={editingForeignerId}
          onClose={handleCloseEditModal}
          onSaveSuccess={handleCloseEditModal} // Close and refresh data on save
        />
      )}
      {showDeleteConfirmModal && foreignerToDelete && (
        <DeleteConfirmationModal
          itemName="Register Arrival" // As per screenshot
          message={`Are you sure do you want to delete the user '${foreignerToDelete.name}'! click on delete if you want to.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default RegisteredArrivalsPage;

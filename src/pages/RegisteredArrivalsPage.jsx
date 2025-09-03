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
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [foreignerToDelete, setForeignerToDelete] = useState(null); // Stores { id, name } of foreigner to delete
  const [availableNationalities, setAvailableNationalities] = useState(['All']);
  const [selectedNationality, setSelectedNationality] = useState('All');
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
      // Update available nationalities when data is loaded
      const nationalities = ['All', ...new Set(cachedData.map(f => f.nationality).filter(Boolean))];
      setAvailableNationalities(nationalities);
      applyFilter(cachedData, tab, selectedNationality);
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
      toast.error(`Failed to load data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique nationalities from data
  const updateNationalities = (data) => {
    if (!data || !Array.isArray(data)) {
      setAvailableNationalities(['All']);
      return;
    }
    const nationalities = ['All', ...new Set(data.map(f => f?.nationality).filter(Boolean))];
    setAvailableNationalities(nationalities);
  };

  // Update nationalities when data changes
  useEffect(() => {
    if (foreigners.length > 0) {
      updateNationalities(foreigners);
    }
  }, [foreigners]);

  useEffect(() => {
    let timeout;

    const initialLoad = async () => {
      const data = await fetchForeignersData('All');
      updateNationalities(data);
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


  const applyFilter = (dataToFilter, currentTab, nationalityFilter) => {
    // If no nationality filter is provided, use the current selectedNationality
    if (nationalityFilter === undefined) {
      nationalityFilter = selectedNationality;
    }
    // Apply nationality filter first if not 'All'
    let filteredData = dataToFilter;
    if (nationalityFilter && nationalityFilter !== 'All') {
      filteredData = dataToFilter.filter(f => f.nationality === nationalityFilter);
    }

    // Then apply tab-specific filters
    let result = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const getExpiryDate = (f) => {
      return f.expiry_date ? new Date(f.expiry_date) : null;
    };

    switch (currentTab) {
      case 'All':
        result = filteredData;
        break;
      case 'Registered By Visitor':
        result = filteredData.filter(f => f.registered_by_visitor === true);
        break;
      case 'Expired in 7 days':
        result = filteredData.filter(f => {
          const expiryDate = getExpiryDate(f);
          if (!expiryDate) return false;
          const daysToExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
          return daysToExpiry > 0 && daysToExpiry <= 7;
        });
        break;
      case 'Expired in 30 days':
        result = filteredData.filter(f => {
          const expiryDate = getExpiryDate(f);
          if (!expiryDate) return false;
          const daysToExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
          return daysToExpiry > 7 && daysToExpiry <= 30;
        });
        break;
      case 'Expired in 90 days':
        result = filteredData.filter(f => {
          const expiryDate = getExpiryDate(f);
          if (!expiryDate) return false;
          const daysToExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
          return daysToExpiry > 30 && daysToExpiry <= 90;
        });
        break;
      default:
        result = filteredData;
        break;
    }
    setFilteredForeigners(result);
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setSelectedNationality('All'); // Reset nationality filter when changing tabs
    fetchForeignersData(tabName);
  };

  const handleNationalityChange = (e) => {
    const newNationality = e.target.value;
    setSelectedNationality(newNationality);
    applyFilter(foreigners, activeTab, newNationality);
  };

  const handleRegisterVisitorClick = () => {
    navigate('/foreigners/add');
  };

  const handleViewDetails = (foreignerId) => {
    setSelectedForeignerId(foreignerId);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedForeignerId(null);
  };

  const handleEditDetails = (foreignerId) => {
    setEditingForeignerId(foreignerId);
    setShowEditModal(true);
  };

  const handleCloseEditModal = (shouldRefresh = false) => {
    setShowEditModal(false);
    setEditingForeignerId(null);
    if (shouldRefresh) {
      fetchForeignersData(activeTab);
    }
  };

  const handleDeleteRequest = (id, name) => {
    setForeignerToDelete({ id, name });
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (foreignerToDelete) {
      try {
        await deleteForeignerApi(foreignerToDelete.id);
        toast.success('Foreigner deleted successfully');
        // Refresh the data
        fetchForeignersData(activeTab);
      } catch (error) {
        console.error('Failed to delete foreigner:', error);
        toast.error('Failed to delete foreigner');
      } finally {
        setShowDeleteConfirmModal(false);
        setForeignerToDelete(null);
      }
    }
  };

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
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold">Registered Arrivals</h1>
            <div className="flex items-center space-x-4">
              {/* New Visitor Button */}
              <button
                onClick={() => navigate('/foreigners/add')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                title="Add New Visitor"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Visitor
              </button>

              {/* Export Button */}
              <button
                onClick={handleExportClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                title="Export Data"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export
              </button>

              {/* Nationality Filter Dropdown */}
              <div className="relative w-48">
                <select
                  value={selectedNationality}
                  onChange={handleNationalityChange}
                  className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8 appearance-none"
                >
                  {availableNationalities.map((nationality) => (
                    <option key={nationality} value={nationality}>
                      {nationality}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="w-full overflow-x-auto">
            <div className="flex space-x-2 pb-1">
              {[
                'All',
                'Registered By Visitor',
                'Expired in 7 days',
                'Expired in 30 days',
                'Expired in 90 days'
              ].map(tab => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`py-2 px-4 text-sm font-medium transition-colors duration-200 whitespace-nowrap
                    ${activeTab === tab
                      ? 'bg-blue-500 rounded-md text-white shadow-md'
                      : 'text-gray-400 bg-gray-800 rounded-md hover:bg-gray-700 hover:text-white'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
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

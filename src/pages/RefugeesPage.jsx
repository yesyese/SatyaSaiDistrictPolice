// src/pages/RefugeesPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, Pencil, Trash2 } from 'lucide-react';
// WHAT CHANGED: Re-imported getForeignersByStatusApi and deleteForeignerApi for the first table
import { getForeignersByStatusApi, deleteForeignerApi, getRefugeeCasesManagementApi, addRefugeeCaseApi } from '../apiService';
import { CustomScrollbarStyles } from '../components/CustomScrollbarStyles';
import RefugeeCaseDetailsPage from './RefugeeCaseDetailsPage'; // Assuming this is for View Details modal
import EditRefugeeCasePage from './EditRefugeeCasePage'; // WHAT CHANGED: Import EditRefugeeCasePage for the edit modal
import { exportDataApi } from '../apiService'; // Adjust the path


// Helper component for the FIRST table (Foreigners with 'Refugee' status)
const ForeignerTableRow = ({ foreigner, onDeleteSuccess, onViewDetails, onEditDetails, onDeleteRequest }) => { // Added props for consistency
  const navigate = useNavigate();

  let visaStatusText = 'N/A';
  let visaStatusBgColor = '';
  let visaStatusTextColor = 'text-gray-100';

  const visaExpiryDate = foreigner.expiry_date ? new Date(foreigner.expiry_date) : null;

  if (visaExpiryDate) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const timeDiff = visaExpiryDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) {
      visaStatusText = `Overstayed by ${Math.abs(daysDiff)} days`;
      visaStatusBgColor = 'bg-red-800';
    } else if (daysDiff === 0) {
      visaStatusText = 'Expires Today';
      visaStatusBgColor = 'bg-red-800';
    } else if (daysDiff <= 7) {
      visaStatusText = `${daysDiff} Days Left`;
      visaStatusBgColor = 'bg-orange-800';
    } else if (daysDiff <= 30) {
      visaStatusText = `${daysDiff} Days Left`;
      visaStatusBgColor = 'bg-yellow-800';
    } else {
      visaStatusText = `${daysDiff} Days Left`;
      visaStatusBgColor = 'bg-green-800';
    }
  } else if (foreigner.status) {
    visaStatusText = foreigner.status;
    switch (foreigner.status) {
      case 'Registered':
        visaStatusBgColor = 'bg-blue-800';
        break;
      case 'Unregistered':
        visaStatusBgColor = 'bg-purple-800';
        break;
      case 'Refugee': // This is the status for the first table
        visaStatusBgColor = 'bg-indigo-800';
        break;
      case 'Overstay':
        visaStatusBgColor = 'bg-red-800';
        break;
      case 'Citizenship_Request':
        visaStatusBgColor = 'bg-teal-800';
        break;
      case 'OutOfView':
        visaStatusBgColor = 'bg-gray-800';
        break;
      default:
        visaStatusBgColor = 'bg-gray-700';
    }
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${foreigner.name}'s record?`)) {
      try {
        await deleteForeignerApi(foreigner.foreigner_id);
        toast.success(`${foreigner.name}'s record deleted successfully!`);
        onDeleteSuccess();
      } catch (error) {
        console.error('Failed to delete foreigner:', error);
        toast.error(`Failed to delete record: ${error.message}`);
      }
    }
  };

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200">
      <td className="px-6 py-4 text-left">{foreigner.foreigner_id || 'N/A'}</td> {/* Using foreigner_id for consistency */}
      <td className="px-6 py-4 text-left">{foreigner.name || 'N/A'}</td>
      <td className="px-6 py-4 text-left">{foreigner.nationality || 'N/A'}</td>
      <td className="px-6 py-4 text-left">{foreigner.gender || 'N/A'}</td>
      <td className="px-6 py-4 text-left">{foreigner.passport_number || 'N/A'}</td>
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
      <td className="px-6 py-4 text-left">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${visaStatusBgColor} ${visaStatusTextColor}`}>
          {visaStatusText}
        </span>
      </td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">
        <div className="flex flex-row space-x-2">
          <button
            onClick={() => onViewDetails(foreigner.foreigner_id)}
            className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center"
          >
            <Eye className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() => navigate(`/foreigners/edit/${foreigner.foreigner_id}`)}
            className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center"
          >
            <Pencil className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center"
          >
            <Trash2 className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Helper component for the Refugee Case Management table
const RefugeeCaseManagementTableRow = ({ caseData, onViewDetails, onEditDetails }) => { // WHAT CHANGED: Added onEditDetails prop
  const navigate = useNavigate();

  let statusBgColor = '';
  let statusTextColor = 'text-gray-100';

  switch (caseData.VisaStatus) {
    case 'Rejected':
      statusBgColor = 'bg-red-800';
      break;
    case 'Granted':
      statusBgColor = 'bg-green-800';
      break;
    case 'Asylum Seeker':
      statusBgColor = 'bg-yellow-800';
      break;
    case 'Decision Pending':
      statusBgColor = 'bg-orange-800';
      break;
    default:
      statusBgColor = 'bg-gray-700';
  }

  const handleViewDetailsClick = () => {
    onViewDetails(caseData.id);
  };

  const handleEditDetailsClick = () => { // WHAT CHANGED: New handler for Edit button
    onEditDetails(caseData.id);
  };

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200">
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{caseData.id || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{caseData.Name || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{caseData.Nationality || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">
        {caseData.DateRegistered ? new Date(caseData.DateRegistered).toLocaleDateString() : 'N/A'}
      </td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{caseData.AssignedOfficer || 'N/A'}</td>
      <td className="px-6 py-4 text-left">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBgColor} ${statusTextColor}`}>
          {caseData.VisaStatus || 'N/A'}
        </span>
      </td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleViewDetailsClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded-md text-xs transition-colors duration-200"
          >
            View Details
          </button>
          <button
            onClick={handleEditDetailsClick} // WHAT CHANGED: Call new edit handler
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-1 px-4 rounded-md text-xs transition-colors duration-200"
          >
            Edit
          </button>
        </div>
      </td>
    </tr>
  );
};

// AddRefugeeCaseModal component definition (it was previously commented out / misplaced)
const AddRefugeeCaseModal = ({ onClose, onCaseAdded }) => {
  const [formData, setFormData] = useState({
    Name: '',
    Nationality: '',
    AssignedOfficer: '',
    DateRegistered: new Date().toISOString().split('T')[0],
    VisaStatus: 'Decision Pending',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addRefugeeCaseApi(formData);
      toast.success('Refugee case added successfully!');
      onCaseAdded();
      onClose();
    } catch (error) {
      console.error('Error adding refugee case:', error);
      toast.error(`Failed to add case: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-md mx-auto relative overflow-y-auto hide-scrollbar" style={{ maxHeight: '90vh' }}>
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-50">Add New Refugee Case</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <label className="input-label">Name</label>
            <input type="text" name="Name" placeholder="Full Name" value={formData.Name} onChange={handleChange} className="input-field" required />
          </div>

          <div>
            <label className="input-label">Nationality</label>
            <input type="text" name="Nationality" placeholder="Nationality" value={formData.Nationality} onChange={handleChange} className="input-field" required />
          </div>

          <div>
            <label className="input-label">Assigned Officer</label>
            <input type="text" name="AssignedOfficer" placeholder="Assigned Officer" value={formData.AssignedOfficer} onChange={handleChange} className="input-field" />
          </div>

          <div>
            <label className="input-label">Date Registered</label>
            <input type="date" name="DateRegistered" value={formData.DateRegistered} onChange={handleChange} className="input-field" required />
          </div>

          <div>
            <label className="input-label">Visa Status</label>
            <input type='text' name="VisaStatus" className="input-field" defaultValue={'Decision Pending'} readOnly />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Case'}
            </button>
          </div>
        </form>
        {/* Inline styles for input-field and input-label */}
        <style>{`
          .input-field {
            padding: 0.75rem; border-radius: 0.375rem; background-color: #374151; color: #F3F4F6;
            border: 1px solid #4B5563; outline: none; box-shadow: none; width: 100%;
          }
          .input-field::placeholder { color: #9CA3AF; }
          .input-field:focus { ring-width: 2px; ring-color: #3B82F6; border-color: #3B82F6; }
          .input-label {
            display: block; font-size: 0.875rem; color: #9CA3AF; margin-bottom: 0.25rem; padding-left: 0.25rem;
          }
          select.input-field {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%239CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>');
            background-repeat: no-repeat; background-position: right 0.75rem center; background-size: 1rem;
            -webkit-appearance: none; -moz-appearance: none; appearance: none;
          }
          input[type="date"] {
            -webkit-appearance: none; -moz-appearance: none; appearance: none;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%239CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>');
            background-repeat: no-repeat; background-position: right 0.75rem center; background-size: 1rem; padding-right: 2.5rem;
          }
          input[type="date"]::-webkit-datetime-edit-text { color: #F3F4F6; }
          input[type="date"]::-webkit-datetime-edit-month-field { color: #F3F4F6; }
          input[type="date"]::-webkit-datetime-edit-day-field { color: #F3F4F6; }
          input[type="date"]::-webkit-datetime-edit-year-field { color: #F3F4F6; }
          input[type="date"]::-webkit-datetime-edit-fields-wrapper { color: #F3F4F6; }
          input[type="date"]::-webkit-inner-spin-button { display: none; }
          input[type="date"]::-webkit-calendar-picker-indicator { opacity: 1; filter: invert(0.7); }
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    </div>
  );
};


const RefugeesPage = () => {
  const [refugeeCases, setRefugeeCases] = useState([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const hasShownToast = useRef(false);
  const handleExportClick = async () => {
    try {
      await exportDataApi('refugees');
    }
    catch(err){
      toast.err('Export Failed');
    }
  };
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  // WHAT CHANGED: State for View Refugee Case Details modal
  const [showRefugeeDetailsModal, setShowRefugeeDetailsModal] = useState(false);
  const [selectedRefugeeId, setSelectedRefugeeId] = useState(null);

  // WHAT CHANGED: State for Edit Refugee Case modal
  const [showEditRefugeeModal, setShowEditRefugeeModal] = useState(false);
  const [editingRefugeeId, setEditingRefugeeId] = useState(null);


  const fetchRefugeeCasesManagement = async () => {
    setLoadingCases(true);
    try {
      const data = await getRefugeeCasesManagementApi();
      setRefugeeCases(data);
      if (!hasShownToast.current) {
        toast.success('Refugee Cases loaded!');
        hasShownToast.current = true;
      }
    } catch (error) {
      console.error('Failed to fetch Refugee Cases Management data:', error);
      toast.error(`Failed to load refugee cases: ${error.message}`);
    } finally {
      setLoadingCases(false);
    }
  };

  useEffect(() => {
    fetchRefugeeCasesManagement();
  }, []);

  const handleAddNewCaseClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCaseAdded = () => {
    fetchRefugeeCasesManagement();
  };

  // WHAT CHANGED: Handler to open the View Refugee Case Details modal
  const handleViewRefugeeCaseDetails = (caseId) => {
    setSelectedRefugeeId(caseId);
    setShowRefugeeDetailsModal(true);
  };

  // WHAT CHANGED: Handler to close the View Refugee Case Details modal
  const handleCloseRefugeeDetailsModal = () => {
    setShowRefugeeDetailsModal(false);
    setSelectedRefugeeId(null);
  };

  // WHAT CHANGED: Handler to open the Edit Refugee Case modal
  const handleEditRefugeeCaseDetails = (caseId) => {
    setEditingRefugeeId(caseId);
    setShowEditRefugeeModal(true);
  };

  // WHAT CHANGED: Handler to close the Edit Refugee Case modal and refresh data
  const handleCloseEditRefugeeModal = () => {
    setShowEditRefugeeModal(false);
    setEditingRefugeeId(null);
    fetchRefugeeCasesManagement(); // Refresh data after edit
  };


  return (
    <>
      <CustomScrollbarStyles />
      <div className="flex-1 p-6 bg-[#070b13] min-h-screen text-gray-100 font-sans">
        <div className="bg-[#141824] p-6 rounded-lg shadow-xl border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-50">Refugee Case Management</h1>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportClick}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
              >
                Export
              </button>

              <button
                onClick={handleAddNewCaseClick}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
              >
                + Add New Case
              </button>
            </div>
          </div>


          {/* Main Table Container (Refugee Case Management Data) */}
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-250px)] rounded-lg shadow-lg border border-gray-800 custom-scrollbar">
            <table className="min-w-full bg-gray-900 text-left text-sm text-gray-300">
              <thead className="bg-gray-800 text-gray-100 uppercase text-xs sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left">CASE ID</th>
                  <th className="px-6 py-3 text-left">NAME</th>
                  <th className="px-6 py-3 text-left">NATIONALITY</th>
                  <th className="px-6 py-3 text-left">DATE REGISTERED</th>
                  <th className="px-6 py-3 text-left">ASSIGNED OFFICER</th>
                  <th className="px-6 py-3 text-left">VISA STATUS</th>
                  <th className="px-6 py-3 text-left">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loadingCases ? (
                  <tr className="text-center">
                    <td colSpan="7" className="py-4 text-gray-400">Loading refugee cases...</td>
                  </tr>
                ) : refugeeCases.length > 0 ? (
                  refugeeCases.map(caseItem => (
                    <RefugeeCaseManagementTableRow
                      key={caseItem.id}
                      caseData={caseItem}
                      onViewDetails={handleViewRefugeeCaseDetails}
                      onEditDetails={handleEditRefugeeCaseDetails} // WHAT CHANGED: Pass edit handler
                    />
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan="7" className="py-4 text-gray-400">No refugee cases found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <AddRefugeeCaseModal onClose={handleCloseModal} onCaseAdded={handleCaseAdded} />
      )}
      {/* WHAT CHANGED: Conditionally render RefugeeCaseDetailsPage as a modal */}
      {showRefugeeDetailsModal && selectedRefugeeId && (
        <RefugeeCaseDetailsPage refugeeId={selectedRefugeeId} onClose={handleCloseRefugeeDetailsModal} />
      )}
      {/* WHAT CHANGED: Conditionally render EditRefugeeCasePage as a modal */}
      {showEditRefugeeModal && editingRefugeeId && (
        <EditRefugeeCasePage
          refugeeId={editingRefugeeId}
          onClose={handleCloseEditRefugeeModal}
          onSaveSuccess={handleCloseEditRefugeeModal} // Close and refresh data on save
        />
      )}
    </>
  );
};

export default RefugeesPage;

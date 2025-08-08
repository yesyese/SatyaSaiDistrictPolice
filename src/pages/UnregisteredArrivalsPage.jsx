// src/pages/UnregisteredArrivalsPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CustomScrollbarStyles } from '../components/CustomScrollbarStyles';
import { getForeignersByStatusApi, deleteForeignerApi, getUnregisteredCaseByIdApi, getUnregisteredArrivalsManagementApi, addUnregisteredCaseApi } from '../apiService';
import {Eye,Pencil,Trash2} from 'lucide-react';

import FileReportModal from '../components/FileReportModal';
import EditCaseModal from '../components/EditCaseModal'; // WHAT CHANGED: Import EditCaseModal


// Helper component for the first table (Foreigners with 'Unregistered' status)
const ForeignerTableRow = ({ foreigner, onDeleteSuccess }) => {
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
    switch(foreigner.status) {
      case 'Registered':
        visaStatusBgColor = 'bg-blue-800';
        break;
      case 'Unregistered':
        visaStatusBgColor = 'bg-purple-800';
        break;
      case 'Refugee':
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
      <td className="px-6 py-4 text-left">{foreigner.id || 'N/A'}</td>
      <td className="px-6 py-4 text-left">{foreigner.name || 'N/A'}</td>
      <td className="px-6 py-4 text-left">{foreigner.nationality || 'N/A'}</td>
      <td className="px-6 py-4 text-left">{foreigner.gender || 'N/A'}</td>
      <td className="px-6 py-4 text-left">{foreigner.passport_number || 'N/A'}</td>
      <td className="px-6 py-4 text-left">
        {foreigner.passport_validity ? new Date(foreigner.passport_validity).toLocaleDateString() : 'N/A'}
      </td>
      <td className="px-6 py-4 text-left">{foreigner.visa_number || 'N/A'}</td>
      <td className="px-6 py-4 text-left">{foreigner.visa_type || 'N/A'}</td>
      <td className="px-6 py-4 text-left">
        {visaExpiryDate ? visaExpiryDate.toLocaleDateString() : 'N/A'}
      </td>
      <td className="px-6 py-4 text-left">{foreigner.occupation || 'N/A'}</td>
      <td className="px-6 py-4 text-left">{foreigner.employer || 'N/A'}</td>
      <td className="px-6 py-4 text-left">{foreigner.indian_address || 'N/A'}</td>
      <td className="px-6 py-4 text-left">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${visaStatusBgColor} ${visaStatusTextColor}`}>
          {visaStatusText}
        </span>
      </td>
      <td className="px-6 py-4 text-left">
        <div className="flex flex-row space-x-2">
          <button
            onClick={() => navigate(`/foreigners/${foreigner.foreigner_id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded-md text-xs"
          >
            <Eye className="w-5 h-5 text-blue-400" />
          </button>
          <button
            onClick={() => navigate(`/foreigners/edit/${foreigner.foreigner_id}`)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-1 px-2 rounded-md text-xs"
          >
            <Pencil className="w-4 h-4 text-yellow-400" />
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-2 rounded-md text-xs"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </td>
    </tr>
  );
};


// Helper component for the main table: Unregistered Arrivals Data
const UnregisteredArrivalTableRow = ({ reportData, onEdit }) => { // WHAT CHANGED: Added onEdit prop
  const navigate = useNavigate();

  let statusBgColor = '';
  let statusTextColor = 'text-gray-100';
  const name = reportData.Name || 'N/A';
  switch (reportData.status) {
    case 'Pending Verification':
      statusBgColor = 'bg-yellow-800';
      break;
    case 'Under Investigation':
      statusBgColor = 'bg-blue-800';
      break;
    case 'Case Closed':
      statusBgColor = 'bg-green-800';
      break;
    case 'Pending':
      statusBgColor = 'bg-orange-800';
      break;
    default:
      statusBgColor = 'bg-gray-700';
  }

  
  
  const handleEditStatusClick = () => { // WHAT CHANGED: New handler for Edit Status button
    onEdit(reportData.id);
  };

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200">
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{reportData.Name || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{reportData.ReportedPlace || 'N/A'}</td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">
        {reportData.reported_at ? new Date(reportData.reported_at).toLocaleDateString() : 'N/A'}
      </td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{reportData.ReportedBy || 'N/A'}</td>
      <td className="px-6 py-4 text-left">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBgColor} ${statusTextColor}`}>
          {reportData.status || 'N/A'}
        </span>
      </td>
      <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">
        <div className="flex space-x-2">
          
          <button
            onClick={handleEditStatusClick} // WHAT CHANGED: Call the new edit handler
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-1 px-3 rounded-md text-xs transition-colors duration-200"
          >
            Edit Status
          </button>
        </div>
      </td>
    </tr>
  );
};


// WHAT CHANGED: The FileReportModal component definition is now included here for self-containment


const UnregisteredArrivalsPage = () => {
  const [unregisteredReports, setUnregisteredReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const hasShownToast = useRef(false);
  const navigate = useNavigate();

  const [showFileReportModal, setShowFileReportModal] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(null); // WHAT CHANGED: State to store caseId for modal
  const [showEditModal, setShowEditModal] = useState(false); // WHAT CHANGED: State to control EditCaseModal visibility
  const [editingCaseId, setEditingCaseId] = useState(null); // WHAT CHANGED: State to store caseId for editing


  const fetchUnregisteredReports = async () => {
    setLoadingReports(true);
    try {
      const data = await getUnregisteredArrivalsManagementApi();
      setUnregisteredReports(data);
      if (!hasShownToast.current) {
        toast.success('Unregistered Arrivals data loaded!');
        hasShownToast.current = true;
      }
    } catch (error) {
      console.error('Failed to fetch Unregistered Arrivals Management reports:', error);
      toast.error(`Failed to load data: ${error.message}`);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchUnregisteredReports();
  }, []);

  const handleFileReportClick = () => {
    setShowFileReportModal(true);
  };

  const handleCloseFileReportModal = () => {
    setShowFileReportModal(false);
    fetchUnregisteredReports(); // WHAT CHANGED: Refresh data after file report
  };

  const handleReportFiled = () => {
    fetchUnregisteredReports();
  };

 

 

  const handleEditCase = (caseId) => { // WHAT CHANGED: New handler for opening edit modal
    setEditingCaseId(caseId);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => { // WHAT CHANGED: New handler for closing edit modal
    setShowEditModal(false);
    setEditingCaseId(null);
    fetchUnregisteredReports(); // Refresh data after edit
  };

  return (
    <>
      <CustomScrollbarStyles />
      <div className="flex-1 p-6 bg-[#070b13] min-h-screen text-gray-100 font-sans">
        <div className="bg-[#141824] p-6 rounded-lg shadow-xl border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-50">Unregistered Arrivals Data</h1>
            <button
              onClick={handleFileReportClick}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
            >
              + File Report
            </button>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-250px)] rounded-lg shadow-lg border border-gray-800 custom-scrollbar">
            <table className="min-w-full bg-gray-900 text-left text-sm text-gray-300">
              <thead className="bg-gray-800 text-gray-100 uppercase text-xs sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left">NAME</th>
                  <th className="px-6 py-3 text-left">REPORTED PLACE</th>
                  <th className="px-6 py-3 text-left">REPORTED DATE</th>
                  <th className="px-6 py-3 text-left">REPORTED BY</th>
                  <th className="px-6 py-3 text-left">STATUS</th>
                  <th className="px-6 py-3 text-left">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loadingReports ? (
                  <tr className="text-center">
                    <td colSpan="6" className="py-4 text-gray-400">Loading reports...</td>
                  </tr>
                ) : unregisteredReports.length > 0 ? (
                  unregisteredReports.map(report => (
                    <UnregisteredArrivalTableRow
                      key={report.id}
                      reportData={report}
                      onEdit={handleEditCase} // WHAT CHANGED: Pass edit handler to table row
                    />
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan="5" className="py-4 text-gray-400">No unregistered reports found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showFileReportModal && (
        <FileReportModal onClose={handleCloseFileReportModal} onReportFiled={handleReportFiled} />
      )}
    
      {showEditModal && editingCaseId && (
        <EditCaseModal caseId={editingCaseId} onClose={handleCloseEditModal} onSaveSuccess={handleCloseEditModal} />
      )}
    </>
  );
};

export default UnregisteredArrivalsPage;

// src/pages/UnregisteredArrivalsPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { CustomScrollbarStyles } from '../components/CustomScrollbarStyles';
import {   getUnregisteredArrivalsManagementApi } from '../apiService';

import FileReportModal from '../components/FileReportModal';
import EditCaseModal from '../components/EditCaseModal'; // WHAT CHANGED: Import EditCaseModal


// Helper component for the first table (Foreigners with 'Unregistered' status)



// Helper component for the main table: Unregistered Arrivals Data
const UnregisteredArrivalTableRow = ({ reportData, onEdit }) => { // WHAT CHANGED: Added onEdit prop

  let statusBgColor = '';
  let statusTextColor = 'text-gray-100';
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

  const [showFileReportModal, setShowFileReportModal] = useState(false);
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
      toast.info(`No data found`);
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


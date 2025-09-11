// src/pages/GrievanceHandlingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getGrievancesApi } from '../apiService';
import { CustomScrollbarStyles } from '../components/CustomScrollbarStyles';
import NewGrievanceModal from '../components/NewGrievanceModal';
import GrievanceDetailsPage from './GrievanceDetailsPage';
import EditGrievanceStatusModal from '../components/EditGrievanceStatusModal';
import { exportDataApi } from '../apiService'; // Adjust the path

const GrievanceTableRow = ({ grievance, onViewDetails, onEditStatus }) => {
  const navigate = useNavigate();

  const getStatusClasses = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-800 text-blue-300';
      case 'In Progress':
        return 'bg-yellow-800 text-yellow-300';
      case 'Resolved':
        return 'bg-green-800 text-green-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200">
      <td className="px-6 py-4 text-left">{grievance.id || 'N/A'}</td>
      <td className="px-6 py-4 text-left">{grievance.complainant_by || 'N/A'}</td>
      <td className="px-6 py-4 text-left">{grievance.subject || 'N/A'}</td>
      <td className="px-6 py-4 text-left">
        {grievance.date_submitted ? new Date(grievance.date_submitted).toLocaleDateString() : 'N/A'}
      </td>
      <td className="px-6 py-4 text-left">
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(grievance.status)}`}>
          {grievance.status || 'N/A'}
        </span>
      </td>
      <td className="px-6 py-4 text-left">
        <button
          onClick={onEditStatus}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded-md text-xs transition-colors duration-200"
        >
          Edit Status
        </button>
      </td>
    </tr>
  );
};

const GrievanceHandlingPage = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedGrievanceId, setSelectedGrievanceId] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false); // 👈 New state
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [editStatusGrievance, setEditStatusGrievance] = useState(null);

  // Handler to update grievance status locally
  const handleStatusUpdateSuccess = (grievanceId, newStatus) => {
    setGrievances(prevGrievances =>
      prevGrievances.map(g =>
        g.id === grievanceId ? { ...g, status: newStatus } : g
      )
    );
  };
  const navigate = useNavigate();

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const data = await getGrievancesApi();
      setGrievances(data);
      toast.success('Grievance records loaded!', { toastId: 'grievance-load-success' });
    } catch (error) {
      console.error('Failed to fetch grievances:', error);
      toast.error(`Failed to load grievances: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleAddGrievanceClick = () => {
    setShowNewModal(true); // 👈 Open modal
  };

  const handleEditStatus = (grievance) => {
    setEditStatusGrievance(grievance);
    setShowEditStatusModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedGrievanceId(null);
  };
  const handleExportGrievances = async () => {
    try {
      await exportDataApi('grievances');
    } catch (err) {
      toast.error(err.message || "Export failed");
    }
  };
  return (
    <>
      <CustomScrollbarStyles />
      <div className="flex-1 p-6 bg-[#070b13] min-h-screen text-gray-100 font-sans">
        <div className="bg-[#141824] p-6 rounded-lg shadow-xl border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-50">Grievance Handling System</h1>
            <div className="flex space-x-3">
              <button
                onClick={handleExportGrievances}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
              >
                Export
              </button>

            </div>
          </div>


          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-250px)] rounded-lg shadow-lg border border-gray-800 custom-scrollbar">
            <table className="min-w-full bg-gray-900 text-left text-sm text-gray-300">
              <thead className="bg-gray-700 text-gray-100 uppercase text-xs sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left">ID</th>
                  <th scope="col" className="px-6 py-3 text-left">COMPLAINT BY</th>
                  <th scope="col" className="px-6 py-3 text-left">SUBJECT</th>
                  <th scope="col" className="px-6 py-3 text-left">DATE SUBMITTED</th>
                  <th scope="col" className="px-6 py-3 text-left">STATUS</th>
                  <th scope="col" className="px-6 py-3 text-left">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="text-center">
                    <td colSpan="6" className="py-4 text-gray-400">Loading grievances...</td>
                  </tr>
                ) : grievances.length > 0 ? (
                  grievances.map(grievance => (
                    <GrievanceTableRow key={grievance.id} grievance={grievance} onEditStatus={() => handleEditStatus(grievance)} />
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan="6" className="py-4 text-gray-400">No grievance records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailsModal && selectedGrievanceId && (
          <GrievanceDetailsPage grievanceId={selectedGrievanceId} onClose={handleCloseDetailsModal} />
        )}

        {/* New Grievance Modal */}
        {showNewModal && (
          <NewGrievanceModal onClose={() => setShowNewModal(false)} />
        )}
        {showEditStatusModal && editStatusGrievance && (
          <EditGrievanceStatusModal
            grievanceId={editStatusGrievance.id}
            currentStatus={editStatusGrievance.status}
            onClose={() => setShowEditStatusModal(false)}
            onSaveSuccess={handleStatusUpdateSuccess}
          />
        )}
      </div>
    </>
  );
};

export default GrievanceHandlingPage;

// src/pages/OrganizationsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { Eye, Pencil, Trash2 } from 'lucide-react'; // Icons for actions
import { getUsersByStationApi, exportAllCsvApi, deleteUserApi } from '../apiService'; // WHAT CHANGED: Import necessary APIs
import { CustomScrollbarStyles } from '../components/CustomScrollbarStyles';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'; // Import delete modal
import EditUserDetailsModal from '../components/EditUserDetailsModal'; // Import Edit User Modal
import UserDetailsModal from '../components/UserDetailsModal'; // Import View User Modal


// Helper component for a single user row within an organization
const OrganizationUserTableRow = ({ user, onDeleteRequest, onEditDetails, onViewDetails }) => {

  // Determine status styling based on backend's user.status field
  let statusText = user.status || 'N/A';
  let statusColorClass = 'text-gray-400';
  let statusBgClass = 'bg-gray-700';

  if (user.status === 'Active') {
    statusColorClass = 'text-green-400';
    statusBgClass = 'bg-green-800';
  } else if (user.status === 'Inactive') {
    statusColorClass = 'text-red-400';
    statusBgClass = 'bg-red-800';
  }

  const handleRequestDelete = () => {
    onDeleteRequest(user.id, user.username);
  };
  const handleEdit = () => {
    onEditDetails(user.id);
  };
  const handleView = () => {
    onViewDetails(user.id);
  };

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200">
      <td className="px-6 py-4 text-left">{user.username || 'N/A'}</td>
      <td className="px-6 py-4 text-left">{user.role || 'N/A'}</td>
      <td className="px-6 py-4 text-left">{user.station_id || 'N/A'}</td>
      <td className="px-6 py-4 text-left">
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusBgClass} ${statusColorClass}`}>
          {statusText}
        </span>
      </td>
      <td className="px-6 py-4 text-left">
        <div className="flex space-x-2">
          <button
            onClick={handleView}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md text-xs transition-colors duration-200"
          >
            View
          </button>
          <button
            onClick={handleEdit}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-1 px-3 rounded-md text-xs transition-colors duration-200"
          >
            Edit
          </button>
          <button
            onClick={handleRequestDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-md text-xs transition-colors duration-200 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};


function OrganizationsPage() {
  const [organizationsData, setOrganizationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasShownInitialToast = useRef(false);

  // State for Add/Edit/Delete modals
  const [showAddOrganizationModal, setShowAddOrganizationModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);


  const fetchOrganizationsData = async () => {
    setLoading(true);
    try {
      const data = await getUsersByStationApi();
      setOrganizationsData(data);
      if (!hasShownInitialToast.current) {
        toast.success('Organizations data loaded!');
        hasShownInitialToast.current = true;
      }
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
      toast.error(`Failed to load organizations: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizationsData();
  }, []);

  // Handlers for Add/Edit/View Modals
  const handleAddPoliceStationClick = () => {
    setShowAddOrganizationModal(true);
  };
  const handleCloseAddOrganizationModal = () => {
    setShowAddOrganizationModal(false);
    fetchOrganizationsData(); // Refresh data on close
  };
  const handleViewDetails = (userId) => {
    setSelectedUserId(userId);
    setShowUserDetailsModal(true);
  };
  const handleCloseUserDetailsModal = () => {
    setShowUserDetailsModal(false);
    setSelectedUserId(null);
  };
  const handleEditDetails = (userId) => {
    setEditingUserId(userId);
    setShowEditUserModal(true);
  };
  const handleCloseEditUserModal = () => {
    setShowEditUserModal(false);
    setEditingUserId(null);
    fetchOrganizationsData();
  };

  // Handlers for Delete Modal
  const handleDeleteRequest = (id, username) => {
    setUserToDelete({ id, username });
    setShowDeleteConfirmModal(true);
  };
  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUserApi(userToDelete.id);
        toast.success(`User ${userToDelete.username} deleted successfully!`);
        fetchOrganizationsData();
      } catch (error) {
        console.error('Failed to delete user:', error);
        toast.error(`Failed to delete user: ${error.message}`);
      } finally {
        setShowDeleteConfirmModal(false);
        setUserToDelete(null);
      }
    }
  };
  const handleCancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setUserToDelete(null);
  };

  const handleExportClick = async () => {
    toast.info('Export functionality not yet implemented. Exporting all data.');
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
      <div className="flex-1 p-6 bg-[#070b13] min-h-screen text-gray-100 font-sans">
        <div className="bg-[#141824] p-6 rounded-lg shadow-xl border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-50">Police Stations</h1>
            <div className="flex space-x-2">
{/*               <button
                onClick={handleExportClick}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
              >
                Export
              </button> */}
{/*               <button
                onClick={handleAddPoliceStationClick}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
              >
                + Add Police Station
              </button> */}
            </div>
          </div>
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-250px)] rounded-lg shadow-lg border border-gray-800 custom-scrollbar">
            <table className="min-w-full bg-gray-900 text-left text-sm text-gray-300">
              <thead className="bg-gray-800 text-gray-100 uppercase text-xs sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left">NAME</th>
                  <th scope="col" className="px-6 py-3 text-left">USERS</th>
                  <th scope="col" className="px-6 py-3 text-left">STATION ID</th>
                  <th scope="col" className="px-6 py-3 text-left">MANDAL</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="text-center">
                    <td colSpan="5" className="py-4 text-gray-400">Loading organizations...</td>
                  </tr>
                ) : organizationsData.length > 0 ? (
                  organizationsData.map(org => (
                    // WHAT CHANGED: Map each user within the station to its own row
                    org.users.map((user, userIndex) => (
                      <tr key={`${org.station_name}-${user.id}`} className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200">
                        {/* Only render station name once for each group */}
                        {userIndex === 0 && (
                          <td rowSpan={org.users.length} className="px-6 py-4 text-left align-top whitespace-nowrap overflow-hidden text-ellipsis">
                            {org.station_name || 'N/A'}
                          </td>
                        )}
                        {/* Render user details for each user */}
                        <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{user.username || 'N/A'}</td>
                        <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{org.station_name || 'N/A'}</td> {/* Using station_name for Mandal for now */}
                        <td className="px-6 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis">{user.mandal || 'N/A'}</td>
                      </tr>
                    ))
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan="5" className="py-4 text-gray-400">No organizations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Modals */}
      {/* {showAddOrganizationModal && (
        // <AddOrganizationModal onClose={handleCloseAddOrganizationModal} onSaveSuccess={handleCloseAddOrganizationModal} />
      )} */}
      {showUserDetailsModal && selectedUserId && (
        <UserDetailsModal userId={selectedUserId} onClose={handleCloseUserDetailsModal} />
      )}
      {showEditUserModal && editingUserId && (
        <EditUserDetailsModal userId={editingUserId} onClose={handleCloseEditUserModal} onSaveSuccess={handleCloseEditUserModal} />
      )}
      {showDeleteConfirmModal && userToDelete && (
        <DeleteConfirmationModal
          itemName="User"
          message={`Are you sure do you want to delete the user '${userToDelete.username}'! click on delete if you want to.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
}

export default OrganizationsPage;


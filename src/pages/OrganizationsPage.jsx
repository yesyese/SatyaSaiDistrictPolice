// src/pages/OrganizationsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { getUsersByStationApi, deleteUserApi } from '../apiService'; // WHAT CHANGED: Import necessary APIs
import { CustomScrollbarStyles } from '../components/CustomScrollbarStyles';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'; // Import delete modal
import EditUserDetailsModal from '../components/EditUserDetailsModal'; // Import Edit User Modal
import UserDetailsModal from '../components/UserDetailsModal'; // Import View User Modal


// Helper component for a single user row within an organization



function OrganizationsPage() {
  const [organizationsData, setOrganizationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasShownInitialToast = useRef(false);

  // State for Add/Edit/Delete modals
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
  
  
  const handleCloseUserDetailsModal = () => {
    setShowUserDetailsModal(false);
    setSelectedUserId(null);
  };
  
  const handleCloseEditUserModal = () => {
    setShowEditUserModal(false);
    setEditingUserId(null);
    fetchOrganizationsData();
  };

  // Handlers for Delete Modal
  
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


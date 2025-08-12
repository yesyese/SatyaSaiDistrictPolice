// src/pages/UserManagementPage.jsx
import React, { useState, useEffect ,useRef} from 'react';
import { toast } from 'react-toastify';
import { CustomScrollbarStyles } from '../components/CustomScrollbarStyles';
import { getAllUsersApi, addUserApi, deleteUserApi } from '../apiService';
import UserDetailsModal from '../components/UserDetailsModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import EditUserDetailsModal from '../components/EditUserDetailsModal';

// Helper component for the table rows
const UserTableRow = ({ user, currentUserId, onDeleteSuccess, onViewDetails, onDeleteRequest, onEditDetails }) => {
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
    if (user.id === currentUserId) {
      toast.error("You cannot delete your own account.");
      return;
    }
    onDeleteRequest(user.id, user.username);
  };

  const handleView = () => {
    onViewDetails(user.id);
  };

  const handleEdit = () => {
    onEditDetails(user.id);
  };

  return (
    <>
      <tr className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200">
        {/* NAME (Username and optional email/ID) */}
        <td className="px-6 py-4 text-left">
          <div className="flex items-center space-x-3">
            <img
              src="https://placehold.co/32x32/141824/D1D5DB?text=U"
              alt="User Icon"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="font-semibold text-white">{user.username}</div>
              <div className="text-gray-400 text-xs">{user.email || 'N/A'}</div> {/* WHAT CHANGED: Changed user.email_id to user.email */}
            </div>
          </div>
        </td>
        {/* ROLE */}
        <td className="px-6 py-4 text-left">{user.role || 'N/A'}</td>
        {/* ORGANIZATION (Assuming station_id maps to organization/station name) */}
        <td className="px-6 py-4 text-left">{user.station_id || 'N/A'}</td>
        {/* STATUS */}
        <td className="px-6 py-4 text-left">
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusBgClass} ${statusColorClass}`}>
            {statusText}
          </span>
        </td>
        {/* MANDAL */}
        <td className="px-6 py-4 text-left">{user.mandal || 'N/A'}</td>
        
        {/* LAST LOGIN */}
        <td className="px-6 py-4 text-left">
          {user.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}
        </td>
        {/* ACTIONS */}
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
              disabled={user.id === currentUserId}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-md text-xs transition-colors duration-200 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};


const UserManagementPage = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: '',
    password: '',
    role: 'Admin',
    station_id: '',
    mandal: ''
  });

  const currentUserId = currentUser?.id;

  const hasShownToast = useRef(false);

  // State for View User Details modal
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // State for Delete Confirmation modal
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // State for Edit User Details modal
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);


  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsersApi();
      setUsers(data);

      if (!hasShownToast.current) {
        toast.success('User list loaded!');
        hasShownToast.current = true;
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      if (!hasShownToast.current) {
        toast.error(`Failed to load users: ${error.message}`);
        hasShownToast.current = true;
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addUserApi(newUserData);
      toast.success('New user created successfully!');
      setShowAddUserForm(false);
      setNewUserData({ username: '', password: '', role: 'Admin', station_id: '' });
      fetchUsers();
    } catch (error) {
      console.error('Failed to add user:', error);
      toast.error(`Failed to add user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handlers for UserDetailsModal
  const handleViewUserDetails = (userId) => {
    setSelectedUserId(userId);
    setShowUserDetailsModal(true);
  };

  const handleCloseUserDetailsModal = () => {
    setShowUserDetailsModal(false);
    setSelectedUserId(null);
  };

  // Handlers for Delete Confirmation modal
  const handleDeleteRequest = (id, username) => {
    setUserToDelete({ id, username });
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUserApi(userToDelete.id);
        toast.success(`User ${userToDelete.username} deleted successfully!`);
        fetchUsers();
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

  // Handlers for EditUserDetailsModal
  const handleEditUserDetails = (userId) => {
    setEditingUserId(userId);
    setShowEditUserModal(true);
  };

  const handleCloseEditUserModal = () => {
    setShowEditUserModal(false);
    setEditingUserId(null);
    fetchUsers(); // Refresh data after edit
  };


  if (loading) {
    return (
      <div className="flex-1 p-6 bg-[#070b13] min-h-screen flex items-center justify-center text-white text-2xl">
        Loading users...
      </div>
    );
  }

  return (
    <>
      <CustomScrollbarStyles />
      <div className="flex-1 p-6 bg-[#070b13] min-h-screen text-gray-100 font-sans">
        <div className="bg-[#141824] p-6 rounded-lg shadow-xl border border-gray-800">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-50">User Management System</h1>
            <button
              onClick={() => setShowAddUserForm(!showAddUserForm)}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
            >
              + Add User
            </button>
          </div>

          {showAddUserForm && (
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Create New User</h3>
              <form onSubmit={handleAddUserSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="username" placeholder="Username" value={newUserData.username} onChange={handleNewUserChange} className="input-field" required />
                <input type="password" name="password" placeholder="Password" value={newUserData.password} onChange={handleNewUserChange} className="input-field" required />
                <select name="role" value={newUserData.role} onChange={handleNewUserChange} className="input-field" required>
                  <option value="Admin">Admin</option>
                  <option value="SuperAdmin">SuperAdmin</option>
                </select>
                <input type="text" name="station_id" placeholder="Station ID (Optional)" value={newUserData.station_id} onChange={handleNewUserChange} className="input-field" />
                <input type="text" name="mandal" placeholder="Mandal" value={newUserData.mandal} onChange={handleNewUserChange} className="input-field" required />
                <div className="col-span-full flex justify-end space-x-4 mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create User'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddUserForm(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* User List Table */}
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-250px)] rounded-lg shadow-lg border border-gray-800">
            <table className="min-w-full bg-gray-900 text-left text-sm text-gray-300">
              <thead className="bg-gray-700 text-gray-100 uppercase text-xs sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left">NAME</th>
                  <th scope="col" className="px-6 py-3 text-left">ROLE</th>
                  <th scope="col" className="px-6 py-3 text-left">ORGANIZATION</th>
                  <th scope="col" className="px-6 py-3 text-left">STATUS</th>
                  <th scope="col" className="px-6 py-3 text-left">MANDAL</th>
                  <th scope="col" className="px-6 py-3 text-left">LAST LOGIN</th>
                  <th scope="col" className="px-6 py-3 text-left">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="text-center">
                    <td colSpan="6" className="py-4 text-gray-400">Loading users...</td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map(user => (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      currentUserId={currentUserId}
                      onDeleteSuccess={fetchUsers}
                      onViewDetails={handleViewUserDetails}
                      onDeleteRequest={handleDeleteRequest}
                      onEditDetails={handleEditUserDetails}
                    />
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan="6" className="py-4 text-gray-400">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Custom Tailwind class for input fields */}
        <style>{`
            .input-field {
                padding: 0.75rem;
                border-radius: 0.375rem; /* rounded-md */
                background-color: #374151; /* bg-gray-700 */
                color: #F3F4F6; /* text-white */
                border: 1px solid #4B5563; /* border-gray-600 */
                outline: none;
                box-shadow: none;
                width: 100%; /* Ensure it takes full column width */
            }
            .input-field::placeholder {
                color: #9CA3AF; /* placeholder-gray-400 */
            }
            .input-field:focus {
                ring-width: 2px;
                ring-color: #3B82F6; /* ring-blue-500 */
                border-color: #3B82F6;
            }
            /* This CSS for .input-label is provided by you in other files and assumed global,
               but including here for self-containment if this file were standalone. */
            .input-label {
                display: block;
                font-size: 0.875rem; /* text-sm */
                color: #9CA3AF; /* text-gray-400 */
                margin-bottom: 0.25rem;
                padding-left: 0.25rem;
            }
        `}</style>
      </div>
      {/* Conditionally render UserDetailsModal */}
      {showUserDetailsModal && selectedUserId && (
        <UserDetailsModal userId={selectedUserId} onClose={handleCloseUserDetailsModal} />
      )}
      {/* Conditionally render DeleteConfirmationModal */}
      {showDeleteConfirmModal && userToDelete && (
        <DeleteConfirmationModal
          itemName="User"
          message={`Are you sure do you want to delete the user '${userToDelete.username}'! click on delete if you want to.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      {/* Conditionally render EditUserDetailsModal */}
      {showEditUserModal && editingUserId && (
        <EditUserDetailsModal
          userId={editingUserId}
          onClose={handleCloseEditUserModal}
          onSaveSuccess={handleCloseEditUserModal} // Close and refresh data on save
        />
      )}
    </>
  );
};

export default UserManagementPage;

// src/components/UserDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getUserByIdApi } from '../apiService'; // WHAT CHANGED: Import API function

function UserDetailsModal({ userId, onClose }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getUserByIdApi(userId);
                setUserData(data);
            } catch (err) {
                console.error('Failed to fetch user details:', err);
                setError(err);
                toast.error(`Failed to load user details: ${err.message || 'Unknown error'}`);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    const handleClose = () => {
        onClose();
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-md mx-auto flex justify-center items-center h-48">
                    <p className="text-gray-300 text-lg">Loading user details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-md mx-auto flex flex-col justify-center items-center h-48">
                    <p className="text-red-400 text-lg">Error: {error.message}</p>
                    <button onClick={handleClose} className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-md mx-auto flex flex-col justify-center items-center h-48">
                    <p className="text-gray-300 text-lg">User not found.</p>
                    <button onClick={handleClose} className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-md mx-auto relative overflow-y-auto hide-scrollbar" style={{ maxHeight: '90vh' }}>
                {/* Header with Close Button */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold text-gray-50">View Details</h1>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form Fields - All read-only */}
                <form className="grid grid-cols-1 gap-4">
                    {/* Fullname */}
                    <div>
                        <label className="input-label">Fullname</label>
                        <input type="text" value={userData.username || 'N/A'} readOnly className="input-field" />
                    </div>

                    {/* Email Address */}
                    <div>
                        <label className="input-label">Email Address</label>
                        <input type="text" value={userData.email || 'N/A'} readOnly className="input-field" />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="input-label">Role</label>
                        <input type="text" value={userData.role || 'N/A'} readOnly className="input-field" />
                    </div>

                    {/* Police Station */}
                    <div>
                        <label className="input-label">Police Station</label>
                        <input type="text" value={userData.station_id || 'N/A'} readOnly className="input-field" />
                    </div>
                    {/* Mandal */}
                    <div>
                        <label className="input-label">Mandal</label>
                        <input type="text" value={userData.mandal || 'N/A'} readOnly className="input-field" />
                    </div>
                    <div>
                        <label className="input-label">Contact</label>
                        <input type="text" value={userData.contact || 'N/A'} readOnly className="input-field" />
                    </div>
                    <div className="col-span-full flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
                {/* Custom Tailwind CSS classes */}
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
                    .input-field[readOnly] { cursor: default; opacity: 0.9; }
                    .hide-scrollbar::-webkit-scrollbar { display: none; }
                    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
            </div>
        </div>
    );
}

export default UserDetailsModal;

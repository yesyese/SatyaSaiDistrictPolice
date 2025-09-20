// src/components/UserProfileModal.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchCurrentUserApi, updateMyProfileApi } from '../apiService'; // WHAT CHANGED: Import API functions
import { X } from 'lucide-react'; // WHAT CHANGED: Import X icon for close button

function UserProfileModal({ user, onClose, onProfileUpdated }) { // WHAT CHANGED: Added user prop
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        contact: '',
        mandal: '' // Assuming this field exists in your User model
    });
    const [loading, setLoading] = useState(true); // For initial fetch
    const [saving, setSaving] = useState(false); // For save button loading
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProfileData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch current user data to pre-fill the form
                const currentUserData = await fetchCurrentUserApi(); // Fetch current user details
                setFormData({
                    username: currentUserData.username || '',
                    email: currentUserData.email || '',
                    contact: currentUserData.contact || '',
                    mandal: currentUserData.mandal || '' // Assuming this field exists
                });
            } catch (err) {
                console.error('Failed to load user profile:', err);
                setError(err);
                toast.error(`Failed to load profile: ${err.message || 'Unknown error'}`);
            } finally {
                setLoading(false);
            }
        };
        loadProfileData();
    }, []); // Empty dependency array to fetch once on mount

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updateData = {
                username: formData.username,
                email: formData.email,
                contact: formData.contact,
                mandal: formData.mandal
            };
            await updateMyProfileApi(updateData);
            toast.success('Profile updated successfully!');
            onProfileUpdated(); // Callback to refresh parent (DashboardPage's user state)
            onClose();
        } catch (err) {
            console.error('Failed to update profile:', err);
            toast.error(`Failed to update profile: ${err.message || 'Unknown error'}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-lg mx-auto flex justify-center items-center h-48">
                    <p className="text-gray-300 text-lg">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-lg mx-auto flex flex-col justify-center items-center h-48">
                    <p className="text-red-400 text-lg">Error: {error.message}</p>
                    <button onClick={onClose} className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-lg mx-auto relative overflow-y-auto hide-scrollbar" style={{ maxHeight: '90vh' }}>
                {/* Header with Close Button */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold text-gray-50">Update Profile</h1> {/* WHAT CHANGED: Title "Update Profile" from screenshot */}
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <X className="w-6 h-6" /> {/* WHAT CHANGED: X icon for close */}
                    </button>
                </div>

                {/* Profile Card Section */}
                <div className="bg-gray-800 p-4 rounded-md flex items-center space-x-4 mb-6">
                    <img
                        src="https://placehold.co/60x60/ffffff/000000?text=U" // Placeholder for user avatar
                        alt="User Avatar"
                        className="w-16 h-16 rounded-full border-2 border-gray-600"
                    />
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold text-white">{user?.username || 'N/A'}</span> {/* Use prop for current user's username */}
                        <span className="text-sm text-gray-400">{user?.email || 'N/A'}</span> {/* Use prop for current user's email */}
                        <span className="text-xs text-gray-500">{user?.station_id || 'N/A'}</span> {/* Use prop for current user's station */}
                        <span className="text-xs text-gray-500">{user?.mandal || 'N/A'}</span> {/* Use prop for current user's mandal */}
                    </div>
                </div>

                {/* Form Fields - Editable */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Fullname */}
                    <div>
                        <label className="input-label">Full Name</label> {/* WHAT CHANGED: Label "Full Name" */}
                        <input type="text" name="username" value={formData.username} onChange={handleChange} className="input-field" required />
                    </div>

                    {/* Contact Number */}
                    <div>
                        <label className="input-label">Contact Number</label>
                        <input type="text" name="contact" value={formData.contact} onChange={handleChange} className="input-field" />
                    </div>

                    {/* Email Address */}
                    <div>
                        <label className="input-label">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" required />
                    </div>

                    {/* Role (Read-only as per screenshot) */}
                    <div>
                        <label className="input-label">Role</label>
                        <input type="text" value={user?.role || 'N/A'} readOnly className="input-field text-gray-400 opacity-70 cursor-not-allowed" />
                    </div>

                    {/* Police Station (Read-only as per screenshot) */}
                    <div className="md:col-span-2"> {/* Spans full width */}
                        <label className="input-label">Police Station</label>
                        <input type="text" value={user?.station_id || 'N/A'} onChange={handleChange} className="input-field text-gray-400 opacity-70 " />
                    </div>

                    <div>
                        <label className="input-label">Mandal</label>
                        <input type="text" value={formData?.mandal || 'N/A'} onChange={handleChange} className="input-field text-gray-400 opacity-70 " />
                    </div>

                    <div className="col-span-full flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Update Profile'} {/* WHAT CHANGED: Button text "Update Profile" */}
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
                    input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0; }
                    .hide-scrollbar::-webkit-scrollbar { display: none; }
                    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
            </div>
        </div>
    );
}

export default UserProfileModal;

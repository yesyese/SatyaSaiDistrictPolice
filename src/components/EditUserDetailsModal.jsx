// src/components/EditUserDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getUserByIdApi, updateUserApi } from '../apiService';
import { User as UserIcon, X } from 'lucide-react'; // Import X icon for close button

function EditUserDetailsModal({ userId, onClose, onSaveSuccess, currentUser }) { // WHAT CHANGED: Added currentUser prop
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        contact_number: '', // Assuming this field exists in your User model and is editable
        role: '', // Role is displayed but might not be directly editable by user themselves
        station_id: '', // Police Station is displayed but might not be directly editable by user themselves
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [originalUserData, setOriginalUserData] = useState(null); // Store original fetched data

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getUserByIdApi(userId);
                setOriginalUserData(data); // Store original data

                // Pre-fill form with existing data
                setFormData({
                    username: data.username || '',
                    email: data.email || '',
                    contact_number: data.contact_number || '', // Assuming contact_number is part of User model
                    role: data.role || 'Admin',
                    station_id: data.station_id || '',
                });
            } catch (err) {
                console.error('Failed to fetch user details for editing:', err);
                setError(err);
                toast.error(`Failed to load user details for editing: ${err.message || 'Unknown error'}`);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // WHAT CHANGED: Construct updateData by taking originalUserData and overlaying changes from formData.
            // This ensures all expected fields are present in the payload, even if they are read-only on frontend.
            // The backend's Pydantic model with `exclude_unset=True` will handle ignoring unchanged fields.
            const updateData = {
                ...originalUserData, // Start with the full original object
                username: formData.username,
                email: formData.email,
                contact_number: formData.contact_number,
                // Role and station_id are typically not editable by user themselves,
                // but if your backend's UserUpdate model accepts them, they would be here.
                // For now, we are sending the values from formData, assuming backend handles immutability.
                role: formData.role,
                station_id: formData.station_id,
            };

            await updateUserApi(userId, updateData);
            toast.success('User details updated successfully!');
            onSaveSuccess(); // Trigger parent refresh
            onClose(); // Close the modal
        } catch (err) {
            console.error('Error updating user:', err);
            toast.error(`Failed to update user: ${err.message || 'Unknown error'}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-md mx-auto flex justify-center items-center h-48">
                    <p className="text-gray-300 text-lg">Loading user for editing...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-md mx-auto flex flex-col justify-center items-center h-48">
                    <p className="text-red-400 text-lg">Error: {error.message}</p>
                    <button onClick={onClose} className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    if (!originalUserData) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-md mx-auto flex flex-col justify-center items-center h-48">
                    <p className="text-gray-300 text-lg">User not found for editing.</p>
                    <button onClick={onClose} className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md">
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
                    <h1 className="text-xl font-semibold text-gray-50">Edit User Details</h1>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Profile Card Section (Displays original data from currentUser prop) */}
                <div className="bg-gray-800 p-4 rounded-md flex items-center space-x-4 mb-6">
                    <img
                        src="https://placehold.co/60x60/ffffff/000000?text=U" // Placeholder for user avatar
                        alt="User Avatar"
                        className="w-16 h-16 rounded-full border-2 border-gray-600"
                    />
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold text-white">{originalUserData.username || 'N/A'}</span>
                        <span className="text-sm text-gray-400">{originalUserData.email || 'N/A'}</span>
                        <span className="text-xs text-gray-500">{originalUserData.station_id || 'N/A'}</span>
                    </div>
                </div>

                {/* Form Fields - Editable */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                    {/* Fullname */}
                    <div>
                        <label className="input-label">Fullname</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} className="input-field" required />
                    </div>

                    {/* Email Address */}
                    <div>
                        <label className="input-label">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="input-label">Role</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="input-field" required>
                            <option value="Admin">Admin</option>
                            <option value="SuperAdmin">SuperAdmin</option>
                        </select>
                    </div>

                    {/* Police Station */}
                    <div>
                        <label className="input-label">Police Station</label>
                        <input type="text" name="station_id" value={formData.station_id} onChange={handleChange} className="input-field" />
                    </div>

                    {/* Contact Number (Added as per screenshot) */}
                    <div>
                        <label className="input-label">Contact Number</label>
                        <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} className="input-field" />
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
                            {saving ? 'Saving...' : 'Save Changes'}
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

export default EditUserDetailsModal;

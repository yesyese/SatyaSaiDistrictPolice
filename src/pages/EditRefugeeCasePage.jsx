// src/pages/EditRefugeeCasePage.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getRefugeeByIdApi, updateRefugeeRecordApi } from '../apiService'; // WHAT CHANGED: Import API functions

function EditRefugeeCasePage({ refugeeId, onClose, onSaveSuccess }) {
    const [formData, setFormData] = useState({
        Name: '',
        Nationality: '',
        DateRegistered: '',
        AssignedOfficer: '',
        VisaStatus: '', // This will be the "Update Status" dropdown
    });
    const [loading, setLoading] = useState(true); // Initial loading for fetching details
    const [saving, setSaving] = useState(false); // For save button loading state
    const [error, setError] = useState(null);
    const [originalCaseData, setOriginalCaseData] = useState(null); // Store original fetched data

    useEffect(() => {
        const fetchCaseDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getRefugeeByIdApi(refugeeId);
                setOriginalCaseData(data); // Store original data

                setFormData({
                    Name: data.Name || '',
                    Nationality: data.Nationality || '',
                    DateRegistered: data.DateRegistered ? data.DateRegistered.split('T')[0] : '', // Format for date input
                    AssignedOfficer: data.AssignedOfficer || '',
                    VisaStatus: data.VisaStatus || 'Decision Pending', // Pre-fill dropdown
                });
            } catch (err) {
                console.error('Failed to fetch Refugee Case details for editing:', err);
                setError(err);
                toast.error(`Failed to load case details for editing: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (refugeeId) {
            fetchCaseDetails();
        }
    }, [refugeeId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updateData = {
                Name: formData.Name,
                Nationality: formData.Nationality,
                DateRegistered: formData.DateRegistered, // YYYY-MM-DD string
                AssignedOfficer: formData.AssignedOfficer,
                VisaStatus: formData.VisaStatus,
            };

            await updateRefugeeRecordApi(refugeeId, updateData);
            toast.success('Refugee case updated successfully!');
            onSaveSuccess(); // Trigger parent refresh
            onClose(); // Close the modal
        } catch (err) {
            console.error('Error updating refugee case:', err);
            toast.error(`Failed to update case: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-md mx-auto flex justify-center items-center h-48">
                    <p className="text-gray-300 text-lg">Loading case for editing...</p>
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

    if (!originalCaseData) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-md mx-auto flex flex-col justify-center items-center h-48">
                    <p className="text-gray-300 text-lg">Refugee case not found for editing.</p>
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
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold text-gray-50">Update Case Details</h1>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form Fields - Editable */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                    {/* Fullname */}
                    <div>
                        <label className="input-label">Fullname</label>
                        <input type="text" name="Name" value={formData.Name} onChange={handleChange} className="input-field" required />
                    </div>

                    {/* Country of Origin */}
                    <div>
                        <label className="input-label">Country of Origin</label>
                        <input type="text" name="Nationality" value={formData.Nationality} onChange={handleChange} className="input-field" required />
                    </div>

                    {/* Date Registered */}
                    <div>
                        <label className="input-label">Date Registered</label>
                        <input type="date" name="DateRegistered" value={formData.DateRegistered} onChange={handleChange} className="input-field" required />
                    </div>

                    {/* Assigned Officer */}
                    <div>
                        <label className="input-label">Assigned Officer</label>
                        <input type="text" name="AssignedOfficer" value={formData.AssignedOfficer} onChange={handleChange} className="input-field" />
                    </div>

                    {/* Update Status (Visa Status) */}
                    <div>
                        <label className="input-label">Update Status</label>
                        <select name="VisaStatus" value={formData.VisaStatus} onChange={handleChange} className="input-field" required>
                            <option value="Decision Pending">Decision Pending</option>
                            <option value="Granted">Granted</option>
                            <option value="Rejected">Rejected</option>
                        </select>
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

export default EditRefugeeCasePage;

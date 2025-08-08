// src/pages/EditForeignerPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getForeignerByIdApi, updateForeignerApi } from '../apiService';

function EditForeignerPage({ foreignerId, onClose, onSaveSuccess }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        nationality: '',
        gender: '',
        passport_validity: '', // YYYY-MM-DD string
        visa_type: '', // Direct access from flat structure
        issue_date: '', // Direct access from flat structure
        expiry_date: '', // Direct access from flat structure
        occupation: '',
        employer: '',
        // WHAT CHANGED: Removed purpose_of_visit from formData state
        indian_address: '',
        status: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [originalForeigner, setOriginalForeigner] = useState(null);

    useEffect(() => {
        const fetchForeignerDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getForeignerByIdApi(foreignerId);
                setOriginalForeigner(data);

                setFormData({
                    name: data.name || '',
                    nationality: data.nationality || '',
                    gender: data.gender || '',
                    passport_validity: data.passport_validity || '', // YYYY-MM-DD string
                    visa_type: data.visa_type || '', // Direct access from flat structure
                    issue_date: data.issue_date || '', // Direct access from flat structure
                    expiry_date: data.expiry_date || '', // Direct access from flat structure
                    occupation: data.occupation || '',
                    employer: data.employer || '',
                    // WHAT CHANGED: Removed purpose_of_visit from pre-fill
                    indian_address: data.indian_address || '',
                    status: data.status || '',
                });
            } catch (err) {
                console.error('Failed to fetch foreigner details for editing:', err);
                setError(err);
                toast.error(`Failed to load details for editing: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (foreignerId) {
            fetchForeignerDetails();
        } else {
            setError(new Error("No foreigner ID provided for editing."));
            setLoading(false);
        }
    }, [foreignerId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updateData = {
                name: formData.name,
                gender: formData.gender,
                passport_validity: formData.passport_validity,
                nationality: formData.nationality,
                status: formData.status,
                occupation: formData.occupation,
                employer: formData.employer,
                indian_address: formData.indian_address,
                // WHAT CHANGED: Removed purpose_of_visit from updateData
                expiry_date: formData.expiry_date,
                issue_date: formData.issue_date,
                visa_type: formData.visa_type
            };

            await updateForeignerApi(foreignerId, updateData);
            toast.success('Foreigner record updated successfully!');
            onSaveSuccess();
            onClose();
        } catch (err) {
            console.error('Error updating foreigner:', err);
            toast.error(`Failed to update record: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-2xl mx-auto flex justify-center items-center h-48">
                    <p className="text-gray-300 text-lg">Loading for editing...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-2xl mx-auto flex flex-col justify-center items-center h-48">
                    <p className="text-red-400 text-lg">Error: {error.message}</p>
                    <button onClick={onClose} className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    if (!originalForeigner) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-2xl mx-auto flex flex-col justify-center items-center h-48">
                    <p className="text-gray-300 text-lg">Foreigner not found for editing.</p>
                    <button onClick={onClose} className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    const latestVisa = (originalForeigner.visas && originalForeigner.visas.length > 0)
        ? originalForeigner.visas.reduce((latest, current) => {
            const latestExpiry = latest.expiry_date ? new Date(latest.expiry_date) : null;
            const currentExpiry = current.expiry_date ? new Date(current.expiry_date) : null;
            if (latestExpiry && currentExpiry) { return currentExpiry > latestExpiry ? current : latest; }
            return latestExpiry ? latest : current;
        })
        : null;


    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-2xl mx-auto relative overflow-y-auto hide-scrollbar" style={{ maxHeight: '90vh' }}>
                {/* Header with Close Button */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold text-gray-50">Edit Details</h1>
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
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Serial Number (Read-only as per design) */}
                    <div>
                        <label className="input-label">Serial Number</label>
                        <input type="text" value={originalForeigner.foreigner_id || originalForeigner.id || 'N/A'} readOnly className="input-field text-gray-400 opacity-70 cursor-not-allowed" />
                    </div>

                    {/* Fullname */}
                    <div>
                        <label className="input-label">Fullname</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field"  />
                    </div>

                    {/* Nationality */}
                    <div>
                        <label className="input-label">Nationality</label>
                        <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} className="input-field" required />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="input-label">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="input-field" required>
                            <option value="" disabled>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Passport Number (Read-only as per design and typical backend logic) */}
                    <div>
                        <label className="input-label">Passport Number</label>
                        <input type="text" value={originalForeigner.passport_number || 'N/A'} readOnly className="input-field text-gray-400 opacity-70 cursor-not-allowed" />
                    </div>

                    {/* Passport Validity */}
                    <div>
                        <label className="input-label">Passport Validity</label>
                        <input type="date" name="passport_validity" value={formData.passport_validity} onChange={handleChange} className="input-field"  />
                    </div>

                    {/* Visa Number (Read-only as per design and typical backend logic) */}
                    <div>
                        <label className="input-label">Visa Number</label>
                        <input type="text" value={latestVisa?.visa_number || 'N/A'} readOnly className="input-field text-gray-400 opacity-70 cursor-not-allowed" />
                    </div>

                    {/* Visa Expiry (editable, part of general ForeignerUpdate if visa is single/primary) */}
                    <div>
                        <label className="input-label">Visa Expiry</label>
                        <input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleChange} className="input-field"  />
                    </div>

                    {/* Visa Type (editable) */}
                    <div>
                        <label className="input-label">Visa Type</label>
                        <input type="text" name="visa_type" value={formData.visa_type} onChange={handleChange} className="input-field"  />
                    </div>

                    {/* Date of Visit (Visa Issue Date) (editable) */}
                    <div>
                        <label className="input-label">Date of Visit</label>
                        <input type="date" name="issue_date" value={formData.issue_date} onChange={handleChange} className="input-field"  />
                    </div>

                    {/* Occupation */}
                    <div>
                        <label className="input-label">Occupation</label>
                        <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className="input-field" />
                    </div>

                    {/* Employer */}
                    <div>
                        <label className="input-label">Employer</label>
                        <input type="text" name="employer" value={formData.employer} onChange={handleChange} className="input-field" />
                    </div>

                    {/* Purpose of Visit */}
                    {/* WHAT CHANGED: Removed Purpose of Visit field as it's not in backend ForeignerUpdate */}
                    {/* <div className="md:col-span-2">
                        <label className="input-label">Purpose of Visit</label>
                        <textarea name="purpose_of_visit" value={formData.purpose_of_visit} onChange={handleChange} rows="3" className="input-field"></textarea>
                    </div> */}

                    {/* Indian Address */}
                    <div className="md:col-span-2">
                        <label className="input-label">Indian Address</label>
                        <textarea name="indian_address" value={formData.indian_address} onChange={handleChange} rows="3" className="input-field"></textarea>
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
                    .input-label {
                        display: block;
                        font-size: 0.875rem; /* text-sm */
                        color: #9CA3AF; /* text-gray-400 */
                        margin-bottom: 0.25rem;
                        padding-left: 0.25rem;
                    }
                    /* Styling for select dropdown */
                    select.input-field {
                        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%239CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>');
                        background-repeat: no-repeat;
                        background-position: right 0.75rem center;
                        background-size: 1rem;
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        appearance: none;
                    }
                    /* Adjust date input appearance */
                    input[type="date"] {
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        appearance: none;
                        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%239CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>');
                        background-repeat: no-repeat;
                        background-position: right 0.75rem center;
                        background-size: 1rem;
                        padding-right: 2.5rem;
                    }
                    /* Placeholder for date inputs */
                    input[type="date"]::-webkit-datetime-edit-text { color: #9CA3AF; }
                    input[type="date"]::-webkit-datetime-edit-month-field { color: #9CA3AF; }
                    input[type="date"]::-webkit-datetime-edit-day-field { color: #9CA3AF; }
                    input[type="date"]::-webkit-datetime-edit-year-field { color: #9CA3AF; }
                    input[type="date"]::-webkit-datetime-edit-fields-wrapper { color: #9CA3AF; }
                    input[type="date"]::-webkit-inner-spin-button { display: none; }
                    input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0; }
                `}</style>
            </div>
        </div>
    );
}

export default EditForeignerPage;

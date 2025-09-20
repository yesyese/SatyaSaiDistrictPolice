// src/components/NewCitizenshipRequestModal.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { addCitizenshipRequestApi } from '../apiService'; // Assuming this API function exists
import { getForeignersApi } from '../apiService';
import { X } from 'lucide-react'; // Import close icon

const NewCitizenshipRequestModal = ({ onClose, onRequestAdded }) => {
    const [, setForeigners] = useState([]);
    const [, setSelectedForeigner] = useState(null);
    React.useEffect(() => {
        async function fetchForeigners() {
            try {
                const data = await getForeignersApi();
                setForeigners(data);
            } catch (err) {
                toast.error('Failed to load foreigners');
            }
        }
        fetchForeigners();
    }, []);
    const [formData, setFormData] = useState({
        ApplicantName: '',
        DateSubmitted: new Date().toISOString().split('T')[0],
        Subject: '',
        status: 'Pending Review',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        if (e.target.name === 'foreigner_id') {
            const id = e.target.value;
            setFormData(prev => ({ ...prev, foreigner_id: id }));
            if (id) {
                import('../apiService').then(({ getForeignerByIdApi }) => {
                    getForeignerByIdApi(id)
                        .then(f => {
                            setSelectedForeigner(f);
                            setFormData(prev => ({
                                ...prev,
                                foreigner_id: f.id,
                                ReviewingOfficer: f.ReviewingOfficer || '',
                                ApplicantName: f.name || f.ApplicantName || ''
                            }));
                        })
                        .catch(() => {
                            setSelectedForeigner(null);
                            setFormData(prev => ({ ...prev, ReviewingOfficer: '', ApplicantName: '' }));
                            toast.error('Foreigner not found');
                        });
                });
            } else {
                setSelectedForeigner(null);
                setFormData(prev => ({ ...prev, ReviewingOfficer: '', ApplicantName: '' }));
            }
            return;
        }
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addCitizenshipRequestApi(formData);
            toast.success('Citizenship request submitted successfully!');
            onRequestAdded();
            onClose();
        } catch (error) {
            console.error('Failed to submit citizenship request:', error);
            toast.error(`Failed to submit request: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-lg mx-auto relative overflow-y-auto hide-scrollbar">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-50">Citizenship Requested Visitor Form</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors duration-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Foreigner Selection */}
                    <div className="md:col-span-2">
                        <label className="input-label">Foreigner ID</label>
                        <input type="text" name="foreigner_id" value={formData.foreigner_id || ''} onChange={handleChange} className="input-field" required />
                    </div>
                    {/* Fullname */}
                    <div>
                        <label className="input-label">Fullname</label>
                        <input type="text" name="ApplicantName" value={formData.ApplicantName} onChange={handleChange} className="input-field" required />
                    </div>
                    {/* Reviewing Officer */}
                    <div>
                        <label className="input-label">Reviewing Officer</label>
                        <input type="text" name="ReviewingOfficer" value={formData.ReviewingOfficer || ''} onChange={handleChange} className="input-field" required />
                    </div>
                    {/* Date Submitted */}
                    <div>
                        <label className="input-label">Date Submitted</label>
                        <input type="date" name="DateSubmitted" value={formData.DateSubmitted} onChange={handleChange} className="input-field" required />
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="input-label">Subject</label>
                        <input type="text" name="Subject" value={formData.Subject} onChange={handleChange} className="input-field" required />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="input-label">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="input-field" required>
                            <option value="Pending Review">Pending Review</option>
                            <option value="Additional info needed">Additional info needed</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Approved">Approved</option>
                        </select>
                    </div>

                    <div className="col-span-full flex justify-end space-x-4 mt-6">
                        <button type="button" onClick={onClose} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50">
                            {loading ? 'Submitting...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
                {/* Custom Tailwind CSS classes */}
                <style>{`
                    .input-field {
                        padding: 0.75rem; border-radius: 0.375rem; background-color: #374151; color: #F3F4F6;
                        border: 1px solid #4B5563; outline: none; box-shadow: none; width: 100%;
                    }
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
};

export default NewCitizenshipRequestModal;

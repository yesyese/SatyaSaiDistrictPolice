// src/pages/AddForeignerPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addForeignerApi } from '../apiService';

function AddForeignerPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', // Fullname
        nationality: '',
        gender: '',
        passport_number: '',
        passport_validity: '', // Will be 'YYYY-MM-DD' string from date input
        visa: {
            visa_number: '',
            visa_type: '',
            issue_date: '', // Date of Visit
            expiry_date: '' // Visa Expiry
        },
        occupation: '',
        employer: '',
        purpose_of_visit: '',
        indian_address: '',
        status: 'Registered' // Default status as per common flow
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('visa_')) {
            const visaFieldName = name.substring(5);
            setFormData(prev => ({
                ...prev,
                visa: {
                    ...prev.visa,
                    [visaFieldName]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addForeignerApi({
                name: formData.name,
                gender: formData.gender,
                passport_number: formData.passport_number,
                passport_validity: formData.passport_validity,
                nationality: formData.nationality,
                status: formData.status,
                occupation: formData.occupation,
                employer: formData.employer,
                indian_address: formData.indian_address,
                purpose_of_visit: formData.purpose_of_visit,
                visa: formData.visa
            });
            toast.success('Foreigner and visa added successfully!');
            navigate('/registered-arrivals');
        } catch (error) {
            console.error('Error adding foreigner:', error);
            toast.error(`Failed to add record: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        // WHAT CHANGED: Re-added flex, justify-center, items-center to parent div to center the form card
        // This div now ensures the form card is centered on the page.
        <div className="flex-1 p-6 bg-[#070b13] min-h-screen text-white font-sans flex justify-center items-center">
            {/* WHAT CHANGED: Added max-h-full and overflow-y-auto to the form card itself.
                         This makes the card's content scrollable when it overflows, keeping the card within view. */}
            <div className="bg-[#141824] p-6 rounded-lg shadow-xl border border-gray-800 w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto custom-form-scrollbar"> {/* WHAT CHANGED: Added custom-form-scrollbar class */}
                {/* Header with Close Button */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold text-gray-50">Register New Visitor</h1>
                    <button
                        onClick={() => navigate('/registered-arrivals')}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Serial Number */}
                    <div className="flex flex-col">
                        <label htmlFor="serial_number" className="input-label">Serial Number</label>
                        <input type="text" id="serial_number" name="serial_number" value="001" readOnly disabled className="input-field text-gray-400 opacity-70 cursor-not-allowed" />
                    </div>
                    
                    <div className="flex flex-col">
                        <label htmlFor="name" className="input-label">Fullname</label>
                        <input type="text" id="name" name="name" placeholder="" value={formData.name} onChange={handleChange} className="input-field" required />
                    </div>
                    
                    <div className="flex flex-col">
                        <label htmlFor="nationality" className="input-label">Nationality</label>
                        <input type="text" id="nationality" name="nationality" placeholder="" value={formData.nationality} onChange={handleChange} className="input-field" required />
                    </div>
                    
                    {/* Gender as a dropdown (select) */}
                    <div className="flex flex-col">
                        <label htmlFor="gender" className="input-label">Gender</label>
                        <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="input-field" required>
                            <option value="" disabled>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    
                    <div className="flex flex-col">
                        <label htmlFor="passport_number" className="input-label">Passport Number</label>
                        <input type="text" id="passport_number" name="passport_number" placeholder="" value={formData.passport_number} onChange={handleChange} className="input-field" required />
                    </div>
                    
                    <div className="flex flex-col">
                        <label htmlFor="passport_validity" className="input-label">Passport Validity</label>
                        <input type="date" id="passport_validity" name="passport_validity" placeholder="dd-mm-yyyy" value={formData.passport_validity} onChange={handleChange} className="input-field" required />
                    </div>
                    
                    <div className="flex flex-col">
                        <label htmlFor="visa_number" className="input-label">Visa Number</label>
                        <input type="text" id="visa_number" name="visa_visa_number" placeholder="" value={formData.visa.visa_number} onChange={handleChange} className="input-field" required />
                    </div>
                    
                    <div className="flex flex-col">
                        <label htmlFor="visa_expiry_date" className="input-label">Visa Expiry</label>
                        <input type="date" id="visa_expiry_date" name="visa_expiry_date" placeholder="dd-mm-yyyy" value={formData.visa.expiry_date} onChange={handleChange} className="input-field" required />
                    </div>
                    
                    <div className="flex flex-col">
                        <label htmlFor="visa_type" className="input-label">Visa Type</label>
                        <input type="text" id="visa_type" name="visa_visa_type" placeholder="" value={formData.visa.visa_type} onChange={handleChange} className="input-field" required />
                    </div>
                    
                    <div className="flex flex-col">
                        <label htmlFor="visa_issue_date" className="input-label">Date of Visit</label>
                        <input type="date" id="visa_issue_date" name="visa_issue_date" placeholder="dd-mm-yyyy" value={formData.visa.issue_date} onChange={handleChange} className="input-field" required />
                    </div>
                    
                    <div className="flex flex-col">
                        <label htmlFor="occupation" className="input-label">Occupation</label>
                        <input type="text" id="occupation" name="occupation" placeholder="" value={formData.occupation} onChange={handleChange} className="input-field" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="employer" className="input-label">Employer</label>
                        <input type="text" id="employer" name="employer" placeholder="" value={formData.employer} onChange={handleChange} className="input-field" />
                    </div>
                    
                    {/* Purpose of Visit (full width) */}
                    <div className="flex flex-col col-span-full">
                        <label htmlFor="purpose_of_visit" className="input-label">Purpose of Visit</label>
                        <input type="text" id="purpose_of_visit" name="purpose_of_visit" placeholder="" value={formData.purpose_of_visit} onChange={handleChange} className="input-field" />
                    </div>
                    
                    {/* Indian Address (full width) */}
                    <div className="flex flex-col col-span-full">
                        <label htmlFor="indian_address" className="input-label">Indian Address</label>
                        <textarea id="indian_address" name="indian_address" placeholder="" value={formData.indian_address} onChange={handleChange} rows="3" className="input-field"></textarea>
                    </div>

                    <div className="col-span-full flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/registered-arrivals')}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add Entry'}
                        </button>
                    </div>
                </form>
            </div>
            {/* Custom Tailwind class for input fields */}
            <style jsx="true">{`
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
                    margin-bottom: 0.25rem; /* small margin for labels */
                    padding-left: 0.25rem; /* slight padding to align with input */
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
                input[type="date"]::-webkit-inner-spin-button { display: none; }
                input[type="date"]::-webkit-calendar-picker-indicator { opacity: 1; filter: invert(0.5); cursor: pointer; }
                /* WHAT CHANGED: Custom scrollbar styles for form */
                .custom-form-scrollbar::-webkit-scrollbar {
                  width: 8px; /* Width for vertical scrollbar */
                }
                .custom-form-scrollbar::-webkit-scrollbar-track {
                  background: #1f2937; /* Match bg-gray-800 */
                  border-radius: 10px;
                }
                .custom-form-scrollbar::-webkit-scrollbar-thumb {
                  background: #4b5563; /* Match bg-gray-600 */
                  border-radius: 10px;
                }
                .custom-form-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: #6b7280; /* Match bg-gray-500 */
                }
                /* Hide scrollbar for Firefox */
                .custom-form-scrollbar {
                  scrollbar-width: none; /* Firefox */
                }
                /* Hide scrollbar for IE, Edge and Chrome (legacy) */
                .custom-form-scrollbar::-webkit-scrollbar {
                  display: none; /* Chrome, Safari, Edge, Opera */
                }
            `}</style>
        </div>
    );
}

export default AddForeignerPage;

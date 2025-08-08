// src/pages/ForeignerDetailsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getForeignerByIdApi } from '../apiService';

function ForeignerDetailsPage({ foreignerId, onClose }) {
    const navigate = useNavigate();
    const [foreigner, setForeigner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const toastShown = useRef(false); // 👈 Prevent duplicate toasts

    useEffect(() => {
        const fetchForeignerDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getForeignerByIdApi(foreignerId);
                setForeigner(data);

                if (!toastShown.current) {
                    toast.success(`Details for ${data.name || data.ForeignerName || 'foreigner'} loaded!`);
                    toastShown.current = true;
                }
            } catch (err) {
                console.error('Failed to fetch foreigner details:', err);
                setError(err);
                if (!toastShown.current) {
                    toast.error(`Failed to load details: ${err.message}`);
                    toastShown.current = true;
                }
            } finally {
                setLoading(false);
            }
        };

        if (foreignerId) {
            fetchForeignerDetails();
        } else {
            setError(new Error("No foreigner ID provided."));
            setLoading(false);
        }
    }, [foreignerId]);

    const handleClose = () => {
        onClose();
    };

    if (!foreigner) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-2xl mx-auto flex flex-col justify-center items-center h-48">
                    <button onClick={handleClose} className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    const latestVisa = (foreigner.visas && foreigner.visas.length > 0)
        ? foreigner.visas.reduce((latest, current) => {
            const latestExpiry = latest.expiry_date ? new Date(latest.expiry_date) : null;
            const currentExpiry = current.expiry_date ? new Date(current.expiry_date) : null;
            return currentExpiry > latestExpiry ? current : latest;
        })
        : null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-2xl mx-auto relative overflow-y-auto hide-scrollbar" style={{ maxHeight: '90vh' }}>
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

                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="input-label">Serial Number</label>
                        <input type="text" value={foreigner.foreigner_id || foreigner.id || 'N/A'} readOnly className="input-field" />
                    </div>
                    <div>
                        <label className="input-label">Fullname</label>
                        <input type="text" value={foreigner.name || 'N/A'} readOnly className="input-field" />
                    </div>
                    <div>
                        <label className="input-label">Nationality</label>
                        <input type="text" value={foreigner.nationality || 'N/A'} readOnly className="input-field" />
                    </div>
                    <div>
                        <label className="input-label">Gender</label>
                        <input type="text" value={foreigner.gender || 'N/A'} readOnly className="input-field" />
                    </div>
                    <div>
                        <label className="input-label">Passport Number</label>
                        <input type="text" value={foreigner.passport_number || 'N/A'} readOnly className="input-field" />
                    </div>
                    <div>
                        <label className="input-label">Passport Validity</label>
                        <input type="text" value={foreigner.passport_validity ? new Date(foreigner.passport_validity).toLocaleDateString() : 'N/A'} readOnly className="input-field" />
                    </div>
                    <div>
                        <label className="input-label">Visa Number</label>
                        <input type="text" value={latestVisa?.visa_number || 'N/A'} readOnly className="input-field" />
                    </div>
                    <div>
                        <label className="input-label">Visa Expiry</label>
                        <input type="text" value={latestVisa?.expiry_date ? new Date(latestVisa.expiry_date).toLocaleDateString() : 'N/A'} readOnly className="input-field" />
                    </div>
                    <div>
                        <label className="input-label">Visa Type</label>
                        <input type="text" value={latestVisa?.visa_type || 'N/A'} readOnly className="input-field" />
                    </div>
                    <div>
                        <label className="input-label">Date of Visit</label>
                        <input type="text" value={latestVisa?.issue_date ? new Date(latestVisa.issue_date).toLocaleDateString() : 'N/A'} readOnly className="input-field" />
                    </div>
                    <div>
                        <label className="input-label">Occupation</label>
                        <input type="text" value={foreigner.occupation || 'N/A'} readOnly className="input-field" />
                    </div>
                    <div>
                        <label className="input-label">Employer</label>
                        <input type="text" value={foreigner.employer || 'N/A'} readOnly className="input-field" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="input-label">Purpose of Visit</label>
                        <textarea value={foreigner.purpose_of_visit || 'N/A'} readOnly rows="3" className="input-field"></textarea>
                    </div>
                    <div className="md:col-span-2">
                        <label className="input-label">Indian Address</label>
                        <textarea value={foreigner.indian_address || 'N/A'} readOnly rows="3" className="input-field"></textarea>
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

                <style>{`
                    .input-field {
                        padding: 0.75rem;
                        border-radius: 0.375rem;
                        background-color: #374151;
                        color: #F3F4F6;
                        border: 1px solid #4B5563;
                        outline: none;
                        box-shadow: none;
                        width: 100%;
                    }
                    .input-label {
                        display: block;
                        font-size: 0.875rem;
                        color: #9CA3AF;
                        margin-bottom: 0.25rem;
                        padding-left: 0.25rem;
                    }
                    .input-field[readOnly] {
                        cursor: default;
                        opacity: 0.9;
                    }
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
            </div>
        </div>
    );
}

export default ForeignerDetailsPage;

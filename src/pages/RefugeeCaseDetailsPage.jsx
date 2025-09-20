import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getRefugeeByIdApi } from '../apiService'; // WHAT CHANGED: Import the API function

function RefugeeCaseDetailsPage({ refugeeId, onClose }) {
    const [caseData, setCaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCaseDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getRefugeeByIdApi(refugeeId);
                setCaseData(data);
                toast.success(`Refugee Case ${data.id || refugeeId} details loaded!`, { toastId: `refugee-case-details-${data.id || refugeeId}` });
            } catch (err) {
                console.error('Failed to fetch Refugee Case details:', err);
                setError(err);
                toast.error(`Failed to load refugee case details: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (refugeeId) {
            fetchCaseDetails();
        }
    }, [refugeeId]);

    const handleClose = () => {
        onClose(); // Call the onClose function passed from parent
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-lg mx-auto flex justify-center items-center h-48">
                    <p className="text-gray-300 text-lg">Loading refugee case details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-lg mx-auto flex flex-col justify-center items-center h-48">
                    <p className="text-red-400 text-lg">Error: {error.message}</p>
                    <button onClick={handleClose} className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    if (!caseData) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-lg mx-auto flex flex-col justify-center items-center h-48">
                    <p className="text-gray-300 text-lg">Refugee case not found.</p>
                    <button onClick={handleClose} className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md">
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
                    <h1 className="text-xl font-semibold text-gray-50">View Case</h1>
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
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Fullname */}
                    <div>
                        <label className="input-label">Fullname</label>
                        <input type="text" value={caseData.Name || 'N/A'} readOnly className="input-field" />
                    </div>

                    {/* Country of Origin (maps to Nationality from API) */}
                    <div>
                        <label className="input-label">Country of Origin</label>
                        <input type="text" value={caseData.Nationality || 'N/A'} readOnly className="input-field" />
                    </div>

                    {/* Date Registered */}
                    <div>
                        <label className="input-label">Date Registered</label>
                        <input type="text" value={caseData.DateRegistered ? new Date(caseData.DateRegistered).toLocaleDateString() : 'N/A'} readOnly className="input-field" />
                    </div>

                    {/* Assigned Officer */}
                    <div>
                        <label className="input-label">Assigned Officer</label>
                        <input type="text" value={caseData.AssignedOfficer || 'N/A'} readOnly className="input-field" />
                    </div>

                    {/* Visa Status (for display only) */}
                    <div>
                        <label className="input-label">Visa Status</label>
                        <input type="text" value={caseData.VisaStatus || 'N/A'} readOnly className="input-field" />
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
            {/* CustomScrollbarStyles should be rendered once globally, not inside a modal */}
            {/* <CustomScrollbarStyles /> */}
        </div>
    );
}

export default RefugeeCaseDetailsPage;

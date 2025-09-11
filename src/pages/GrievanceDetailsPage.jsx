import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getGrievanceByIdApi } from '../apiService';

function GrievanceDetailsPage({ grievanceId, onClose }) {
    const [grievanceData, setGrievanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGrievanceDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getGrievanceByIdApi(grievanceId);
                setGrievanceData(data);
                toast.success(`Grievance ${data.id || grievanceId} details loaded!`);
            } catch (err) {
                console.error('Failed to fetch grievance details:', err);
                setError(err);
                toast.error(`Failed to load grievance details: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (grievanceId) {
            fetchGrievanceDetails();
        }
    }, [grievanceId]);

    const handleClose = () => {
        onClose(); // Call the onClose function passed from parent
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-lg mx-auto flex justify-center items-center h-48">
                    <p className="text-gray-300 text-lg">Loading grievance details...</p>
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

    if (!grievanceData) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-lg mx-auto flex flex-col justify-center items-center h-48">
                    <p className="text-gray-300 text-lg">Grievance not found.</p>
                    <button onClick={handleClose} className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    // Determine the formatted date for "Update status"
    const status = grievanceData.status;
        

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-2xl mx-auto relative overflow-y-auto hide-scrollbar" style={{ maxHeight: '90vh' }}>
                {/* Header with Close Button */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold text-gray-50">Grievance Handling Case- {grievanceData.id || 'N/A'}</h1>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Grievance Details */}
                <div className="space-y-4">
                    <div className="bg-gray-700 p-4 rounded-md">
                        <p className="text-gray-400 text-sm mb-1">Complainant: <span className="text-gray-100 font-medium">{grievanceData.ComplaintBy || 'N/A'}</span></p>
                        <p className="text-gray-400 text-sm mb-1">Date Submitted: <span className="text-gray-100 font-medium">{grievanceData.DateSubmitted ? new Date(grievanceData.DateSubmitted).toLocaleDateString() : 'N/A'}</span></p>
                        <p className="text-gray-400 text-sm">Subject: <span className="text-gray-100 font-medium">{grievanceData.Subject || 'N/A'}</span></p>
                    </div>

                    <div className="bg-gray-700 p-4 rounded-md">
                        <h3 className="text-gray-400 text-sm mb-2">Full Description:</h3>
                        <p className="text-gray-100 leading-relaxed">
                            {grievanceData.full_description || 'No full description available.'}
                        </p>
                    </div>

                    <div className="bg-gray-600 p-4 rounded-md">
                        <h3 className="input-label">Update status</h3>
                        {/* This will be read-only date input, as per design */}
                        <input
                            type="dropdown" // Change to text as per screenshot for "26-07-2025" display
                            value={status}
                            readOnly
                            className="input-field"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
                    >
                        Close
                    </button>
                </div>
                {/* Custom Tailwind CSS classes */}
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

export default GrievanceDetailsPage;

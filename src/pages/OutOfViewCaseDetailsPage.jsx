// src/pages/OutOfViewCaseDetailsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { getOutOfViewCaseByIdApi } from '../apiService';
import { CustomScrollbarStyles } from '../components/CustomScrollbarStyles';

function OutOfViewCaseDetailsPage({ caseId, onClose }) {
    const [caseData, setCaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const hasToastedRef = useRef(false); // Toast guard

    useEffect(() => {
        const fetchCaseDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getOutOfViewCaseByIdApi(caseId);
                setCaseData(data);

                if (!hasToastedRef.current) {
                    toast.success(`Details for case ${data.id || caseId} loaded!`);
                    hasToastedRef.current = true;
                }
            } catch (err) {
                console.error('Failed to fetch Out of View case details:', err);
                setError(err);
                if (!hasToastedRef.current) {
                    // toast.error(`Failed to load case details: ${err.message}`);
                    // hasToastedRef.current = true;
                }
            } finally {
                setLoading(false);
            }
        };

        if (caseId) {
            fetchCaseDetails();
        }

        return () => {
            hasToastedRef.current = false;
        };
    }, [caseId]);

    const handleClose = () => {
        onClose();
    };

    if (loading || !caseId) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-lg mx-auto flex justify-center items-center h-48">
                    <p className="text-gray-300 text-lg">Loading case details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-lg mx-auto flex flex-col justify-center items-center h-48">
                    <p className="text-red-400 text-lg">Error: {error.message}</p>
                    <button onClick={handleClose} className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-lg mx-auto relative overflow-y-auto hide-scrollbar" style={{ maxHeight: '90vh' }}>
                {/* Header */}
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

                {/* Vertical Form */}
                <form className="space-y-4">
                    <div>
                        <label className="input-label">Fullname</label>
                        <input type="text" value={caseData.ForeignerName || 'N/A'} readOnly className="input-field" />
                    </div>

                    <div>
                        <label className="input-label">Country of Origin</label>
                        <input type="text" value={caseData.Nationality || 'N/A'} readOnly className="input-field" />
                    </div>

                    <div>
                        <label className="input-label">Date Registered</label>
                        <input type="text" value={caseData.case_opened_date ? new Date(caseData.case_opened_date).toLocaleDateString() : 'N/A'} readOnly className="input-field" />
                    </div>

                    <div>
                        <label className="input-label">Assigned Officer</label>
                        <input type="text" value={caseData.AssignedOfficer || 'N/A'} readOnly className="input-field" />
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                {/* Input styles and scrollbar */}
                <style>{`
          .input-field {
            padding: 0.75rem;
            border-radius: 0.375rem;
            background-color: #374151;
            color: #F3F4F6;
            border: 1px solid #4B5563;
            outline: none;
            width: 100%;
          }
          .input-label {
            font-size: 0.875rem;
            color: #9CA3AF;
            margin-bottom: 0.25rem;
            display: block;
          }
          .input-field[readOnly] {
            opacity: 0.9;
            cursor: default;
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
            <CustomScrollbarStyles />
        </div>
    );
}

export default OutOfViewCaseDetailsPage;

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getCitizenshipRequestByIdApi, approveCitizenshipRequestApi, rejectCitizenshipRequestApi, requestMoreInfoCitizenshipRequestApi } from '../apiService'; // WHAT CHANGED: Import API functions
import { CustomScrollbarStyles } from '../components/CustomScrollbarStyles'; // For consistent styling

function CitizenshipRequestDetailsPage({ requestId, onClose, onActionSuccess }) { // Added onActionSuccess prop
    const [requestData, setRequestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processingAction, setProcessingAction] = useState(false); // For button loading state
    const [error, setError] = useState(null);

    const fetchRequestDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCitizenshipRequestByIdApi(requestId);
            setRequestData(data);
            toast.success(`Application ${data.id || requestId} details loaded!`);
        } catch (err) {
            console.error('Failed to fetch Citizenship Request details:', err);
            setError(err);
            toast.error(`Failed to load application details: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (requestId) {
            fetchRequestDetails();
        }
    }, [requestId]);

    const handleClose = () => {
        onClose(); // Call the onClose function passed from parent
    };
const handleApiError = async (err, defaultMsg) => {
  let message = defaultMsg;
  try {
    const data = await err.json?.();
    if (typeof data === 'string') message = data;
    else if (data?.message) message = data.message;
    else message = JSON.stringify(data);
  } catch {
    message = err.message || defaultMsg;
  }
  toast.error(message);
};

    // WHAT CHANGED: Handlers for action buttons
    const handleApprove = async () => {
  setProcessingAction(true);
  try {
    await approveCitizenshipRequestApi(requestData);
    toast.success('Application approved successfully!');
    onActionSuccess();
    onClose();
  } catch (err) {
    console.error('Failed to approve application:', err);
    await handleApiError(err, 'Failed to approve application');
  } finally {
    setProcessingAction(false);
  }
};


   const handleReject = async () => {
  setProcessingAction(true);
  try {
    await rejectCitizenshipRequestApi(requestData);
    toast.success('Application rejected!');
    onActionSuccess();
    onClose();
  } catch (err) {
    console.error('Failed to reject application:', err);
    await handleApiError(err, 'Failed to reject application');
  } finally {
    setProcessingAction(false);
  }
};

   const handleRequestMoreInfo = async () => {
  setProcessingAction(true);
  try {
    await requestMoreInfoCitizenshipRequestApi(requestData);
    toast.info('Request for more info sent!');
    onActionSuccess();
    onClose();
  } catch (err) {
    console.error('Failed to request more info:', err);
    await handleApiError(err, 'Failed to request more info');
  } finally {
    setProcessingAction(false);
  }
};


    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-lg mx-auto flex justify-center items-center h-48">
                    <p className="text-gray-300 text-lg">Loading application details...</p>
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

    if (!requestData) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-lg mx-auto flex flex-col justify-center items-center h-48">
                    <p className="text-gray-300 text-lg">Application not found.</p>
                    <button onClick={handleClose} className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    // Determine status badge color
    let statusBgColor = 'bg-gray-700';
    let statusTextColor = 'text-gray-100';
    switch (requestData.status) {
        case 'Pending Review':
            statusBgColor = 'bg-yellow-800';
            break;
        case 'Additional info needed':
            statusBgColor = 'bg-orange-800';
            break;
        case 'Rejected':
            statusBgColor = 'bg-red-800';
            break;
        case 'Approved':
            statusBgColor = 'bg-green-800';
            break;
        default:
            statusBgColor = 'bg-gray-700';
    }


    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-2xl mx-auto relative overflow-y-auto hide-scrollbar" style={{ maxHeight: '90vh' }}>
                {/* Header with Close Button */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold text-gray-50">Application- {requestData.id || 'N/A'}</h1>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Application Details */}
                <div className="space-y-4 mb-6">
                    <div className="bg-gray-700 p-4 rounded-md">
                        <p className="text-gray-400 text-sm mb-1">Complainant: <span className="text-gray-100 font-medium">{requestData.ApplicantName || 'N/A'}</span></p> {/* WHAT CHANGED: Mapped to applicant_name */}
                        <p className="text-gray-400 text-sm mb-1">Date Submitted: <span className="text-gray-100 font-medium">{requestData.DateSubmitted ? new Date(requestData.DateSubmitted).toLocaleDateString() : 'N/A'}</span></p>
                        {/* <p className="text-gray-400 text-sm">Subject: <span className="text-gray-100 font-medium">{requestData.Subject || 'N/A'}</span></p> WHAT CHANGED: Mapped to subject_or_description */}
                    </div>

                    <div className="bg-gray-700 p-4 rounded-md">
                        <h3 className="text-gray-400 text-sm mb-2">Status:</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusBgColor} ${statusTextColor}`}>
                            {requestData.status || 'N/A'}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-gray-700 p-4 rounded-md flex justify-around items-center">
                    <h3 className="text-gray-400 text-lg font-semibold mr-4">Actions</h3>
                    <button
                        onClick={handleApprove}
                        disabled={processingAction}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50"
                    >
                        {processingAction ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                        onClick={handleReject}
                        disabled={processingAction}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50"
                    >
                        {processingAction ? 'Processing...' : 'Reject'}
                    </button>
                    <button
                        onClick={handleRequestMoreInfo}
                        disabled={processingAction}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50"
                    >
                        {processingAction ? 'Processing...' : 'Request more info'}
                    </button>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
                    >
                        Close
                    </button>
                </div>
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
            <CustomScrollbarStyles /> {/* WHAT CHANGED: Moved CustomScrollbarStyles to here for global application */}
        </div>
    );
}

export default CitizenshipRequestDetailsPage;

import { getUnregisteredCaseByIdApi } from "../apiService";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
export const ViewCaseModal = ({ caseId, onClose }) => {
    const [caseData, setCaseData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUnregisteredCaseByIdApi(caseId);
                setCaseData(data);
            } catch (err) {
                toast.error("Couldn't fetch case details");
            }
        };
        fetchData();
    }, [caseId]);

    if (!caseData) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-[#141824] p-6 rounded-lg shadow-xl w-full max-w-md mx-auto relative overflow-y-auto hide-scrollbar">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-50">View Case</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="input-label">Location of Sighting</label>
                        <input className="input-field" disabled value={caseData.ReportedPlace || 'N/A'} />
                    </div>

                    <div>
                        <label className="input-label">Date of Sighting</label>
                        <input className="input-field" disabled value={new Date(caseData.reported_at).toLocaleDateString()} />
                    </div>

                    <div>
                        <label className="input-label">Reported by (eg., Hotel Manager, Anonymous)</label>
                        <input className="input-field" disabled value={caseData.ReportedBy || 'N/A'} />
                    </div>

                    <div>
                        <label className="input-label">Description of Sighting</label>
                        <textarea className="input-field" disabled rows="3" value={caseData.DescriptionOfSighting || 'N/A'} />
                    </div>

                    <div className="flex justify-end">
                        <button onClick={onClose} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200">
                            Cancel
                        </button>
                    </div>
                </div>

                <style>{`
          .input-field {
            padding: 0.75rem;
            border-radius: 0.375rem;
            background-color: #374151;
            color: #F3F4F6;
            border: 1px solid #4B5563;
            width: 100%;
          }
          .input-label {
            font-size: 0.875rem;
            color: #9CA3AF;
            margin-bottom: 0.25rem;
            display: block;
            padding-left: 0.25rem;
          }
        `}</style>
            </div>
        </div>
    );
};
export default ViewCaseModal;
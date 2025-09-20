// src/components/EditCaseModal.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { updateUnregisteredCaseStatusApi } from '../apiService';
import { CustomScrollbarStyles } from './CustomScrollbarStyles'; // Import for styling

export const EditCaseModal = ({ caseId, onClose, onSaveSuccess }) => {
  // No need to fetch case data from API
  const [saving, setSaving] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  // Only status is needed for update

  // No need to fetch case data from API
  useEffect(() => {
    // Component is ready
  }, [caseId]);

  // WHAT CHANGED: Updated handleStatusChange to handle both status and name changes
  const handleStatusChange = (e) => {
    // Always trim and match valid statuses
    const value = e.target.value.trim();
    if (["Pending", "Under Investigation", "Case Closed"].includes(value)) {
      setNewStatus(value);
    } else {
      setNewStatus(""); // fallback if invalid
    }
  };



  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUnregisteredCaseStatusApi(caseId, { status: newStatus });
      toast.success(`Case updated.`);
      onSaveSuccess(); // Trigger a data refresh on the parent page
      onClose();
    } catch (err) {
      toast.error(`Failed to update: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };




  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <CustomScrollbarStyles />
      <div className="bg-[#141824] p-6 rounded-lg shadow-xl w-full max-w-md mx-auto relative overflow-y-auto hide-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-50">Edit Case</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 gap-4">

          <div>
            <label className="input-label">Update Status</label>
            <select className="input-field bg-gray-800" value={newStatus} onChange={handleStatusChange} required>
              <option value="">Select status</option>
              <option value="Pending">Pending</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Case Closed">Case Closed</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button onClick={onClose} type="button" className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        <style>{`
          .input-field {
            padding: 0.75rem; border-radius: 0.375rem; background-color: #374151; color: #F3F4F6;
            border: 1px solid #4B5563; outline: none; box-shadow: none; width: 100%;
          }
          .input-label {
            font-size: 0.875rem; color: #9CA3AF; margin-bottom: 0.25rem; display: block; padding-left: 0.25rem;
          }
        `}</style>
      </div>
    </div>
  );
};
export default EditCaseModal;

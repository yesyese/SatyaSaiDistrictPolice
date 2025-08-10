import React, { useState } from 'react';
import { updateGrievanceStatusApi } from '../apiService';
import { toast } from 'react-toastify';

const EditGrievanceStatusModal = ({ grievanceId, currentStatus, onClose, onSaveSuccess }) => {
  const [newStatus, setNewStatus] = useState(currentStatus || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateGrievanceStatusApi(grievanceId, { status: newStatus });
      toast.success('Status updated.');
      onSaveSuccess();
      onClose();
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black  flex justify-center items-center z-50">
      <div className="bg-[#141824] p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-gray-50 mb-4">Update Grievance Status</h2>
        <form onSubmit={handleSave}>
          <select
            className="input-field mb-4"
            value={newStatus}
            onChange={e => setNewStatus(e.target.value)}
          >
            <option value="Open">Open</option>
            <option value="InProgress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">Cancel</button>
            <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default EditGrievanceStatusModal;

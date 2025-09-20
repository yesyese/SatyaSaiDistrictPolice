// src/components/FileReportModal.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { addUnregisteredCaseApi } from '../apiService'; // Import the API function

function FileReportModal({ onClose, onReportFiled }) {
  const [formData, setFormData] = useState({
    Name: '', // Corresponds to "Fullname" in some designs, but "Name" in your API output
    ReportedPlace: '', // Corresponds to "Location of Sighting"
    reported_at: new Date().toISOString().split('T')[0], // Default to today's date, "Date of Sighting"
    ReportedBy: '', // Corresponds to "Reported by"
    DescriptionOfSighting: '', // New field for "Description of Sighting"
    status: 'Pending', // Default status for new reports, as per your API output
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send data matching your backend's UnregisteredCaseCreate model
      await addUnregisteredCaseApi(formData);
      toast.success('Unregistered arrival reported successfully!');
      onReportFiled(); // Trigger refresh in parent component
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error reporting unregistered arrival:', error);
      toast.error(`Failed to file report: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-[#141824] p-6 rounded-lg shadow-2xl border border-gray-800 w-full max-w-md mx-auto relative overflow-y-auto hide-scrollbar" style={{ maxHeight: '90vh' }}>
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-50">Report an Unregistered Arrival</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {/* Location of Sighting */}
          <div>
            <label className="input-label">Location of Sighting</label>
            <input type="text" name="ReportedPlace" placeholder="e.g., Near City Park" value={formData.ReportedPlace} onChange={handleChange} className="input-field" required />
          </div>
          
          {/* Fullname */}
          <div>
            <label className="input-label">Fullname</label>
            <input type="text" name="Name" placeholder="e.g., John Doe" value={formData.Name} onChange={handleChange} className="input-field" required />
          </div>
          {/* Date of Sighting */}
          <div>
            <label className="input-label">Date of Sighting</label>
            <input type="date" name="reported_at" value={formData.reported_at} onChange={handleChange} className="input-field" required />
          </div>
          
          {/* Reported by */}
          <div>
            <label className="input-label">Reported by (e.g., Hotel Manager, Anonymous)</label>
            <input type="text" name="ReportedBy" placeholder="e.g., Hotel Manager" value={formData.ReportedBy} onChange={handleChange} className="input-field" required />
          </div>

          {/* Description of Sighting */}
          <div>
            <label className="input-label">Description of Sighting</label>
            <textarea name="DescriptionOfSighting" placeholder="Provide a brief description of the sighting..." value={formData.DescriptionOfSighting} onChange={handleChange} rows="3" className="input-field"></textarea>
          </div>
          
          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Reporting...' : 'File Report'}
            </button>
          </div>
        </form>
        {/* Inline styles for input-field and input-label */}
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
          input[type="date"]::-webkit-calendar-picker-indicator { opacity: 1; filter: invert(0.7); }
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    </div>
  );
};

export default FileReportModal;

import React, { useState } from 'react';

const NewGrievanceModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
   
    complaintType: '',
    subject: '',
    dateOfIncident: '',
    status: '',
  
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Future: send this to your grievance API endpoint
    onClose(); // close after submitting
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-[#1E2535] text-white rounded-lg w-full max-w-3xl p-6 shadow-lg relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-2">
          <h2 className="text-lg font-semibold">File New Complaint</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl font-bold">&times;</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm">Complaint By</label>
            <input type="text" name="fullName"  onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-[#2C3446] border border-gray-700 focus:outline-none" />
          </div>

         

        

          <div>
            <label className="block mb-1 text-sm">Subject</label>
            <input type="text" name="subject" value={formData.subject} onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-[#2C3446] border border-gray-700" />
          </div>

          <div>
            <label className="block mb-1 text-sm">Date of Incident</label>
            <input type="date" name="dateOfIncident" value={formData.dateOfIncident} onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-[#2C3446] border border-gray-700" />
          </div>

      


          {/* Action buttons */}
          <div className="flex justify-end items-center gap-3 md:col-span-2 mt-4">
            <button type="button" onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition">
              Cancel
            </button>
            <button type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition">
              + File Complaint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewGrievanceModal;

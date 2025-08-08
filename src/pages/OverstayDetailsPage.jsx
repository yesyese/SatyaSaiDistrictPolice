// src/pages/OverstayDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getOverstayRecordByIdApi } from '../apiService';
import { CustomScrollbarStyles } from '../components/CustomScrollbarStyles';
import { ArrowLeft, Calendar, User, Globe, CreditCard } from 'lucide-react';

const OverstayDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [overstayRecord, setOverstayRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOverstayDetails();
    }
  }, [id]);

  const fetchOverstayDetails = async () => {
    try {
      setLoading(true);
      const data = await getOverstayRecordByIdApi(id);
      setOverstayRecord(data);
      console.log('Overstay details fetched:', data);
    } catch (error) {
      console.error('Failed to fetch overstay details:', error);
      toast.error('Failed to load overstay details.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateOverstayStatus = (visaExpiryDate) => {
    if (!visaExpiryDate) return { text: 'N/A', color: 'text-gray-400' };
    
    const expiry = new Date(visaExpiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.ceil((today.getTime() - expiry.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 0) {
      return {
        text: `Overstayed by ${daysDiff} day${daysDiff > 1 ? 's' : ''}`,
        color: 'text-red-400',
        bgColor: 'bg-red-900/30'
      };
    } else if (daysDiff === 0) {
      return {
        text: 'Expires Today',
        color: 'text-orange-400',
        bgColor: 'bg-orange-900/30'
      };
    } else {
      return {
        text: `${Math.abs(daysDiff)} day${Math.abs(daysDiff) > 1 ? 's' : ''} remaining`,
        color: 'text-green-400',
        bgColor: 'bg-green-900/30'
      };
    }
  };

  if (loading) {
    return (
      <>
        <CustomScrollbarStyles />
        <div className="flex-1 p-6 bg-[#070b13] min-h-screen text-gray-100 font-sans">
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400 text-lg">Loading overstay details...</div>
          </div>
        </div>
      </>
    );
  }

  if (!overstayRecord) {
    return (
      <>
        <CustomScrollbarStyles />
        <div className="flex-1 p-6 bg-[#070b13] min-h-screen text-gray-100 font-sans">
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400 text-lg">Overstay record not found</div>
          </div>
        </div>
      </>
    );
  }

  const status = calculateOverstayStatus(overstayRecord.VisaExpiryDate);

  return (
    <>
      <CustomScrollbarStyles />
      <div className="flex-1 p-6 bg-[#070b13] min-h-screen text-gray-100 font-sans">
        <div className="bg-[#141824] p-6 rounded-lg shadow-xl border border-gray-800">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/overstays')}
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Overstays
              </button>
              <h1 className="text-2xl font-semibold text-gray-50">
                Overstay Details
              </h1>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Name</label>
                  <p className="text-gray-100 text-lg">{overstayRecord.Name || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400">Nationality</label>
                  <p className="text-gray-100 flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    {overstayRecord.Nationality || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400">Passport Number</label>
                  <p className="text-gray-100 flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    {overstayRecord.PassportNum || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400">Visa Number</label>
                  <p className="text-gray-100">{overstayRecord.VisaNum || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Visa Information */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Visa Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Visa Expiry Date</label>
                  <p className="text-gray-100 text-lg">
                    {formatDate(overstayRecord.VisaExpiryDate)}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400">Current Status</label>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}>
                    {status.text}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400">Record ID</label>
                  <p className="text-gray-100">#{overstayRecord.id}</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400">Foreigner ID</label>
                  <p className="text-gray-100">#{overstayRecord.foreigner_id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="mt-6 bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Logged At</label>
                <p className="text-gray-100">
                  {formatDate(overstayRecord.logged_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OverstayDetailsPage;

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaPlusCircle, FaListAlt } from 'react-icons/fa';
import ComplaintList from '../components/ComplaintList';
import ComplaintForm from '../components/ComplaintForm';

const Dashboard = () => {
  const { user } = useAuth();
  const [refresh, setRefresh] = useState(false);

  // Toggle refresh to reload complaints after submission
  const handleComplaintSubmit = () => setRefresh(r => !r);

  return (
    <div className="min-h-screen bg-[#FBFBFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-10 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1D1D1F] mb-2 tracking-tight">
            Welcome, {user?.name}
          </h1>
          <p className="text-[#86868B] text-base sm:text-lg">
            Manage your electricity complaints with PHCN
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-[#D2D2D7] p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#007AFF]/10 flex items-center justify-center">
                <FaListAlt className="text-[#007AFF] text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#1D1D1F]">Your Complaints</h2>
                <p className="text-sm text-[#86868B]">View and track all submissions</p>
              </div>
            </div>
            <ComplaintList key={refresh} />
          </div>
          <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-[#D2D2D7] p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#007AFF]/10 flex items-center justify-center">
                <FaPlusCircle className="text-[#007AFF] text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#1D1D1F]">Submit Complaint</h2>
                <p className="text-sm text-[#86868B]">Report a new electricity issue</p>
              </div>
            </div>
            <ComplaintForm onSuccess={handleComplaintSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
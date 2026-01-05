import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminStats from '../components/AdminStats';
import UserList from '../components/UserList';
import AdminComplaintList from '../components/AdminComplaintList';
import CategoryManager from '../components/CategoryManager';
import { FaUsers, FaChartBar, FaClipboardList, FaTags } from 'react-icons/fa';

const Admin = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#FBFBFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-10 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#1D1D1F] mb-2 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-[#86868B] text-base">
            Welcome, {user?.name}. Manage users, complaints, and view analytics.
          </p>
        </div>
        <section className="mb-10 sm:mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[#007AFF]/10 flex items-center justify-center">
              <FaChartBar className="text-[#007AFF] text-sm" />
            </div>
            <h2 className="text-xl font-semibold text-[#1D1D1F]">Complaint Stats</h2>
          </div>
          <AdminStats />
        </section>
        <section className="mb-10 sm:mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[#007AFF]/10 flex items-center justify-center">
              <FaUsers className="text-[#007AFF] text-sm" />
            </div>
            <h2 className="text-xl font-semibold text-[#1D1D1F]">Manage Users</h2>
          </div>
          <UserList />
        </section>
        <section className="mb-10 sm:mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[#007AFF]/10 flex items-center justify-center">
              <FaClipboardList className="text-[#007AFF] text-sm" />
            </div>
            <h2 className="text-xl font-semibold text-[#1D1D1F]">Manage Complaints</h2>
          </div>
          <AdminComplaintList />
        </section>
        <section className="mb-10 sm:mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[#007AFF]/10 flex items-center justify-center">
              <FaTags className="text-[#007AFF] text-sm" />
            </div>
            <h2 className="text-xl font-semibold text-[#1D1D1F]">Manage Categories</h2>
          </div>
          <CategoryManager />
        </section>
      </div>
    </div>
  );
};

export default Admin; 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaExclamationCircle, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';

const AdminStats = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/admin/complaint-stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        setError('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return <div className="text-center py-4">Loading stats...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-[#D2D2D7] p-5 flex flex-col items-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="w-10 h-10 rounded-lg bg-[#007AFF]/10 flex items-center justify-center mb-3">
          <FaExclamationCircle className="text-lg text-[#007AFF]" />
        </div>
        <div className="font-semibold text-2xl text-[#1D1D1F] mb-1">{stats.total}</div>
        <div className="text-xs text-[#86868B] font-medium">Total</div>
      </div>
      <div className="bg-white rounded-xl border border-[#D2D2D7] p-5 flex flex-col items-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="w-10 h-10 rounded-lg bg-[#FF9500]/10 flex items-center justify-center mb-3">
          <FaHourglassHalf className="text-lg text-[#FF9500]" />
        </div>
        <div className="font-semibold text-2xl text-[#1D1D1F] mb-1">{stats.pending}</div>
        <div className="text-xs text-[#86868B] font-medium">Pending</div>
      </div>
      <div className="bg-white rounded-xl border border-[#D2D2D7] p-5 flex flex-col items-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="w-10 h-10 rounded-lg bg-[#34C759]/10 flex items-center justify-center mb-3">
          <FaCheckCircle className="text-lg text-[#34C759]" />
        </div>
        <div className="font-semibold text-2xl text-[#1D1D1F] mb-1">{stats.resolved}</div>
        <div className="text-xs text-[#86868B] font-medium">Resolved</div>
      </div>
      <div className="bg-white rounded-xl border border-[#D2D2D7] p-5 flex flex-col items-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="w-10 h-10 rounded-lg bg-[#FF3B30]/10 flex items-center justify-center mb-3">
          <FaTimesCircle className="text-lg text-[#FF3B30]" />
        </div>
        <div className="font-semibold text-2xl text-[#1D1D1F] mb-1">{stats.rejected}</div>
        <div className="text-xs text-[#86868B] font-medium">Rejected</div>
      </div>
    </div>
  );
};

export default AdminStats; 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSpinner, FaFilter } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import ComplaintDetailModal from './ComplaintDetailModal';

const statusColors = {
  pending: 'bg-[#FF9500]/10 text-[#FF9500]',
  in_progress: 'bg-[#007AFF]/10 text-[#007AFF]',
  resolved: 'bg-[#34C759]/10 text-[#34C759]',
  rejected: 'bg-[#FF3B30]/10 text-[#FF3B30]',
};

const ComplaintList = () => {
  const { token } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailComplaint, setDetailComplaint] = useState(null);
  // Filters
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('/api/complaints', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(res.data);
    } catch (err) {
      setError('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => { fetchComplaints(); fetchCategories(); }, [token]);

  // Filtering logic
  const filteredComplaints = complaints.filter(c =>
    (!filterStatus || c.status === filterStatus) &&
    (!filterCategory || c.category?._id === filterCategory)
  );

  if (loading) return <div className="flex justify-center py-8"><FaSpinner className="animate-spin text-xl text-[#007AFF]" /></div>;
  if (error) return <div className="text-[#FF3B30] text-center py-6 text-sm">{error}</div>;
  if (!complaints.length) return <div className="text-[#86868B] text-center py-8 text-sm">No complaints found.</div>;

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5 items-center">
        <span className="flex items-center gap-1.5 text-[#86868B] text-sm font-medium"><FaFilter className="text-xs" /> Filter:</span>
        <select className="border border-[#D2D2D7] rounded-lg px-3 py-1.5 bg-white text-[#1D1D1F] text-sm focus:outline-none focus:ring-0 focus:border-[#007AFF] transition-colors" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select className="border border-[#D2D2D7] rounded-lg px-3 py-1.5 bg-white text-[#1D1D1F] text-sm focus:outline-none focus:ring-0 focus:border-[#007AFF] transition-colors" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
        </select>
      </div>
      <div className="space-y-3">
        {filteredComplaints.map(c => (
          <div
            key={c._id}
            className="bg-white border border-[#D2D2D7] rounded-xl p-4 hover:border-[#007AFF] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] cursor-pointer transition-all"
            onClick={() => setDetailComplaint(c)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[#1D1D1F] text-base mb-1.5 truncate" title={c.title}>{c.title}</div>
                <div className="text-sm text-[#86868B] line-clamp-2">{c.description}</div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${statusColors[c.status] || 'bg-[#86868B]/10 text-[#86868B]'}`}>{c.status.replace('_', ' ')}</span>
                <span className="text-xs text-[#86868B] whitespace-nowrap">{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ComplaintDetailModal complaint={detailComplaint} onClose={() => setDetailComplaint(null)} />
    </div>
  );
};

export default ComplaintList; 
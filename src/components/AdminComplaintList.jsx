import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaTrash, FaCheck, FaUserPlus, FaSpinner, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ComplaintDetailModal from './ComplaintDetailModal';

const statusColors = {
  pending: 'bg-[#FF9500]/10 text-[#FF9500]',
  in_progress: 'bg-[#007AFF]/10 text-[#007AFF]',
  resolved: 'bg-[#34C759]/10 text-[#34C759]',
  rejected: 'bg-[#FF3B30]/10 text-[#FF3B30]',
};

const AdminComplaintList = () => {
  const { token } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assigningId, setAssigningId] = useState(null);
  const [resolvingId, setResolvingId] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [detailComplaint, setDetailComplaint] = useState(null);
  // Filters
  const [filterStatus, setFilterStatus] = useState('');
  const [filterUser, setFilterUser] = useState('');
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

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      // ignore
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

  useEffect(() => { fetchComplaints(); fetchUsers(); fetchCategories(); }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    try {
      await axios.delete(`/api/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Complaint deleted');
      fetchComplaints();
    } catch (err) {
      toast.error('Failed to delete complaint');
    }
  };

  const handleAssign = (id) => {
    setAssigningId(id);
    setSelectedUser('');
  };

  const submitAssign = async () => {
    if (!selectedUser) return toast.error('Select a user to assign');
    try {
      await axios.patch(`/api/complaints/${assigningId}/assign`, { assignedTo: selectedUser }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Complaint assigned');
      setAssigningId(null);
      fetchComplaints();
    } catch (err) {
      toast.error('Failed to assign complaint');
    }
  };

  const handleResolve = (id) => {
    setResolvingId(id);
    setResolutionNotes('');
  };

  const submitResolve = async () => {
    try {
      await axios.put(`/api/complaints/${resolvingId}`, { status: 'resolved', resolutionNotes }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Complaint resolved');
      setResolvingId(null);
      fetchComplaints();
    } catch (err) {
      toast.error('Failed to resolve complaint');
    }
  };

  // Filtering logic
  const filteredComplaints = complaints.filter(c =>
    (!filterStatus || c.status === filterStatus) &&
    (!filterUser || c.user?._id === filterUser) &&
    (!filterCategory || c.category?._id === filterCategory)
  );

  if (loading) return <div className="flex justify-center py-8"><FaSpinner className="animate-spin text-xl text-[#007AFF]" /></div>;
  if (error) return <div className="text-[#FF3B30] text-center py-6 text-sm">{error}</div>;
  if (!complaints.length) return <div className="text-[#86868B] text-center py-8 text-sm">No complaints found.</div>;

  return (
    <div className="overflow-x-auto">
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
        <select className="border border-[#D2D2D7] rounded-lg px-3 py-1.5 bg-white text-[#1D1D1F] text-sm focus:outline-none focus:ring-0 focus:border-[#007AFF] transition-colors" value={filterUser} onChange={e => setFilterUser(e.target.value)}>
          <option value="">All Users</option>
          {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>
        <select className="border border-[#D2D2D7] rounded-lg px-3 py-1.5 bg-white text-[#1D1D1F] text-sm focus:outline-none focus:ring-0 focus:border-[#007AFF] transition-colors" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
        </select>
      </div>
      <div className="bg-white rounded-xl border border-[#D2D2D7] shadow-[0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#FBFBFD] border-b border-[#D2D2D7]">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-[#1D1D1F] text-xs uppercase tracking-wider">Title</th>
                <th className="py-3 px-4 text-left font-semibold text-[#1D1D1F] text-xs uppercase tracking-wider">User</th>
                <th className="py-3 px-4 text-left font-semibold text-[#1D1D1F] text-xs uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left font-semibold text-[#1D1D1F] text-xs uppercase tracking-wider">Category</th>
                <th className="py-3 px-4 text-center font-semibold text-[#1D1D1F] text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map(c => (
                <tr key={c._id} className="hover:bg-[#FBFBFD] cursor-pointer transition-colors border-b border-[#D2D2D7] last:border-b-0" onClick={e => { if (e.target.tagName === 'BUTTON' || e.target.tagName === 'svg' || e.target.tagName === 'path') return; setDetailComplaint(c); }}>
                  <td className="py-3 px-4 font-medium text-[#1D1D1F] max-w-[200px] truncate">{c.title}</td>
                  <td className="py-3 px-4 text-[#86868B] max-w-[150px] truncate">{c.user?.name || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${statusColors[c.status] || 'bg-[#86868B]/10 text-[#86868B]'}`}>{c.status.replace('_', ' ')}</span>
                  </td>
                  <td className="py-3 px-4 text-[#86868B] max-w-[150px] truncate">{c.category?.name || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => handleAssign(c._id)} className="text-[#007AFF] hover:text-[#0051D5] transition-colors p-1.5 hover:bg-[#007AFF]/10 rounded" title="Assign"><FaUserPlus /></button>
                      <button onClick={() => handleResolve(c._id)} className="text-[#34C759] hover:text-[#28A745] transition-colors p-1.5 hover:bg-[#34C759]/10 rounded" title="Resolve"><FaCheck /></button>
                      <button onClick={() => handleDelete(c._id)} className="text-[#FF3B30] hover:text-[#D70015] transition-colors p-1.5 hover:bg-[#FF3B30]/10 rounded" title="Delete"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Assign Modal */}
      {assigningId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-6 w-full max-w-sm border border-[#D2D2D7]">
            <h3 className="font-semibold text-[#1D1D1F] mb-4 text-lg">Assign Complaint</h3>
            <select className="w-full mb-5 px-4 py-3 border border-[#D2D2D7] rounded-xl bg-white text-[#1D1D1F] focus:outline-none focus:ring-0 focus:border-[#007AFF] transition-colors" value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
              <option value="">Select user</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
              ))}
            </select>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setAssigningId(null)} className="px-4 py-2 rounded-xl bg-[#FBFBFD] text-[#86868B] hover:bg-[#D2D2D7] transition-colors text-sm font-medium">Cancel</button>
              <button onClick={submitAssign} className="px-4 py-2 rounded-xl bg-[#007AFF] text-white hover:bg-[#0051D5] transition-colors text-sm font-medium">Assign</button>
            </div>
          </div>
        </div>
      )}
      {/* Resolve Modal */}
      {resolvingId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-6 w-full max-w-sm border border-[#D2D2D7]">
            <h3 className="font-semibold text-[#1D1D1F] mb-4 text-lg">Resolve Complaint</h3>
            <textarea
              className="w-full mb-5 px-4 py-3 border border-[#D2D2D7] rounded-xl bg-white text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-0 focus:border-[#007AFF] transition-colors resize-none"
              placeholder="Resolution notes (optional)"
              value={resolutionNotes}
              onChange={e => setResolutionNotes(e.target.value)}
              rows={3}
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setResolvingId(null)} className="px-4 py-2 rounded-xl bg-[#FBFBFD] text-[#86868B] hover:bg-[#D2D2D7] transition-colors text-sm font-medium">Cancel</button>
              <button onClick={submitResolve} className="px-4 py-2 rounded-xl bg-[#34C759] text-white hover:bg-[#28A745] transition-colors text-sm font-medium">Resolve</button>
            </div>
          </div>
        </div>
      )}
      {/* Detail Modal */}
      <ComplaintDetailModal complaint={detailComplaint} onClose={() => setDetailComplaint(null)} />
    </div>
  );
};

export default AdminComplaintList; 
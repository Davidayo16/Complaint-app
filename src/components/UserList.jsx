import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserList = () => {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  if (loading) return <div className="text-center py-8 text-[#86868B] text-sm">Loading users...</div>;
  if (error) return <div className="text-[#FF3B30] text-center py-6 text-sm">{error}</div>;
  if (!users.length) return <div className="text-[#86868B] text-center py-8 text-sm">No users found.</div>;

  return (
    <div className="bg-white rounded-xl border border-[#D2D2D7] shadow-[0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#FBFBFD] border-b border-[#D2D2D7]">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-[#1D1D1F] text-xs uppercase tracking-wider">Name</th>
              <th className="py-3 px-4 text-left font-semibold text-[#1D1D1F] text-xs uppercase tracking-wider">Email</th>
              <th className="py-3 px-4 text-left font-semibold text-[#1D1D1F] text-xs uppercase tracking-wider">Role</th>
              <th className="py-3 px-4 text-center font-semibold text-[#1D1D1F] text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b border-[#D2D2D7] last:border-b-0 hover:bg-[#FBFBFD] transition-colors">
                <td className="py-3 px-4 text-[#1D1D1F] font-medium">{u.name}</td>
                <td className="py-3 px-4 text-[#86868B]">{u.email}</td>
                <td className="py-3 px-4 text-[#86868B] capitalize">{u.role}</td>
                <td className="py-3 px-4 text-center">
                  {u._id !== user._id && (
                    <button onClick={() => handleDelete(u._id)} className="text-[#FF3B30] hover:text-[#D70015] transition-colors p-1.5 hover:bg-[#FF3B30]/10 rounded">
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList; 
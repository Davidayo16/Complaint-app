import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaTrash, FaEdit, FaPlus, FaSpinner, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CategoryManager = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name) return toast.error('Name is required');
    try {
      await axios.post('/api/categories', { name, description }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Category added');
      setName('');
      setDescription('');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add category');
    }
  };

  const handleEdit = (cat) => {
    setEditing(cat._id);
    setEditName(cat.name);
    setEditDescription(cat.description || '');
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/categories/${editing}`, { name: editName, description: editDescription }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Category updated');
      setEditing(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await axios.delete(`/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  if (loading) return <div className="flex justify-center py-8"><FaSpinner className="animate-spin text-xl text-[#007AFF]" /></div>;
  if (error) return <div className="text-[#FF3B30] text-center py-6 text-sm">{error}</div>;

  return (
    <div className="bg-white rounded-xl border border-[#D2D2D7] shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-6">
      <h3 className="text-lg font-semibold text-[#1D1D1F] mb-5 flex items-center gap-2">
        <FaPlus className="text-[#007AFF]" /> Manage Categories
      </h3>
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Category name"
          className="px-4 py-2.5 border border-[#D2D2D7] rounded-xl bg-white text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-0 focus:border-[#007AFF] transition-colors flex-1 sm:flex-none sm:w-48"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          className="px-4 py-2.5 border border-[#D2D2D7] rounded-xl bg-white text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-0 focus:border-[#007AFF] transition-colors flex-1"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button type="submit" className="px-4 py-2.5 rounded-xl bg-[#007AFF] text-white hover:bg-[#0051D5] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm font-medium">
          <FaPlus /> Add
        </button>
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#FBFBFD] border-b border-[#D2D2D7]">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-[#1D1D1F] text-xs uppercase tracking-wider">Name</th>
              <th className="py-3 px-4 text-left font-semibold text-[#1D1D1F] text-xs uppercase tracking-wider">Description</th>
              <th className="py-3 px-4 text-center font-semibold text-[#1D1D1F] text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat._id} className="border-b border-[#D2D2D7] last:border-b-0 hover:bg-[#FBFBFD] transition-colors">
                <td className="py-3 px-4">
                  {editing === cat._id ? (
                    <input value={editName} onChange={e => setEditName(e.target.value)} className="border border-[#D2D2D7] rounded-lg px-3 py-1.5 w-full focus:outline-none focus:ring-0 focus:border-[#007AFF] transition-colors" />
                  ) : <span className="text-[#1D1D1F] font-medium">{cat.name}</span>}
                </td>
                <td className="py-3 px-4">
                  {editing === cat._id ? (
                    <input value={editDescription} onChange={e => setEditDescription(e.target.value)} className="border border-[#D2D2D7] rounded-lg px-3 py-1.5 w-full focus:outline-none focus:ring-0 focus:border-[#007AFF] transition-colors" />
                  ) : <span className="text-[#86868B]">{cat.description || '—'}</span>}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2 justify-center">
                    {editing === cat._id ? (
                      <>
                        <button onClick={submitEdit} className="text-[#34C759] hover:text-[#28A745] transition-colors p-1.5 hover:bg-[#34C759]/10 rounded"><FaCheck /></button>
                        <button onClick={() => setEditing(null)} className="text-[#86868B] hover:text-[#1D1D1F] transition-colors p-1.5 hover:bg-[#86868B]/10 rounded"><FaEdit /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(cat)} className="text-[#007AFF] hover:text-[#0051D5] transition-colors p-1.5 hover:bg-[#007AFF]/10 rounded"><FaEdit /></button>
                        <button onClick={() => handleDelete(cat._id)} className="text-[#FF3B30] hover:text-[#D70015] transition-colors p-1.5 hover:bg-[#FF3B30]/10 rounded"><FaTrash /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryManager; 
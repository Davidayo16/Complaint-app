import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(email, password);
      toast.success('Login successful!');
      // Redirect based on user role
      const redirectPath = response?.user?.role === 'admin' ? '/admin' : '/dashboard';
      navigate(redirectPath);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#FBFBFD]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-[#1D1D1F] mb-2 tracking-tight">Welcome back</h1>
          <p className="text-[#86868B] text-sm">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-8 border border-[#D2D2D7]">
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1D1D1F] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-[#D2D2D7] bg-white text-[#1D1D1F] placeholder:text-[#86868B] focus:border-[#007AFF] focus:ring-0 transition-colors"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1D1D1F] mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-[#D2D2D7] bg-white text-[#1D1D1F] placeholder:text-[#86868B] focus:border-[#007AFF] focus:ring-0 transition-colors"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-6 bg-[#007AFF] text-white py-3 rounded-xl font-medium hover:bg-[#0051D5] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 
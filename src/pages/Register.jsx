import React, { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setErrors({});

      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }

      try {
        const response = await register(formData.name, formData.email, formData.password);
        toast.success('Registration successful!', { autoClose: 2000 });
        // Redirect based on user role (new users are always 'user' role)
        const redirectPath = response?.user?.role === 'admin' ? '/admin' : '/dashboard';
        navigate(redirectPath);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Registration failed';
        const errorDetails = err.response?.data?.error || err.message;
        console.error('Registration error:', {
          message: errorMessage,
          details: errorDetails,
          status: err.response?.status,
          response: err.response?.data,
        });
        toast.error(errorMessage, { autoClose: 5000 });
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate, register]
  );

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#FBFBFD]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-[#1D1D1F] mb-2 tracking-tight">Create account</h1>
          <p className="text-[#86868B] text-sm">Get started with PHCN Complaints</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-8 border border-[#D2D2D7] space-y-5"
          noValidate
          aria-labelledby="register-title"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#1D1D1F] mb-2">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              className={`w-full px-4 py-3 rounded-xl border bg-white text-[#1D1D1F] placeholder:text-[#86868B] focus:ring-0 transition-colors ${
                errors.name ? 'border-red-500' : 'border-[#D2D2D7] focus:border-[#007AFF]'
              }`}
              value={formData.name}
              onChange={handleInputChange}
              required
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              disabled={loading}
            />
            {errors.name && (
              <p id="name-error" className="mt-1.5 text-sm text-red-500">
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#1D1D1F] mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className={`w-full px-4 py-3 rounded-xl border bg-white text-[#1D1D1F] placeholder:text-[#86868B] focus:ring-0 transition-colors ${
                errors.email ? 'border-red-500' : 'border-[#D2D2D7] focus:border-[#007AFF]'
              }`}
              value={formData.email}
              onChange={handleInputChange}
              required
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              disabled={loading}
            />
            {errors.email && (
              <p id="email-error" className="mt-1.5 text-sm text-red-500">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#1D1D1F] mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              className={`w-full px-4 py-3 rounded-xl border bg-white text-[#1D1D1F] placeholder:text-[#86868B] focus:ring-0 transition-colors ${
                errors.password ? 'border-red-500' : 'border-[#D2D2D7] focus:border-[#007AFF]'
              }`}
              value={formData.password}
              onChange={handleInputChange}
              required
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              disabled={loading}
            />
            {errors.password && (
              <p id="password-error" className="mt-1.5 text-sm text-red-500">
                {errors.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full mt-6 bg-[#007AFF] text-white py-3 rounded-xl font-medium hover:bg-[#0051D5] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
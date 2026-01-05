import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

const ComplaintForm = ({ onSuccess }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "", // Category (e.g. Overbilling, Outage)
    disco: "",
    meterNumber: "",
    accountNumber: "",
    phoneNumber: "",
    address: "",
    state: "",
    lga: "",
    feederOrTransformer: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]); // State for category list

  const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

  // Fetch categories on component mount
  useEffect(() => {
    console.log("Token:", token); // Debug
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data);
        console.log("Fetched categories:", response.data);
      } catch (err) {
        console.error(
          "Fetch categories error:",
          err.response?.data,
          err.message
        );
        toast.error("Failed to load categories", { autoClose: 5000 });
      }
    };
    if (token) fetchCategories(); // Only fetch if token exists
  }, [token]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    else if (formData.title.length < 5)
      newErrors.title = "Title must be at least 5 characters";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    else if (formData.description.length < 10)
      newErrors.description = "Description must be at least 10 characters";
    if (!formData.category) newErrors.category = "Category is required"; // Validate category

    // Light validation for PHCN-specific context (optional but helpful)
    if (!formData.meterNumber.trim() && !formData.accountNumber.trim()) {
      newErrors.meterNumber =
        "Provide at least a Meter Number or Account Number for electricity complaints";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required for follow-up";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address / location is required";
    }
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
        await axios.post(
          `${API_BASE_URL}/complaints`,
          {
            title: formData.title,
            description: formData.description,
            category: formData.category, // Include category in request
            disco: formData.disco || undefined,
            meterNumber: formData.meterNumber || undefined,
            accountNumber: formData.accountNumber || undefined,
            phoneNumber: formData.phoneNumber || undefined,
            address: formData.address || undefined,
            state: formData.state || undefined,
            lga: formData.lga || undefined,
            feederOrTransformer: formData.feederOrTransformer || undefined,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Complaint submitted successfully!", { autoClose: 2000 });
        setFormData({
          title: "",
          description: "",
          category: "",
          disco: "",
          meterNumber: "",
          accountNumber: "",
          phoneNumber: "",
          address: "",
          state: "",
          lga: "",
          feederOrTransformer: "",
        });
        if (onSuccess) onSuccess();
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Submission failed";
        const errorDetails = {
          message: errorMessage,
          status: err.response?.status,
          response: err.response?.data,
          error: err.message,
        };
        console.error("Complaint submission error:", errorDetails);
        toast.error(errorMessage, { autoClose: 5000 });
      } finally {
        setLoading(false);
      }
    },
    [formData, token, onSuccess, validateForm]
  );

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
      aria-labelledby="complaint-form-title"
    >
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-[#1D1D1F] mb-2"
        >
          Complaint Category
        </label>
        <select
          id="category"
          name="category"
          className={`w-full px-4 py-3 rounded-xl border bg-white text-[#1D1D1F] placeholder:text-[#86868B] focus:ring-0 transition-colors ${errors.category ? "border-red-500" : "border-[#D2D2D7] focus:border-[#007AFF]"}`}
          value={formData.category}
          onChange={handleInputChange}
          required
          aria-invalid={!!errors.category}
          aria-describedby={errors.category ? "category-error" : undefined}
          disabled={loading || categories.length === 0}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p id="category-error" className="mt-1.5 text-sm text-red-500">
            {errors.category}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="disco"
            className="block text-sm font-medium text-[#1D1D1F] mb-2"
          >
            Disco / Service Provider
          </label>
          <select
            id="disco"
            name="disco"
            className="w-full px-4 py-3 rounded-xl border border-[#D2D2D7] bg-white text-[#1D1D1F] placeholder:text-[#86868B] focus:ring-0 focus:border-[#007AFF] transition-colors"
            value={formData.disco}
            onChange={handleInputChange}
            disabled={loading}
          >
            <option value="">Select DISCO</option>
            <option value="AEDC">Abuja Electricity Distribution Company (AEDC)</option>
            <option value="BEDC">Benin Electricity Distribution Company (BEDC)</option>
            <option value="EEDC">Enugu Electricity Distribution Company (EEDC)</option>
            <option value="EKEDC">Eko Electricity Distribution Company (EKEDC)</option>
            <option value="IBEDC">Ibadan Electricity Distribution Company (IBEDC)</option>
            <option value="IKEDC">Ikeja Electric (IKEDC)</option>
            <option value="JEDC">Jos Electricity Distribution Company (JEDC)</option>
            <option value="KAEDCO">Kaduna Electricity Distribution Company (KAEDCO)</option>
            <option value="KEDCO">Kano Electricity Distribution Company (KEDCO)</option>
            <option value="PHED">Port Harcourt Electricity Distribution Company (PHED)</option>
            <option value="YEDC">Yola Electricity Distribution Company (YEDC)</option>
            <option value="OTHERS">Others</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-[#1D1D1F] mb-2"
          >
            Phone / WhatsApp Number
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="e.g. 0803 123 4567"
            className={`w-full px-4 py-3 rounded-xl border bg-white text-[#1D1D1F] placeholder:text-[#86868B] focus:ring-0 transition-colors ${
              errors.phoneNumber ? "border-red-500" : "border-[#D2D2D7] focus:border-[#007AFF]"
            }`}
            value={formData.phoneNumber}
            onChange={handleInputChange}
            aria-invalid={!!errors.phoneNumber}
            aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
            disabled={loading}
          />
          {errors.phoneNumber && (
            <p
              id="phoneNumber-error"
              className="mt-1.5 text-sm text-red-500"
            >
              {errors.phoneNumber}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="meterNumber"
            className="block text-sm font-medium text-[#1D1D1F] mb-2"
          >
            Meter Number
          </label>
          <input
            id="meterNumber"
            name="meterNumber"
            type="text"
            placeholder="Enter meter number"
            className={`w-full px-4 py-3 rounded-xl border bg-white text-[#1D1D1F] placeholder:text-[#86868B] focus:ring-0 transition-colors ${
              errors.meterNumber ? "border-red-500" : "border-[#D2D2D7] focus:border-[#007AFF]"
            }`}
            value={formData.meterNumber}
            onChange={handleInputChange}
            aria-invalid={!!errors.meterNumber}
            aria-describedby={errors.meterNumber ? "meterNumber-error" : undefined}
            disabled={loading}
          />
          {errors.meterNumber && (
            <p
              id="meterNumber-error"
              className="mt-1.5 text-sm text-red-500"
            >
              {errors.meterNumber}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="accountNumber"
            className="block text-sm font-medium text-[#1D1D1F] mb-2"
          >
            Account Number (if any)
          </label>
          <input
            id="accountNumber"
            name="accountNumber"
            type="text"
            placeholder="Enter account number"
            className="w-full px-4 py-3 rounded-xl border border-[#D2D2D7] bg-white text-[#1D1D1F] placeholder:text-[#86868B] focus:ring-0 focus:border-[#007AFF] transition-colors"
            value={formData.accountNumber}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-[#1D1D1F] mb-2"
          >
            State
          </label>
          <input
            id="state"
            name="state"
            type="text"
            placeholder="e.g. Lagos"
            className="w-full px-4 py-3 rounded-xl border border-[#D2D2D7] bg-white text-[#1D1D1F] placeholder:text-[#86868B] focus:ring-0 focus:border-[#007AFF] transition-colors"
            value={formData.state}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>
        <div>
          <label
            htmlFor="lga"
            className="block text-sm font-medium text-[#1D1D1F] mb-2"
          >
            LGA / Area
          </label>
          <input
            id="lga"
            name="lga"
            type="text"
            placeholder="e.g. Ikeja, Port Harcourt City"
            className="w-full px-4 py-3 rounded-xl border border-[#D2D2D7] bg-white text-[#1D1D1F] placeholder:text-[#86868B] focus:ring-0 focus:border-[#007AFF] transition-colors"
            value={formData.lga}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-[#1D1D1F] mb-2"
        >
          House Address / Landmark
        </label>
        <input
          id="address"
          name="address"
          type="text"
          placeholder="Full address and closest landmark"
          className={`w-full px-4 py-2 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
            errors.address ? "border-red-500" : ""
          }`}
          value={formData.address}
          onChange={handleInputChange}
          aria-invalid={!!errors.address}
          aria-describedby={errors.address ? "address-error" : undefined}
          disabled={loading}
        />
        {errors.address && (
          <p
            id="address-error"
            className="mt-1 text-xs text-red-500 font-medium"
          >
            {errors.address}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="feederOrTransformer"
          className="block text-sm font-medium text-[#1D1D1F] mb-2"
        >
          Feeder / Transformer Name (if known)
        </label>
        <input
          id="feederOrTransformer"
          name="feederOrTransformer"
          type="text"
          placeholder="e.g. Alagomeji 11kV Feeder"
          className="w-full px-4 py-3 rounded-xl border border-[#D2D2D7] bg-white text-[#1D1D1F] placeholder:text-[#86868B] focus:ring-0 focus:border-[#007AFF] transition-colors"
          value={formData.feederOrTransformer}
          onChange={handleInputChange}
          disabled={loading}
        />
      </div>
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-[#1D1D1F] mb-2"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Enter complaint title"
          className={`w-full px-4 py-3 rounded-xl border bg-white text-[#1D1D1F] placeholder:text-[#86868B] focus:ring-0 transition-colors ${errors.title ? "border-red-500" : "border-[#D2D2D7] focus:border-[#007AFF]"}`}
          value={formData.title}
          onChange={handleInputChange}
          required
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
          disabled={loading}
        />
        {errors.title && (
          <p id="title-error" className="mt-1.5 text-sm text-red-500">
            {errors.title}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-[#1D1D1F] mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Describe your complaint"
          className={`w-full px-4 py-3 rounded-xl border bg-white text-[#1D1D1F] placeholder:text-[#86868B] focus:ring-0 transition-colors ${errors.description ? "border-red-500" : "border-[#D2D2D7] focus:border-[#007AFF]"}`}
          value={formData.description}
          onChange={handleInputChange}
          required
          rows={4}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "description-error" : undefined}
          disabled={loading}
        />
        {errors.description && (
          <p id="description-error" className="mt-1.5 text-sm text-red-500">
            {errors.description}
          </p>
        )}
      </div>
      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-[#007AFF] text-white font-medium text-base hover:bg-[#0051D5] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Complaint'}
      </button>
    </form>
  );
};

export default ComplaintForm;

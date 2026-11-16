"use client";

import { useState } from "react";

export default function RequirementsForm({ onSuccess, isModal = false }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    productCategory: "",
    requirements: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          fullName: "",
          phoneNumber: "",
          email: "",
          productCategory: "",
          requirements: "",
        });
      }, 4000);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="py-10 text-center space-y-3 animate-in fade-in">
        <div className="w-16 h-16 bg-emerald-100 text-[#04940B] rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
          ✓
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Thank You!</h3>
        <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
          Your requirements have been submitted successfully. A member of our commercial equipment team will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Title & Description */}
      <h2
        className={`font-bold text-[#1F2937] tracking-tight leading-tight ${
          isModal ? "text-xl sm:text-2xl" : "text-2xl sm:text-[32px]"
        }`}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Tell Us About Your Requirements
      </h2>

      <p className="text-gray-500 text-[13px] sm:text-[14px] leading-relaxed mt-2 mb-6 sm:mb-8 font-normal">
        Whether you are setting up a new business or upgrading your existing facility, share your requirements with us. Our team will help you explore suitable equipment options.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Row 1: Full Name & Phone Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className="block text-[13px] sm:text-[14px] font-medium text-gray-800 mb-1.5 sm:mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder=""
              className="w-full h-[46px] sm:h-[48px] px-4 rounded-[10px] border border-gray-300 focus:outline-none focus:border-[#04940B] focus:ring-1 focus:ring-[#04940B] text-sm text-gray-800 transition"
            />
          </div>

          <div>
            <label className="block text-[13px] sm:text-[14px] font-medium text-gray-800 mb-1.5 sm:mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder=""
              className="w-full h-[46px] sm:h-[48px] px-4 rounded-[10px] border border-gray-300 focus:outline-none focus:border-[#04940B] focus:ring-1 focus:ring-[#04940B] text-sm text-gray-800 transition"
            />
          </div>
        </div>

        {/* Row 2: Email address & Product Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className="block text-[13px] sm:text-[14px] font-medium text-gray-800 mb-1.5 sm:mb-2">
              Email address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder=""
              className="w-full h-[46px] sm:h-[48px] px-4 rounded-[10px] border border-gray-300 focus:outline-none focus:border-[#04940B] focus:ring-1 focus:ring-[#04940B] text-sm text-gray-800 transition"
            />
          </div>

          <div>
            <label className="block text-[13px] sm:text-[14px] font-medium text-gray-800 mb-1.5 sm:mb-2">
              Product Category
            </label>
            <input
              type="text"
              name="productCategory"
              value={formData.productCategory}
              onChange={handleChange}
              placeholder=""
              className="w-full h-[46px] sm:h-[48px] px-4 rounded-[10px] border border-gray-300 focus:outline-none focus:border-[#04940B] focus:ring-1 focus:ring-[#04940B] text-sm text-gray-800 transition"
            />
          </div>
        </div>

        {/* Row 3: Tell Us About Your Requirements */}
        <div>
          <label className="block text-[13px] sm:text-[14px] font-medium text-gray-800 mb-1.5 sm:mb-2">
            Tell Us About Your Requirements
          </label>
          <textarea
            name="requirements"
            rows={isModal ? 4 : 5}
            value={formData.requirements}
            onChange={handleChange}
            placeholder=""
            className="w-full h-[120px] sm:h-[150px] p-4 rounded-[10px] border border-gray-300 focus:outline-none focus:border-[#04940B] focus:ring-1 focus:ring-[#04940B] text-sm text-gray-800 transition resize-none"
          ></textarea>
        </div>

        {/* Submit Button (Aligned to the Right matching reference design) */}
        <div className="flex justify-end pt-2 sm:pt-3">
          <button
            type="submit"
            disabled={submitting}
            className="w-[140px] sm:w-[150px] h-[46px] rounded-[60px] bg-[#04940B] hover:bg-[#037A09] active:scale-[0.98] text-white font-medium text-[16px] transition-all cursor-pointer shadow-xs flex items-center justify-center disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

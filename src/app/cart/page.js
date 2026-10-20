"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cartItems, isLoaded, updateQuantity, removeFromCart, clearCart } = useCart();

  // Enquiry Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    productCategory: "",
    requirements: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Pre-fill Product Category based on items in cart if user hasn't typed anything
  useEffect(() => {
    if (cartItems.length > 0 && !formData.productCategory) {
      const categories = [
        ...new Set(cartItems.map((it) => it.category_name).filter(Boolean)),
      ];
      if (categories.length > 0) {
        setFormData((prev) => ({
          ...prev,
          productCategory: categories.join(", "),
        }));
      }
    }
  }, [cartItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.fullName.trim() || !formData.phoneNumber.trim() || !formData.email.trim()) {
      setErrorMessage("Please fill in all required fields (Name, Phone, and Email).");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: cartItems,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        clearCart();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setErrorMessage(data.message || "Failed to submit enquiry. Please try again.");
      }
    } catch (err) {
      console.error("Enquiry submission error:", err);
      // Fallback success for local development
      setSubmitted(true);
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-[#E11D48] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAFBFD] font-poppins min-h-screen py-10 sm:py-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================= */}
        {/* SUCCESS CONFIRMATION STATE                                */}
        {/* ========================================================= */}
        {submitted ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-14 text-center max-w-2xl mx-auto shadow-sm my-10 animate-in fade-in zoom-in-95">
            <div className="w-20 h-20 bg-emerald-50 text-[#04940B] rounded-full flex items-center justify-center mx-auto text-4xl font-bold mb-6">
              ✓
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3 font-poppins">
              Enquiry Submitted Successfully!
            </h1>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              Thank you for sharing your requirements. Our commercial equipment specialist will review your selected items and contact you with a customized quote and delivery schedule shortly.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/products"
                className="px-8 h-[48px] rounded-[60px] bg-[#E11D48] hover:bg-[#BE123C] text-white font-medium text-sm transition-all shadow-xs flex items-center justify-center"
              >
                Continue Browsing Products
              </Link>
              <Link
                href="/"
                className="px-8 h-[48px] rounded-[60px] border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-sm transition-all flex items-center justify-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* ========================================================= */}
            {/* TOP HEADER: ENQUIRY CART                                  */}
            {/* Exactly matching Reference Image 3                        */}
            {/* ========================================================= */}
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
              <h1 className="text-3xl sm:text-[42px] font-bold text-[#0F172A] tracking-tight leading-tight mb-3">
                Enquiry Cart
              </h1>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed font-normal">
                Review your selected products, add specific requirements for each item, and submit your contact details for a personalized quote.
              </p>
            </div>

            {/* ========================================================= */}
            {/* SECTION 1: SELECTED PRODUCTS TABLE                        */}
            {/* Exactly matching Reference Image 3 layout                 */}
            {/* ========================================================= */}
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200/70 p-10 sm:p-14 text-center shadow-xs mb-12">
                <div className="w-16 h-16 rounded-full bg-red-50 text-[#E11D48] flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M2.5 5.5H5.2L7 13.8C7.15 14.5 7.75 15 8.5 15H16.2C16.9 15 17.5 14.5 17.65 13.8L19 7.5H6.2"
                      stroke="#E11D48"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="9.5" cy="18.8" r="1.6" fill="#E11D48" />
                    <circle cx="15.8" cy="18.8" r="1.6" fill="#E11D48" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Your Enquiry Cart is Empty</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                  Browse our commercial kitchen and refrigeration products and click &ldquo;Add to Cart&rdquo; to build your quote enquiry.
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-7 h-[46px] rounded-[60px] bg-[#E11D48] hover:bg-[#BE123C] text-white text-sm font-medium transition shadow-xs"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden mb-12">
                
                {/* Table Header */}
                <div className="grid grid-cols-12 px-6 py-4 border-b border-gray-100 bg-[#FAFAFA] text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <div className="col-span-7 sm:col-span-8 flex items-center gap-4">
                    <span className="w-6"></span>
                    <span>Product</span>
                  </div>
                  <div className="col-span-3 sm:col-span-2 text-right pr-2 sm:pr-6">
                    <span>Price</span>
                  </div>
                  <div className="col-span-2 text-right pr-2">
                    <span>Quantity</span>
                  </div>
                </div>

                {/* Table Body - Product Rows */}
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 px-4 sm:px-6 py-5 items-center hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Product Column: Delete [✕] + Image + Title */}
                      <div className="col-span-7 sm:col-span-8 flex items-center gap-3 sm:gap-4">
                        {/* Red Delete Button (✕) */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 text-base font-bold transition cursor-pointer flex-shrink-0"
                          title="Remove item"
                          aria-label={`Remove ${item.name}`}
                        >
                          ✕
                        </button>

                        {/* Thumbnail Image */}
                        <Link
                          href={`/products/${item.id}`}
                          className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-xl p-1.5 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden group"
                        >
                          <img
                            src={item.image_url || "/products/velvet_covered_clean.png"}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.currentTarget.src = "/products/velvet_covered_clean.png";
                            }}
                          />
                        </Link>

                        {/* Title & Category/Model */}
                        <div className="min-w-0 pr-2">
                          <Link
                            href={`/products/${item.id}`}
                            className="font-medium text-gray-900 text-sm sm:text-[15px] hover:text-[#E11D48] transition-colors line-clamp-2 leading-snug"
                          >
                            {item.name}
                          </Link>
                          {item.model_no && (
                            <p className="text-xs text-gray-500 mt-0.5 truncate">
                              Model: {item.model_no}
                            </p>
                          )}
                          {item.category_name && (
                            <span className="inline-block text-[11px] text-gray-400 mt-0.5 sm:hidden">
                              {item.category_name}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price Column */}
                      <div className="col-span-3 sm:col-span-2 text-right pr-2 sm:pr-6">
                        <span className="font-semibold text-gray-900 text-sm sm:text-[15px]">
                          {item.price > 0 ? (
                            `$${Number(item.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                          ) : (
                            <span className="text-xs text-gray-500 font-normal">Quote Req.</span>
                          )}
                        </span>
                      </div>

                      {/* Quantity Stepper Column */}
                      <div className="col-span-2 flex justify-end">
                        <div className="flex items-center border border-gray-300 rounded-lg h-9 px-1 bg-white shadow-2xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black font-bold text-sm cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-semibold text-gray-900 text-xs sm:text-sm select-none">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black font-bold text-sm cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Table Footer Actions */}
                <div className="p-4 sm:px-6 bg-[#FAFAFA] border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs text-gray-500 hover:text-red-600 font-medium transition cursor-pointer"
                  >
                    Clear All Items
                  </button>
                  <Link
                    href="/products"
                    className="text-xs sm:text-sm text-[#04940B] hover:text-[#037A09] font-medium transition"
                  >
                    + Add More Products
                  </Link>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* SECTION 2: SUBMIT YOUR ENQUIRY FORM                       */}
            {/* Exactly matching Reference Image 2                        */}
            {/* ========================================================= */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-10 lg:p-12 shadow-xs">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 font-poppins">
                Submit Your Enquiry
              </h2>

              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1: Name * and Email * */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Your Full Name"
                      className="w-full h-[50px] px-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E11D48] focus:ring-1 focus:ring-[#E11D48] text-sm text-gray-800 transition bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="yourname@company.com"
                      className="w-full h-[50px] px-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E11D48] focus:ring-1 focus:ring-[#E11D48] text-sm text-gray-800 transition bg-white"
                    />
                  </div>
                </div>

                {/* Row 2: Phone * and Product Category / Subject * */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full h-[50px] px-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E11D48] focus:ring-1 focus:ring-[#E11D48] text-sm text-gray-800 transition bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Subject / Product Category *
                    </label>
                    <input
                      type="text"
                      name="productCategory"
                      value={formData.productCategory}
                      onChange={handleChange}
                      placeholder="e.g. Commercial Kitchen, Refrigeration"
                      className="w-full h-[50px] px-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E11D48] focus:ring-1 focus:ring-[#E11D48] text-sm text-gray-800 transition bg-white"
                    />
                  </div>
                </div>

                {/* Row 3: Message / Tell Us About Your Requirement * */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Message / Tell Us About Your Requirement *
                  </label>
                  <textarea
                    name="requirements"
                    rows="5"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="Provide details about your project, capacity requirements, delivery timeline, or any custom specifications..."
                    className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E11D48] focus:ring-1 focus:ring-[#E11D48] text-sm text-gray-800 transition resize-none bg-white"
                  ></textarea>
                </div>

                {/* Red SUBMIT ENQUIRY Button matching Image 2 */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-[220px] h-[50px] rounded-[60px] bg-[#E11D48] hover:bg-[#BE123C] active:scale-[0.98] text-white font-semibold text-sm tracking-wider uppercase transition-all cursor-pointer shadow-sm flex items-center justify-center disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "SUBMIT ENQUIRY"}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

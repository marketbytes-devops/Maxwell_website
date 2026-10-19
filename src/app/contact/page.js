"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "General Equipment Inquiry",
    city: "Kollam",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          phone: "",
          email: "",
          subject: "General Equipment Inquiry",
          city: "Kollam",
          message: "",
        });
      }, 4000);
    }, 800);
  };

  const showrooms = [
    {
      city: "Kollam",
      badge: "Main Showroom",
      address: "ST THOMAS SHOPPING COMPLEX, near Jawahar Balabhavan, Kadapakkada, Kollam, Kerala 691001",
      phone: "+91 94471 23456",
      email: "kollam@maxsel.in",
      hours: "Mon – Sat: 9:30 AM – 7:30 PM",
    },
    {
      city: "Trivandrum",
      badge: "Branch Office",
      address: "Aaliya Tower, New, Karakkamandapam, Nemom, Thiruvananthapuram, Kerala 695020",
      phone: "+91 94472 34567",
      email: "trivandrum@maxsel.in",
      hours: "Mon – Sat: 9:30 AM – 7:30 PM",
    },
    {
      city: "Kochi",
      badge: "Commercial Hub",
      address: "Velleparambil House, Sastha Temple Road, Ernakulam – 682017, Kerala",
      phone: "+91 94473 45678",
      email: "kochi@maxsel.in",
      hours: "Mon – Sat: 9:30 AM – 7:30 PM",
    },
  ];

  return (
    <div className="w-full bg-white font-poppins flex flex-col min-h-screen">
      {/* ========================================================= */}
      {/* 1. TOP HERO BANNER (Exact Figma Measurements & Text)     */}
      {/* Width: 1744.63px, Height: 643.65px, Box: 878px x 139px   */}
      {/* ========================================================= */}
      <section className="w-full flex justify-center bg-[#0C1222] overflow-hidden">
        <div
          className="w-full max-w-[1745px] h-[480px] sm:h-[560px] md:h-[643.65px] relative flex flex-col items-center justify-center bg-cover bg-center overflow-hidden px-4"
          style={{
            backgroundImage: `url('/images/contact_banner.webp'), url('/images/contact_banner.jpg')`,
            backgroundPosition: "center 30%",
          }}
        >
          {/* Dark Contrast Overlay */}
          <div className="absolute inset-0 bg-black/55 backdrop-brightness-85"></div>

          {/* Banner Content Container (Centered) */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-[1000px] mx-auto px-4">
            {/* Heading: Bounding Box 878px x 139px */}
            <div className="w-full max-w-[878px] min-h-[110px] md:min-h-[139px] flex items-center justify-center">
              <h1
                className="text-white text-3xl sm:text-4xl md:text-[46px] lg:text-[50px] font-bold leading-[1.18] tracking-tight drop-shadow-md"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Let’s Find The Right Equipment <br />
                For Your Business
              </h1>
            </div>

            {/* Subtitle matching Figma text */}
            <p
              className="w-full max-w-[878px] text-white/90 text-sm sm:text-base md:text-[18px] leading-relaxed font-normal mt-4 md:mt-5 drop-shadow-xs"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Looking for reliable commercial kitchen, bakery, refrigeration, or foodservice equipment?
              Our team is here to understand your requirements and help you explore the right solutions for your business.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. SHOWROOM LOCATIONS (Kollam, Trivandrum, Kochi)         */}
      {/* ========================================================= */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-[#04940B] uppercase tracking-wider block mb-2">
            Visit Our Showrooms
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
            Experience Our Commercial Equipment In Person
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Visit any of our 3 state-of-the-art showrooms across Kerala to view live equipment demonstrations.
          </p>
        </div>

        {/* 3 Showroom Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {showrooms.map((room) => (
            <div
              key={room.city}
              className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{room.city}</h3>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#04940B]/10 text-[#04940B]">
                    {room.badge}
                  </span>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm text-gray-600 font-roboto">
                  {/* Address */}
                  <div className="flex items-start gap-2.5">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="leading-relaxed">{room.address}</p>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${room.phone}`} className="hover:text-[#04940B] font-medium text-gray-800">
                      {room.phone}
                    </a>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${room.email}`} className="hover:text-[#04940B] text-gray-700">
                      {room.email}
                    </a>
                  </div>

                  {/* Hours */}
                  <div className="flex items-center gap-2.5 pt-1 text-gray-500 text-xs">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{room.hours}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex items-center gap-3">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(room.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  Get Directions ↗
                </a>
                <a
                  href={`tel:${room.phone}`}
                  className="py-2 px-4 rounded-xl bg-[#04940B]/10 hover:bg-[#04940B] hover:text-white text-[#04940B] text-xs font-semibold transition"
                >
                  Call
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. CONTACT FORM & SALES CONSULTATION SECTION              */}
      {/* ========================================================= */}
      <section className="w-full bg-gray-50/70 border-t border-gray-200 py-16 sm:py-20">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Description Column */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-semibold text-[#04940B] uppercase tracking-wider block mb-2">
                  Get In Touch
                </span>
                <h2 className="text-3xl font-bold text-[#0F172A] leading-tight">
                  Consult With Our Commercial Kitchen Experts
                </h2>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed font-roboto">
                  Whether you are launching a new restaurant, expanding a supermarket chain, or upgrading commercial refrigeration, our technical sales engineers are ready to assist.
                </p>
              </div>

              {/* Highlights */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#04940B]/10 text-[#04940B] flex items-center justify-center font-bold text-sm flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Custom Layout & Capacity Planning</h4>
                    <p className="text-xs text-gray-500 font-roboto">We calculate dimensions, power loads, and refrigeration tonnage for your floor plan.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#04940B]/10 text-[#04940B] flex items-center justify-center font-bold text-sm flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Official Brand Warranty</h4>
                    <p className="text-xs text-gray-500 font-roboto">Direct manufacturer authorization with prompt spare parts support across Kerala.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#04940B]/10 text-[#04940B] flex items-center justify-center font-bold text-sm flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Rapid Delivery & Installation</h4>
                    <p className="text-xs text-gray-500 font-roboto">Dedicated delivery fleet and trained technical team for turnkey commissioning.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contact Form Column */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 bg-emerald-100 text-[#04940B] rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                    ✓
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Message Received!</h3>
                  <p className="text-sm text-gray-600 max-w-md mx-auto font-roboto">
                    Thank you for reaching out. A Maxsel commercial equipment consultant will review your inquiry and get in touch within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Send Us an Equipment Inquiry
                  </h3>
                  <p className="text-xs text-gray-500 mb-5 font-roboto">
                    Fill out the form below and our team will get back to you with specs, brochures, and quotes.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B] transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B] transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        placeholder="anand@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B] transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Nearest Showroom</label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B] transition"
                      >
                        <option value="Kollam">Kollam Showroom</option>
                        <option value="Trivandrum">Trivandrum Showroom</option>
                        <option value="Kochi">Kochi Showroom</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Equipment Requirement / Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B] transition"
                    >
                      <option value="Deep Freezer & Refrigeration">Deep Freezer & Commercial Refrigeration</option>
                      <option value="Combi Ovens & Bakery">Combi Ovens & Bakery Equipment</option>
                      <option value="Commercial Cooking Ranges">Commercial Cooking Ranges</option>
                      <option value="Dishwashers & Glasswashers">Dishwashers & Glasswashers</option>
                      <option value="Vending Machines & Coolers">Vending Machines & Display Coolers</option>
                      <option value="Complete Kitchen Project">Complete Commercial Kitchen Project</option>
                      <option value="General Equipment Inquiry">General Inquiry / Quotation Request</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Your Message / Specifications</label>
                    <textarea
                      rows="4"
                      placeholder="Tell us about your kitchen requirements, estimated capacity, or model preference..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B] transition"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-[200px] h-[48px] rounded-[60px] bg-[#04940B] hover:bg-[#037A09] active:scale-[0.98] text-white font-semibold text-sm transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? "Sending..." : "Submit Inquiry"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

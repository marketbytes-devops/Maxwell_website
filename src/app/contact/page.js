"use client";

import { useState } from "react";
import Image from "next/image";

export default function ContactPage() {
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

  const locations = [
    {
      city: "Kollam",
      address: "ST THOMAS SHOPPING COMPLEX, near Jawahar Balabhavan, Kadapakkada, Kollam, Kerala 691001",
      phone: "+91 98472 72004",
      mapImg: "/images/maps/kollam_map.png",
      mapUrl: "https://maps.google.com/?q=ST+THOMAS+SHOPPING+COMPLEX,+near+Jawahar+Balabhavan,+Kadapakkada,+Kollam,+Kerala+691001",
    },
    {
      city: "Trivandrum",
      address: "Aaliya Tower, New, Karakkamandapam, Nemom, Thiruvananthapuram, Kerala 695020",
      phone: "+91 98472 70004",
      mapImg: "/images/maps/trivandrum_map.png",
      mapUrl: "https://maps.google.com/?q=Aaliya+Tower,+New,+Karakkamandapam,+Nemom,+Thiruvananthapuram,+Kerala+695020",
    },
    {
      city: "Kochi",
      addressLines: ["Velleparambil House", "Sastha Temple Road, Ernakulam – 682017, Kerala"],
      address: "Velleparambil House, Sastha Temple Road, Ernakulam – 682017, Kerala",
      phone: "+91 81568 70004",
      mapImg: "/images/maps/kochi_map.png",
      mapUrl: "https://maps.google.com/?q=Velleparambil+House,+Sastha+Temple+Road,+Ernakulam+-+682017,+Kerala",
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
          className="w-full max-w-[1745px] h-[460px] sm:h-[540px] md:h-[643.65px] relative flex flex-col items-center justify-center bg-cover bg-center overflow-hidden px-4"
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
      {/* 2. FORM SECTION (Matching Picture 1 Reference)            */}
      {/* Left: Prefer to Reach Us by Email? | Right: Requirements   */}
      {/* ========================================================= */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-14 sm:py-20">
        <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8">
          
          {/* LEFT CARD: Prefer to Reach Us by Email? */}
          <div className="w-full lg:w-[320px] xl:w-[350px] bg-white rounded-[24px] border border-[#D1D5DB] p-6 sm:p-8 flex flex-col justify-start flex-shrink-0 shadow-2xs">
            <h3
              className="text-[26px] sm:text-[28px] font-bold text-[#1F2937] leading-[1.25]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Prefer to Reach Us <br />
              by Email?
            </h3>

            <p className="text-gray-500 text-[14px] sm:text-[15px] leading-relaxed mt-4 font-normal">
              Have a product enquiry or a specific equipment requirement? Send us an email with your details, and our team can review your enquiry.
            </p>

            <div className="mt-6">
              <a
                href="mailto:maxselagencies2@gmail.com"
                className="block w-full text-center sm:text-left px-4 py-2.5 rounded-[12px] border border-gray-200 text-gray-700 text-[14px] font-medium hover:border-[#04940B] hover:text-[#04940B] transition-colors break-all"
              >
                maxselagencies2@gmail.com
              </a>
            </div>
          </div>

          {/* RIGHT CARD: Tell Us About Your Requirements */}
          <div className="w-full flex-1 bg-white rounded-[24px] border border-[#D1D5DB] p-6 sm:p-8 lg:p-10 shadow-2xs">
            <h2
              className="text-2xl sm:text-[32px] font-bold text-[#1F2937] tracking-tight leading-tight"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Tell Us About Your Requirements
            </h2>

            <p className="text-gray-500 text-[14px] sm:text-[15px] leading-relaxed mt-2 mb-8 font-normal">
              Whether you are setting up a new business or upgrading your existing facility, share your requirements with us. Our team will help you explore suitable equipment options.
            </p>

            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-[#04940B] rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Thank You!</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Your requirements have been submitted successfully. A member of our commercial equipment team will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1: Full Name & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] sm:text-[14px] font-medium text-gray-800 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder=""
                      className="w-full h-[48px] px-4 rounded-[10px] border border-gray-300 focus:outline-none focus:border-[#04940B] focus:ring-1 focus:ring-[#04940B] text-sm text-gray-800 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] sm:text-[14px] font-medium text-gray-800 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder=""
                      className="w-full h-[48px] px-4 rounded-[10px] border border-gray-300 focus:outline-none focus:border-[#04940B] focus:ring-1 focus:ring-[#04940B] text-sm text-gray-800 transition"
                    />
                  </div>
                </div>

                {/* Row 2: Email address & Product Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] sm:text-[14px] font-medium text-gray-800 mb-2">
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder=""
                      className="w-full h-[48px] px-4 rounded-[10px] border border-gray-300 focus:outline-none focus:border-[#04940B] focus:ring-1 focus:ring-[#04940B] text-sm text-gray-800 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] sm:text-[14px] font-medium text-gray-800 mb-2">
                      Product Category
                    </label>
                    <input
                      type="text"
                      name="productCategory"
                      value={formData.productCategory}
                      onChange={handleChange}
                      placeholder=""
                      className="w-full h-[48px] px-4 rounded-[10px] border border-gray-300 focus:outline-none focus:border-[#04940B] focus:ring-1 focus:ring-[#04940B] text-sm text-gray-800 transition"
                    />
                  </div>
                </div>

                {/* Row 3: Tell Us About Your Requirements */}
                <div>
                  <label className="block text-[13px] sm:text-[14px] font-medium text-gray-800 mb-2">
                    Tell Us About Your Requirements
                  </label>
                  <textarea
                    name="requirements"
                    rows="5"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder=""
                    className="w-full h-[140px] sm:h-[160px] p-4 rounded-[10px] border border-gray-300 focus:outline-none focus:border-[#04940B] focus:ring-1 focus:ring-[#04940B] text-sm text-gray-800 transition resize-none"
                  ></textarea>
                </div>

                {/* Submit Button (Aligned to the Right matching reference) */}
                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-[140px] sm:w-[150px] h-[46px] rounded-[60px] bg-[#04940B] hover:bg-[#037A09] active:scale-[0.98] text-white font-medium text-[16px] transition-all cursor-pointer shadow-xs flex items-center justify-center disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. CONNECT WITH MAXSEL AGENCIES (Matching Picture 2)       */}
      {/* 3-Column Box with Maps & Branch Details                   */}
      {/* ========================================================= */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pb-20 sm:pb-24">
        {/* Section Heading & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2
            className="text-2xl sm:text-[34px] lg:text-[38px] font-bold text-[#1F2937] tracking-tight leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Connect With Maxsel Agencies
          </h2>
          <p className="text-gray-500 text-[14px] sm:text-[16px] mt-2 leading-relaxed font-normal">
            With offices in Kochi, Trivandrum, and Kollam, connect with our team to discuss your commercial equipment requirements.
          </p>
        </div>

        {/* 3-Column Bordered Container with Maps and Details */}
        <div className="w-full bg-white border border-[#E5E7EB] rounded-none sm:rounded-md overflow-hidden shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E5E7EB]">
            {locations.map((loc) => (
              <div key={loc.city} className="p-6 sm:p-7 lg:p-8 flex flex-col justify-between">
                <div>
                  {/* Top: Location Map Image */}
                  <a
                    href={loc.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-[190px] sm:h-[210px] overflow-hidden mb-6 bg-gray-50 border border-gray-100 group cursor-pointer"
                    title={`View ${loc.city} showroom on Google Maps`}
                  >
                    <img
                      src={loc.mapImg}
                      alt={`${loc.city} Showroom Map`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </a>

                  {/* City Name */}
                  <h3
                    className="text-xl sm:text-[22px] font-bold text-gray-900 mb-2.5"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {loc.city}
                  </h3>

                  {/* Address */}
                  {loc.addressLines ? (
                    <div className="text-[13px] sm:text-[14px] text-gray-600 leading-relaxed mb-6 font-normal">
                      <p>{loc.addressLines[0]}</p>
                      <p>{loc.addressLines[1]}</p>
                    </div>
                  ) : (
                    <p className="text-[13px] sm:text-[14px] text-gray-600 leading-relaxed mb-6 font-normal">
                      {loc.address}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="pt-2">
                  <p className="text-[13px] sm:text-[14px] font-medium text-gray-900">
                    Phone:{" "}
                    <a
                      href={`tel:${loc.phone.replace(/\s+/g, "")}`}
                      className="hover:text-[#04940B] font-semibold text-gray-900 transition-colors"
                    >
                      {loc.phone}
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

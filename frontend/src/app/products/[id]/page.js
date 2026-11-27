"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage({ params }) {
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Kollam",
    message: "",
  });
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          setActiveImage(data.product.image_url || "/products/freezer/main_view.png");
        }
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    setEnquirySubmitted(true);
    setTimeout(() => {
      setEnquirySubmitted(false);
      setEnquiryOpen(false);
      setEnquiryForm({ name: "", phone: "", email: "", city: "Kollam", message: "" });
    }, 2500);
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center bg-white font-poppins">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#04940B] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-white font-poppins px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The requested product could not be located.</p>
        <Link
          href="/products"
          className="px-6 py-2.5 rounded-[60px] bg-[#04940B] text-white font-medium hover:bg-[#037A09] transition"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  const galleryList =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : product.image_url
      ? [product.image_url]
      : [
          "/products/freezer/main_view.png",
          "/products/freezer/thumb_1.png",
          "/products/freezer/thumb_2.png",
          "/products/freezer/thumb_3.png",
        ];

  return (
    <div className="w-full bg-white font-poppins flex flex-col min-h-screen">
      {/* 1. TOP HERO BANNER (Matching Reference Image) */}
      <section className="w-full bg-[#111827] overflow-hidden relative">
        <div
          className="w-full h-[180px] sm:h-[240px] md:h-[280px] bg-cover bg-center flex items-center justify-center relative"
          style={{
            backgroundImage: `url('/products/freezer/hero_banner.png')`,
            backgroundPosition: "center 30%",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30"></div>
          <div className="relative z-10 text-center px-4">
            <span className="text-xs sm:text-sm font-medium text-emerald-300 tracking-wider uppercase block mb-1">
              Commercial Kitchen &amp; Food Preparation Equipment
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-wide uppercase drop-shadow-md">
              ENGINEERED FOR PERFECTION <br className="hidden sm:inline" />
              <span className="text-lime-400">BUILT TO LAST</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-roboto flex-wrap">
          <Link href="/" className="hover:text-[#04940B] transition">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#04940B] transition">Products</Link>
          {product.brand && (
            <>
              <span>/</span>
              <span className="text-gray-600 font-medium">{product.brand}</span>
            </>
          )}
          {product.breadcrumb && product.breadcrumb.length > 0 ? (
            product.breadcrumb.map((crumb) => (
              <span key={crumb.id} className="flex items-center gap-2">
                <span>/</span>
                <span className="text-gray-500 capitalize">{crumb.name}</span>
              </span>
            ))
          ) : (
            <>
              <span>/</span>
              <span className="text-gray-400 capitalize">{product.category_name || "Equipment"}</span>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name || product.model_no}</span>
        </nav>
      </div>

      {/* 2. MAIN PRODUCT SECTION (Two Columns: Left Gallery + Right Specs) */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: INTERACTIVE IMAGE GALLERY (Main + 4 Thumbs)   */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* Main Showcase Image Box */}
            <div className="w-full max-w-[560px] h-[360px] sm:h-[460px] bg-white rounded-2xl border border-gray-200/80 p-3 sm:p-4 flex items-center justify-center shadow-xs overflow-hidden group">
              <img
                src={activeImage || product.image_url}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                onError={(e) => {
                  e.currentTarget.src = "/products/freezer/main_view.png";
                }}
              />
            </div>

            {/* Clickable Thumbnails Row (All Uploaded Images) */}
            {galleryList.length > 1 && (
              <div className="w-full max-w-[560px] flex items-center justify-start sm:justify-center gap-3 sm:gap-4 mt-6 overflow-x-auto pb-2">
                {galleryList.map((imgUrl, index) => {
                  const isActive = (activeImage || product.image_url) === imgUrl;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveImage(imgUrl)}
                      className={`w-[78px] h-[78px] sm:w-[88px] sm:h-[88px] rounded-xl border bg-white p-1.5 flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                        isActive
                          ? "border-2 border-[#04940B] shadow-md scale-105 ring-2 ring-[#04940B]/20"
                          : "border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: MODEL TITLE, SPECIFICATIONS, ENQUIRY CTA   */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            {/* Product Heading */}
            <h1
              className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#1F2937] tracking-tight leading-tight mb-2"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              {product.name || product.model_no}
            </h1>

            {/* Model Number Badge if distinct from Title */}
            {product.model_no && product.name && product.model_no.toLowerCase() !== product.name.toLowerCase() && (
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 font-mono">
                  Model: {product.model_no}
                </span>
              </div>
            )}

            {/* Product Description - Rendered when present (e.g. for Trufrost / Butler) */}
            {product.description && product.description.trim() && (
              <div className="mb-6 pt-1 pb-4 border-b border-gray-100">
                <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed font-roboto whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Subheading: Key Features & Specifications */}
            <h2
              className="text-lg sm:text-[20px] font-semibold text-[#1F2937] mb-4"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              Key Features &amp; Specifications:
            </h2>

            {/* Specifications List (Exact Bullet Layout from Reference Image) */}
            <div className="space-y-3 mb-8">
              {product.specifications && product.specifications.length > 0 ? (
                product.specifications.map((spec, i) => (
                  <div
                    key={i}
                    className="flex items-start text-sm sm:text-[15px] leading-relaxed text-[#374151]"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  >
                    <span className="w-2 h-2 rounded-full bg-gray-400 mt-2 mr-3 flex-shrink-0"></span>
                    <span className="font-normal text-gray-600 min-w-[200px] sm:min-w-[220px]">
                      {spec.spec_key}:
                    </span>
                    <span className="font-medium text-gray-900">
                      {spec.spec_value}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">
                  No additional technical specifications listed for this product.
                </p>
              )}
            </div>

            {/* Action Buttons: Add to Cart, Enquiry, and Download Brochure */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={() => {
                  if (!product) return;
                  addToCart(product, 1);
                }}
                className="h-[46px] px-6 rounded-[60px] bg-[#0F172A] hover:bg-black active:scale-[0.98] text-white text-[15px] font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2.5 5.5H5.2L7 13.8C7.15 14.5 7.75 15 8.5 15H16.2C16.9 15 17.5 14.5 17.65 13.8L19 7.5H6.2"
                    stroke="#E11D48"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line x1="6" y1="8" x2="18.8" y2="8" stroke="#E11D48" strokeWidth="2.2" strokeLinecap="round" />
                  <circle cx="9.5" cy="18.8" r="1.6" fill="#E11D48" />
                  <circle cx="15.8" cy="18.8" r="1.6" fill="#E11D48" />
                </svg>
                Add to Cart
              </button>

              {/* Green "Enquiry" Button */}
              <button
                type="button"
                onClick={() => setEnquiryOpen(true)}
                className="h-[46px] px-7 rounded-[60px] bg-[#04940B] hover:bg-[#037A09] active:scale-[0.98] text-white text-[15px] font-medium flex items-center justify-center transition-all cursor-pointer shadow-xs whitespace-nowrap"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Enquiry
              </button>

              {/* Download Brochure Button */}
              {product.brochure_url ? (
                <a
                  href={product.brochure_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="h-[46px] px-6 rounded-[60px] border-2 border-[#04940B] text-[#04940B] hover:bg-[#04940B] hover:text-white active:scale-[0.98] text-[15px] font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download Brochure
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => alert("Brochure for this model will be available soon. Please click Enquiry to request specifications.")}
                  className="h-[46px] px-6 rounded-[60px] border-2 border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 active:scale-[0.98] text-[15px] font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                  title="No brochure uploaded yet"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download Brochure
                </button>
              )}
            </div>

            {/* Categories & Tags Metadata */}
            <div className="pt-4 border-t border-gray-100 text-xs sm:text-sm text-gray-500 space-y-1.5 font-roboto">
              <div>
                <span className="font-medium text-gray-700">Categories: </span>
                <span className="text-[#04940B]">
                  {product.category_name || "Deep Freezer"}
                  {product.tags ? `, ${product.tags}` : ""}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Tag: </span>
                <span className="text-gray-600">
                  {product.category_name ? `${product.category_name}s` : "Freezers"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* ENQUIRY MODAL (Interactive Popup)                          */}
      {/* ========================================================= */}
      {enquiryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setEnquiryOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setEnquiryOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm transition cursor-pointer"
            >
              ✕
            </button>

            {enquirySubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-[#04940B] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-gray-900">Enquiry Received!</h3>
                <p className="text-sm text-gray-600">
                  Thank you! Our sales team will get in touch with pricing and availability for{" "}
                  <span className="font-semibold text-gray-900">{product.name || product.model_no}</span> shortly.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-xs font-semibold text-[#04940B] uppercase tracking-wider block mb-1">
                    Direct Equipment Enquiry
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Enquire for {product.name || product.model_no}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Fill in your details below and our commercial sales consultant will contact you.
                  </p>
                </div>

                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={enquiryForm.phone}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="rahul@example.com"
                        value={enquiryForm.email}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nearest Showroom</label>
                    <select
                      value={enquiryForm.city}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
                    >
                      <option value="Kollam">Kollam Showroom</option>
                      <option value="Trivandrum">Trivandrum Showroom</option>
                      <option value="Kochi">Kochi Showroom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Message / Requirements</label>
                    <textarea
                      rows="3"
                      placeholder={`Please share price quote, warranty, and delivery schedule for ${product.model_no || product.name}...`}
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full h-[46px] rounded-[60px] bg-[#04940B] hover:bg-[#037A09] text-white font-semibold text-sm transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                    >
                      Submit Enquiry
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

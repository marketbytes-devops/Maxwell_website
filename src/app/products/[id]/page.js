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
      : [
          product.image_url,
          "/products/freezer/thumb_1.png",
          "/products/freezer/thumb_2.png",
          "/products/freezer/thumb_3.png",
          "/products/freezer/thumb_4.png",
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
              Not a member? Join now to shop.
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
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-roboto">
          <Link href="/" className="hover:text-[#04940B] transition">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#04940B] transition">Products</Link>
          <span>/</span>
          <span className="text-gray-400 capitalize">{product.category_name || "Equipment"}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.model_no || product.name}</span>
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
            <div className="w-full max-w-[560px] h-[340px] sm:h-[420px] bg-white rounded-2xl border border-gray-200/80 p-6 flex items-center justify-center shadow-xs overflow-hidden group">
              <img
                src={activeImage || product.image_url}
                alt={product.name}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                onError={(e) => {
                  e.currentTarget.src = "/products/freezer/main_view.png";
                }}
              />
            </div>

            {/* 4 Clickable Thumbnails Row (Matching Reference Image) */}
            <div className="w-full max-w-[560px] flex items-center justify-start sm:justify-center gap-3 sm:gap-4 mt-6 overflow-x-auto pb-2">
              {galleryList.slice(0, 4).map((imgUrl, index) => {
                const isActive = activeImage === imgUrl;
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
                      alt={`View ${index + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: MODEL TITLE, SPECIFICATIONS, ENQUIRY CTA   */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            {/* Product Model Heading (e.g. F450GL23) */}
            <h1
              className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1F2937] tracking-tight leading-tight mb-4"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              {product.model_no || product.name}
            </h1>

            {/* Subheading: Product Specification */}
            <h2
              className="text-lg sm:text-[20px] font-medium text-[#4B5563] mb-4"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              Product Specification:
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
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-gray-400 mt-2 mr-3 flex-shrink-0"></span>
                    <span className="min-w-[220px]">External Dimension (mm):</span>
                    <span className="font-medium text-gray-900">1360 (W) x 695 (D) x 882 (H)</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-gray-400 mt-2 mr-3 flex-shrink-0"></span>
                    <span className="min-w-[220px]">Gross volume:</span>
                    <span className="font-medium text-gray-900">422 Liters</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-gray-400 mt-2 mr-3 flex-shrink-0"></span>
                    <span className="min-w-[220px]">Temperature range (°C):</span>
                    <span className="font-medium text-gray-900">&lt; - 17.0°C</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-gray-400 mt-2 mr-3 flex-shrink-0"></span>
                    <span className="min-w-[220px]">No. of Baskets:</span>
                    <span className="font-medium text-gray-900">3</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-gray-400 mt-2 mr-3 flex-shrink-0"></span>
                    <span className="min-w-[220px]">Energy Star Rating :</span>
                    <span className="font-medium text-gray-900">3 Star</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons: Quantity Stepper, Add to Cart, and Enquiry */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              {/* Quantity Stepper (Clickable + Editable by Typing) */}
              <div className="flex items-center border border-gray-300 rounded-[60px] h-[46px] px-2 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, (Number(q) || 1) - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold text-base cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setQuantity("");
                    } else {
                      const num = parseInt(val, 10);
                      if (!isNaN(num)) {
                        setQuantity(Math.max(1, num));
                      }
                    }
                  }}
                  onBlur={() => {
                    if (!quantity || Number(quantity) < 1) {
                      setQuantity(1);
                    }
                  }}
                  className="w-12 text-center font-semibold text-gray-900 text-sm outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  aria-label="Quantity"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => (Number(q) || 1) + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold text-base cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={() => {
                  if (!product) return;
                  addToCart(product, Number(quantity) || 1);
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

      {/* 3. STORE LOCATIONS BAR (Kollam, Trivandrum, Kochi matching Reference) */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-10 mb-12">
        <div className="w-full bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {/* Kollam */}
            <div className="pt-4 md:pt-0 md:pr-6">
              <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2 font-poppins">
                Kollam
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-roboto">
                ST THOMAS SHOPPING COMPLEX, near Jawahar Balabhavan, Kadapakkada, Kollam, Kerala 691001
              </p>
            </div>

            {/* Trivandrum */}
            <div className="pt-4 md:pt-0 md:px-6">
              <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2 font-poppins">
                Trivandrum
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-roboto">
                Aaliya Tower, New, Karakkamandapam, Nemom, Thiruvananthapuram, Kerala 695020
              </p>
            </div>

            {/* Kochi */}
            <div className="pt-4 md:pt-0 md:pl-6">
              <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2 font-poppins">
                Kochi
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-roboto">
                Velleparambil House, Sastha Temple Road, Ernakulam – 682017, Kerala
              </p>
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
                  <span className="font-semibold text-gray-900">{product.model_no || product.name}</span> shortly.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-xs font-semibold text-[#04940B] uppercase tracking-wider block mb-1">
                    Direct Equipment Enquiry
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Enquire for {product.model_no || product.name}
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

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

// Default categories exactly matching Figma design Screenshot 1
const DESIGN_CATEGORIES = [
  { name: "Back Bar", defaultChevron: "right" },
  { name: "Deep Freezer", defaultChevron: "down" },
  { name: "Dishwasher", defaultChevron: "right" },
  { name: "Glass Washer", defaultChevron: "down" },
  { name: "Golden Confectionery Cabinet", defaultChevron: "right" },
  { name: "Ice Machine", defaultChevron: "down" },
  { name: "Pastry Cabinet", defaultChevron: "down" },
  { name: "Stainless Steel Refrigerators", defaultChevron: "right" },
  { name: "Storage Water Cooler", defaultChevron: "down" },
  { name: "Supermarket Range", defaultChevron: "right" },
  { name: "Vending Machine", defaultChevron: "down" },
  { name: "Visi Cooler", defaultChevron: "down" },
];

const PRICE_RANGES = [
  { id: "0-40", label: "0$ – 40$", min: 0, max: 40 },
  { id: "40-100", label: "40$ – 100$", min: 40, max: 100 },
  { id: "100-150", label: "100$ – 150$", min: 100, max: 150 },
  { id: "150-175", label: "150$ – 175$", min: 150, max: 175 },
  { id: "175-250", label: "175$ – 250$", min: 175, max: 250 },
  { id: "250-350", label: "250$ – 350$", min: 250, max: 350 },
];

// Fallback products with 3 distinct, high-quality images from src/assets/products
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: "Back Bar",
    model_no: "BB-3D-GLS",
    brand: "Maxsel",
    category_name: "Back Bar",
    image_url: "/products/back_bar_product.png",
    price: 340,
    specifications: [
      { spec_key: "External Dimension (mm)", spec_value: "1350 x 520 x 900" },
      { spec_key: "Gross Volume", spec_value: "330 L" },
      { spec_key: "Temperature Range", spec_value: "0°C ~ 10°C" },
      { spec_key: "Doors", spec_value: "Double Glazed Hinged Doors" },
    ],
  },
  {
    id: 2,
    name: "Coffee grinder",
    model_no: "CG-500-ESP",
    brand: "Maxsel",
    category_name: "Preparation Table",
    image_url: "/products/mixer_product.png",
    price: 120,
    specifications: [
      { spec_key: "Capacity", spec_value: "10 Litres" },
      { spec_key: "Motor Power", spec_value: "450 W" },
      { spec_key: "Speed Range", spec_value: "130 - 900 RPM" },
      { spec_key: "Transmission", spec_value: "Direct Gear Driven" },
    ],
  },
  {
    id: 3,
    name: "Velvet Covvered",
    model_no: "VC-880-BLK",
    brand: "Maxsel",
    category_name: "Pastry Cabinet",
    image_url: "/products/velvet_covered_clean.png",
    price: 280,
    specifications: [
      { spec_key: "External Dimension (mm)", spec_value: "900 x 750 x 1200" },
      { spec_key: "Gross Volume", spec_value: "380 L" },
      { spec_key: "Temperature Range", spec_value: "2°C ~ 8°C" },
      { spec_key: "Power Supply", spec_value: "220V / 50Hz" },
    ],
  },
  {
    id: 4,
    name: "Commercial Range",
    model_no: "CR-6B-OVEN",
    brand: "Maxsel",
    category_name: "Supermarket Range",
    image_url: "/products/range_product.png",
    price: 320,
    specifications: [
      { spec_key: "Burners", spec_value: "6 Heavy-Duty Cast Iron" },
      { spec_key: "Oven Capacity", spec_value: "GN 2/1 Standard" },
      { spec_key: "Gas Consumption", spec_value: "36 kW" },
      { spec_key: "Construction", spec_value: "AISI 304 Stainless Steel" },
    ],
  },
  {
    id: 5,
    name: "Combi Bakery Oven",
    model_no: "BO-TOUCH-10",
    brand: "Maxsel",
    category_name: "Pastry Cabinet",
    image_url: "/products/bakery_oven_product.png",
    price: 350,
    specifications: [
      { spec_key: "Trays Capacity", spec_value: "10 Trays (600x400 mm)" },
      { spec_key: "Control", spec_value: "Touchscreen Digital Display" },
      { spec_key: "Temperature Range", spec_value: "30°C ~ 260°C" },
      { spec_key: "Steam Generation", spec_value: "Direct Injection" },
    ],
  },
  {
    id: 6,
    name: "Commercial Dishwasher",
    model_no: "DW-HOOD-120",
    brand: "Maxsel",
    category_name: "Dishwasher",
    image_url: "/products/dishwash.png",
    price: 290,
    specifications: [
      { spec_key: "Rack Size", spec_value: "500 x 500 mm" },
      { spec_key: "Washing Cycle", spec_value: "60 / 90 / 120 sec" },
      { spec_key: "Boiler Capacity", spec_value: "7 Litres" },
      { spec_key: "Total Power", spec_value: "6.8 kW" },
    ],
  },
];

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [products, setProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cartToast, setCartToast] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  // Fetch products and categories dynamically from MySQL DB
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ]);

        if (prodRes.ok) {
          const pData = await prodRes.json();
          if (pData.success && Array.isArray(pData.products) && pData.products.length > 0) {
            setProducts(pData.products);
          } else {
            setProducts(FALLBACK_PRODUCTS);
          }
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }

        if (catRes.ok) {
          const cData = await catRes.json();
          if (cData.success && Array.isArray(cData.categories)) {
            setDbCategories(cData.categories);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Merge design categories with database categories seamlessly
  const categoryList = useMemo(() => {
    const list = [...DESIGN_CATEGORIES];
    const existingNames = new Set(list.map((c) => c.name.toLowerCase()));

    dbCategories.forEach((dbCat) => {
      if (!existingNames.has(dbCat.name.toLowerCase())) {
        list.push({
          name: dbCat.name,
          defaultChevron: "right",
        });
        existingNames.add(dbCat.name.toLowerCase());
      }
    });

    return list;
  }, [dbCategories]);

  // Handle Search Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  // Toggle Price Filter
  const togglePrice = (id) => {
    setSelectedPrices((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Wishlist toggle
  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  // Add to cart with feedback
  const handleAddToCart = (product) => {
    if (!product) return;
    addToCart(product, 1);
    setCartToast(`"${product.name}" added to enquiry cart!`);
    setTimeout(() => setCartToast(""), 3500);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    const result = products.filter((prod) => {
      // Category filter
      if (
        activeCategory !== "All" &&
        prod.category_name?.toLowerCase() !== activeCategory.toLowerCase()
      ) {
        return false;
      }

      // Search keyword filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = prod.name?.toLowerCase().includes(q);
        const matchModel = prod.model_no?.toLowerCase().includes(q);
        const matchCat = prod.category_name?.toLowerCase().includes(q);
        const matchBrand = prod.brand?.toLowerCase().includes(q);
        const matchTags = prod.tags?.toLowerCase().includes(q);
        if (!matchName && !matchModel && !matchCat && !matchBrand && !matchTags) {
          return false;
        }
      }

      // Price filter (if price ranges selected and item has a price)
      if (selectedPrices.length > 0 && prod.price !== undefined) {
        const matchesAnyRange = selectedPrices.some((rangeId) => {
          const range = PRICE_RANGES.find((r) => r.id === rangeId);
          if (!range) return false;
          return prod.price >= range.min && prod.price <= range.max;
        });
        if (!matchesAnyRange) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [products, activeCategory, searchQuery, selectedPrices, sortBy]);

  return (
    <div className="w-full bg-white flex flex-col min-h-screen">
      {/* 1. TOP SEARCH SECTION (Exact Measurements: 733px x 55.24px) */}
      <section className="w-full py-8 md:py-12 bg-white flex justify-center px-4">
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-[733px] flex flex-col sm:flex-row items-center gap-[6px]"
          style={{ minHeight: "55.24px" }}
        >
          {/* Input Box: 563px x 55px, border-radius 35px, border 1px solid #050019 */}
          <div className="w-full sm:w-[563px] h-[55px] rounded-[35px] border border-[#050019] px-5 flex items-center gap-3 bg-white transition-all focus-within:ring-2 focus-within:ring-[#04940B]/30">
            {/* Search Magnifying Glass Icon */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748B"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, models, categories..."
              className="w-full bg-transparent text-sm md:text-base text-[#0F172A] placeholder-gray-400 focus:outline-none"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-600 text-sm px-1 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Button: 164px x 55.24px, border-radius 60px, background #04940B */}
          <button
            type="submit"
            className="w-full sm:w-[164px] h-[55.24px] rounded-[60px] bg-[#04940B] hover:bg-[#037A09] active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer shadow-xs flex-shrink-0"
          >
            <span
              className="text-[#FFFFFF] text-[18px] font-medium leading-none"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Search
            </span>
          </button>
        </form>
      </section>

      {/* 2. BANNER SECTION (Exact Measurements: width max-w-[1745px], height 318.65px) */}
      <section className="w-full flex justify-center bg-[#0C1222] overflow-hidden mb-8 md:mb-14">
        <div
          className="w-full max-w-[1745px] h-[200px] sm:h-[260px] md:h-[318.65px] relative flex items-center justify-center bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: `url('/images/products_banner.png')`,
          }}
        >
          <h1 className="sr-only">
            Walk In Curious, Walk Out With Today’s Special Offer!
          </h1>
        </div>
      </section>

      {/* Toast Notification */}
      {cartToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-emerald-500/30 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#04940B]"></span>
          <span className="text-sm font-medium">{cartToast}</span>
        </div>
      )}

      {/* 3. MAIN CATALOG CONTAINER: Left Categories + Right Product Grid */}
      <section className="w-full max-w-[1728px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-[80px] pb-24">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-800"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
            </svg>
            Categories & Filter
          </button>
          <span className="text-sm text-gray-500 font-roboto">
            {filteredProducts.length} items
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 xl:gap-14 items-start">
          {/* ========================================================= */}
          {/* LEFT SIDEBAR: PRODUCT CATEGORY + PRICE FILTER            */}
          {/* ========================================================= */}
          <aside
            className={`w-full lg:w-[320px] flex-shrink-0 ${
              mobileFilterOpen ? "block" : "hidden lg:block"
            }`}
          >
            {/* PRODUCT CATEGORY Heading */}
            {/* Exact Specs: Roboto, 700 bold, 24px, 100% line-height, UPPERCASE, #323334, width: 236px, height: 28px */}
            <div className="mb-6">
              <h2
                className="font-bold text-[24px] uppercase tracking-normal"
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  lineHeight: "100%",
                  color: "#323334",
                  minWidth: "236px",
                  height: "28px",
                }}
              >
                PRODUCT CATEGORY
              </h2>
            </div>

            {/* "All Categories" Reset Button */}
            <div className="mb-3">
              <button
                type="button"
                onClick={() => setActiveCategory("All")}
                className={`w-full text-left py-2 px-2 rounded-lg text-[16px] font-medium transition-colors cursor-pointer flex items-center justify-between ${
                  activeCategory === "All"
                    ? "bg-[#04940B]/10 text-[#04940B] font-semibold"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                <span>All Categories</span>
                {activeCategory === "All" && (
                  <span className="w-2 h-2 rounded-full bg-[#04940B]"></span>
                )}
              </button>
            </div>

            {/* Category List */}
            {/* Exact Specs: Roboto, 400 regular, 20px, line-height 100%, capitalize, #323334 */}
            <ul className="space-y-4">
              {categoryList.map((cat, idx) => {
                const isActive =
                  activeCategory.toLowerCase() === cat.name.toLowerCase();

                return (
                  <li key={idx} className="border-b border-gray-100/60 pb-3">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveCategory((prev) =>
                          prev.toLowerCase() === cat.name.toLowerCase()
                            ? "All"
                            : cat.name
                        )
                      }
                      className="w-full flex items-center justify-between text-left group cursor-pointer transition-colors"
                    >
                      <span
                        className={`text-[20px] capitalize transition-colors leading-[100%] ${
                          isActive
                            ? "text-[#04940B] font-semibold"
                            : "text-[#323334] group-hover:text-[#04940B]"
                        }`}
                        style={{
                          fontFamily: "'Roboto', sans-serif",
                          lineHeight: "100%",
                        }}
                      >
                        {cat.name}
                      </span>

                      {/* Chevron Arrow */}
                      <span
                        className={`text-gray-400 group-hover:text-[#04940B] transition-transform ${
                          isActive ? "text-[#04940B]" : ""
                        }`}
                      >
                        {cat.defaultChevron === "down" ? (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        ) : (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* PRICE FILTER SECTION */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <h3
                className="font-bold text-[22px] text-[#323334] mb-4"
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  lineHeight: "100%",
                }}
              >
                Price
              </h3>

              <div className="space-y-3.5">
                {PRICE_RANGES.map((range) => {
                  const isChecked = selectedPrices.includes(range.id);

                  return (
                    <label
                      key={range.id}
                      className="flex items-center gap-3.5 cursor-pointer group select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => togglePrice(range.id)}
                        className="w-[18px] h-[18px] rounded border border-gray-300 text-[#04940B] focus:ring-[#04940B] cursor-pointer accent-[#04940B]"
                      />
                      <span
                        className="text-[17px] text-[#323334] group-hover:text-black transition-colors"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        {range.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* ========================================================= */}
          {/* RIGHT GRID: PRODUCT CARDS CATALOG                         */}
          {/* ========================================================= */}
          <main className="flex-1 w-full">
            {/* Top Bar inside Product catalog: Results count and Filter/Sort */}
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-500 font-roboto">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredProducts.length}
                </span>{" "}
                {filteredProducts.length === 1 ? "Product" : "Products"}
                {activeCategory !== "All" && (
                  <span className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#04940B]/10 text-[#04940B]">
                    {activeCategory}
                    <button
                      type="button"
                      onClick={() => setActiveCategory("All")}
                      className="hover:opacity-75"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>

              {/* Filter & Sort Control */}
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-gray-700 hidden sm:inline">
                  Filter & Sort
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs sm:text-sm font-medium bg-transparent border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#04940B]"
                >
                  <option value="featured">Featured</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                </select>
              </div>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && !loading && (
              <div className="w-full py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-lg font-medium text-gray-700 mb-2 font-roboto">
                  No products found matching your filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                    setSelectedPrices([]);
                  }}
                  className="text-sm font-semibold text-[#04940B] hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            )}

            {/* PRODUCT CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 xl:gap-8 justify-items-center">
              {filteredProducts.map((product) => {
                const isLiked = wishlist.includes(product.id);

                return (
                  /* ========================================================= */
                  /* PRODUCT CARD CONTAINER                                   */
                  /* Width: 389px, Height: 499px, radius: 12px, border: 1px #BBBBBB */
                  /* ========================================================= */
                  <div
                    key={product.id}
                    className="w-full max-w-[389px] h-[499px] bg-[#FFFFFF] rounded-[12px] border border-[#BBBBBB] p-4 sm:p-5 flex flex-col justify-between relative shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    {/* Top-Right Capsule Pill: Wishlist Pill with Divider and Heart */}
                    <div className="absolute top-4 right-4 z-10 flex items-center h-[32px] px-2.5 rounded-full border border-gray-200 bg-white/95 backdrop-blur-xs shadow-2xs">
                      {/* Vertical line divider inside pill */}
                      <span className="w-[1px] h-3.5 bg-gray-200 mr-2"></span>
                      {/* Heart Icon */}
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        className="text-gray-400 hover:text-red-500 active:scale-110 transition-all cursor-pointer"
                        title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill={isLiked ? "#EF4444" : "none"}
                          stroke={isLiked ? "#EF4444" : "#64748B"}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </button>
                    </div>

                    {/* Product Image Area: Clean centered product focus, clickable to inner page */}
                    <Link
                      href={`/products/${product.id}`}
                      className="w-full h-[320px] flex items-center justify-center mx-auto overflow-hidden my-auto p-2 cursor-pointer group"
                    >
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
                          onError={(e) => {
                            e.currentTarget.src = "/products/velvet_covered_clean.png";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg text-gray-300">
                          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                        </div>
                      )}
                    </Link>

                    {/* Product Name & Action Buttons Container */}
                    <div className="w-full space-y-3 pt-1">
                      {/* Product Name (Clickable to Inner Page) */}
                      {/* Exact Specs: Roboto, weight 500, size 24px, line-height 100% */}
                      <Link href={`/products/${product.id}`} className="block">
                        <h3
                          className="text-[22px] sm:text-[24px] font-medium text-[#000000] hover:text-[#04940B] transition-colors truncate leading-[100%]"
                          style={{
                            fontFamily: "'Roboto', sans-serif",
                            lineHeight: "100%",
                          }}
                          title={product.name}
                        >
                          {product.name}
                        </h3>
                      </Link>

                      {/* Action Buttons Row */}
                      {/* Perfectly fitted inside card without any right overflow */}
                      <div className="flex items-center gap-2.5 w-full pt-1">
                        {/* View details Link Button (Navigates to inner product page) */}
                        <Link
                          href={`/products/${product.id}`}
                          className="flex-[1.35] h-[42px] min-w-0 rounded-[60px] bg-[#04940B] hover:bg-[#037A09] active:scale-[0.98] text-white text-[14px] sm:text-[15px] font-medium flex items-center justify-center transition-all cursor-pointer shadow-xs px-2 whitespace-nowrap"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                          View details
                        </Link>

                        {/* Add to Cart Button */}
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 h-[42px] min-w-0 rounded-[60px] bg-[#000000] hover:bg-[#1f2937] active:scale-[0.98] text-white text-[14px] sm:text-[15px] font-medium flex items-center justify-center transition-all cursor-pointer shadow-xs px-2 whitespace-nowrap"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </section>

      {/* ========================================================= */}
      {/* QUICK VIEW DETAILS MODAL                                   */}
      {/* Displays all specifications and details saved from Admin   */}
      {/* ========================================================= */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm transition"
            >
              ✕
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Product Image */}
              <div className="w-full md:w-1/2 h-[260px] md:h-[320px] flex items-center justify-center bg-gray-50 rounded-xl p-4">
                <img
                  src={selectedProduct.image_url || "/products/velvet_covered_clean.png"}
                  alt={selectedProduct.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Product Information */}
              <div className="w-full md:w-1/2 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#04940B] uppercase tracking-wider mb-1">
                    {selectedProduct.category_name || "Commercial Equipment"}
                  </div>
                  <h2
                    className="text-2xl font-bold text-gray-900 mb-1"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  >
                    {selectedProduct.name}
                  </h2>
                  <p className="text-xs text-gray-500 mb-4 font-mono">
                    Model: {selectedProduct.model_no || "N/A"} | Brand: {selectedProduct.brand || "Maxsel"}
                  </p>

                  {/* Specifications Table */}
                  <div className="space-y-2 mb-6">
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-1">
                      Specifications
                    </h4>
                    {selectedProduct.specifications && selectedProduct.specifications.length > 0 ? (
                      <div className="space-y-1.5 text-xs">
                        {selectedProduct.specifications.map((spec, i) => (
                          <div key={i} className="flex justify-between py-1 border-b border-gray-50">
                            <span className="text-gray-500">{spec.spec_key}:</span>
                            <span className="font-medium text-gray-800">{spec.spec_value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No specifications listed.</p>
                    )}
                  </div>
                </div>

                {/* Modal Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 h-[42px] rounded-[60px] bg-[#04940B] hover:bg-[#037A09] text-white text-sm font-medium transition cursor-pointer flex items-center justify-center shadow-xs"
                  >
                    Add to Cart
                  </button>
                  {selectedProduct.brochure_url && (
                    <a
                      href={selectedProduct.brochure_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 h-[42px] rounded-[60px] border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium flex items-center justify-center transition"
                    >
                      Brochure
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {cartToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-[#E11D48] text-white flex items-center justify-center text-xs font-bold">
            ✓
          </div>
          <span className="text-sm font-medium">{cartToast}</span>
          <Link
            href="/cart"
            className="ml-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
          >
            View Cart →
          </Link>
        </div>
      )}
    </div>
  );
}

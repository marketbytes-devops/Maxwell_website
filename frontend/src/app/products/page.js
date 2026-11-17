"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const PRICE_RANGES = [
  { id: "0-40", label: "0$ – 40$", min: 0, max: 40 },
  { id: "40-100", label: "40$ – 100$", min: 40, max: 100 },
  { id: "100-150", label: "100$ – 150$", min: 100, max: 150 },
  { id: "150-175", label: "150$ – 175$", min: 150, max: 175 },
  { id: "175-250", label: "175$ – 250$", min: 175, max: 250 },
  { id: "250-350", label: "250$ – 350$", min: 250, max: 350 },
];

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  // Brands list from API
  const [brands, setBrands] = useState([]);
  // All categories tree from API
  const [allCategoriesTree, setAllCategoriesTree] = useState([]);

  // Selection states
  const [selectedBrandId, setSelectedBrandId] = useState(null); // null = All
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  const [selectedPrices, setSelectedPrices] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  // 1. Fetch Brands, All Categories Tree, and Products on Mount
  useEffect(() => {
    async function loadInitial() {
      try {
        const [bRes, cRes, pRes] = await Promise.all([
          fetch("/api/brands"),
          fetch("/api/categories?as_tree=true"),
          fetch("/api/products"),
        ]);
        if (bRes.ok) {
          const bData = await bRes.json();
          const rawBrands = bData.brands || [];
          // Sort brands so "Western" appears first
          const sortedBrands = [...rawBrands].sort((a, b) => {
            const aName = (a.name || "").toLowerCase();
            const bName = (b.name || "").toLowerCase();
            if (aName === "western") return -1;
            if (bName === "western") return 1;
            return aName.localeCompare(bName);
          });
          setBrands(sortedBrands);
        }
        if (cRes.ok) {
          const cData = await cRes.json();
          setAllCategoriesTree(cData.categories || []);
        }
        if (pRes.ok) {
          const pData = await pRes.json();
          setProducts(pData.products || []);
        }
      } catch (err) {
        console.error("Failed to load catalog data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, []);

  // Map categories grouped by Brand ID
  const categoriesByBrand = useMemo(() => {
    const map = {};
    for (const cat of allCategoriesTree) {
      const bId = cat.brand_id;
      if (!map[bId]) {
        map[bId] = [];
      }
      map[bId].push(cat);
    }
    return map;
  }, [allCategoriesTree]);

  // Handle clicking a Brand item in the list
  const handleBrandClick = (brandId) => {
    if (selectedBrandId === brandId) {
      // Collapse / unselect
      setSelectedBrandId(null);
      setActiveCategoryId(null);
    } else {
      setSelectedBrandId(brandId);
      setActiveCategoryId(null);
    }
  };

  // Toggle subcategory expansion
  const toggleSubcategoryExpand = (catId, e) => {
    e.stopPropagation();
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Helper: Get all descendant IDs of a category node
  const getSubcategoryIds = (catNode) => {
    let ids = [catNode.id];
    if (catNode.children && catNode.children.length > 0) {
      for (const child of catNode.children) {
        ids = ids.concat(getSubcategoryIds(child));
      }
    }
    return ids;
  };

  // Find targeted category IDs
  const targetCategoryIds = useMemo(() => {
    if (!activeCategoryId) return null;
    const findNode = (nodes) => {
      for (const n of nodes) {
        if (n.id === activeCategoryId) return n;
        if (n.children && n.children.length > 0) {
          const found = findNode(n.children);
          if (found) return found;
        }
      }
      return null;
    };
    const node = findNode(allCategoriesTree);
    return node ? getSubcategoryIds(node) : [activeCategoryId];
  }, [activeCategoryId, allCategoriesTree]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    const result = products.filter((prod) => {
      // 1. Filter by Brand
      if (selectedBrandId !== null) {
        const brandObj = brands.find((b) => b.id === selectedBrandId);
        const matchesBrandId = prod.brand_id === selectedBrandId;
        const matchesBrandName =
          brandObj &&
          (prod.brand || "").toLowerCase() === brandObj.name.toLowerCase();
        if (!matchesBrandId && !matchesBrandName) {
          return false;
        }
      }

      // 2. Filter by Category / Subcategory
      if (targetCategoryIds && targetCategoryIds.length > 0) {
        if (!targetCategoryIds.includes(prod.category_id)) {
          return false;
        }
      }

      // 3. Search keyword filter
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

      // 4. Price filter
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
  }, [
    products,
    selectedBrandId,
    brands,
    targetCategoryIds,
    searchQuery,
    selectedPrices,
    sortBy,
  ]);

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

  // Recursive Category Item Renderer (inside selected brand)
  const renderCategoryNode = (cat, depth = 0) => {
    const isSelected = activeCategoryId === cat.id;
    const hasChildren = cat.children && cat.children.length > 0;
    const isExpanded = !!expandedCategories[cat.id];

    return (
      <li key={cat.id} className="border-b border-gray-100/60 pb-2 last:border-b-0">
        <div
          onClick={(e) => {
            e.stopPropagation();
            setActiveCategoryId((prev) => (prev === cat.id ? null : cat.id));
          }}
          className={`w-full flex items-center justify-between text-left group cursor-pointer transition-colors py-1 ${
            depth > 0 ? "pl-" + Math.min(depth * 3, 6) : ""
          }`}
        >
          <span
            className={`capitalize transition-colors leading-[120%] flex items-center gap-1.5 ${
              depth === 0 ? "text-[16px]" : "text-[14px]"
            } ${
              isSelected
                ? "text-[#04940B] font-semibold"
                : "text-gray-700 group-hover:text-[#04940B]"
            }`}
            style={{ fontFamily: "'Roboto', sans-serif" }}
          >
            {depth > 0 && <span className="text-gray-300 font-mono text-xs">↳</span>}
            {cat.name}
          </span>

          {hasChildren && (
            <button
              type="button"
              onClick={(e) => toggleSubcategoryExpand(cat.id, e)}
              className="p-1 text-gray-400 hover:text-[#04940B] transition-transform"
              aria-label="Toggle subcategory"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          )}
        </div>

        {/* Subcategories (Level 2 & 3) */}
        {hasChildren && isExpanded && (
          <ul className="mt-1 space-y-1 pl-2 border-l border-gray-200/80 ml-2">
            {cat.children.map((child) => renderCategoryNode(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  // Selected brand name display
  const activeBrandName = useMemo(() => {
    if (selectedBrandId === null) return "All Brands";
    return brands.find((b) => b.id === selectedBrandId)?.name || "Brand";
  }, [selectedBrandId, brands]);

  return (
    <div className="w-full bg-white flex flex-col min-h-screen">
      {/* 1. TOP SEARCH SECTION */}
      <section className="w-full py-8 md:py-12 bg-white flex justify-center px-4">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full max-w-[733px] flex flex-col sm:flex-row items-center gap-[6px]"
          style={{ minHeight: "55.24px" }}
        >
          <div className="w-full sm:w-[563px] h-[55px] rounded-[35px] border border-[#050019] px-5 flex items-center gap-3 bg-white transition-all focus-within:ring-2 focus-within:ring-[#04940B]/30">
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

      {/* 2. BANNER SECTION */}
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
            Product Categories
          </button>
          <span className="text-sm text-gray-500 font-roboto">
            {filteredProducts.length} items
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 xl:gap-14 items-start">
          {/* ========================================================= */}
          {/* LEFT SIDEBAR: PRODUCT CATEGORY (BRAND ACCORDIONS)         */}
          {/* ========================================================= */}
          <aside
            className={`w-full lg:w-[320px] flex-shrink-0 ${
              mobileFilterOpen ? "block" : "hidden lg:block"
            }`}
          >
            {/* PRODUCT CATEGORY HEADING */}
            <div className="mb-5 flex items-center justify-between border-b border-gray-200 pb-3">
              <h2
                className="font-bold text-[22px] uppercase tracking-normal text-[#323334]"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                PRODUCT CATEGORY
              </h2>
              {(selectedBrandId !== null || activeCategoryId !== null) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBrandId(null);
                    setActiveCategoryId(null);
                  }}
                  className="text-xs text-[#04940B] hover:underline font-semibold"
                >
                  Reset
                </button>
              )}
            </div>

            {/* BRAND LIST ACCORDION */}
            <div className="space-y-3">
              {/* "All Brands / All Products" Option */}
              <button
                type="button"
                onClick={() => {
                  setSelectedBrandId(null);
                  setActiveCategoryId(null);
                }}
                className={`w-full text-left py-2.5 px-3 rounded-xl text-[16px] font-medium transition-all cursor-pointer flex items-center justify-between border ${
                  selectedBrandId === null
                    ? "bg-[#04940B]/10 text-[#04940B] font-semibold border-[#04940B]/30 shadow-2xs"
                    : "text-gray-700 hover:bg-gray-50 border-transparent"
                }`}
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                <span>All Brands &amp; Products</span>
                {selectedBrandId === null && (
                  <span className="w-2 h-2 rounded-full bg-[#04940B]"></span>
                )}
              </button>

              {/* Dynamic Brand items: Clicking a Brand opens its Categories */}
              {brands.map((b) => {
                const isBrandSelected = selectedBrandId === b.id;
                const brandCategories = categoriesByBrand[b.id] || [];

                return (
                  <div
                    key={b.id}
                    className={`rounded-xl border transition-all ${
                      isBrandSelected
                        ? "border-[#04940B]/30 bg-emerald-50/20 shadow-2xs"
                        : "border-gray-200/80 bg-white hover:border-gray-300"
                    }`}
                  >
                    {/* Brand Click Header */}
                    <button
                      type="button"
                      onClick={() => handleBrandClick(b.id)}
                      className="w-full p-3 flex items-center justify-between text-left group cursor-pointer transition-colors"
                    >
                      <span
                        className={`text-[18px] capitalize transition-colors leading-[100%] font-medium ${
                          isBrandSelected
                            ? "text-[#04940B] font-bold"
                            : "text-[#323334] group-hover:text-[#04940B]"
                        }`}
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        {b.name}
                      </span>

                      {/* Expand / Collapse Chevron */}
                      <span
                        className={`transition-transform duration-200 text-gray-400 group-hover:text-[#04940B] ${
                          isBrandSelected ? "text-[#04940B] rotate-180" : ""
                        }`}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </span>
                    </button>

                    {/* Categories under this Brand (Displayed when Brand is clicked) */}
                    {isBrandSelected && (
                      <div className="px-3 pb-3 pt-1 border-t border-gray-100">
                        {brandCategories.length === 0 ? (
                          <p className="text-xs text-gray-400 italic py-2">
                            No categories added under {b.name} yet.
                          </p>
                        ) : (
                          <ul className="space-y-1.5 mt-1">
                            {brandCategories.map((cat) => renderCategoryNode(cat, 0))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* PRICE FILTER SECTION */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <h3
                className="font-bold text-[20px] text-[#323334] mb-4"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Price
              </h3>

              <div className="space-y-3">
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
                        className="text-[16px] text-[#323334] group-hover:text-black transition-colors"
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
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-gray-200 gap-4">
              <div>
                <p className="text-gray-500 text-sm font-roboto">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {filteredProducts.length}
                  </span>{" "}
                  product{filteredProducts.length === 1 ? "" : "s"}
                  {selectedBrandId !== null && (
                    <span className="ml-1 text-[#04940B] font-medium">
                      for {activeBrandName}
                    </span>
                  )}
                </p>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-500 font-roboto">
                  Sort by:
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
                    setSelectedBrandId(null);
                    setActiveCategoryId(null);
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
                  <div
                    key={product.id}
                    className="w-full max-w-[389px] h-[499px] bg-[#FFFFFF] rounded-[12px] border border-[#BBBBBB] p-4 sm:p-5 flex flex-col justify-between relative shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    {/* Wishlist Pill */}
                    <div className="absolute top-4 right-4 z-10 flex items-center h-[32px] px-2.5 rounded-full border border-gray-200 bg-white/95 backdrop-blur-xs shadow-2xs">
                      <span className="w-[1px] h-3.5 bg-gray-200 mr-2"></span>
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

                    {/* Product Image */}
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
                      <Link
                        href={`/products/${product.id}`}
                        className="block cursor-pointer group"
                      >
                        <h3
                          className="font-medium text-[22px] text-[#323334] group-hover:text-[#04940B] transition-colors leading-[100%] line-clamp-1"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                          {product.name || product.model_no}
                        </h3>
                        {product.brand && (
                          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block mt-1">
                            {product.brand}
                          </span>
                        )}
                      </Link>

                      {/* Action Buttons: Add to Cart + Request a Quote */}
                      <div className="w-full flex items-center gap-[7px]">
                        <button
                          type="button"
                          onClick={() => addToCart(product, 1)}
                          className="w-[165px] h-[40px] rounded-[60px] bg-[#04940B] hover:bg-[#037A09] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                          </svg>
                          <span
                            className="text-[#FFFFFF] text-[13px] font-medium leading-none"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            Add to Cart
                          </span>
                        </button>

                        <Link
                          href={`/products/${product.id}`}
                          className="flex-1 h-[40px] rounded-[60px] border border-[#04940B] text-[#04940B] hover:bg-[#04940B]/5 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer shadow-xs"
                        >
                          <span
                            className="text-[13px] font-medium leading-none whitespace-nowrap"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            Request a Quote
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}

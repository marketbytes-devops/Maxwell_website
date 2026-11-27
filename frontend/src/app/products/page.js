"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const searchContainerRef = useRef(null);

  // 1. Fetch Brands, All Categories Tree, and Products on Mount
  useEffect(() => {
    async function loadInitial() {
      try {
        const timestamp = Date.now();
        const [bRes, cRes, pRes] = await Promise.allSettled([
          fetch(`/api/brands?t=${timestamp}`, { cache: "no-store" }).then((r) => (r.ok ? r.json() : Promise.reject(r))),
          fetch(`/api/categories?as_tree=true&t=${timestamp}`, { cache: "no-store" }).then((r) => (r.ok ? r.json() : Promise.reject(r))),
          fetch(`/api/products?t=${timestamp}`, { cache: "no-store" }).then((r) => (r.ok ? r.json() : Promise.reject(r))),
        ]);

        if (bRes.status === "fulfilled" && bRes.value?.brands) {
          const rawBrands = bRes.value.brands || [];
          const sortedBrands = [...rawBrands].sort((a, b) => {
            const aName = (a.name || "").toLowerCase();
            const bName = (b.name || "").toLowerCase();
            if (aName === "western") return -1;
            if (bName === "western") return 1;
            return aName.localeCompare(bName);
          });
          setBrands(sortedBrands);
        } else if (bRes.status === "rejected") {
          console.warn("Failed to load brands:", bRes.reason);
        }

        if (cRes.status === "fulfilled" && cRes.value?.categories) {
          setAllCategoriesTree(cRes.value.categories || []);
        } else if (cRes.status === "rejected") {
          console.warn("Failed to load categories:", cRes.reason);
        }

        if (pRes.status === "fulfilled" && pRes.value?.products) {
          setProducts(pRes.value.products || []);
        } else if (pRes.status === "rejected") {
          console.warn("Failed to load products:", pRes.reason);
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

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchDropdownOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsSearchDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Suggestions for live search dropdown
  const searchSuggestions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return products
      .filter((p) => {
        const matchName = p.name?.toLowerCase().includes(q);
        const matchModel = p.model_no?.toLowerCase().includes(q);
        const matchCat = p.category_name?.toLowerCase().includes(q);
        const matchBrand = p.brand?.toLowerCase().includes(q);
        const matchTags = p.tags?.toLowerCase().includes(q);
        return matchName || matchModel || matchCat || matchBrand || matchTags;
      })
      .slice(0, 8);
  }, [products, searchQuery]);

  // Handle selecting an item from the search dropdown
  const handleSelectSuggestion = (p) => {
    setSearchQuery(p.model_no || p.name);
    // If current selected brand or category filter excludes this product, reset them so it's visible in the catalog
    if (selectedBrandId !== null && p.brand_id && p.brand_id !== selectedBrandId) {
      setSelectedBrandId(null);
    }
    if (activeCategoryId !== null && p.category_id && !targetCategoryIds?.includes(p.category_id)) {
      setActiveCategoryId(null);
    }
    setIsSearchDropdownOpen(false);
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
          {/* LEFT SIDEBAR: PRODUCT CATEGORY (STICKY ON DESKTOP)        */}
          {/* ========================================================= */}
          <aside
            className={`w-full lg:w-[320px] flex-shrink-0 lg:sticky lg:top-[120px] lg:self-start lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2 ${
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

           
          </aside>

          {/* ========================================================= */}
          {/* RIGHT GRID: PRODUCT CARDS CATALOG                         */}
          {/* ========================================================= */}
          <main className="flex-1 w-full">
            {/* Top Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-6 border-b border-gray-200 gap-4">
              <div>
                <p className="text-gray-500 text-sm font-roboto flex items-center flex-wrap gap-1.5">
                  <span>
                    Showing{" "}
                    <span className="font-semibold text-gray-900">
                      {filteredProducts.length}
                    </span>{" "}
                    product{filteredProducts.length === 1 ? "" : "s"}
                  </span>
                  {selectedBrandId !== null && (
                    <span className="text-[#04940B] font-medium">
                      for {activeBrandName}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 bg-[#04940B]/10 text-[#04940B] text-xs font-medium px-2 py-0.5 rounded-full ml-1">
                      Filter: &ldquo;{searchQuery}&rdquo;
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="hover:text-red-500 cursor-pointer ml-0.5 text-xs font-bold leading-none"
                        title="Clear filter"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </p>
              </div>

              {/* Controls: Search Bar with Autocomplete Dropdown + Sort By */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Search Bar with Autocomplete Dropdown */}
                <div ref={searchContainerRef} className="relative w-full sm:w-[260px] md:w-[320px]">
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-gray-400 pointer-events-none">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsSearchDropdownOpen(true);
                      }}
                      onFocus={() => setIsSearchDropdownOpen(true)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setIsSearchDropdownOpen(false);
                        }
                      }}
                      placeholder="Search products or model..."
                      className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#04940B]/25 focus:border-[#04940B] transition-all shadow-2xs"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setIsSearchDropdownOpen(false);
                        }}
                        className="absolute right-2.5 text-gray-400 hover:text-gray-600 text-xs w-4 h-4 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
                        title="Clear search"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Autocomplete / Filter Dropdown */}
                  {isSearchDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-full sm:w-[360px] max-h-[380px] overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-200 z-50 py-1.5 divide-y divide-gray-100 animate-in fade-in slide-in-from-top-1 duration-150">
                      {searchQuery.trim().length > 0 ? (
                        searchSuggestions.length > 0 ? (
                          <>
                            <div className="px-3.5 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                              <span>Matching Products ({searchSuggestions.length})</span>
                              <span className="text-[10px] text-gray-400 font-normal">Click to filter</span>
                            </div>
                            <div className="divide-y divide-gray-50">
                              {searchSuggestions.map((p) => (
                                <div
                                  key={p.id}
                                  onClick={() => handleSelectSuggestion(p)}
                                  className="px-3.5 py-2 hover:bg-emerald-50/70 cursor-pointer flex items-center gap-3 transition-colors group"
                                >
                                  <div className="w-10 h-10 rounded-md bg-gray-50 border border-gray-200/60 p-1 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {p.image_url ? (
                                      <img
                                        src={p.image_url}
                                        alt={p.name}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                          e.currentTarget.src = "/products/velvet_covered_clean.png";
                                        }}
                                      />
                                    ) : (
                                      <span className="text-gray-300 text-xs">📦</span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <p className="text-xs sm:text-sm font-bold text-gray-900 truncate group-hover:text-[#04940B] transition-colors">
                                        {p.name || p.model_no}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                      {p.model_no && (
                                        <span className="text-[10px] font-mono font-semibold bg-emerald-50 text-[#04940B] px-1.5 py-0.2 rounded border border-emerald-200">
                                          {p.model_no}
                                        </span>
                                      )}
                                      {p.brand && (
                                        <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded">
                                          {p.brand}
                                        </span>
                                      )}
                                      {p.category_name && (
                                        <span className="text-[10px] text-gray-400 truncate max-w-[120px]">
                                          {p.category_name}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <Link
                                    href={`/products/${p.id}`}
                                    onClick={(e) => e.stopPropagation()}
                                    title="View full details"
                                    className="p-1 text-gray-400 hover:text-[#04940B] hover:bg-white rounded border border-transparent hover:border-gray-200 transition-colors flex-shrink-0"
                                  >
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    >
                                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                      <polyline points="15 3 21 3 21 9"></polyline>
                                      <line x1="10" y1="14" x2="21" y2="3"></line>
                                    </svg>
                                  </Link>
                                </div>
                              ))}
                            </div>
                            <div className="px-3.5 pt-2 pb-1 flex items-center justify-between text-xs text-gray-500 bg-gray-50/70">
                              <span className="text-[11px]">Filtering product grid in real-time</span>
                              <button
                                type="button"
                                onClick={() => setIsSearchDropdownOpen(false)}
                                className="text-[#04940B] hover:underline font-medium text-xs cursor-pointer"
                              >
                                Done
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="px-4 py-6 text-center text-gray-500">
                            <p className="text-xs font-semibold text-gray-700">No matching products found</p>
                            <p className="text-[11px] text-gray-400 mt-1">
                              No product matches &ldquo;{searchQuery}&rdquo;
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setSearchQuery("");
                                setIsSearchDropdownOpen(false);
                              }}
                              className="mt-2 text-xs font-medium text-[#04940B] hover:underline cursor-pointer"
                            >
                              Clear search
                            </button>
                          </div>
                        )
                      ) : (
                        <div className="px-3.5 py-3 text-xs text-gray-500">
                          <p className="font-semibold text-gray-700 mb-0.5">Quick Product Filter</p>
                          <p className="text-[11px] text-gray-400 mb-2.5">
                            Type any model number, product name, brand, or category.
                          </p>
                          {products.length > 0 && (
                            <div>
                              <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
                                Suggestions:
                              </span>
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {products.slice(0, 6).map((p) => (
                                  <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => handleSelectSuggestion(p)}
                                    className="text-[11px] font-medium bg-gray-100 hover:bg-emerald-50 hover:text-[#04940B] text-gray-700 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                                  >
                                    {p.model_no || p.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs sm:text-sm text-gray-500 font-roboto whitespace-nowrap">
                    Sort by:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-xs sm:text-sm font-medium bg-white border border-gray-200 rounded-lg px-2.5 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#04940B]/25 focus:border-[#04940B] cursor-pointer shadow-2xs"
                  >
                    <option value="featured">Featured</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                  </select>
                </div>
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
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
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
                          className="font-bold text-[20px] sm:text-[22px] text-[#323334] group-hover:text-[#04940B] transition-colors leading-[120%] line-clamp-1"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                          title={product.name || product.model_no}
                        >
                          {product.name || product.model_no}
                        </h3>
                        {product.model_no && product.name && product.model_no.toLowerCase() !== product.name.toLowerCase() ? (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-mono font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              {product.model_no}
                            </span>
                            {product.brand && (
                              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                                {product.brand}
                              </span>
                            )}
                          </div>
                        ) : product.brand ? (
                          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block mt-1">
                            {product.brand}
                          </span>
                        ) : null}
                      </Link>

                      {/* Action Buttons: Add to Cart + Request a Quote */}
                      <div className="w-full grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => addToCart(product, 1)}
                          className="w-full h-[40px] px-2 rounded-[60px] bg-[#04940B] hover:bg-[#037A09] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="flex-shrink-0"
                          >
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                          </svg>
                          <span
                            className="text-[#FFFFFF] text-[12px] sm:text-[13px] font-medium leading-none whitespace-nowrap"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            Add to Cart
                          </span>
                        </button>

                        <Link
                          href={`/products/${product.id}`}
                          className="w-full h-[40px] px-2 rounded-[60px] border border-[#04940B] text-[#04940B] hover:bg-[#04940B]/5 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer shadow-xs"
                        >
                          <span
                            className="text-[12px] sm:text-[13px] font-medium leading-none whitespace-nowrap"
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

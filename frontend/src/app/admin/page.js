"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Products table & pagination state
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [modelNoFilter, setModelNoFilter] = useState("");
  const [debouncedModelNo, setDebouncedModelNo] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const searchTimerRef = useRef(null);
  const modelTimerRef = useRef(null);

  // 1. Load high-level stats & brands on mount
  useEffect(() => {
    async function loadInitial() {
      try {
        setLoadingStats(true);
        const [dashRes, brandsRes] = await Promise.all([
          fetch("/api/admin/dashboard"),
          fetch("/api/admin/brands"),
        ]);

        if (dashRes.ok) {
          const dashData = await dashRes.json();
          setStats(dashData.stats || null);
        }

        if (brandsRes.ok) {
          const brandsData = await brandsRes.json();
          setBrands(brandsData.brands || []);
        }
      } catch (err) {
        console.error("Failed to load dashboard initial data:", err);
      } finally {
        setLoadingStats(false);
      }
    }
    loadInitial();
  }, []);

  // 2. Load categories when selectedBrandId changes
  useEffect(() => {
    async function loadCategories() {
      if (!selectedBrandId) {
        setCategories([]);
        setSelectedCategoryId("");
        return;
      }
      try {
        const res = await fetch(`/api/admin/categories?brand_id=${selectedBrandId}`);
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    loadCategories();
  }, [selectedBrandId]);

  // Debounce search input
  const handleSearchChange = (val) => {
    setSearchTerm(val);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 300);
  };

  // Debounce model number input
  const handleModelNoChange = (val) => {
    setModelNoFilter(val);
    if (modelTimerRef.current) clearTimeout(modelTimerRef.current);
    modelTimerRef.current = setTimeout(() => {
      setDebouncedModelNo(val);
      setPage(1);
    }, 300);
  };

  // 3. Fetch paginated & filtered products
  const fetchProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (debouncedSearch.trim()) params.append("search", debouncedSearch.trim());
      if (debouncedModelNo.trim()) params.append("model_no", debouncedModelNo.trim());
      if (selectedBrandId) params.append("brand_id", selectedBrandId);
      if (selectedCategoryId) params.append("category_id", selectedCategoryId);

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();

      setProducts(data.products || []);
      setTotalProducts(data.total || 0);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoadingProducts(false);
    }
  }, [page, limit, debouncedSearch, debouncedModelNo, selectedBrandId, selectedCategoryId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle Delete Product
  const handleDelete = async (id, model) => {
    if (!confirm(`Are you sure you want to delete product "${model}"?`)) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      await fetchProducts();

      // Refresh total count in stats
      setStats((prev) => (prev ? { ...prev, totalProducts: Math.max(0, prev.totalProducts - 1) } : prev));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setModelNoFilter("");
    setDebouncedModelNo("");
    setSelectedBrandId("");
    setSelectedCategoryId("");
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    searchTerm || modelNoFilter || selectedBrandId || selectedCategoryId
  );

  // Pagination page pills helper (shows current page and adjacent pages)
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="space-y-6 font-poppins max-w-7xl">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Products
            </p>
            <h3 className="text-2xl font-bold text-[#0F172A] mt-1">
              {stats?.totalProducts ?? totalProducts ?? 0}
            </h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#04940B] flex items-center justify-center font-bold">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
        </div>

        {/* Total Brands */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Brands
            </p>
            <h3 className="text-2xl font-bold text-[#0F172A] mt-1">
              {stats?.totalBrands ?? brands.length ?? 0}
            </h3>
          </div>
          <Link
            href="/admin/brands"
            className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition"
            title="Manage Brands"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </Link>
        </div>

        {/* Total Categories */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categories
            </p>
            <h3 className="text-2xl font-bold text-[#0F172A] mt-1">
              {stats?.totalCategories || 0}
            </h3>
          </div>
          <Link
            href="/admin/categories"
            className="w-11 h-11 rounded-xl bg-amber-50 text-[#F59E0B] hover:bg-amber-100 flex items-center justify-center transition"
            title="Manage Categories"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </Link>
        </div>

        {/* Quick Add Product Card */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] text-amber-400 font-medium uppercase tracking-wider">
              Quick Action
            </p>
            <p className="text-xs font-semibold mt-0.5">Upload Product</p>
          </div>
          <Link
            href="/admin/products/add"
            className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F172A] text-xs font-bold px-3 py-2 rounded-xl shadow-xs transition flex items-center gap-1"
          >
            <span>+ Add</span>
          </Link>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Table Header & Multi-Filter Toolbar */}
        <div className="p-5 border-b border-gray-100 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-800 text-base">
                Product Catalog Management
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {totalProducts} product{totalProducts === 1 ? "" : "s"} found {hasActiveFilters && "(Filtered)"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-xl transition cursor-pointer font-medium"
                >
                  ✕ Reset Filters
                </button>
              )}

              <Link
                href="/admin/products/add"
                className="bg-[#04940B] hover:bg-[#037A09] text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1 whitespace-nowrap shadow-xs"
              >
                + Add Product
              </Link>
            </div>
          </div>

          {/* Multi-Field Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {/* 1. Global Search (Model, Brand, Category, Specs, Tags) */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search all fields..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-9 pr-7 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#04940B]"
              />
              <svg className="absolute left-3 top-2.5 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* 2. Specific Model Number Filter */}
            <div className="relative">
              <input
                type="text"
                placeholder="Filter by Model No..."
                value={modelNoFilter}
                onChange={(e) => handleModelNoChange(e.target.value)}
                className="w-full pl-3 pr-7 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#04940B]"
              />
              {modelNoFilter && (
                <button
                  type="button"
                  onClick={() => handleModelNoChange("")}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* 3. Filter by Brand */}
            <div>
              <select
                value={selectedBrandId}
                onChange={(e) => {
                  setSelectedBrandId(e.target.value);
                  setSelectedCategoryId("");
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#04940B]"
              >
                <option value="">All Brands</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Filter by Category */}
            <div>
              <select
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setPage(1);
                }}
                disabled={!selectedBrandId || categories.length === 0}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#04940B] disabled:opacity-50"
              >
                <option value="">
                  {!selectedBrandId ? "Select a Brand first" : "All Categories"}
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rows Per Page selector bar */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
            <div className="flex items-center gap-2">
              <span>Show per page:</span>
              {[10, 15, 25, 50].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setLimit(num);
                    setPage(1);
                  }}
                  className={`px-2 py-0.5 rounded-md font-semibold cursor-pointer transition ${
                    limit === num
                      ? "bg-[#04940B] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            {totalProducts > 0 && (
              <span>
                Showing <strong className="text-gray-800">{(page - 1) * limit + 1}</strong> to{" "}
                <strong className="text-gray-800">{Math.min(page * limit, totalProducts)}</strong> of{" "}
                <strong className="text-gray-800">{totalProducts}</strong> products
              </span>
            )}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto relative">
          {loadingProducts && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs z-10 flex items-center justify-center">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#04940B]">
                <div className="w-5 h-5 border-2 border-[#04940B] border-t-transparent rounded-full animate-spin" />
                <span>Loading products...</span>
              </div>
            </div>
          )}

          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 border-b border-gray-100">
              <tr>
                <th className="py-3 px-5 font-semibold">Model / Product</th>
                <th className="py-3 px-5 font-semibold">Brand</th>
                <th className="py-3 px-5 font-semibold">Category Path</th>
                <th className="py-3 px-5 font-semibold">Technical Specs</th>
                <th className="py-3 px-5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 && !loadingProducts ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400 text-sm">
                    {hasActiveFilters
                      ? "No products found matching your active filters. Try resetting filters."
                      : "No products added yet. Click '+ Add Product' to start building your catalog."}
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition">
                    {/* Thumbnail + Model No (Main) */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              alt={p.model_no || p.name}
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <span className="text-[10px] text-gray-400">No Img</span>
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/products/${p.id}`}
                            target="_blank"
                            className="font-bold text-[#04940B] hover:underline transition text-sm flex items-center gap-1"
                            title="Preview on Storefront"
                          >
                            <span>{p.model_no || p.name}</span>
                            <span className="text-[10px] opacity-75">↗</span>
                          </Link>
                          {p.is_featured && (
                            <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-full border border-amber-200 mt-0.5 inline-block">
                              ★ Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 text-gray-700 font-medium">
                      {p.brand || "—"}
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-lg font-medium">
                        {p.category_path || p.category_name}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-xs text-gray-500">
                      {p.specifications && p.specifications.length > 0 ? (
                        <div className="space-y-0.5 max-w-[280px]">
                          {p.specifications.slice(0, 2).map((s, i) => (
                            <div key={i} className="truncate">
                              <span className="font-medium text-gray-700">{s.spec_key}:</span> {s.spec_value}
                            </div>
                          ))}
                          {p.specifications.length > 2 && (
                            <span className="text-[10px] text-gray-400">
                              +{p.specifications.length - 2} more specs
                            </span>
                          )}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <Link
                        href={`/products/${p.id}`}
                        target="_blank"
                        className="text-xs text-gray-600 hover:text-gray-900 font-semibold px-2.5 py-1 rounded-md hover:bg-gray-100 mr-2 transition"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/products/edit/${p.id}`}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2.5 py-1 rounded-md hover:bg-blue-50 mr-2 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.model_no || p.name)}
                        disabled={deletingId === p.id}
                        className="text-xs text-red-600 hover:text-red-800 font-semibold px-2.5 py-1 rounded-md hover:bg-red-50 transition cursor-pointer"
                      >
                        {deletingId === p.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50">
            <span className="text-xs text-gray-500">
              Page <strong className="text-gray-800">{page}</strong> of{" "}
              <strong className="text-gray-800">{totalPages}</strong>
            </span>

            <div className="flex items-center gap-1.5">
              {/* Previous Button */}
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
              >
                ← Previous
              </button>

              {/* Page Number Buttons */}
              {getPageNumbers().map((pNum) => (
                <button
                  key={pNum}
                  type="button"
                  onClick={() => setPage(pNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition cursor-pointer ${
                    page === pNum
                      ? "bg-[#04940B] text-white shadow-xs"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pNum}
                </button>
              ))}

              {/* Next Button */}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

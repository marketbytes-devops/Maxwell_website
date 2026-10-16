"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) throw new Error("Failed to load dashboard data");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDelete = async (id, model) => {
    if (!confirm(`Are you sure you want to delete product "${model}"?`)) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      await fetchDashboardData();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 font-poppins">
        <div className="w-8 h-8 border-3 border-[#04940B] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm">Loading catalog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 max-w-xl">
        <p className="font-semibold text-sm">Unable to load dashboard</p>
        <p className="text-xs mt-1">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-3 px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { stats, categories = [], recentProducts = [] } = data || {};

  const filteredProducts = recentProducts.filter((p) => {
    return (
      searchTerm === "" ||
      p.model_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category_name && p.category_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6 font-poppins max-w-7xl">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Products */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Products
            </p>
            <h3 className="text-3xl font-bold text-[#0F172A] mt-1">
              {stats?.totalProducts || 0}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#04940B] flex items-center justify-center font-bold">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
        </div>

        {/* Total Categories */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categories
            </p>
            <h3 className="text-3xl font-bold text-[#0F172A] mt-1">
              {stats?.totalCategories || 0}
            </h3>
          </div>
          <Link
            href="/admin/categories"
            className="w-12 h-12 rounded-xl bg-amber-50 text-[#F59E0B] hover:bg-amber-100 flex items-center justify-center transition"
            title="Manage Categories"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </Link>
        </div>

        {/* Quick Add Product Card */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-400 font-medium uppercase tracking-wider">
              Quick Action
            </p>
            <p className="text-sm font-semibold mt-1">Add to Catalog</p>
          </div>
          <Link
            href="/admin/products/add"
            className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F172A] text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <span>+ Add Product</span>
          </Link>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Table Controls */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-800 text-base">
              Products List
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"} found
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#04940B]"
              />
              <svg className="absolute left-3 top-2.5 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>

            <Link
              href="/admin/products/add"
              className="bg-[#04940B] hover:bg-[#037A09] text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1 whitespace-nowrap shadow-xs"
            >
              + Add Product
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 border-b border-gray-100">
              <tr>
                <th className="py-3 px-5 font-semibold">Model No</th>
                <th className="py-3 px-5 font-semibold">Title</th>
                <th className="py-3 px-5 font-semibold">Brand</th>
                <th className="py-3 px-5 font-semibold">Category</th>
                <th className="py-3 px-5 font-semibold">Specifications</th>
                <th className="py-3 px-5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400 text-sm">
                    No products added yet. Click &ldquo;Add Product&rdquo; to add your first product.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition">
                    <td className="py-3.5 px-5 font-bold text-[#04940B]">
                      {p.model_no}
                    </td>

                    <td className="py-3.5 px-5 font-medium text-gray-900">
                      {p.name}
                    </td>

                    <td className="py-3.5 px-5 text-gray-700">
                      {p.brand || "—"}
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                        {p.category_name}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-xs text-gray-500">
                      {p.specifications && p.specifications.length > 0 ? (
                        <div className="space-y-0.5">
                          {p.specifications.slice(0, 2).map((s, i) => (
                            <div key={i}>
                              <span className="font-medium text-gray-700">{s.spec_key}:</span> {s.spec_value}
                            </div>
                          ))}
                          {p.specifications.length > 2 && (
                            <span className="text-[10px] text-gray-400">
                              +{p.specifications.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleDelete(p.id, p.model_no)}
                        disabled={deletingId === p.id}
                        className="text-xs text-red-600 hover:text-red-800 font-semibold px-2.5 py-1 rounded-md hover:bg-red-50 transition"
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
      </div>
    </div>
  );
}

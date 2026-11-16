"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [seedDefaults, setSeedDefaults] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const loadBrands = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/brands");
      if (res.ok) {
        const data = await res.json();
        setBrands(data.brands || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setError("");
    setSuccessMsg("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          seed_defaults: seedDefaults,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || "Failed to add brand");

      setName("");
      setSuccessMsg(
        seedDefaults
          ? `Brand created and 13 default categories added under it!`
          : `Brand created!`
      );
      setTimeout(() => setSuccessMsg(""), 4000);
      await loadBrands();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (b) => {
    setEditingId(b.id);
    setEditName(b.name);
  };

  const handleSaveEdit = async (id) => {
    if (!editName.trim()) return;

    try {
      const res = await fetch(`/api/admin/brands/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });
      if (!res.ok) throw new Error("Failed to update brand");

      setEditingId(null);
      await loadBrands();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id, brandName) => {
    if (
      !confirm(
        `Delete brand "${brandName}"? This will also remove all categories and subcategories under this brand.`
      )
    )
      return;

    try {
      const res = await fetch(`/api/admin/brands/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete brand");
      await loadBrands();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSeedDefaultsForBrand = async (brandId, brandName) => {
    try {
      const res = await fetch(`/api/admin/brands/${brandId}/seed-defaults`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to seed default categories");
      setSuccessMsg(data.message || `Seeded default categories for ${brandName}`);
      setTimeout(() => setSuccessMsg(""), 3500);
      await loadBrands();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 font-poppins">
      <div>
        <h2 className="text-2xl font-bold text-[#0F172A]">Brands Management</h2>
        <p className="text-sm text-gray-500 mt-1">
          Add and manage commercial equipment brands. Each brand holds its own 13 main categories and nested subcategories.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-[#04940B] rounded-xl text-sm font-medium">
          {successMsg}
        </div>
      )}

      {/* Add Brand Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              placeholder="Enter brand name (e.g. Western, Butler, Hoshizaki, Maxsel)..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#04940B] hover:bg-[#037A09] text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              {submitting ? "Adding..." : "+ Create Brand"}
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={seedDefaults}
              onChange={(e) => setSeedDefaults(e.target.checked)}
              className="rounded text-[#04940B] focus:ring-[#04940B]"
            />
            <span>
              Automatically populate the <strong>13 standard categories</strong> under this new brand (Visi Cooler, Deep Freezer, Back Bar, etc.)
            </span>
          </label>
        </form>
      </div>

      {/* Brands List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 text-sm">All Brands</h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
            {brands.length} Total
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400">Loading brands...</div>
        ) : brands.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">No brands added yet.</div>
        ) : (
          <ul className="divide-y divide-gray-100 text-sm">
            {brands.map((b) => (
              <li
                key={b.id}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/70 transition"
              >
                {editingId === b.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
                    />
                    <button
                      onClick={() => handleSaveEdit(b.id)}
                      className="px-3 py-1.5 bg-[#04940B] text-white text-xs font-semibold rounded-lg hover:bg-[#037A09]"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-base">{b.name}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-[#04940B] font-medium border border-emerald-100">
                          {b.category_count || 0} Categories
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-100">
                          {b.product_count || 0} Products
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/admin/categories?brandId=${b.id}`}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-3 py-1.5 rounded-lg transition"
                      >
                        Manage Categories →
                      </Link>

                      {(!b.category_count || b.category_count === 0) && (
                        <button
                          onClick={() => handleSeedDefaultsForBrand(b.id, b.name)}
                          className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 font-medium px-2.5 py-1.5 rounded-lg transition"
                          title="Generate 13 default categories"
                        >
                          + Seed 13 Categories
                        </button>
                      )}

                      <button
                        onClick={() => handleStartEdit(b)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 rounded-md hover:bg-blue-50 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(b.id, b.name)}
                        className="text-xs text-red-600 hover:text-red-800 font-semibold px-2 py-1 rounded-md hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

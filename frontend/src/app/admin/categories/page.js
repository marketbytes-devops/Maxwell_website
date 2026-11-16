"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CategoriesPage() {
  const searchParams = useSearchParams();
  const initialBrandId = searchParams.get("brandId");

  const [brands, setBrands] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState(
    initialBrandId ? Number(initialBrandId) : null
  );
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Category Form state
  const [mainName, setMainName] = useState("");
  const [capacityNote, setCapacityNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Quick subcategory modal/inline state
  const [addingSubUnder, setAddingSubUnder] = useState(null); // Category object
  const [subName, setSubName] = useState("");
  const [subCapacityNote, setSubCapacityNote] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCapacity, setEditCapacity] = useState("");

  const loadBrands = async () => {
    try {
      const res = await fetch("/api/admin/brands");
      if (res.ok) {
        const data = await res.json();
        const list = data.brands || [];
        setBrands(list);
        if (!selectedBrandId && list.length > 0) {
          setSelectedBrandId(list[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadCategories = async (brandId) => {
    if (!brandId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/categories?brand_id=${brandId}&as_tree=true`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
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

  useEffect(() => {
    if (selectedBrandId) {
      loadCategories(selectedBrandId);
    }
  }, [selectedBrandId]);

  const handleAddMainCategory = async (e) => {
    e.preventDefault();
    if (!mainName.trim() || !selectedBrandId) return;

    setError("");
    setSuccessMsg("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand_id: selectedBrandId,
          name: mainName.trim(),
          capacity_note: capacityNote.trim(),
          parent_id: null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || "Failed to add category");

      setMainName("");
      setCapacityNote("");
      setSuccessMsg("Main category added successfully!");
      setTimeout(() => setSuccessMsg(""), 3500);
      await loadCategories(selectedBrandId);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    if (!subName.trim() || !addingSubUnder) return;

    setError("");
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand_id: addingSubUnder.brand_id,
          parent_id: addingSubUnder.id,
          name: subName.trim(),
          capacity_note: subCapacityNote.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || "Failed to add subcategory");

      setAddingSubUnder(null);
      setSubName("");
      setSubCapacityNote("");
      setSuccessMsg(`Subcategory added under ${addingSubUnder.name}!`);
      setTimeout(() => setSuccessMsg(""), 3500);
      await loadCategories(selectedBrandId);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStartEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditCapacity(cat.capacity_note || "");
  };

  const handleSaveEdit = async (id) => {
    if (!editName.trim()) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          capacity_note: editCapacity.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to update category");

      setEditingId(null);
      await loadCategories(selectedBrandId);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id, catName) => {
    if (
      !confirm(
        `Delete "${catName}"? Warning: All subcategories and sub-subcategories inside it will also be permanently deleted!`
      )
    )
      return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
      await loadCategories(selectedBrandId);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSeedDefaults = async () => {
    if (!selectedBrandId) return;
    try {
      const res = await fetch(`/api/admin/brands/${selectedBrandId}/seed-defaults`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to seed categories");
      setSuccessMsg(data.message);
      setTimeout(() => setSuccessMsg(""), 3500);
      await loadCategories(selectedBrandId);
    } catch (err) {
      alert(err.message);
    }
  };

  const selectedBrand = useMemo(() => {
    return brands.find((b) => b.id === selectedBrandId);
  }, [brands, selectedBrandId]);

  // Recursive Tree Node Renderer
  const renderCategoryNode = (cat, depth = 1) => {
    const isLevel1 = depth === 1;
    const isLevel2 = depth === 2;
    const isLevel3 = depth >= 3;

    const levelBadge = isLevel1
      ? "Level 1: Main Category"
      : isLevel2
      ? "Level 2: Subcategory"
      : "Level 3: Sub-subcategory";

    const badgeColor = isLevel1
      ? "bg-emerald-50 text-[#04940B] border-emerald-200"
      : isLevel2
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-purple-50 text-purple-700 border-purple-200";

    const indentClass = isLevel1
      ? "pl-4 sm:pl-6"
      : isLevel2
      ? "pl-8 sm:pl-12 bg-gray-50/40"
      : "pl-12 sm:pl-18 bg-gray-50/80";

    return (
      <div key={cat.id} className="border-b border-gray-100 last:border-b-0">
        <div
          className={`py-3.5 pr-4 sm:pr-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${indentClass}`}
        >
          {editingId === cat.id ? (
            <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Category Name"
                className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
              />
              <input
                type="text"
                value={editCapacity}
                onChange={(e) => setEditCapacity(e.target.value)}
                placeholder="Capacity Note (optional)"
                className="w-full sm:w-48 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSaveEdit(cat.id)}
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
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2.5 flex-wrap">
                {depth > 1 && (
                  <span className="text-gray-300 font-mono text-xs select-none">
                    {depth === 2 ? "↳" : "└──"}
                  </span>
                )}
                <span className="font-semibold text-gray-900 text-sm">{cat.name}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${badgeColor}`}
                >
                  {levelBadge}
                </span>
                {cat.capacity_note && (
                  <span className="text-xs text-gray-400 italic">({cat.capacity_note})</span>
                )}
                {cat.product_count > 0 && (
                  <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {cat.product_count} products
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {depth < 3 && (
                  <button
                    onClick={() => {
                      setAddingSubUnder(cat);
                      setSubName("");
                      setSubCapacityNote("");
                    }}
                    className="text-xs bg-[#04940B]/10 hover:bg-[#04940B]/20 text-[#04940B] font-semibold px-2.5 py-1 rounded-md transition"
                  >
                    + Add Subcategory
                  </button>
                )}
                <button
                  onClick={() => handleStartEdit(cat)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>

        {/* Children Subcategories */}
        {cat.children && cat.children.length > 0 && (
          <div className="border-t border-gray-100/70">
            {cat.children.map((child) => renderCategoryNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl space-y-6 font-poppins">
      <div>
        <h2 className="text-2xl font-bold text-[#0F172A]">Categories & Subcategories</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage brand-specific categories, subcategories, and nested subcategories.
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

      {/* Brand Selector Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
            Current Brand:
          </label>
          <select
            value={selectedBrandId || ""}
            onChange={(e) => setSelectedBrandId(Number(e.target.value))}
            className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#04940B]"
          >
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.category_count || 0} categories)
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {categories.length === 0 && (
            <button
              onClick={handleSeedDefaults}
              className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold px-4 py-2 rounded-xl transition"
            >
              + Populate 13 Default Categories
            </button>
          )}
          <Link
            href="/admin/brands"
            className="text-xs text-gray-600 hover:text-gray-900 font-medium px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
          >
            Manage Brands
          </Link>
        </div>
      </div>

      {/* Add Main Category Form (Level 1 under current brand) */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">
          + Add New Main Category for {selectedBrand?.name || "Selected Brand"}
        </h3>
        <form onSubmit={handleAddMainCategory} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="Main Category Name (e.g. Deep Freezer, Visi Cooler, Combi Oven)..."
            value={mainName}
            onChange={(e) => setMainName(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
          />
          <input
            type="text"
            placeholder="Capacity Note (optional, e.g. 70 to 720 Liters)..."
            value={capacityNote}
            onChange={(e) => setCapacityNote(e.target.value)}
            className="w-full sm:w-64 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#04940B]"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#04940B] hover:bg-[#037A09] text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow-xs transition cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            {submitting ? "Adding..." : "+ Add Category"}
          </button>
        </form>
      </div>

      {/* Quick Add Subcategory Modal / Drawer */}
      {addingSubUnder && (
        <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-blue-900 text-sm">
              Add Subcategory under: <span className="underline">{addingSubUnder.name}</span>
            </h4>
            <button
              onClick={() => setAddingSubUnder(null)}
              className="text-xs text-gray-500 hover:text-gray-800"
            >
              ✕ Close
            </button>
          </div>
          <form onSubmit={handleAddSubcategory} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              placeholder="Subcategory Name (e.g. Glass Top, Solid Top, Single Door)..."
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
              className="flex-1 px-4 py-2 bg-white border border-blue-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              autoFocus
            />
            <input
              type="text"
              placeholder="Capacity / Spec Note (optional)..."
              value={subCapacityNote}
              onChange={(e) => setSubCapacityNote(e.target.value)}
              className="w-full sm:w-56 px-4 py-2 bg-white border border-blue-200 rounded-xl text-xs"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl text-sm transition"
            >
              Save Subcategory
            </button>
          </form>
        </div>
      )}

      {/* Categories Tree Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 text-sm">
            Categories & Subcategories ({selectedBrand?.name || "Brand"})
          </h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
            {categories.length} Main Categories
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400 space-y-3">
            <p>No categories found for this brand.</p>
            <button
              onClick={handleSeedDefaults}
              className="text-xs bg-[#04940B] text-white px-4 py-2 rounded-xl font-medium"
            >
              Populate 13 Standard Categories Now
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {categories.map((cat) => renderCategoryNode(cat, 1))}
          </div>
        )}
      </div>
    </div>
  );
}

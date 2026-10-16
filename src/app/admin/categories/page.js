"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/categories");
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
    loadCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add category");

      setName("");
      await loadCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleSaveEdit = async (id) => {
    if (!editName.trim()) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });
      if (!res.ok) throw new Error("Failed to update category");

      setEditingId(null);
      await loadCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id, catName) => {
    if (!confirm(`Delete category "${catName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
      await loadCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 font-poppins">
      <div>
        <h2 className="text-2xl font-bold text-[#0F172A]">Categories</h2>
        <p className="text-sm text-gray-500 mt-1">
          Add, edit, or remove product categories.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Add Category Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="Enter category name (e.g. Counter Top, Bakery Ovens)..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#04940B] hover:bg-[#037A09] text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Adding..." : "+ Add Category"}
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 text-sm">All Categories</h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
            {categories.length} Total
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">No categories added yet.</div>
        ) : (
          <ul className="divide-y divide-gray-100 text-sm">
            {categories.map((cat) => (
              <li key={cat.id} className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-gray-50/70 transition">
                {editingId === cat.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
                    />
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
                ) : (
                  <>
                    <span className="font-medium text-gray-800">{cat.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEdit(cat)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2.5 py-1 rounded-md hover:bg-blue-50 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="text-xs text-red-600 hover:text-red-800 font-semibold px-2.5 py-1 rounded-md hover:bg-red-50 transition"
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

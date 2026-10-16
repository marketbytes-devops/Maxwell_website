"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form State
  const [modelNo, setModelNo] = useState("");
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [brochureUrl, setBrochureUrl] = useState("");

  // Quick add inline feedback
  const [quickCatMsg, setQuickCatMsg] = useState("");
  const [quickBrandMsg, setQuickBrandMsg] = useState("");

  // Specifications
  const [specs, setSpecs] = useState([
    { key: "External Dimension (mm)", value: "" },
    { key: "Gross Volume", value: "" },
    { key: "Temperature Range", value: "" },
    { key: "No. of Shelves", value: "" },
    { key: "Power Supply", value: "" },
  ]);

  // Load categories and brands from MySQL
  const loadOptions = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch("/api/admin/brands"),
      ]);

      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.categories || []);
      }
      if (brandRes.ok) {
        const brandData = await brandRes.json();
        setBrands(brandData.brands || []);
      }
    } catch (err) {
      console.error("Failed to load options:", err);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  // Quick Add Brand from input
  const handleQuickAddBrand = async () => {
    if (!brand.trim()) {
      setQuickBrandMsg("Type a brand name first");
      setTimeout(() => setQuickBrandMsg(""), 2000);
      return;
    }

    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: brand.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setQuickBrandMsg("Brand added!");
      await loadOptions();
      setTimeout(() => setQuickBrandMsg(""), 2000);
    } catch (err) {
      setQuickBrandMsg(err.message);
      setTimeout(() => setQuickBrandMsg(""), 2500);
    }
  };

  // Quick Add Category from input
  const handleQuickAddCategory = async () => {
    if (!categoryName.trim()) {
      setQuickCatMsg("Type a category name first");
      setTimeout(() => setQuickCatMsg(""), 2000);
      return;
    }

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setQuickCatMsg("Category added!");
      await loadOptions();
      setTimeout(() => setQuickCatMsg(""), 2000);
    } catch (err) {
      setQuickCatMsg(err.message);
      setTimeout(() => setQuickCatMsg(""), 2500);
    }
  };

  const handleSpecChange = (index, field, val) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const addCustomSpec = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const removeSpec = (index) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!modelNo.trim()) {
      setError("Please provide a Model Number");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_no: modelNo.trim(),
          name: productName.trim() || modelNo.trim(),
          brand: brand.trim() || "Maxsel",
          category_name: categoryName.trim() || "General",
          tags: tags.trim(),
          image_url: imageUrl.trim(),
          brochure_url: brochureUrl.trim(),
          is_featured: false,
          specifications: specs.filter((s) => s.key.trim() && s.value.trim()),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to save product");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin");
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-poppins pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Add New Product</h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the model details, brand, category, and specifications.
          </p>
        </div>
        <Link
          href="/admin"
          className="text-xs font-semibold px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition"
        >
          Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
          Product saved successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm border-b border-gray-100 pb-2">
            Product Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Model Number */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Model Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CPS30HC-GLGY"
                value={modelNo}
                onChange={(e) => setModelNo(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
              />
            </div>

            {/* Product Title */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Product Name / Title
              </label>
              <input
                type="text"
                placeholder="e.g. Counter Top Cooler"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
              />
            </div>

            {/* Brand with Type + Add Button */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-700">
                  Brand Name
                </label>
                {quickBrandMsg && (
                  <span className="text-[11px] text-emerald-600 font-medium">
                    {quickBrandMsg}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  list="brand-options"
                  placeholder="Type or select brand..."
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
                />
                <datalist id="brand-options">
                  {brands.map((b) => (
                    <option key={b.id} value={b.name} />
                  ))}
                </datalist>
                <button
                  type="button"
                  onClick={handleQuickAddBrand}
                  title="Add brand to database"
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-[#04940B] hover:text-white text-gray-700 flex items-center justify-center font-bold text-lg transition flex-shrink-0 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Category with Type + Add Button */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-700">
                  Category *
                </label>
                {quickCatMsg && (
                  <span className="text-[11px] text-emerald-600 font-medium">
                    {quickCatMsg}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  list="category-options"
                  placeholder="Type or select category..."
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
                />
                <datalist id="category-options">
                  {categories.map((c) => (
                    <option key={c.id} value={c.name} />
                  ))}
                </datalist>
                <button
                  type="button"
                  onClick={handleQuickAddCategory}
                  title="Add category to database"
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-[#04940B] hover:text-white text-gray-700 flex items-center justify-center font-bold text-lg transition flex-shrink-0 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Tags (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Counter Top, Cooler, Mini Fridge"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
            />
          </div>
        </div>

        {/* Specifications Matrix */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="font-semibold text-gray-800 text-sm">
              Product Specifications
            </h3>
            <button
              type="button"
              onClick={addCustomSpec}
              className="text-xs font-semibold text-[#04940B] hover:underline"
            >
              + Add Field
            </button>
          </div>

          <div className="space-y-3">
            {specs.map((spec, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Field (e.g. Gross Volume)"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                  className="w-5/12 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#04940B]"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 34.5 L)"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#04940B]"
                />
                <button
                  type="button"
                  onClick={() => removeSpec(index)}
                  className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center text-sm"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Media & Brochure Links */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm border-b border-gray-100 pb-2">
            Media & Brochure (Optional)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Image URL
              </label>
              <input
                type="text"
                placeholder="e.g. /products/preparation_systems.webp"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#04940B]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Brochure Link (PDF URL)
              </label>
              <input
                type="text"
                placeholder="e.g. https://.../brochure.pdf"
                value={brochureUrl}
                onChange={(e) => setBrochureUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#04940B]"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#04940B] hover:bg-[#037A09] text-white font-semibold px-8 py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Product"}
          </button>
          <Link
            href="/admin"
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

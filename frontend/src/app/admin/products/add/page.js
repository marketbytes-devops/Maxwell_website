"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DEFAULT_SPEC_KEYS = [
  "External Dimension (mm)",
  "Gross Volume",
  "Temperature Range",
  "No. of Shelves / Baskets",
  "Power Supply / Voltage",
];

const createEmptyProduct = () => ({
  id: Date.now() + Math.random(),
  model_no: "",
  name: "",
  description: "",
  tags: "",
  brochure_url: "",
  is_featured: false,
  uploadedImages: [], // [{ url, is_primary }]
  uploading: false,
  uploadError: "",
  specs: DEFAULT_SPEC_KEYS.map((k) => ({ key: k, value: "" })),
});

export default function AddProductPage() {
  const router = useRouter();

  const [brands, setBrands] = useState([]);
  const [categoriesTree, setCategoriesTree] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Cascading Brand & Category selection (Shared by all products added in this session)
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [selectedLevel1Id, setSelectedLevel1Id] = useState("");
  const [selectedLevel2Id, setSelectedLevel2Id] = useState("");
  const [selectedLevel3Id, setSelectedLevel3Id] = useState("");

  // Multi-Product list state
  const [productsList, setProductsList] = useState([createEmptyProduct()]);

  // Hidden file inputs refs for each product card
  const fileInputRefs = useRef({});

  // 1. Load Brands on mount
  useEffect(() => {
    async function loadBrands() {
      try {
        const res = await fetch("/api/admin/brands");
        if (res.ok) {
          const data = await res.json();
          const list = data.brands || [];
          setBrands(list);
          if (list.length > 0) {
            setSelectedBrandId(String(list[0].id));
          }
        }
      } catch (err) {
        console.error("Failed to load brands:", err);
      }
    }
    loadBrands();
  }, []);

  // 2. When selectedBrandId changes, fetch categories tree for that brand
  useEffect(() => {
    if (!selectedBrandId) {
      setCategoriesTree([]);
      setSelectedLevel1Id("");
      setSelectedLevel2Id("");
      setSelectedLevel3Id("");
      return;
    }

    async function loadBrandCategories() {
      try {
        const res = await fetch(`/api/admin/categories?brand_id=${selectedBrandId}&as_tree=true`);
        if (res.ok) {
          const data = await res.json();
          const tree = data.categories || [];
          setCategoriesTree(tree);
          if (tree.length > 0) {
            setSelectedLevel1Id(String(tree[0].id));
          } else {
            setSelectedLevel1Id("");
          }
          setSelectedLevel2Id("");
          setSelectedLevel3Id("");
        }
      } catch (err) {
        console.error("Failed to load categories for brand:", err);
      }
    }
    loadBrandCategories();
  }, [selectedBrandId]);

  // Cascading category levels
  const level1Category = useMemo(() => {
    return categoriesTree.find((c) => String(c.id) === String(selectedLevel1Id)) || null;
  }, [categoriesTree, selectedLevel1Id]);

  const level2Options = useMemo(() => {
    return level1Category?.children || [];
  }, [level1Category]);

  const level2Category = useMemo(() => {
    return level2Options.find((c) => String(c.id) === String(selectedLevel2Id)) || null;
  }, [level2Options, selectedLevel2Id]);

  const level3Options = useMemo(() => {
    return level2Category?.children || [];
  }, [level2Category]);

  const handleLevel1Change = (val) => {
    setSelectedLevel1Id(val);
    setSelectedLevel2Id("");
    setSelectedLevel3Id("");
  };

  const handleLevel2Change = (val) => {
    setSelectedLevel2Id(val);
    setSelectedLevel3Id("");
  };

  const activeSelectedCategory = useMemo(() => {
    if (selectedLevel3Id) {
      return level3Options.find((c) => String(c.id) === String(selectedLevel3Id)) || null;
    }
    if (selectedLevel2Id) {
      return level2Category;
    }
    return level1Category;
  }, [selectedLevel3Id, level3Options, selectedLevel2Id, level2Category, level1Category]);

  const categoryPathPreview = useMemo(() => {
    const brandObj = brands.find((b) => String(b.id) === String(selectedBrandId));
    const parts = [
      brandObj?.name,
      level1Category?.name,
      level2Category?.name,
      selectedLevel3Id ? level3Options.find((c) => String(c.id) === String(selectedLevel3Id))?.name : null,
    ];
    return parts.filter(Boolean).join(" > ");
  }, [brands, selectedBrandId, level1Category, level2Category, selectedLevel3Id, level3Options]);

  // Product items handlers
  const updateProductField = (pIdx, field, val) => {
    setProductsList((prev) => {
      const next = [...prev];
      next[pIdx] = { ...next[pIdx], [field]: val };
      return next;
    });
  };

  const addAnotherProduct = () => {
    const lastProduct = productsList[productsList.length - 1];
    const newProd = createEmptyProduct();
    // Copy specification keys from the previous product if customized
    if (lastProduct && lastProduct.specs.length > 0) {
      newProd.specs = lastProduct.specs.map((s) => ({ key: s.key, value: "" }));
    }
    setProductsList((prev) => [...prev, newProd]);
  };

  const removeProduct = (pIdx) => {
    if (productsList.length <= 1) return;
    setProductsList((prev) => prev.filter((_, i) => i !== pIdx));
  };

  // Image Upload handler for specific product
  const handleFileUpload = async (pIdx, e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setProductsList((prev) => {
      const next = [...prev];
      next[pIdx] = { ...next[pIdx], uploading: true, uploadError: "" };
      return next;
    });

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.error || "Image upload failed");
      }

      const newUrls = data.urls || (data.url ? [data.url] : []);
      setProductsList((prev) => {
        const next = [...prev];
        const currentProd = next[pIdx];
        const existingImgs = [...(currentProd.uploadedImages || [])];
        newUrls.forEach((url, idx) => {
          const isPrimary = existingImgs.length === 0 && idx === 0;
          existingImgs.push({ url, is_primary: isPrimary });
        });
        next[pIdx] = {
          ...currentProd,
          uploadedImages: existingImgs,
          uploading: false,
          uploadError: "",
        };
        return next;
      });
    } catch (err) {
      setProductsList((prev) => {
        const next = [...prev];
        next[pIdx] = { ...next[pIdx], uploading: false, uploadError: err.message };
        return next;
      });
    } finally {
      if (fileInputRefs.current[pIdx]) {
        fileInputRefs.current[pIdx].value = "";
      }
    }
  };

  const handleSetPrimaryImage = (pIdx, imgIdx) => {
    setProductsList((prev) => {
      const next = [...prev];
      const prod = next[pIdx];
      const updatedImgs = prod.uploadedImages.map((img, i) => ({
        ...img,
        is_primary: i === imgIdx,
      }));
      next[pIdx] = { ...prod, uploadedImages: updatedImgs };
      return next;
    });
  };

  const handleRemoveImage = (pIdx, imgIdx) => {
    setProductsList((prev) => {
      const next = [...prev];
      const prod = next[pIdx];
      const filtered = prod.uploadedImages.filter((_, i) => i !== imgIdx);
      if (filtered.length > 0 && !filtered.some((img) => img.is_primary)) {
        filtered[0].is_primary = true;
      }
      next[pIdx] = { ...prod, uploadedImages: filtered };
      return next;
    });
  };

  // Spec helpers for specific product
  const handleSpecChange = (pIdx, specIdx, field, val) => {
    setProductsList((prev) => {
      const next = [...prev];
      const prod = next[pIdx];
      const newSpecs = [...prod.specs];
      newSpecs[specIdx] = { ...newSpecs[specIdx], [field]: val };
      next[pIdx] = { ...prod, specs: newSpecs };
      return next;
    });
  };

  const addSpecRow = (pIdx) => {
    setProductsList((prev) => {
      const next = [...prev];
      const prod = next[pIdx];
      next[pIdx] = {
        ...prod,
        specs: [...prod.specs, { key: "", value: "" }],
      };
      return next;
    });
  };

  const removeSpecRow = (pIdx, specIdx) => {
    setProductsList((prev) => {
      const next = [...prev];
      const prod = next[pIdx];
      next[pIdx] = {
        ...prod,
        specs: prod.specs.filter((_, i) => i !== specIdx),
      };
      return next;
    });
  };

  // Submit Handler: Saves all products under the selected Brand and Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedBrandId) {
      setError("Please select a Brand");
      return;
    }

    if (!activeSelectedCategory) {
      setError("Please select a Category under this brand");
      return;
    }

    // Validate that every product has a model number
    for (let i = 0; i < productsList.length; i++) {
      const p = productsList[i];
      if (!p.model_no.trim()) {
        setError(`Product #${i + 1} is missing a Model Number. Please fill it before saving.`);
        return;
      }
    }

    setSaving(true);
    try {
      const brandObj = brands.find((b) => String(b.id) === String(selectedBrandId));

      const payloadProducts = productsList.map((p) => {
        const primaryImg =
          p.uploadedImages.find((img) => img.is_primary)?.url || p.uploadedImages[0]?.url || "";

        return {
          model_no: p.model_no.trim(),
          name: (p.name || p.model_no).trim(),
          brand_id: Number(selectedBrandId),
          brand: brandObj?.name || "Maxsel",
          category_id: activeSelectedCategory.id,
          category_name: activeSelectedCategory.name,
          description: p.description.trim(),
          tags: p.tags.trim(),
          image_url: primaryImg,
          images: p.uploadedImages.map((img, idx) => ({
            url: img.url,
            is_primary: img.is_primary,
            display_order: idx + 1,
          })),
          brochure_url: p.brochure_url.trim(),
          is_featured: p.is_featured,
          specifications: p.specs
            .filter((s) => s.key.trim() && s.value.trim())
            .map((s, idx) => ({
              key: s.key.trim(),
              value: s.value.trim(),
              display_order: idx + 1,
            })),
        };
      });

      const res = await fetch("/api/admin/products/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand_id: Number(selectedBrandId),
          brand: brandObj?.name || "Maxsel",
          category_id: activeSelectedCategory.id,
          category_name: activeSelectedCategory.name,
          products: payloadProducts,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.error || "Failed to create products");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin");
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 font-poppins pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Add Products</h2>
          <p className="text-sm text-gray-500 mt-1">
            Choose Brand &amp; Category once, then add one or multiple product models under it.
          </p>
        </div>
        <Link
          href="/admin"
          className="text-xs text-gray-600 hover:text-gray-900 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition w-fit"
        >
          ← Back to Catalog
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-[#04940B] rounded-2xl text-sm font-semibold flex items-center gap-2">
          <span>✓ {productsList.length} product(s) created successfully! Redirecting to catalog...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ========================================================= */}
        {/* 1. SHARED BRAND & CATEGORY SELECTION                      */}
        {/* ========================================================= */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">
                1. Target Brand &amp; Category Placement
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                All products added below will be placed into this category.
              </p>
            </div>
            {categoryPathPreview && (
              <span className="text-xs font-medium text-[#04940B] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                {categoryPathPreview}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Brand Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Brand <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedBrandId}
                onChange={(e) => setSelectedBrandId(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#04940B]"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Level 1: Main Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Main Category (Level 1) <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedLevel1Id}
                onChange={(e) => handleLevel1Change(e.target.value)}
                required
                disabled={categoriesTree.length === 0}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B] disabled:opacity-50"
              >
                {categoriesTree.length === 0 ? (
                  <option value="">No categories under this brand yet</option>
                ) : (
                  categoriesTree.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.children?.length ? `(${c.children.length} subcategories)` : ""}
                    </option>
                  ))
                )}
              </select>
              {categoriesTree.length === 0 && (
                <Link
                  href={`/admin/categories?brandId=${selectedBrandId}`}
                  className="text-[11px] text-[#04940B] hover:underline mt-1 inline-block"
                >
                  + Add categories to this brand
                </Link>
              )}
            </div>

            {/* Level 2: Subcategory */}
            {level2Options.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Subcategory (Level 2)
                </label>
                <select
                  value={selectedLevel2Id}
                  onChange={(e) => handleLevel2Change(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
                >
                  <option value="">-- Optional: Select Subcategory --</option>
                  {level2Options.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.children?.length ? `(${c.children.length} sub-subcategories)` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Level 3: Sub-subcategory */}
            {level3Options.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Sub-subcategory (Level 3)
                </label>
                <select
                  value={selectedLevel3Id}
                  onChange={(e) => setSelectedLevel3Id(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
                >
                  <option value="">-- Optional: Select Sub-subcategory --</option>
                  {level3Options.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. DYNAMIC PRODUCT LIST (EACH PRODUCT IN SAME CATEGORY)    */}
        {/* ========================================================= */}
        <div className="space-y-6">
          {productsList.map((product, pIdx) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden transition"
            >
              {/* Product Card Header */}
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#04940B] text-white flex items-center justify-center font-bold text-xs">
                    {pIdx + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      {product.model_no ? `Model: ${product.model_no}` : `Product #${pIdx + 1}`}
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Placed in: <span className="font-medium text-gray-700">{categoryPathPreview || "Selected Category"}</span>
                    </p>
                  </div>
                </div>

                {productsList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProduct(pIdx)}
                    className="text-xs text-red-600 hover:text-red-800 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 border border-red-200 transition cursor-pointer"
                  >
                    ✕ Remove Product
                  </button>
                )}
              </div>

              <div className="p-6 space-y-6">
                {/* 2.1 Basic Product Info */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Basic Info
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Model Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. F450GL23, BB-3D-GLS"
                        value={product.model_no}
                        onChange={(e) => updateProductField(pIdx, "model_no", e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Product Title / Name
                      </label>
                      <input
                        type="text"
                        placeholder="Defaults to model number if blank"
                        value={product.name}
                        onChange={(e) => updateProductField(pIdx, "name", e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Equipment specifications overview..."
                        value={product.description}
                        onChange={(e) => updateProductField(pIdx, "description", e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Search Tags / Keywords
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Freezers, Glass Top"
                        value={product.tags}
                        onChange={(e) => updateProductField(pIdx, "tags", e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center justify-between">
                        <span>Brochure PDF URL</span>
                        <label className="text-[11px] text-[#04940B] hover:underline cursor-pointer font-medium">
                          Upload PDF from PC
                          <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const fd = new FormData();
                              fd.append("file", file);
                              try {
                                const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
                                const data = await res.json();
                                if (data.urls?.[0]) {
                                  updateProductField(pIdx, "brochure_url", data.urls[0]);
                                }
                              } catch (err) {
                                alert("Failed to upload PDF brochure");
                              }
                            }}
                          />
                        </label>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. /brochures/spec_sheet.pdf or click Upload PDF"
                        value={product.brochure_url}
                        onChange={(e) => updateProductField(pIdx, "brochure_url", e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-gray-700 pt-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={product.is_featured}
                      onChange={(e) => updateProductField(pIdx, "is_featured", e.target.checked)}
                      className="rounded text-[#04940B] focus:ring-[#04940B]"
                    />
                    <span>Mark as Featured Product</span>
                  </label>
                </div>

                {/* 2.2 Product Images Upload */}
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Product Images (From PC)
                    </h4>
                    {product.uploadedImages.length > 0 && (
                      <span className="text-xs text-gray-400">
                        {product.uploadedImages.length} image{product.uploadedImages.length === 1 ? "" : "s"} uploaded
                      </span>
                    )}
                  </div>

                  {product.uploadError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs">
                      {product.uploadError}
                    </div>
                  )}

                  {/* Dropzone */}
                  <div
                    onClick={() => fileInputRefs.current[pIdx]?.click()}
                    className="border-2 border-dashed border-gray-300 hover:border-[#04940B] bg-gray-50/60 hover:bg-emerald-50/20 rounded-xl p-4 text-center cursor-pointer transition flex items-center justify-center gap-3"
                  >
                    <input
                      type="file"
                      ref={(el) => (fileInputRefs.current[pIdx] = el)}
                      onChange={(e) => handleFileUpload(pIdx, e)}
                      multiple
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="hidden"
                    />
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#04940B] flex items-center justify-center flex-shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-gray-800">
                        {product.uploading ? "Uploading images..." : "Click to upload photos for this model"}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Multiple JPG, PNG, WEBP supported
                      </p>
                    </div>
                  </div>

                  {/* Thumbnails */}
                  {product.uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                      {product.uploadedImages.map((img, imgIdx) => (
                        <div
                          key={imgIdx}
                          className={`relative group rounded-xl border-2 overflow-hidden bg-white p-1 transition ${
                            img.is_primary ? "border-[#04940B] shadow-xs" : "border-gray-200"
                          }`}
                        >
                          <div className="w-full h-24 relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                            <img
                              src={img.url}
                              alt="Upload preview"
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>

                          {img.is_primary ? (
                            <span className="absolute top-1.5 left-1.5 bg-[#04940B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                              Cover
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(pIdx, imgIdx)}
                              className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition bg-black/75 hover:bg-black text-white text-[9px] font-medium px-1.5 py-0.5 rounded cursor-pointer"
                            >
                              Set Cover
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(pIdx, imgIdx)}
                            className="absolute top-1.5 right-1.5 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] opacity-80 hover:opacity-100 transition cursor-pointer"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2.3 Technical Specifications */}
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Technical Specifications
                    </h4>
                    <button
                      type="button"
                      onClick={() => addSpecRow(pIdx)}
                      className="text-xs font-semibold text-[#04940B] hover:text-[#037A09] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 transition cursor-pointer"
                    >
                      + Add Spec Row
                    </button>
                  </div>

                  <div className="space-y-2">
                    {product.specs.map((spec, specIdx) => (
                      <div key={specIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Specification Key"
                          value={spec.key}
                          onChange={(e) => handleSpecChange(pIdx, specIdx, "key", e.target.value)}
                          className="w-1/2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#04940B]"
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          value={spec.value}
                          onChange={(e) => handleSpecChange(pIdx, specIdx, "value", e.target.value)}
                          className="w-1/2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#04940B]"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpecRow(pIdx, specIdx)}
                          className="text-gray-400 hover:text-red-600 px-1 text-sm cursor-pointer"
                          title="Remove row"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================================= */}
        {/* BUTTON: + ADD ANOTHER PRODUCT UNDER SAME CATEGORY         */}
        {/* ========================================================= */}
        <div className="pt-2">
          <button
            type="button"
            onClick={addAnotherProduct}
            className="w-full py-4 px-6 border-2 border-dashed border-[#04940B]/50 hover:border-[#04940B] bg-emerald-50/40 hover:bg-emerald-50/70 text-[#04940B] font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-2xs hover:shadow-xs cursor-pointer group"
          >
            <span className="w-7 h-7 rounded-full bg-[#04940B] text-white flex items-center justify-center text-sm font-bold group-hover:scale-110 transition-transform">
              +
            </span>
            <span className="text-sm">
              Add Another Product Model under this same Brand &amp; Category
            </span>
          </button>
        </div>

        {/* Final Action Submission Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#04940B] hover:bg-[#037A09] text-white font-semibold px-8 py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
            >
              {saving
                ? "Saving Products..."
                : productsList.length === 1
                ? "Save 1 Product & Publish"
                : `Save All ${productsList.length} Products & Publish`}
            </button>
            <Link
              href="/admin"
              className="px-6 py-3.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition"
            >
              Cancel
            </Link>
          </div>

          <span className="text-xs text-gray-400 font-medium">
            Total {productsList.length} product{productsList.length === 1 ? "" : "s"} ready to add
          </span>
        </div>
      </form>
    </div>
  );
}

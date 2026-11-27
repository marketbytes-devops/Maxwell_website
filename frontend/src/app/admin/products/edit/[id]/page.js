"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AiSpecScanner from "@/components/admin/AiSpecScanner";

export default function EditProductPage() {
  const params = useParams();
  const productId = params?.id;
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [categoriesTree, setCategoriesTree] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Cascading Brand & Category selection
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [selectedLevel1Id, setSelectedLevel1Id] = useState("");
  const [selectedLevel2Id, setSelectedLevel2Id] = useState("");
  const [selectedLevel3Id, setSelectedLevel3Id] = useState("");

  // Product Basic Info
  const [modelNo, setModelNo] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [brochureUrl, setBrochureUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  // PC Image Upload state
  const [uploadedImages, setUploadedImages] = useState([]); // [{ url, is_primary }]
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Specifications state
  const [specs, setSpecs] = useState([
    { key: "External Dimension (mm)", value: "" },
    { key: "Gross Volume", value: "" },
    { key: "Temperature Range", value: "" },
    { key: "No. of Shelves / Baskets", value: "" },
    { key: "Power Supply / Voltage", value: "" },
  ]);

  // 1. Load initial product and brands
  useEffect(() => {
    async function loadData() {
      if (!productId) return;
      try {
        setLoading(true);
        const [pRes, bRes] = await Promise.all([
          fetch(`/api/admin/products/${productId}`),
          fetch("/api/admin/brands"),
        ]);

        if (!pRes.ok) throw new Error("Failed to load product details");
        const pData = await pRes.json();
        const prod = pData.product;

        if (bRes.ok) {
          const bData = await bRes.json();
          setBrands(bData.brands || []);
        }

        // Fill basic fields (prioritize model_no, fallback to name)
        const initialModel = prod.model_no || prod.name || "";
        setModelNo(initialModel);
        setProductName(initialModel);
        setDescription(prod.description || "");
        setTags(prod.tags || "");
        setBrochureUrl(prod.brochure_url || "");
        setIsFeatured(Boolean(prod.is_featured));
        setSelectedBrandId(String(prod.brand_id || ""));

        // Specifications
        if (prod.specifications && prod.specifications.length > 0) {
          setSpecs(
            prod.specifications.map((s) => ({
              key: s.spec_key || "",
              value: s.spec_value || "",
            }))
          );
        }

        // Images
        if (prod.images && prod.images.length > 0) {
          setUploadedImages(
            prod.images.map((im) => ({
              url: im.image_url,
              is_primary: Boolean(im.is_primary),
            }))
          );
        } else if (prod.image_url) {
          setUploadedImages([{ url: prod.image_url, is_primary: true }]);
        }

        // Load Categories for this brand and set breadcrumb
        if (prod.brand_id) {
          const cRes = await fetch(`/api/admin/categories?brand_id=${prod.brand_id}&as_tree=true`);
          if (cRes.ok) {
            const cData = await cRes.json();
            const tree = cData.categories || [];
            setCategoriesTree(tree);

            // Assign level IDs from breadcrumb
            const bc = prod.breadcrumb || [];
            if (bc.length >= 1) setSelectedLevel1Id(String(bc[0].id));
            if (bc.length >= 2) setSelectedLevel2Id(String(bc[1].id));
            if (bc.length >= 3) setSelectedLevel3Id(String(bc[2].id));
            if (bc.length === 0 && prod.category_id) {
              setSelectedLevel1Id(String(prod.category_id));
            }
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [productId]);

  // When selectedBrandId changes manually
  const handleBrandChange = async (newBrandId) => {
    setSelectedBrandId(newBrandId);
    setSelectedLevel1Id("");
    setSelectedLevel2Id("");
    setSelectedLevel3Id("");
    if (!newBrandId) {
      setCategoriesTree([]);
      return;
    }
    try {
      const res = await fetch(`/api/admin/categories?brand_id=${newBrandId}&as_tree=true`);
      if (res.ok) {
        const data = await res.json();
        const tree = data.categories || [];
        setCategoriesTree(tree);
        if (tree.length > 0) setSelectedLevel1Id(String(tree[0].id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Derived category levels
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

  // PC Image Upload Handler
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError("");

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
      setUploadedImages((prev) => {
        const next = [...prev];
        newUrls.forEach((url, idx) => {
          const isPrimary = next.length === 0 && idx === 0;
          next.push({ url, is_primary: isPrimary });
        });
        return next;
      });
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSetPrimaryImage = (index) => {
    setUploadedImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        is_primary: i === index,
      }))
    );
  };

  const handleRemoveImage = (index) => {
    setUploadedImages((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.is_primary)) {
        filtered[0].is_primary = true;
      }
      return filtered;
    });
  };

  // Specification helpers
  const handleSpecChange = (index, field, val) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const addSpecRow = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const removeSpecRow = (index) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  // AI Spec Sheet Extractor Handler
  const handleApplyExtractedSpecs = (data) => {
    if (data.model_no) setModelNo(data.model_no);
    if (data.name) setProductName(data.name);
    if (data.description !== undefined) setDescription(data.description);
    if (data.tags) setTags(data.tags);
    if (data.specs && Array.isArray(data.specs) && data.specs.length > 0) {
      setSpecs(data.specs.map((s) => ({ key: s.key || "", value: s.value || "" })));
    }
  };

  // Submit Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!modelNo.trim()) {
      setError("Please provide a Model Number");
      return;
    }

    if (!selectedBrandId) {
      setError("Please select a Brand");
      return;
    }

    if (!activeSelectedCategory) {
      setError("Please select a Category under this brand");
      return;
    }

    setSaving(true);
    try {
      const primaryImg = uploadedImages.find((img) => img.is_primary)?.url || uploadedImages[0]?.url || "";
      const brandObj = brands.find((b) => String(b.id) === String(selectedBrandId));

      const payload = {
        model_no: modelNo.trim(),
        name: (productName || modelNo).trim(),
        brand_id: Number(selectedBrandId),
        brand: brandObj?.name || "Maxsel",
        category_id: activeSelectedCategory.id,
        category_name: activeSelectedCategory.name,
        description: (description || "").trim(),
        tags: tags.trim(),
        image_url: primaryImg,
        images: uploadedImages.map((img, idx) => ({
          url: img.url,
          is_primary: img.is_primary,
          display_order: idx + 1,
        })),
        brochure_url: brochureUrl.trim(),
        is_featured: isFeatured,
        specifications: specs
          .filter((s) => s.key.trim() && s.value.trim())
          .map((s, idx) => ({
            key: s.key.trim(),
            value: s.value.trim(),
            display_order: idx + 1,
          })),
      };

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (parseErr) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Server error (${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data.detail || data.error || data.message || "Failed to update product");
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500 font-poppins">
        <div className="w-9 h-9 border-3 border-[#04940B] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm">Loading product for editing...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6 font-poppins pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Edit Product</h2>
          <p className="text-sm text-gray-500 mt-1">
            Updating details for <span className="font-semibold text-[#04940B]">{modelNo || "Product"}</span>
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
          <span>✓ Product updated successfully! Redirecting to catalog...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. BRAND & CATEGORY SELECTION */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">
                1. Brand &amp; Category Placement
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Categories are organized strictly under their respective brand.
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
                onChange={(e) => handleBrandChange(e.target.value)}
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
                  <option value="">No categories under this brand</option>
                ) : (
                  categoriesTree.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.children?.length ? `(${c.children.length} subcategories)` : ""}
                    </option>
                  ))
                )}
              </select>
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

        {/* 2. PC IMAGE UPLOADER */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-2 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">
                2. Product Images
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Upload new photos or manage existing ones. Select which image is primary.
              </p>
            </div>
            {uploadedImages.length > 0 && (
              <span className="text-xs font-medium text-gray-500">
                {uploadedImages.length} image{uploadedImages.length === 1 ? "" : "s"}
              </span>
            )}
          </div>

          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs">
              {uploadError}
            </div>
          )}

          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 hover:border-[#04940B] bg-gray-50/60 hover:bg-emerald-50/30 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#04940B] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {uploading ? "Uploading from PC..." : "Click to upload more images from PC"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Supports multiple JPG, PNG, WEBP files
              </p>
            </div>
          </div>

          {/* Uploaded Images Thumbnails */}
          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {uploadedImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative group rounded-xl border-2 overflow-hidden bg-white p-1.5 transition ${
                    img.is_primary ? "border-[#04940B] shadow-sm" : "border-gray-200"
                  }`}
                >
                  <div className="w-full h-28 relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={img.url}
                      alt={`Product image ${idx + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {img.is_primary ? (
                    <span className="absolute top-2 left-2 bg-[#04940B] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      Primary Cover
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryImage(idx)}
                      className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition bg-black/70 hover:bg-black text-white text-[10px] font-medium px-2 py-0.5 rounded-md"
                    >
                      Set as Cover
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-80 hover:opacity-100 transition"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. BASIC PRODUCT DETAILS */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm border-b border-gray-100 pb-2">
            3. Basic Product Information
          </h3>

          {/* AI Specification Table Scanner & Visual Reference */}
          <AiSpecScanner
            title="Scan & Auto-Fill from Spec Sheet Image"
            currentModelNo={modelNo}
            onApplyData={handleApplyExtractedSpecs}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Product Title / Name
              </label>
              <input
                type="text"
                placeholder="e.g. Prodigy – Convex or Western 300L Freezer (Optional)"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                If left blank, will automatically use the Model Number.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Model Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Prodigy – Convex, F450GL23, BB-3D-GLS"
                value={modelNo}
                onChange={(e) => setModelNo(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Product Description (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Commercial overview, features, modularity, applications (e.g. for Trufrost / Butler products)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Leave empty if product only has technical specifications (like Western / Hoshizaki).
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Search Tags / Keywords
              </label>
              <input
                type="text"
                placeholder="e.g. Freezers, Glass Top, Convection Oven"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center justify-between">
                <span>Brochure PDF Download URL</span>
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
                          setBrochureUrl(data.urls[0]);
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
                placeholder="e.g. /uploads/products/spec_sheet.pdf or click Upload PDF"
                value={brochureUrl}
                onChange={(e) => setBrochureUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#04940B]"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-gray-700 pt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded text-[#04940B] focus:ring-[#04940B]"
            />
            <span>Mark as Featured Product (Highlights at top of catalog)</span>
          </label>
        </div>

        {/* 4. TECHNICAL SPECIFICATIONS */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">
                4. Technical Specifications Table
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Displayed in the clean spec table on the product detail page.
              </p>
            </div>
            <button
              type="button"
              onClick={addSpecRow}
              className="text-xs font-semibold text-[#04940B] hover:text-[#037A09] bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 transition cursor-pointer"
            >
              + Add Row
            </button>
          </div>

          <div className="space-y-2.5">
            {specs.map((spec, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Specification Name"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(idx, "key", e.target.value)}
                  className="w-1/2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#04940B]"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                  className="w-1/2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#04940B]"
                />
                <button
                  type="button"
                  onClick={() => removeSpecRow(idx)}
                  className="text-gray-400 hover:text-red-600 px-2 text-sm transition cursor-pointer"
                  title="Remove row"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || uploading}
            className="bg-[#04940B] hover:bg-[#037A09] text-white font-semibold px-8 py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Update Product"}
          </button>
          <Link
            href="/admin"
            className="px-6 py-3.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}


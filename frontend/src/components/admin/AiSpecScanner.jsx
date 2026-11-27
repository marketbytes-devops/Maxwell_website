"use client";

import { useState, useRef, useEffect } from "react";

// Client-side image compression helper to avoid large uploads and proxy timeouts
async function compressImageIfNeeded(file, maxDim = 1600, quality = 0.85) {
  if (!file || !file.type.startsWith("image/")) return file;
  if (file.size < 500 * 1024) return file; // Skip already small images

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }));
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

/**
 * AiSpecScanner
 * Allows admins to upload, paste, or drag & drop a specification sheet image.
 * Analyzes the table with Gemini Vision and auto-fills Model No, Title, Description,
 * Tags, and all Technical Specification parameters.
 */
export default function AiSpecScanner({
  onApplyData,
  onApplyAllModels,
  currentModelNo = "",
  title = "AI Specification Table Auto-Filler",
}) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [extractedData, setExtractedData] = useState(null);
  const [selectedModelIdx, setSelectedModelIdx] = useState(0);

  // Gemini Key Management
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [savingKey, setSavingKey] = useState(false);
  const [keyStatusChecked, setKeyStatusChecked] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  // Reference Viewer Modal (Zoom & inspect)
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const fileInputRef = useRef(null);

  // Check backend AI key configuration status
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/admin/ai-status");
        if (res.ok) {
          const data = await res.json();
          setIsConfigured(Boolean(data.configured));
        }
      } catch (err) {
        console.error("Failed to check AI status:", err);
      } finally {
        setKeyStatusChecked(true);
      }
    }
    checkStatus();
  }, []);

  // Listen for paste events (Ctrl+V) when user pastes a screenshot
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            handleImageSelected(blob);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleImageSelected = (selectedFile) => {
    if (!selectedFile) return;
    setError("");
    setSuccessMsg("");
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    // Automatically trigger extraction for high-speed workflow
    triggerExtraction(selectedFile);
  };

  const handleFileInputChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      handleImageSelected(f);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      handleImageSelected(droppedFile);
    }
  };

  const triggerExtraction = async (targetFile = file) => {
    if (!targetFile) return;
    setScanning(true);
    setError("");
    setSuccessMsg("");

    try {
      // Compress image client-side if large to prevent upload delays or proxy errors
      const optimizedFile = await compressImageIfNeeded(targetFile);

      const formData = new FormData();
      formData.append("file", optimizedFile);
      if (currentModelNo) {
        formData.append("model_no", currentModelNo);
      }

      // Read local storage key if available
      const localKey = typeof window !== "undefined" ? localStorage.getItem("MAXSEL_GEMINI_KEY") || "" : "";
      const headers = {};
      if (localKey) {
        headers["X-Gemini-Key"] = localKey;
      }

      const res = await fetch("/api/admin/extract-specs", {
        method: "POST",
        headers,
        body: formData,
      });

      let result = {};
      try {
        result = await res.json();
      } catch (parseErr) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Server error (${res.status})`);
      }

      if (!res.ok) {
        if (result.requires_key || res.status === 400 && result.detail?.toLowerCase().includes("key")) {
          setShowKeyModal(true);
          throw new Error("Gemini API key is required to scan specification images.");
        }
        throw new Error(result.error || result.detail || "Failed to scan specification sheet.");
      }

      if (!result.success) {
        if (result.requires_key) {
          setShowKeyModal(true);
        }
        throw new Error(result.error || "Failed to scan specification sheet.");
      }

      const data = result.data;
      setExtractedData(data);
      setSelectedModelIdx(0);

      // Auto-apply to form
      if (onApplyData) {
        onApplyData(data);
      }

      const specsCount = data.specs?.length || 0;
      setSuccessMsg(`Extracted ${specsCount} specs & auto-filled basic info!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  };

  // Switch between models if table contains multiple models
  const handleSelectModel = (idx) => {
    if (!extractedData?.all_models?.[idx]) return;
    setSelectedModelIdx(idx);
    const m = extractedData.all_models[idx];
    const updatedData = {
      ...extractedData,
      model_no: m.model_no || extractedData.model_no,
      name: m.name || extractedData.name,
      specs: m.specs || extractedData.specs,
    };
    if (onApplyData) {
      onApplyData(updatedData);
    }
  };

  // Add all detected models to form
  const handleAddAllDetectedModels = () => {
    if (onApplyAllModels && extractedData?.all_models?.length > 0) {
      onApplyAllModels(extractedData.all_models, extractedData);
      setSuccessMsg(`Added all ${extractedData.all_models.length} models to form!`);
    }
  };

  // Save Gemini Key
  const handleSaveApiKey = async (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;
    setSavingKey(true);
    try {
      const res = await fetch("/api/admin/set-gemini-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: apiKeyInput.trim() }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || "Failed to save key");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("MAXSEL_GEMINI_KEY", apiKeyInput.trim());
      }
      setIsConfigured(true);
      setShowKeyModal(false);
      setApiKeyInput("");
      // Retry scanning immediately
      if (file) {
        triggerExtraction(file);
      }
    } catch (err) {
      alert("Error saving API key: " + err.message);
    } finally {
      setSavingKey(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50/60 via-white to-green-50/40 rounded-2xl border-2 border-emerald-300/80 p-4 sm:p-5 shadow-xs mb-6 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-200/30 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-gray-900 tracking-tight">{title}</h4>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  AI Auto-Fill
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Upload or paste (Ctrl+V) a spec sheet image. AI extracts model, name, and parameters instantly.
              </p>
            </div>
          </div>

          {/* Quick Key Configuration button */}
          <button
            type="button"
            onClick={() => setShowKeyModal(true)}
            className="text-[11px] font-medium text-emerald-700 hover:text-emerald-900 bg-emerald-100/60 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer"
          >
            <span>{isConfigured ? "✓ Gemini Key Active" : "⚙ Set Gemini API Key"}</span>
          </button>
        </div>

        {/* Dropzone & Preview Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Dropzone Area */}
          <div className={previewUrl ? "md:col-span-8" : "md:col-span-12"}>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 sm:p-5 text-center cursor-pointer transition ${
                scanning
                  ? "border-emerald-500 bg-emerald-50/50 animate-pulse"
                  : "border-emerald-300/80 hover:border-emerald-500 bg-white/80 hover:bg-emerald-50/30"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {scanning ? (
                <div className="flex flex-col items-center justify-center py-2 space-y-2">
                  <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-bold text-emerald-800">
                    Analyzing Specification Sheet Table with Gemini AI...
                  </p>
                  <p className="text-[11px] text-emerald-600">
                    Extracting model numbers, dimensions, capacity, voltage, temperatures...
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-800">
                      {previewUrl ? "Click or Drop to Replace Spec Image" : "Drop or Click to Upload Spec Table Image"}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Supports JPG, PNG, WEBP screenshots • Or press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-[10px] font-mono">Ctrl+V</kbd> anywhere to paste
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Uploaded Image Thumbnail & Visual Reference Controller */}
          {previewUrl && (
            <div className="md:col-span-4 bg-white rounded-xl border border-emerald-200 p-2.5 flex items-center gap-3">
              <div
                onClick={() => setIsViewerOpen(true)}
                className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 cursor-pointer group"
                title="Click to view reference image side-by-side"
              >
                <img src={previewUrl} alt="Spec table" className="w-full h-full object-cover group-hover:scale-105 transition" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 flex items-center justify-center text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition">
                  Zoom
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800 truncate">Spec Image Active</p>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setIsViewerOpen(true)}
                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded cursor-pointer transition flex items-center gap-1"
                  >
                    🔍 Visual Reference
                  </button>
                  <button
                    type="button"
                    disabled={scanning}
                    onClick={() => triggerExtraction()}
                    className="text-[11px] font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2 py-0.5 rounded cursor-pointer transition"
                  >
                    ↻ Re-Scan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center justify-between">
            <span>⚠️ {error}</span>
            {error.toLowerCase().includes("key") && (
              <button
                type="button"
                onClick={() => setShowKeyModal(true)}
                className="text-xs font-bold underline ml-2 cursor-pointer"
              >
                Enter Key
              </button>
            )}
          </div>
        )}

        {successMsg && (
          <div className="mt-3 p-2.5 bg-emerald-100/80 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
            <span>✓ {successMsg}</span>
          </div>
        )}

        {/* Multi-Model Selector Bar (If table contained columns for multiple models) */}
        {extractedData?.all_models && extractedData.all_models.length > 1 && (
          <div className="mt-3 pt-3 border-t border-emerald-200/80 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-gray-600 uppercase">
                Multiple Models Found ({extractedData.all_models.length}):
              </span>
              {extractedData.all_models.map((m, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectModel(idx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                    selectedModelIdx === idx
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-emerald-600"
                  }`}
                >
                  {m.model_no || `Model #${idx + 1}`}
                </button>
              ))}
            </div>

            {onApplyAllModels && (
              <button
                type="button"
                onClick={handleAddAllDetectedModels}
                className="text-xs font-bold text-emerald-800 bg-emerald-200/80 hover:bg-emerald-300 px-3 py-1 rounded-lg transition cursor-pointer shadow-xs"
              >
                + Add All {extractedData.all_models.length} Models as Separate Products
              </button>
            )}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* VISUAL REFERENCE VIEWER MODAL / SIDE DOCK                  */}
      {/* ========================================================= */}
      {isViewerOpen && previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex flex-col p-4 sm:p-6 animate-fadeIn">
          {/* Top Bar */}
          <div className="flex items-center justify-between bg-gray-900 text-white px-4 py-2.5 rounded-t-2xl border-b border-gray-800">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-white">Spec Sheet Reference Viewer</span>
              <span className="text-xs text-gray-400">
                Keep this open to cross-reference extracted numbers with the original image
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-xs rounded text-white"
              >
                − Zoom Out
              </button>
              <span className="text-xs font-mono text-gray-300 px-1">{Math.round(zoomLevel * 100)}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-xs rounded text-white"
              >
                + Zoom In
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-xs rounded text-gray-300"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsViewerOpen(false)}
                className="ml-3 px-3 py-1 bg-red-600 hover:bg-red-700 text-xs font-bold rounded-lg text-white"
              >
                ✕ Close
              </button>
            </div>
          </div>

          {/* Image Pan & Zoom Body */}
          <div className="flex-1 bg-gray-950 rounded-b-2xl overflow-auto flex items-center justify-center p-4">
            <img
              src={previewUrl}
              alt="Specification reference full"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center center" }}
              className="max-h-full max-w-full object-contain transition-transform duration-150"
            />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* GEMINI API KEY SETUP MODAL                                */}
      {/* ========================================================= */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span>⚡</span> Setup Gemini API Key
              </h3>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              To read and auto-fill technical specs from images, Maxwell uses the Gemini 2.5 Flash Vision AI.
              A free key can be obtained instantly from Google AI Studio.
            </p>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 text-xs text-emerald-800">
              <p className="font-semibold mb-1">How to get your free key:</p>
              <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-emerald-700">
                <li>
                  Go to{" "}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold underline text-emerald-900"
                  >
                    Google AI Studio (Click here)
                  </a>
                </li>
                <li>Click <strong>&quot;Create API Key&quot;</strong> (It is free)</li>
                <li>Paste the key below and click <strong>&quot;Save Key&quot;</strong></li>
              </ol>
            </div>

            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  required
                  placeholder="AIzaSy..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#04940B]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingKey || !apiKeyInput.trim()}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#04940B] hover:bg-[#037A09] rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
                >
                  {savingKey ? "Saving..." : "Save Key & Continue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

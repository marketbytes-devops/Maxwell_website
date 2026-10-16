"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  // Fetch products and categories from MySQL database
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/categories"),
        ]);

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData.products || []);
        }
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.categories || []);
        }
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    const matchCategory =
      activeCategory === "all" || p.category_name === activeCategory;
    const matchSearch =
      searchQuery.trim() === "" ||
      p.model_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tags && p.tags.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-full bg-white font-poppins min-h-screen flex flex-col">
      {/* 1. TOP SEARCH SECTION (Exact Measurements: 733px x 55.24px) */}
      <section className="w-full py-10 md:py-14 bg-white flex justify-center px-4">
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-[733px] flex flex-col sm:flex-row items-center gap-[6px]"
          style={{ minHeight: "55.24px" }}
        >
          {/* Input Box: 563px x 55px, border-radius 35px, border 1px solid #050019 */}
          <div
            className="w-full sm:w-[563px] h-[55px] rounded-[35px] border border-[#050019] px-5 flex items-center gap-3 bg-white transition-all focus-within:ring-2 focus-within:ring-[#04940B]/30"
          >
            {/* Search Magnifying Glass Icon */}
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
              placeholder="Search by model number, equipment, brand..."
              className="w-full bg-transparent text-sm md:text-base text-[#0F172A] placeholder-gray-400 focus:outline-none"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-600 text-sm px-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Button: 164px x 55.24px, border-radius 60px, background #04940B */}
          <button
            type="submit"
            className="w-full sm:w-[164px] h-[55.24px] rounded-[60px] bg-[#04940B] hover:bg-[#037A09] active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer shadow-sm flex-shrink-0"
          >
            {/* Text: Poppins, weight 500, size 18px, line-height 100%, color #FFFFFF */}
            <span
              className="text-[#FFFFFF] text-[18px] font-medium leading-none"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Search
            </span>
          </button>
        </form>
      </section>

      {/* 2. BANNER SECTION (Exact Measurements: width 1744.63px, height 318.65px) */}
      <section className="w-full flex justify-center bg-[#0C1222] overflow-hidden">
        <div
          className="w-full max-w-[1745px] h-[260px] sm:h-[318.65px] relative flex flex-col items-center justify-center px-4 text-center bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: `url('/images/products_banner.png')`,
          }}
        >
          {/* Overlay to ensure maximum contrast and depth matching Figma */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(12, 18, 48, 0.65) 0%, rgba(8, 12, 34, 0.85) 100%)",
            }}
          />

          {/* Banner Text (Exact specs: Roboto 500, 58px, #FFFFFF, Capitalize, width 954px) */}
          <div className="relative z-10 max-w-[954px] w-full flex flex-col items-center">
            <h1
              className="text-white text-[28px] sm:text-[40px] md:text-[54px] lg:text-[58px] font-medium leading-[1.1] md:leading-[100%] tracking-normal capitalize"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              Walk In Curious, Walk Out With Today’s Special Offer!
            </h1>

            {/* Faint subtitle from screenshot */}
            <p className="text-gray-300 text-xs sm:text-sm mt-3 font-normal opacity-75">
              Not a member? Join now to shop
            </p>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT CATALOG GRID */}
      <section className="w-full py-12 md:py-16 bg-[#F8FAFC] flex-grow">
        <div className="container mx-auto px-4 xl:px-[80px] max-w-[1728px]">
          {/* Categories Filter Pills */}
          {categories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition whitespace-nowrap cursor-pointer ${
                  activeCategory === "all"
                    ? "bg-[#04940B] text-white shadow-sm"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                }`}
              >
                All Categories ({products.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition whitespace-nowrap cursor-pointer ${
                    activeCategory === cat.name
                      ? "bg-[#04940B] text-white shadow-sm"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-[#0F172A]">
              {activeCategory === "all" ? "All Products" : activeCategory}
            </h3>
            <span className="text-sm text-gray-500">
              Showing {filteredProducts.length} item
              {filteredProducts.length === 1 ? "" : "s"}
            </span>
          </div>

          {/* Product Cards Grid */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400">
              <div className="w-10 h-10 border-3 border-[#04940B] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 bg-white rounded-2xl border border-gray-200 text-center p-8">
              <p className="text-gray-500 font-medium text-base">
                No products found matching your search.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Try searching for another model, or clear the search query.
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-5 py-2 bg-[#04940B] text-white rounded-full text-sm font-medium hover:bg-[#037A09]"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-[24px] border border-gray-200 p-7 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  {/* Top: Model Heading with Yellow Underline */}
                  <div>
                    <div className="mb-5">
                      <h2 className="text-[#04940B] font-extrabold text-2xl sm:text-3xl tracking-tight leading-none break-all">
                        {product.model_no}
                      </h2>
                      <div className="w-20 h-[3px] bg-[#FBBF24] mt-2 rounded-full"></div>
                    </div>

                    {/* Specifications List */}
                    <div className="space-y-3 mb-6">
                      <h4 className="text-gray-700 font-medium text-sm">
                        Product Specification:
                      </h4>

                      <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                        {product.specifications && product.specifications.length > 0 ? (
                          product.specifications.map((spec, i) => (
                            <li
                              key={i}
                              className="flex justify-between items-start gap-3"
                            >
                              <span className="flex items-center gap-2 text-gray-500 whitespace-nowrap">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></span>
                                {spec.spec_key}:
                              </span>
                              <span className="font-medium text-gray-900 text-right">
                                {spec.spec_value}
                              </span>
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-400 italic text-xs">
                            Technical specifications available on request.
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom: Action Buttons & Footer */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <button className="px-7 py-2.5 rounded-full bg-[#04940B] text-[#FBBF24] font-bold text-sm shadow-xs hover:bg-[#037A09] transition cursor-pointer">
                        Enquiry
                      </button>
                      {product.brochure_url ? (
                        <a
                          href={product.brochure_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-5 py-2.5 rounded-full bg-[#EDEDED] hover:bg-gray-200 text-gray-700 font-semibold text-xs transition"
                        >
                          Download Brochure
                        </a>
                      ) : (
                        <button className="px-5 py-2.5 rounded-full bg-[#EDEDED] hover:bg-gray-200 text-gray-700 font-semibold text-xs transition cursor-pointer">
                          Download Brochure
                        </button>
                      )}
                    </div>

                    <div className="text-[11px] text-gray-400 space-y-1">
                      <p>
                        <strong className="text-gray-600">Category:</strong>{" "}
                        {product.category_name}
                      </p>
                      {product.tags && (
                        <p className="line-clamp-1">
                          <strong className="text-gray-600">Tags:</strong>{" "}
                          {product.tags}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-full bg-white font-poppins flex flex-col">
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
              placeholder="Search..."
              className="w-full bg-transparent text-sm md:text-base text-[#0F172A] placeholder-gray-400 focus:outline-none"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-600 text-sm px-1 cursor-pointer"
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
      <section className="w-full flex justify-center bg-[#0C1222] overflow-hidden mb-16">
        <div
          className="w-full max-w-[1745px] h-[220px] sm:h-[280px] md:h-[318.65px] relative flex items-center justify-center bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: `url('/images/products_banner.png')`,
          }}
        >
          {/* Accessible hidden text for screen readers and SEO */}
          <h1 className="sr-only">
            Walk In Curious, Walk Out With Today’s Special Offer!
          </h1>
        </div>
      </section>
    </div>
  );
}

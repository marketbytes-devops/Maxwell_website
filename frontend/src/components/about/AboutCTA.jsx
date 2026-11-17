"use client";

import React, { useState } from "react";
import Link from "next/link";
import RequestQuoteModal from "@/components/common/RequestQuoteModal";

export default function AboutCTA({ onRequestQuote }) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenQuote = () => {
    if (onRequestQuote) {
      onRequestQuote();
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <section className="w-full flex justify-center bg-white py-16 sm:py-20 lg:py-24 px-6 sm:px-12 md:px-16 xl:px-[80px] font-poppins border-t border-gray-100">
        {/* Content Container: Max Width: 1067px, Height Hugging, Centered */}
        <div className="w-full max-w-[1067px] mx-auto flex flex-col items-center text-center gap-4 sm:gap-5">
          {/* Top Tag */}
          <span
            className="font-semibold text-xs sm:text-sm tracking-wider uppercase"
            style={{ color: "#E11D48" }}
          >
            START A CONVERSATION
          </span>

          {/* Heading */}
          <h2 className="text-[#0F172A] font-bold text-3xl sm:text-4xl lg:text-[42px] leading-[1.2] tracking-tight">
            Let&apos;s Find the Right Equipment for Your Business
          </h2>

          {/* Description */}
          <p className="text-[#475569] text-sm sm:text-base lg:text-[16px] leading-[1.68] font-normal max-w-[1000px] pt-1">
            Planning a new commercial kitchen, setting up a bakery, opening a
            café or upgrading your existing equipment? Maxsel Agencies offers a
            diverse range of professional equipment solutions to support your
            business requirements. Share your requirements with us and explore
            suitable equipment options for your business.
          </p>

          {/* Buttons Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-3 sm:pt-4 w-full">
            {/* 1. Discuss Your Requirements */}
            <button
              type="button"
              onClick={handleOpenQuote}
              className="h-[48px] sm:h-[50px] px-6 sm:px-7 rounded-[6px] text-white font-medium text-sm sm:text-[15px] flex items-center justify-center gap-2 transition-all duration-200 shadow-xs hover:opacity-95 active:scale-[0.98] cursor-pointer"
              style={{ backgroundColor: "#E11D48" }}
            >
              <span>Discuss Your Requirements</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            {/* 2. Request a Quote */}
            <button
              type="button"
              onClick={handleOpenQuote}
              className="h-[48px] sm:h-[50px] px-6 sm:px-7 rounded-[6px] bg-[#18181B] hover:bg-black text-white font-medium text-sm sm:text-[15px] flex items-center justify-center transition-all duration-200 shadow-xs active:scale-[0.98] cursor-pointer"
            >
              Request a Quote
            </button>

            {/* 3. Contact Us */}
            <Link
              href="/contact"
              className="h-[48px] sm:h-[50px] px-6 sm:px-7 rounded-[6px] bg-[#18181B] hover:bg-black text-white font-medium text-sm sm:text-[15px] flex items-center justify-center transition-all duration-200 shadow-xs active:scale-[0.98] cursor-pointer"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Built-in Quote Modal */}
      <RequestQuoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

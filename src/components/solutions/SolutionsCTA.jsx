"use client";

import React from "react";
import Link from "next/link";

export default function SolutionsCTA({ onContact }) {
  return (
    <section className="w-full flex justify-center bg-[#1B1B1B] overflow-hidden">
      {/* Main Container matching exact Figma measurements: 1734px x 405.11px */}
      <div
        className="w-full max-w-[1734px] min-h-[360px] sm:min-h-[380px] lg:h-[405.11px] relative flex flex-col justify-center px-6 sm:px-12 md:px-16 xl:px-[126px] py-14 lg:py-0 font-poppins"
        style={{
          backgroundColor: "#343434",
          backgroundImage:
            "linear-gradient(90deg, #1B1B1B 17.28%, rgba(0, 0, 0, 0) 48.91%)",
        }}
      >
        {/* Text and Action Content (Left-aligned matching Figma) */}
        <div className="relative z-10 max-w-[760px] flex flex-col items-start">
          {/* Section Heading */}
          <h2
            className="text-white text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.18] tracking-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Find the Right Equipment for <br />
            Your Business
          </h2>

          {/* Subtitle / Description */}
          <p
            className="text-[#D1D5DB] text-sm sm:text-base lg:text-[17px] leading-[1.65] font-normal mt-4 sm:mt-5 mb-7 sm:mb-8 max-w-[650px]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Every business has different equipment requirements. Maxsel Agencies
            helps businesses explore professional equipment solutions from
            established brands, suited to their operational needs.
          </p>

          {/* CTA Button: Contact Our Team (#14A800) */}
          <div>
            {onContact ? (
              <button
                type="button"
                onClick={onContact}
                className="inline-flex items-center justify-center h-[46px] sm:h-[48px] px-7 sm:px-8 rounded-[8px] bg-[#14A800] hover:bg-[#129400] active:scale-[0.98] text-white font-medium text-[15px] sm:text-[16px] shadow-sm hover:shadow-md transition-all cursor-pointer"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Contact Our Team
              </button>
            ) : (
              <Link
                href="/contact"
                className="inline-flex items-center justify-center h-[46px] sm:h-[48px] px-7 sm:px-8 rounded-[8px] bg-[#14A800] hover:bg-[#129400] active:scale-[0.98] text-white font-medium text-[15px] sm:text-[16px] shadow-sm hover:shadow-md transition-all cursor-pointer"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Contact Our Team
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

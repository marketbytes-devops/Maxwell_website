"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function BrandCategorySection({
  heading,
  subHeading,
  brandTag,
  brandLogo,
  cards,
}) {
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 532; // card width (508px) + gap (24px)
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full flex justify-center bg-white py-14 lg:py-[80px] px-6 sm:px-12 md:px-16 xl:px-[80px] font-poppins border-b border-[#F1F5F9] last:border-b-0">
      {/* Overall Section Container: max-w 1573px, gap 48px */}
      <div className="w-full max-w-[1573px] flex flex-col gap-8 lg:gap-[48px]">
        {/* Header Block: Heading + Subheading + Tag on Left, View all + Nav Arrows on Right */}
        <div className="w-full flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          {/* Left Side (896px max width matching Figma) */}
          <div className="max-w-[896px] flex flex-col">
            <h2 className="font-poppins font-semibold text-3xl sm:text-4xl lg:text-[46px] leading-[1.1] text-[#030303] tracking-[0.015em]">
              {heading}
            </h2>
            <p className="font-poppins font-normal text-base sm:text-[18px] leading-[150%] text-[#475569] mt-3">
              {subHeading}
            </p>
            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[14px] font-medium bg-[#E1F6FD] text-[#009EE2] hover:bg-[#D0F0FC] transition-colors cursor-pointer w-fit">
                {brandTag}
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </span>
            </div>
          </div>

          {/* Right Side: View all Product + Slider Navigation Arrows */}
          <div className="flex items-center gap-6 self-start lg:self-end">
            <Link
              href="/products"
              className="font-poppins font-medium text-[16px] text-[#D81159] hover:text-[#BE0E4C] transition-colors whitespace-nowrap"
            >
              View all Product
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleScroll("left")}
                aria-label="Previous Product"
                className="w-11 h-11 rounded-full bg-[#FFF1F2] hover:bg-[#FFE4E8] flex items-center justify-center transition-all cursor-pointer text-[#64748B] hover:text-[#334155] active:scale-95 shadow-xs"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={() => handleScroll("right")}
                aria-label="Next Product"
                className="w-11 h-11 rounded-full bg-[#FFE4E8] hover:bg-[#FDD0D8] flex items-center justify-center transition-all cursor-pointer text-[#334155] active:scale-95 shadow-xs"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Cards Container Div: Width 1573px, Height 461px, 24px gap */}
        <div
          ref={scrollContainerRef}
          className="w-full max-w-[1573px] flex flex-col md:flex-row items-stretch justify-start overflow-x-auto scrollbar-hide pb-2"
          style={{
            display: "flex",
            gap: "24px",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="flex-1 w-full md:w-[calc(33.333%-16px)] min-w-[280px] md:min-w-[320px] max-w-full lg:max-w-[508.33px] h-[461px] rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:border-[#CBD5E1] group cursor-pointer shrink-0 md:shrink"
              style={{
                borderRadius: "16px",
                borderWidth: "1px",
                height: "461px",
                maxWidth: "508.33px",
              }}
            >
              {/* Product Picture Container: Width 508.33px x Height 388px */}
              <div
                className="w-full h-[388px] relative bg-white flex items-center justify-center overflow-hidden"
                style={{ height: "388px" }}
              >
                {/* Brand Logo Badge in Top Left */}
                {brandLogo && (
                  <div className="absolute top-4 left-4 z-10 w-[52px] h-[34px] bg-white border border-[#E2E8F0] rounded-[8px] p-1 flex items-center justify-center shadow-xs pointer-events-none">
                    <Image
                      src={brandLogo}
                      alt={brandTag}
                      width={42}
                      height={26}
                      className="object-contain max-h-full max-w-full"
                    />
                  </div>
                )}

                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 508px"
                  className={`w-full h-full ${
                    card.isCover
                      ? "object-cover group-hover:scale-105 transition-transform duration-500"
                      : "object-contain p-6 sm:p-8 group-hover:scale-105 transition-transform duration-500"
                  }`}
                />
              </div>

              {/* Card Title Box: 73px height */}
              <div
                className="h-[73px] px-6 py-4 flex items-center bg-white border-t border-[#F8FAFC]"
                style={{ height: "73px" }}
              >
                <h3 className="font-poppins font-semibold text-[18px] text-[#030303] leading-snug line-clamp-2 group-hover:text-[#009EE2] transition-colors">
                  {card.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

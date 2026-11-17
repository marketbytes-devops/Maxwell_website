"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";

const brands = [
  "/brands/1.webp",
  "/brands/2.webp",
  "/brands/3.webp",
  "/brands/4.webp",
  "/brands/5.webp",
  "/brands/6.webp",
  "/brands/7.webp",
  "/brands/8.webp",
];

export default function AboutBrands() {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Duplicate brands to create an infinite seamless marquee
  const displayBrands = [...brands, ...brands, ...brands];

  useEffect(() => {
    let animationFrameId;
    const scrollContainer = scrollRef.current;

    const scroll = () => {
      if (scrollContainer && !isHovered) {
        scrollContainer.scrollLeft += 1; // Marquee speed

        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 3) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  return (
    <section className="w-full py-16 sm:py-20 lg:py-[90px] bg-white font-poppins overflow-hidden">
      <div className="w-full max-w-[1728px] mx-auto px-6 sm:px-12 md:px-16 xl:px-[80px] flex flex-col items-center">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
          <span
            className="font-semibold text-xs sm:text-sm tracking-wider uppercase mb-2.5"
            style={{ color: "#E11D48" }}
          >
            GLOBAL PARTNERS
          </span>
          <h2 className="text-[#0F172A] font-bold text-3xl sm:text-4xl lg:text-[42px] leading-tight tracking-tight mb-3">
            Premium Global Brands We Deal With
          </h2>
          <p className="text-[#475569] text-sm sm:text-base lg:text-[17px] font-normal leading-relaxed">
            Global brands, trusted performance
          </p>
        </div>

        {/* Brands Infinite Marquee */}
        <div className="w-full flex justify-center">
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex gap-6 overflow-x-auto scrollbar-hide max-w-full pb-4 select-none"
            style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
          >
            {displayBrands.map((brand, i) => (
              <div
                key={i}
                className="w-[200px] sm:w-[220px] lg:w-[233px] h-[120px] sm:h-[135px] lg:h-[144px] flex-shrink-0 border border-[#E2E8F0] rounded-[12px] flex items-center justify-center p-5 bg-white transition-all duration-300 hover:shadow-md hover:border-[#E11D48] cursor-pointer"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={brand}
                    alt={`Premium Partner Brand ${(i % brands.length) + 1}`}
                    fill
                    sizes="233px"
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import Image from "next/image";

export default function WorkBanner() {
  return (
    <section className="w-full flex justify-center bg-[#111827] relative overflow-hidden">
      {/* Main Banner Container with Exact Figma Measurements: 1728px x 672px */}
      <div className="w-full max-w-[1728px] h-[520px] sm:h-[600px] lg:h-[672px] relative flex flex-col justify-center px-6 sm:px-12 md:px-16 xl:px-[80px] pt-16 lg:pt-[80px] pb-16 lg:pb-0 overflow-hidden font-poppins">
        {/* Background Bakery / Cafe Installation Image */}
        <Image
          src="/images/work/banner.webp"
          alt="Completed commercial bakery and cafe installation by Maxsel"
          fill
          priority
          sizes="(max-width: 1728px) 100vw, 1728px"
          className="object-cover w-full h-full select-none"
        />

        {/* Ambient Dark Gradient Overlays for High Legibility */}
        <div
          className="absolute inset-0 pointer-events-none select-none z-1"
          style={{
            background: `
              linear-gradient(90deg, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.58) 42%, rgba(0, 0, 0, 0.22) 75%, rgba(0, 0, 0, 0.1) 100%),
              linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, transparent 40%, rgba(0, 0, 0, 0.45) 100%)
            `,
          }}
        />

        {/* Content Container (Left-aligned matching Figma: gap 35px) */}
        <div className="relative z-10 max-w-[760px] flex flex-col gap-[35px]">
          {/* Main Heading */}
          <h1
            className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-bold leading-[1.12] tracking-tight drop-shadow-md"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Let’s Bring Great <br />
            Projects to Life
          </h1>

          {/* Subtitle / Paragraph */}
          <p
            className="text-[#D9DCE0] text-sm sm:text-base md:text-[18px] leading-[1.65] max-w-[720px] font-normal drop-shadow-sm"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Explore our completed projects and see how we deliver reliable
            commercial kitchen, bakery, refrigeration, and foodservice solutions
            to businesses across metropolitan areas.
          </p>
        </div>
      </div>
    </section>
  );
}

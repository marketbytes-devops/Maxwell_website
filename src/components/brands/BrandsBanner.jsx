"use client";

import React from "react";
import Image from "next/image";

export default function BrandsBanner() {
  return (
    <section className="w-full flex justify-center bg-[#111827] relative overflow-hidden">
      {/* Main Banner Container with Exact Figma Measurements: 1728px x 672px */}
      <div className="w-full max-w-[1728px] h-[520px] sm:h-[600px] lg:h-[672px] relative flex flex-col justify-center px-6 sm:px-12 md:px-16 xl:px-[80px] pt-16 lg:pt-[80px] pb-16 lg:pb-0 overflow-hidden font-poppins">
        {/* Background Hospitality & Cafe Interior Installation */}
        <Image
          src="/images/brands/banner.webp"
          alt="Make Your Brand Unforgettable - Maxsel Brands"
          fill
          priority
          sizes="(max-width: 1728px) 100vw, 1728px"
          className="object-cover w-full h-full select-none"
        />

        {/* Ambient Dark Gradient Overlays for Clean High Legibility matching Figma */}
        <div
          className="absolute inset-0 pointer-events-none select-none z-1"
          style={{
            background: `
              linear-gradient(90deg, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.58) 45%, rgba(0, 0, 0, 0.20) 75%, rgba(0, 0, 0, 0.08) 100%),
              linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, transparent 40%, rgba(0, 0, 0, 0.45) 100%)
            `,
          }}
        />

        {/* Content Container (Figma: 690px width x 210px height hug, gap 35px) */}
        <div className="relative z-10 max-w-[690px] flex flex-col gap-[35px]">
          {/* Main Heading */}
          <h1
            className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-bold leading-[1.12] tracking-tight drop-shadow-md"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Make Your Brand <br className="hidden sm:inline" />
            Unforgettable
          </h1>

          {/* Subtitle / Paragraph */}
          <p
            className="text-[#D9DCE0] text-sm sm:text-base md:text-[18px] leading-[1.65] max-w-[690px] font-normal drop-shadow-sm"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            We create meaningful brand identities that capture your vision, connect
            with your audience, and leave a lasting impression.
          </p>
        </div>
      </div>
    </section>
  );
}

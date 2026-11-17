"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import bannerImg from "@/assets/About_us/498a1c94445e34615839626e363e6942960bd3a2.jpg";

export default function AboutBanner() {
  return (
    <section className="w-full flex justify-center bg-[#0F141C] relative overflow-hidden">
      {/* Main Banner Container with Exact Figma Measurements: 1728px x 672px */}
      <div className="w-full max-w-[1728px] h-[540px] sm:h-[600px] lg:h-[672px] relative flex flex-col justify-center px-6 sm:px-12 md:px-16 xl:px-[80px] pt-16 lg:pt-0 overflow-hidden font-poppins">
        {/* Background Commercial Kitchen Image */}
        <Image
          src={bannerImg}
          alt="Commercial Kitchen and Foodservice Equipment by Maxsel Agencies"
          fill
          priority
          sizes="(max-width: 1728px) 100vw, 1728px"
          className="object-cover w-full h-full select-none object-center"
        />

        {/* Ambient Dark Gradient Overlays for High Legibility matching Figma */}
        <div
          className="absolute inset-0 pointer-events-none select-none z-1"
          style={{
            background: `
              linear-gradient(90deg, rgba(8, 11, 16, 0.88) 0%, rgba(8, 11, 16, 0.72) 42%, rgba(8, 11, 16, 0.32) 75%, rgba(8, 11, 16, 0.12) 100%),
              linear-gradient(180deg, rgba(8, 11, 16, 0.45) 0%, transparent 40%, rgba(8, 11, 16, 0.5) 100%)
            `,
          }}
        />

        {/* Content Container (Figma: 800 Hug width x 359 Hug height) */}
        <div className="relative z-10 max-w-[800px] flex flex-col gap-5 sm:gap-6">
          {/* Pill Badge */}
          <div className="w-fit">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#1A202C]/80 border border-white/20 text-[#E2E8F0] text-xs sm:text-[13px] font-medium tracking-wide backdrop-blur-md shadow-xs">
              About Maxsel Agencies
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[60px] font-bold leading-[1.12] tracking-tight drop-shadow-md"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            The Right Solutions for Your{" "}
            <span className="text-[#E52534]">Business.</span>
          </h1>

          {/* Subtitle / Paragraph */}
          <p
            className="text-[#D1D5DB] text-sm sm:text-base md:text-[17px] lg:text-[18px] leading-[1.65] max-w-[740px] font-normal drop-shadow-sm"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Since 1991, we’ve helped businesses explore professional equipment
            solutions for commercial kitchens, bakeries, cafés, refrigeration and
            foodservice operations.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4 flex-wrap pt-2">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-[12px] bg-[#E52534] hover:bg-[#CC1E2B] text-white font-medium text-sm sm:text-base transition-all duration-300 shadow-lg shadow-[#E52534]/25 hover:shadow-[#E52534]/40 active:scale-95 cursor-pointer"
            >
              Explore Our Products
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-[12px] border border-white/60 hover:border-white bg-black/40 hover:bg-white/10 text-white font-medium text-sm sm:text-base transition-all duration-300 backdrop-blur-xs active:scale-95 cursor-pointer"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


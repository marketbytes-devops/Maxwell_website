"use client";

import React from "react";
import Image from "next/image";
import storyImg from "@/assets/About_us/0232ef1dbb42e9c0af2996496ae40b806a35bdb0.jpg";

export default function AboutStory() {
  return (
    <section className="w-full flex justify-center bg-white py-16 sm:py-20 lg:py-[90px] px-6 sm:px-12 md:px-16 xl:px-[80px] font-poppins overflow-hidden">
      {/* Overall Section Container: Width: 1568px, Height: 624px, Gap: 80px */}
      <div className="w-full max-w-[1568px] flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-[80px]">
        {/* Left Side: Image (737px x 624px) + Floating Red Card (215px x 178px, #E11D48) */}
        <div className="w-full lg:w-[737px] h-[480px] sm:h-[560px] lg:h-[624px] relative shrink-0">
          <div className="w-full h-full relative overflow-hidden rounded-[8px] bg-gray-100">
            <Image
              src={storyImg}
              alt="Chefs preparing food with commercial kitchen equipment - Maxsel Agencies"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 737px"
              className="object-cover w-full h-full select-none"
            />
          </div>

          {/* Floating Red Card (Compact, unified gap matching target design) */}
          <div
            className="absolute -bottom-4 right-0 sm:right-4 lg:-bottom-5 lg:-right-5 w-[175px] sm:w-[185px] bg-[#E11D48] text-white p-4 sm:p-4.5 flex flex-col gap-3 shadow-xl z-10"
            style={{ backgroundColor: "#E11D48" }}
          >
            <h3 className="font-poppins font-medium text-[17px] sm:text-[18px] leading-[1.25] text-white">
              Built on <br />
              Experiences
            </h3>
            <p className="font-poppins font-normal text-[12px] sm:text-[12.5px] leading-[1.4] text-white/90">
              Serving Kerala&apos;s hospitality sectors since 1991
            </p>
          </div>
        </div>

        {/* Right Side: Content (Width: 751px, Height: 624px, Gap: 32px) */}
        <div className="w-full lg:w-[751px] flex flex-col justify-between gap-8 lg:gap-[32px] lg:h-[624px]">
          {/* Main Story Content */}
          <div className="flex flex-col gap-4 sm:gap-5">
            <span
              className="font-semibold text-xs sm:text-sm tracking-wider uppercase"
              style={{ color: "#E11D48" }}
            >
              OUR STORY
            </span>

            <h2 className="text-[#0F172A] font-bold text-3xl sm:text-4xl lg:text-[42px] xl:text-[44px] leading-[1.18] tracking-tight">
              A legacy of understanding business needs.
            </h2>

            <div className="flex flex-col gap-4 text-[#475569] text-sm sm:text-base leading-[1.68] font-normal pt-1">
              <p>
                Established in 1991, Maxsel Agencies serves businesses across the
                hospitality and foodservice sector with a broad portfolio of
                professional equipment.
              </p>
              <p>
                Over the years, our focus has been on understanding the different
                requirements of businesses—from space and capacity to workflow and
                day-to-day operational needs. We recognize that every business is
                different, and choosing the right equipment is an important part of
                building an efficient operation.
              </p>
              <p>
                Today, our portfolio spans commercial kitchen, bakery,
                refrigeration, coffee and café, supermarket, and foodservice
                equipment. We help customers explore suitable choices from
                established brands with a professional, customer-focused approach.
              </p>
            </div>
          </div>

          {/* Bottom Checklist Row */}
          <div className="border-t border-[#E2E8F0] pt-6 sm:pt-8 flex flex-wrap items-center gap-6 sm:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#FFE4E8] text-[#E11D48] flex items-center justify-center shrink-0">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-[#1E293B] text-sm sm:text-[15px] font-medium whitespace-nowrap">
                Established expertise
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#FFE4E8] text-[#E11D48] flex items-center justify-center shrink-0">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-[#1E293B] text-sm sm:text-[15px] font-medium whitespace-nowrap">
                Diverse portfolio
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#FFE4E8] text-[#E11D48] flex items-center justify-center shrink-0">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-[#1E293B] text-sm sm:text-[15px] font-medium whitespace-nowrap">
                Trusted brands
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

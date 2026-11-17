"use client";

import React from "react";
import Image from "next/image";

// Import images from assets/About_us
import visionImg from "@/assets/About_us/f4129d3575d3f6a77d00bf2336e70209d34741ba.jpg";
import missionImg from "@/assets/About_us/461df2f19b928923b9d4072727f66cdbef5fbd7b.jpg";

export default function AboutVisionMission() {
  return (
    <section className="w-full flex justify-center bg-white py-14 sm:py-20 lg:py-[90px] px-6 sm:px-12 md:px-16 xl:px-[80px] font-poppins">
      {/* Overall Section Container: Width: 1568px, Gap: 24px */}
      <div className="w-full max-w-[1568px] flex flex-col gap-8 sm:gap-10 lg:gap-12">
        {/* Top Header Block */}
        <div className="flex flex-col gap-3">
          <span
            className="font-semibold text-xs sm:text-sm tracking-wider uppercase"
            style={{ color: "#E11D48" }}
          >
            OUR VISION &amp; MISSION
          </span>

          <h2 className="text-[#0F172A] font-bold text-3xl sm:text-4xl lg:text-[42px] leading-[1.2] tracking-tight">
            A clear purpose for every partnership.
          </h2>
        </div>

        {/* Two Columns Grid: Gap: 24px, 1568px container */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-[24px]">
          {/* Left Column: Our Vision */}
          <div className="flex flex-col gap-5 sm:gap-6 group">
            {/* Image Container */}
            <div className="w-full h-[280px] sm:h-[360px] lg:h-[420px] relative rounded-[8px] overflow-hidden bg-gray-100 shadow-sm">
              <Image
                src={visionImg}
                alt="Commercial refrigerated display showcase with juices - Our Vision"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 772px"
                style={{ objectPosition: "center 21%" }}
                className="object-cover w-full h-full select-none transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Text Content */}
            <div className="flex flex-col gap-2.5">
              <h3 className="font-bold text-2xl sm:text-[28px] text-[#0F172A] leading-snug">
                Our Vision
              </h3>
              <p className="text-[#475569] text-sm sm:text-[15.5px] leading-[1.65] font-normal">
                To be a trusted name in professional commercial kitchen, bakery
                and foodservice equipment, helping businesses access suitable
                equipment solutions for their evolving needs.
              </p>
            </div>
          </div>

          {/* Right Column: Our Mission */}
          <div className="flex flex-col gap-5 sm:gap-6 group">
            {/* Image Container */}
            <div className="w-full h-[280px] sm:h-[360px] lg:h-[420px] relative rounded-[8px] overflow-hidden bg-gray-100 shadow-sm">
              <Image
                src={missionImg}
                alt="Commercial bakery display shelves showcasing fresh pastries and bread - Our Mission"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 772px"
                style={{ objectPosition: "center 30%" }}
                className="object-cover w-full h-full select-none transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Text Content */}
            <div className="flex flex-col gap-2.5">
              <h3 className="font-bold text-2xl sm:text-[28px] text-[#0F172A] leading-snug">
                Our Mission
              </h3>
              <p className="text-[#475569] text-sm sm:text-[15.5px] leading-[1.65] font-normal">
                To provide businesses with reliable equipment choices from
                established brands, supported by professional product guidance
                and a customer-focused approach.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";

export default function SolutionsBanner({ onGetStarted }) {
  return (
    <section className="w-full flex justify-center bg-[#13460C] relative">
      {/* Main Banner Container with Exact Figma Measurements: 1728px x 801.36px */}
      <div
        className="w-full max-w-[1728px] min-h-[580px] sm:min-h-[680px] lg:h-[801.36px] relative flex flex-col justify-center px-6 sm:px-12 md:px-16 xl:px-[100px] py-16 lg:py-0 font-poppins"
        style={{
          backgroundColor: "#1B5713",
          backgroundImage: `
            radial-gradient(circle at 75% 55%, rgba(42, 175, 23, 0.45) 0%, transparent 60%),
            linear-gradient(112deg, #13460C 0%, #1B5713 32%, #187812 68%, #20A217 100%)
          `,
        }}
      >
        {/* Background Layer: Contains Faint Concentric Contour Rings clipped inside banner */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="65%" cy="80%" r="260" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1.2" />
            <circle cx="65%" cy="80%" r="420" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" />
            <circle cx="65%" cy="80%" r="620" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" />
            <circle cx="65%" cy="80%" r="840" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1.2" />
          </svg>
        </div>

        {/* Content Container (Left Aligned matching Reference) */}
        <div className="relative z-10 flex flex-col max-w-[850px]">
          {/* Main Title */}
          <h1
            className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold leading-[1.12] tracking-tight drop-shadow-xs"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Equipment Solutions <br />
            for Every Industry
          </h1>

          {/* Subtitle Description */}
          <p
            className="text-white/90 text-sm sm:text-base md:text-[17px] leading-[1.65] max-w-[720px] font-normal mt-5 mb-8 drop-shadow-xs"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            At Maxsel Agencies, we provide professional equipment solutions for the diverse needs of the hospitality and foodservice industry. From commercial kitchens and bakeries to cafés, supermarkets, and ice cream businesses, our wide product range supports different business requirements. With established brands and a customer-focused approach, we help businesses explore suitable equipment for their space, capacity, and operational needs.
          </p>

          {/* Action Button: Get Started for Free */}
          <div>
            <button
              type="button"
              onClick={onGetStarted}
              className="inline-flex items-center justify-center h-[50px] px-8 bg-white hover:bg-gray-50 active:scale-[0.98] text-[#1B5713] font-semibold text-[15px] sm:text-[16px] rounded-[10px] shadow-sm hover:shadow-md transition-all cursor-pointer"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Get Started for Free
            </button>
          </div>
        </div>

        {/* Bottom Right Circular Badge (Growing Since 2014) */}
        {/* Exactly matches Figma reference: static orientation, solid green center, half-protruding across bottom edge */}
        <div className="absolute right-8 sm:right-16 md:right-24 lg:right-[110px] xl:right-[130px] bottom-0 translate-y-1/2 w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] md:w-[170px] md:h-[170px] z-30 pointer-events-none select-none">
          <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
            <defs>
              {/* Counter-clockwise circle path starting at 3 o'clock (x=164, y=100) */}
              <path
                id="growingCCWPath"
                d="M 100, 100 m 64, 0 a 64,64 0 0,0 -128,0 a 64,64 0 0,0 128,0"
                fill="none"
              />
            </defs>

            {/* Inner Solid Green Circle: Pure vibrant green, no white border, flat crisp edge */}
            <circle cx="100" cy="100" r="34" fill="#14A800" />

            {/* GROWING: starts just above 3 o'clock and curves toward 12 o'clock */}
            <text
              className="text-[14.5px] font-bold fill-black tracking-[4px]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <textPath href="#growingCCWPath" startOffset="1.5%">
                GROWING
              </textPath>
            </text>

            {/* SINCE: curves toward 9 o'clock and ends right at dividing line */}
            <text
              className="text-[14.5px] font-bold fill-black tracking-[4px]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <textPath href="#growingCCWPath" startOffset="33.5%">
                SINCE
              </textPath>
            </text>

            {/* 2014: starts right below 9 o'clock on the white background */}
            <text
              className="text-[14.5px] font-bold fill-black tracking-[4.5px]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <textPath href="#growingCCWPath" startOffset="53%">
                2014
              </textPath>
            </text>

            {/* WE ARE: curves up toward 3 o'clock on the white background */}
            <text
              className="text-[14.5px] font-bold fill-black tracking-[4px]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <textPath href="#growingCCWPath" startOffset="78%">
                WE ARE
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}

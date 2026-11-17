"use client";

import React from "react";

const principles = [
  {
    id: "customer-focus",
    title: "Customer Focus",
    description:
      "Understanding business requirements and helping customers explore suitable solutions.",
    icon: (
      <svg
        className="w-8 h-8 sm:w-9 sm:h-9"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
      </svg>
    ),
  },
  {
    id: "quality",
    title: "Quality",
    description:
      "Offering reliable equipment choices from established brands.",
    icon: (
      <svg
        className="w-8 h-8 sm:w-9 sm:h-9"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    id: "integrity",
    title: "Integrity",
    description: "Upholding transparent and honest business practices.",
    icon: (
      <svg
        className="w-8 h-8 sm:w-9 sm:h-9"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 19v-1a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v1" />
        <circle cx="8.5" cy="7" r="3.5" />
        <path d="M16 11.5l3-1.5 3 1.5v3c0 2.5-3 4-3 4s-3-1.5-3-4v-3z" />
      </svg>
    ),
  },
  {
    id: "professionalism",
    title: "Professionalism",
    description:
      "Maintaining a professional approach to product guidance and customer interactions.",
    icon: (
      <svg
        className="w-8 h-8 sm:w-9 sm:h-9"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    id: "reliability",
    title: "Reliability",
    description: "Building lasting relationships with customers.",
    icon: (
      <svg
        className="w-8 h-8 sm:w-9 sm:h-9"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m3 9 9-5 9 5" />
        <path d="M4 10h16" />
        <path d="M6 14v4" />
        <path d="M10 14v4" />
        <path d="M2 19h10" />
        <path d="M16 13l2.5-1.2 2.5 1.2v2.5c0 2-2.5 3.5-2.5 3.5s-2.5-1.5-2.5-3.5V13z" />
      </svg>
    ),
  },
  {
    id: "continuous-improvement",
    title: "Continuous Improvement",
    description:
      "Continuously growing our expertise and range of solutions.",
    icon: (
      <svg
        className="w-8 h-8 sm:w-9 sm:h-9"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 3v8" />
        <path d="M14 3h5a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-5" />
        <path d="M14 15l-3.5 2-3.5-2V11l3.5-2 3.5 2v4z" />
        <circle cx="6.5" cy="7.5" r="1.5" />
      </svg>
    ),
  },
];

export default function AboutPrinciples() {
  return (
    <section
      className="w-full flex justify-center py-16 sm:py-20 lg:py-[80px] px-6 sm:px-12 md:px-16 xl:px-[80px] font-poppins"
      style={{ backgroundColor: "#FFEBEB" }}
    >
      {/* Container: Max width: 1568px, Gap: 32px */}
      <div className="w-full max-w-[1568px] flex flex-col gap-8 sm:gap-10 lg:gap-[32px]">
        {/* Top Header Block */}
        <div className="flex flex-col gap-2.5 sm:gap-3">
          <span
            className="font-semibold text-xs sm:text-sm tracking-wider uppercase"
            style={{ color: "#E11D48" }}
          >
            OUR VALUES
          </span>

          <h2 className="text-[#0F172A] font-bold text-3xl sm:text-4xl lg:text-[42px] leading-[1.2] tracking-tight">
            The Principles Behind Our Work
          </h2>
        </div>

        {/* 6 Cards Grid: 3 columns x 2 rows, gap: 32px */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-[32px]">
          {principles.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[8px] p-8 sm:p-9 lg:p-10 flex flex-col justify-between min-h-[250px] sm:min-h-[275px] lg:h-[295px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow duration-300"
            >
              {/* Top Icon */}
              <div className="flex items-center justify-start text-[#0F172A]">
                {item.icon}
              </div>

              {/* Bottom Content: Title & Description */}
              <div className="flex flex-col gap-2 pt-6">
                <h3 className="font-bold text-lg sm:text-[19px] text-[#0F172A] leading-snug">
                  {item.title}
                </h3>
                <p className="text-[#475569] text-xs sm:text-[13.5px] lg:text-[14px] leading-[1.6] font-normal">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

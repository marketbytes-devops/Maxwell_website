"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const articles = [
  {
    id: 1,
    title: "Planning Commercial Kitchen Ventilation Rates Correctly",
    date: "Oct 12, 2026",
    readTime: "6 Min Read",
    image: "/images/work/ventilation.webp",
    link: "#",
  },
  {
    id: 2,
    title: "Eco-Design: Planning Food Prep Areas for Less Waste",
    date: "Sep 12, 2026",
    readTime: "8 Min Read",
    image: "/images/work/eco_design.webp",
    link: "#",
  },
  {
    id: 3,
    title: "5 Crucial Maintenance Steps for Commercial Steam Ovens",
    date: "May 14, 2026",
    readTime: "4 Min Read",
    image: "/images/work/steam_oven.webp",
    link: "#",
  },
];

export default function WorkInsights() {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-white font-poppins flex justify-center">
      <div className="w-full max-w-[1728px] px-4 sm:px-8 md:px-12 xl:px-[77.5px] flex flex-col items-center">
        {/* Section Header */}
        <div className="w-full max-w-[1573px] flex flex-col mb-10 sm:mb-14">
          <h2 className="text-[#0F172A] font-bold text-2xl sm:text-3xl lg:text-[40px] leading-[1.2] mb-3">
            Culinary Insights & Engineering Guides
          </h2>
          <p className="text-[#475569] font-normal text-base sm:text-[18px] leading-[1.5]">
            Keep up to date with smart kitchen maintenance rules, safety compliance tips, and layout planning.
          </p>
        </div>

        {/* 3 Cards Container with exact Figma measurements: 1573px total, 24px gap, 508.33px card width, 572px height */}
        <div className="w-full max-w-[1573px] grid grid-cols-1 md:grid-cols-3 gap-[24px]">
          {articles.map((article) => (
            <div
              key={article.id}
              className="w-full max-w-[508.33px] mx-auto h-auto lg:h-[572px] rounded-[16px] border border-[#E2E8F0] bg-white flex flex-col overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 group cursor-pointer"
            >
              {/* Card Image: 508.33px x 388px */}
              <div className="w-full h-[260px] sm:h-[320px] lg:h-[388px] relative overflow-hidden bg-gray-50 shrink-0">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 508px"
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Card Content */}
              <div className="p-6 lg:p-[24px] flex flex-col justify-between flex-grow">
                <div>
                  {/* Meta: Date + Read Time pill badge matching reference */}
                  <div className="flex items-center gap-2 mb-3 text-[13px] sm:text-[14px]">
                    <span className="text-[#E63F63] font-medium">{article.date}</span>
                    <span className="text-[#CBD5E1]">•</span>
                    <span className="inline-block px-2.5 py-0.5 rounded-full border border-[#41AE46] text-[#41AE46] text-[11px] sm:text-[12px] font-medium bg-green-50/40">
                      {article.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-[18px] sm:text-[19px] leading-[1.38] text-[#0F172A] line-clamp-2 group-hover:text-[#E63F63] transition-colors">
                    {article.title}
                  </h3>
                </div>

                {/* Read Article Bordered Link Button */}
                <div className="mt-4 pt-2">
                  <Link
                    href={article.link}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[6px] border border-[#E63F63]/30 text-[#E63F63] hover:bg-rose-50/60 active:scale-95 text-[13px] sm:text-[14px] font-medium transition-all"
                  >
                    <span>Read Article</span>
                    <svg
                      className="w-3.5 h-3.5 stroke-[2.5]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

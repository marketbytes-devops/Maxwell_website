"use client";

import React, { useRef } from "react";
import Image from "next/image";

// Import images from assets/solutions
import hospitalityImg from "@/assets/solutions/hospitality.webp";
import restaurantImg from "@/assets/solutions/restaurant.webp";
import bakeryImg from "@/assets/solutions/bakery.webp";
import cafeImg from "@/assets/solutions/cafe.webp";
import icecreamImg from "@/assets/solutions/icecream.webp";
import supermarketImg from "@/assets/solutions/supermarket.webp";

const industries = [
  {
    id: "hotels",
    title: "Hotels",
    description:
      "Professional commercial kitchen, refrigeration and foodservice equipment for hospitality operations.",
    image: hospitalityImg,
    alt: "Commercial kitchen equipment and wash area for hotels and hospitality",
  },
  {
    id: "restaurants",
    title: "Restaurants",
    description:
      "Cooking, food preparation and refrigeration equipment to support restaurant operations.",
    image: restaurantImg,
    alt: "Commercial cooking fryers and preparation tables for restaurants",
  },
  {
    id: "bakeries",
    title: "Bakeries",
    description:
      "Bakery ovens, mixers, proofers and other equipment for bakeries, patisseries and commercial production units.",
    image: bakeryImg,
    alt: "Commercial bakery deck ovens and fresh bread baking equipment",
  },
  {
    id: "cafes",
    title: "Cafes",
    description:
      "Professional espresso machines, coffee grinders, refrigeration and display showcases for cafés and coffee shops.",
    image: cafeImg,
    alt: "Artisan cafe espresso machines and coffee equipment",
  },
  {
    id: "ice-cream",
    title: "Ice Cream & Juice Bars",
    description:
      "Specialized equipment for ice cream parlours, gelato businesses and juice bars, supporting preparation and display.",
    image: icecreamImg,
    alt: "Commercial gelato scooping displays and juice bar equipment",
  },
  {
    id: "supermarkets",
    title: "Supermarkets",
    description:
      "Refrigeration and display equipment designed for supermarkets and retail stores to support storage and display.",
    image: supermarketImg,
    alt: "Supermarket retail multideck refrigeration and product displays",
  },
];

export default function AboutIndustries() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 496; // 480px card + 16px gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full flex justify-center bg-white py-14 sm:py-20 lg:py-[90px] px-6 sm:px-12 md:px-16 xl:px-[80px] font-poppins overflow-hidden">
      {/* Container: Max width: 1568px */}
      <div className="w-full max-w-[1568px] flex flex-col gap-8 sm:gap-10">
        {/* Header Row with Title and Scroll Arrows */}
        <div className="w-full flex items-end justify-between gap-4">
          <div className="flex flex-col gap-2.5 sm:gap-3">
            <span
              className="font-semibold text-xs sm:text-sm tracking-wider uppercase"
              style={{ color: "#E11D48" }}
            >
              INDUSTRIES WE SERVE
            </span>

            <h2 className="text-[#0F172A] font-bold text-3xl sm:text-4xl lg:text-[42px] leading-[1.2] tracking-tight">
              Equipment Solutions for Diverse Business Needs
            </h2>
          </div>

          {/* Navigation Scroll Buttons */}
          <div className="hidden sm:flex items-center gap-2 shrink-0 pb-1">
            <button
              onClick={() => scroll("left")}
              aria-label="Previous industries"
              className="w-10 h-10 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-600 transition shadow-xs cursor-pointer"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Next industries"
              className="w-10 h-10 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-600 transition shadow-xs cursor-pointer"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal Cards Scroll Row: Gap: 16px */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-[16px] pb-4 w-full scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {industries.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-[280px] sm:w-[380px] md:w-[440px] lg:w-[480px] flex flex-col gap-4 group snap-start"
            >
              {/* Card Image Container */}
              <div className="w-full h-[220px] sm:h-[280px] lg:h-[320px] relative rounded-[8px] overflow-hidden bg-gray-100 shadow-sm">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 440px, 480px"
                  className="object-cover w-full h-full select-none transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Card Content: Title & Description */}
              <div className="flex flex-col gap-2 pt-1">
                <h3 className="font-bold text-xl sm:text-2xl text-[#0F172A] leading-snug">
                  {item.title}
                </h3>
                <p className="text-[#475569] text-xs sm:text-sm lg:text-[14.5px] leading-[1.6] font-normal">
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

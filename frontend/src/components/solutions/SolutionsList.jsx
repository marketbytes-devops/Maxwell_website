"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export const solutionsData = [
  {
    id: "hotels-hospitality",
    title: "HOTELS & HOSPITALITY",
    subTitle: "Professional Equipment for Hospitality Businesses",
    description:
      "Equip your hospitality operations with professional kitchen and refrigeration solutions. Our equipment range supports food preparation, cooking, storage, and service requirements.",
    images: ["/images/solutions/hospitality.webp"],
    alt: "Commercial kitchen equipment for hotels and hospitality",
    products: [
      ["Combi Oven", "Undercounter Refrigerator", "Reach-In Cabinet", "Dishwasher", "Blast Chiller / Freezer", "Floor-Standing Fryer"],
      ["Steamer", "Preparation Table", "Wine Cooler", "Back Bar Cooler", "Ice Cube Machine", "Glass Washer"]
    ],
    imagePosition: "left", // Image Left, Content Right
  },
  {
    id: "restaurants-food-service",
    title: "RESTAURANTS & FOOD SERVICE",
    subTitle: "Reliable Solutions for Commercial Kitchens",
    description:
      "Explore commercial kitchen equipment suited to the daily operational needs of restaurants and foodservice businesses, from food preparation and cooking to refrigeration and cleaning.",
    images: ["/images/solutions/restaurant.webp"],
    alt: "Modern restaurant kitchen equipment",
    products: [
      ["Combi Oven", "Undercounter Refrigerator", "Reach-In Cabinet", "Dishwasher"],
      ["Blast Chiller / Freezer", "Floor-Standing Fryer", "Steamer", "Preparation Table"]
    ],
    imagePosition: "right", // Content Left, Image Right
  },
  {
    id: "bakeries-patisseries",
    title: "BAKERIES & PATISSERIES",
    subTitle: "Professional Equipment for Baking Businesses",
    description:
      "From dough preparation to baking, discover professional equipment for bakeries, patisseries, and commercial production units.",
    images: ["/images/solutions/bakery.webp"],
    alt: "Commercial bakery with industrial deck ovens and spiral mixers",
    products: [
      ["Planetary Mixer", "Spiral Mixer"],
      ["Proofer", "Deck Oven"]
    ],
    imagePosition: "left", // Image Left, Content Right
  },
  {
    id: "cafes-coffee-shops",
    title: "CAFÉS & COFFEE SHOPS",
    subTitle: "Everything Your Café Needs",
    description:
      "Explore professional equipment for coffee preparation, food service, and product display, with solutions suited to cafés and coffee shops.",
    images: ["/images/solutions/cafe.webp"],
    alt: "Artisan café equipment with commercial espresso machines and displays",
    products: [
      [
        "Semi-Automatic Coffee Machine",
        "Fully Automatic Coffee Machine",
        "Coffee Grinder",
        "High-Speed Oven",
        "Cake Display Showcase",
        "Tall Display Showcase"
      ],
      [
        "Countertop Display",
        "Commercial Blender",
        "Commercial Microwave Oven",
        "Contact Grill",
        "Bun Toaster",
        "Tabletop Fryer"
      ]
    ],
    imagePosition: "right", // Content Left, Image Right
  },
  {
    id: "ice-cream-juice-bars",
    title: "ICE CREAM & JUICE BARS",
    subTitle: "Specialized Equipment for Frozen Desserts and Beverages",
    description:
      "Discover equipment for ice cream parlours, gelato businesses, and juice bars, supporting product preparation and display.",
    images: ["/images/solutions/icecream.webp"],
    alt: "Gelato parlour scooping showcase and commercial juice bar equipment",
    products: [
      ["Soft Serve Freezer", "Gelato Batch Freezer", "Ice Cream & Gelato Scooping Display"],
      ["Commercial Blender", "Juice Dispenser"]
    ],
    imagePosition: "left", // Image Left, Content Right
  },
  {
    id: "supermarkets-retail",
    title: "SUPERMARKETS & RETAIL",
    subTitle: "Refrigeration and Display Solutions for Retail",
    description:
      "Explore refrigeration equipment designed for supermarkets and retail stores to support the storage and display of chilled and frozen products.",
    images: ["/images/solutions/supermarket.webp"],
    alt: "Supermarket retail multideck refrigeration and island display freezers",
    products: [
      ["Multideck Chiller", "Island Freezer", "Vertical Freezer"],
      ["Visi Cooler", "Glass-Top Freezer", "Hard-Top Freezer"]
    ],
    imagePosition: "right", // Content Left, Image Right
  },
];

function SolutionItem({ solution }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrev = () => {
    if (solution.images.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? solution.images.length - 1 : prev - 1));
    }
  };

  const handleNext = () => {
    if (solution.images.length > 1) {
      setCurrentImageIndex((prev) => (prev === solution.images.length - 1 ? 0 : prev + 1));
    }
  };

  const isImageLeft = solution.imagePosition === "left";

  return (
    <div
      id={solution.id}
      className={`w-full flex flex-col ${
        isImageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
      } items-center justify-between gap-8 sm:gap-10 xl:gap-[47px]`}
    >
      {/* Solution Image Card with Navigation Controls */}
      <div className="w-full lg:w-[50%] xl:w-[748px] h-[340px] sm:h-[420px] md:h-[460px] lg:h-[504px] relative rounded-[12px] overflow-hidden shadow-sm shrink-0 group">
        <Image
          src={solution.images[currentImageIndex]}
          alt={solution.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 748px"
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.02]"
          priority={solution.id === "hotels-hospitality"}
        />

        {/* Carousel Arrow Controls (Chevron Buttons matching reference) */}
        <div
          className={`absolute top-5 sm:top-6 ${
            isImageLeft ? "left-5 sm:left-6" : "right-5 sm:right-6"
          } flex items-center gap-2 z-10`}
        >
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous image"
            className="w-10 h-10 rounded-full bg-white/85 hover:bg-white active:scale-95 backdrop-blur-md flex items-center justify-center text-gray-800 shadow-md transition-all cursor-pointer"
          >
            <svg
              className="w-4 h-4 stroke-[2.5]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next image"
            className="w-10 h-10 rounded-full bg-white/85 hover:bg-white active:scale-95 backdrop-blur-md flex items-center justify-center text-gray-800 shadow-md transition-all cursor-pointer"
          >
            <svg
              className="w-4 h-4 stroke-[2.5]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Solution Text Content Container */}
      <div className="w-full lg:w-[50%] xl:w-[703px] flex flex-col justify-center">
        {/* Main Section Heading: Roboto 600, 40px, #323334 */}
        <h2
          className="text-[#323334] text-2xl sm:text-3xl lg:text-[40px] font-semibold leading-[1.1] uppercase tracking-normal"
          style={{ fontFamily: "'Roboto', sans-serif" }}
        >
          {solution.title}
        </h2>

        {/* Sub-heading: Poppins 500, 20px, #000000 */}
        <h3
          className="text-[#000000] text-lg sm:text-[20px] font-medium leading-[29px] tracking-[0.015em] mt-3 sm:mt-4 text-justify sm:text-left"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {solution.subTitle}
        </h3>

        {/* Content Paragraph: Poppins 400, 18px, #737373 */}
        <p
          className="text-[#737373] text-base sm:text-[18px] font-normal leading-[29px] tracking-[0.015em] mt-2 sm:mt-3 text-justify sm:text-left"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {solution.description}
        </p>

        {/* Product Points in 2 Columns: #272727 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 lg:gap-x-10 gap-y-2 mt-5 sm:mt-6 mb-7 sm:mb-8">
          {/* Column 1 */}
          <ul className="space-y-2">
            {solution.products[0].map((item, idx) => (
              <li
                key={idx}
                className="flex items-start text-[#272727] text-[15px] sm:text-[16px] leading-[26px] font-normal"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <span className="mr-2 text-base select-none leading-[26px]">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Column 2 */}
          <ul className="space-y-2">
            {solution.products[1].map((item, idx) => (
              <li
                key={idx}
                className="flex items-start text-[#272727] text-[15px] sm:text-[16px] leading-[26px] font-normal"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <span className="mr-2 text-base select-none leading-[26px]">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button: Explore Our Products */}
        <div>
          <Link
            href="/products"
            className="inline-flex items-center justify-center h-[48px] sm:h-[50px] px-8 rounded-[10px] bg-[#FBC331] hover:bg-[#fabc22] active:scale-[0.98] text-[#1F2937] font-semibold text-[15px] sm:text-[16px] shadow-sm hover:shadow-md transition-all cursor-pointer"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Explore Our Products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SolutionsList() {
  return (
    <section className="w-full flex justify-center bg-white pt-24 pb-20 sm:pb-28 lg:pb-36">
      <div className="w-full max-w-[1728px] px-6 sm:px-12 md:px-16 xl:px-[126px] flex flex-col space-y-20 sm:space-y-24 lg:space-y-28 xl:space-y-32">
        {solutionsData.map((solution) => (
          <SolutionItem key={solution.id} solution={solution} />
        ))}
      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import WorkBanner from "@/components/work/WorkBanner";
import RequestQuoteModal from "@/components/common/RequestQuoteModal";

const allProjects = [
  {
    id: 1,
    tag: "Hotel Kitchen",
    category: "Hotels & Resorts",
    title: "Grand Plaza Resort & Convention",
    location: "Kochi, Kerala",
    description: "Complete turnkey commercial kitchen setup including combi ovens, custom stainless steel preparation lines, and heavy-duty cold rooms.",
    image: "/images/solutions/hospitality.webp",
    scope: ["Combi Ovens", "Refrigeration", "Custom Fabrication"],
  },
  {
    id: 2,
    tag: "Fine Dining",
    category: "Commercial Kitchens",
    title: "Azure Coastal Bistro & Grill",
    location: "Trivandrum, Kerala",
    description: "High-output restaurant kitchen setup with blast chillers, floor-standing fryers, dishwashing systems, and exhaust hood integration.",
    image: "/images/solutions/restaurant.webp",
    scope: ["Cooking Ranges", "Blast Chillers", "Dishwashers"],
  },
  {
    id: 3,
    tag: "Artisanal Bakery",
    category: "Cafés & Bakeries",
    title: "The Pastry Lounge & Bakehouse",
    location: "Bangalore, Karnataka",
    description: "Industrial baking facility equipped with multi-deck ovens, spiral mixers, planetary dough preparators, and temperature-controlled proofing chambers.",
    image: "/images/solutions/bakery.webp",
    scope: ["Deck Ovens", "Spiral Mixers", "Proofers"],
  },
  {
    id: 4,
    tag: "Coffee Lab",
    category: "Cafés & Bakeries",
    title: "The Daily Brew Specialty Cafe",
    location: "Kollam, Kerala",
    description: "Specialty cafe layout with multi-group espresso machines, commercial coffee grinders, countertop cake display showcases, and high-speed ovens.",
    image: "/images/solutions/cafe.webp",
    scope: ["Espresso Machines", "Cake Showcases", "Commercial Blenders"],
  },
  {
    id: 5,
    tag: "Gelato Parlour",
    category: "Cafés & Bakeries",
    title: "Gelato & Glow Artisan Dessert Bar",
    location: "Kochi, Kerala",
    description: "Custom illuminated curved glass gelato scooping showcases, batch freezers, and commercial juice dispensers designed for high-traffic customer service.",
    image: "/images/solutions/icecream.webp",
    scope: ["Gelato Batch Freezers", "Scooping Counters", "Juice Dispensers"],
  },
  {
    id: 6,
    tag: "Retail Cold Chain",
    category: "Supermarkets",
    title: "FreshMart Hypermarket & Cold Storage",
    location: "Kozhikode, Kerala",
    description: "Central supermarket refrigeration including open-air multideck produce chillers, island display freezers, and glass-door visi coolers.",
    image: "/images/solutions/supermarket.webp",
    scope: ["Multideck Chillers", "Island Freezers", "Visi Coolers"],
  },
  {
    id: 7,
    tag: "Banquet & Events",
    category: "Hotels & Resorts",
    title: "Imperial Crown Regency Hall",
    location: "Hyderabad, Telangana",
    description: "Bulk banqueting kitchen facility capable of catering up to 2,000 guests simultaneously with heavy steam cooking kettles and holding cabinets.",
    image: "/projects/card1.webp",
    scope: ["Steam Cooking", "Holding Cabinets", "Dishwashing"],
  },
  {
    id: 8,
    tag: "QSR Chain",
    category: "Cloud Kitchens & QSR",
    title: "Urban Express Kitchens",
    location: "Chennai, Tamil Nadu",
    description: "Optimized compact line setup for fast-paced quick service operations, tabletop fryers, conveyor toasters, and rapid cook ovens.",
    image: "/projects/card2.webp",
    scope: ["Rapid Ovens", "Tabletop Fryers", "Underbar Prep"],
  },
  {
    id: 9,
    tag: "Cloud Kitchen",
    category: "Cloud Kitchens & QSR",
    title: "Bite-Sized Delivery Kitchen Hub",
    location: "Mumbai, Maharashtra",
    description: "High-efficiency multi-brand shared ghost kitchen facility featuring modular cooking ranges, reach-in refrigeration, and automated fire safety.",
    image: "/projects/card4.webp",
    scope: ["Modular Ranges", "Reach-In Fridges", "Ventilation"],
  },
];

const categories = [
  "All Projects",
  "Hotels & Resorts",
  "Commercial Kitchens",
  "Cafés & Bakeries",
  "Cloud Kitchens & QSR",
  "Supermarkets",
];

export default function WorkPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Projects");
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const filteredProjects =
    selectedCategory === "All Projects"
      ? allProjects
      : allProjects.filter((p) => p.category === selectedCategory);

  return (
    <main className="w-full bg-[#FAFAFA] min-h-screen font-poppins">
      {/* Work Banner Section matching exact Figma measurements (1728px x 672px, px-[80px], pt-[80px], gap: 35px) */}
      <WorkBanner />

      {/* Main Filter & Gallery Section */}
      <section className="w-full flex justify-center py-16 sm:py-20">
        <div className="w-full max-w-[1728px] px-6 sm:px-12 md:px-16 xl:px-[126px]">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-4 scrollbar-hide mb-12 sm:mb-16">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm sm:text-[15px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? "bg-[#1B5713] text-white shadow-sm"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-[16px] overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
              >
                {/* Project Image */}
                <div className="w-full h-[260px] sm:h-[280px] relative overflow-hidden bg-gray-100">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Category Tag Overlay */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold tracking-wide">
                      {project.tag}
                    </span>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between">
                  <div>
                    {/* Location with Icon */}
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs sm:text-sm font-medium mb-2.5">
                      <svg
                        className="w-4 h-4 text-[#1B5713] shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 7.2c0 7.3-8 11.8-8 11.8z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{project.location}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-[#0F172A] text-xl font-semibold leading-snug group-hover:text-[#1B5713] transition-colors">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[#64748B] text-sm leading-relaxed mt-2.5 line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Scope Tags */}
                  <div className="pt-5 mt-5 border-t border-gray-100 flex flex-wrap gap-1.5">
                    {project.scope.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-[6px] bg-gray-50 text-gray-600 text-[11px] font-medium border border-gray-100"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Consultation CTA */}
      <section className="w-full flex justify-center bg-[#1B1B1B] text-white py-16 sm:py-20">
        <div
          className="w-full max-w-[1734px] px-6 sm:px-12 md:px-16 xl:px-[126px] flex flex-col md:flex-row items-center justify-between gap-8"
          style={{
            backgroundColor: "#343434",
            backgroundImage: "linear-gradient(90deg, #1B1B1B 17.28%, rgba(0, 0, 0, 0) 48.91%)",
          }}
        >
          <div className="max-w-[720px] py-6 sm:py-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Have an Upcoming Commercial Project?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-3">
              Consult with our equipment specialists for kitchen layout design, capacity calculation, and custom stainless steel fabrication.
            </p>
          </div>

          <div className="shrink-0 pb-6 sm:pb-0">
            <button
              type="button"
              onClick={() => setQuoteModalOpen(true)}
              className="inline-flex items-center justify-center h-[50px] px-8 rounded-[8px] bg-[#14A800] hover:bg-[#129400] active:scale-[0.98] text-white font-medium text-base shadow-sm transition-all cursor-pointer"
            >
              Request Project Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Reusable Request Quote Modal */}
      <RequestQuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </main>
  );
}

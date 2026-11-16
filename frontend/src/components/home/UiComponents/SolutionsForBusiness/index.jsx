"use client";
import React, { useRef } from "react";

export default function SolutionsForBusiness() {
  const scrollRef = useRef(null);

  const solutions = [
    {
      title: "Fine Dining",
      image: "/solutions/card1.webp"
    },
    {
      title: "Hotels & Banquet",
      image: "/solutions/card2.webp"
    },
    {
      title: "Quick Service Cafe",
      image: "/solutions/card3.webp"
    },
    {
      title: "High-Volume Bakeries",
      image: "/solutions/card4.webp"
    },
    {
      title: "Cloud & Ghost Kitchens",
      image: "/solutions/card1.webp"
    },
    {
      title: "Institutional Catering",
      image: "/solutions/card2.webp"
    },
    {
      title: "Bars & Microbreweries",
      image: "/solutions/card3.webp"
    },
    {
      title: "Supermarkets & Delis",
      image: "/solutions/card4.webp"
    }
  ];

  const scrollLeftBtn = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const child = container.children[0];
      const scrollAmount = child ? child.offsetWidth + 24 : 390;
      if (container.scrollLeft <= 10) {
        container.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
      } else {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    }
  };

  const scrollRightBtn = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const child = container.children[0];
      const scrollAmount = child ? child.offsetWidth + 24 : 390;
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <section className="w-full py-20 bg-white font-poppins">
      <div className="container mx-auto px-4 xl:px-[80px] max-w-[1728px]">
        
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-[50px] gap-6">
          <div className="flex flex-col gap-3 max-w-[850px]">
            <h2 className="font-poppins font-semibold text-[28px] md:text-[42px] leading-tight text-[#0F172A]">
              Solutions for Your Business
            </h2>
            <p className="font-poppins font-normal text-[16px] md:text-[18px] leading-[150%] text-[#475569]">
              We don't just sell products — we deliver fully integrated culinary spaces optimized for your business model.
            </p>
          </div>

          {/* Controls: Arrows */}
          <div className="flex items-center gap-[8px] flex-shrink-0">
            <button 
              onClick={scrollLeftBtn}
              aria-label="Previous solutions"
              className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-500 cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button 
              onClick={scrollRightBtn}
              aria-label="Next solutions"
              className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-500 cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {/* Cards Row (4 cards at a time on desktop) */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-6 w-full scrollbar-hide snap-x snap-mandatory" 
          style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
          {solutions.map((item, index) => (
            <div 
              key={index} 
              className="relative flex-shrink-0 w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc((100%-72px)/4)] h-[320px] rounded-[16px] overflow-hidden group cursor-pointer snap-start"
            >
              {/* Background Image */}
              <img 
                src={item.image} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23f8fafc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14px' fill='%2394a3b8'%3E" + encodeURIComponent(item.title) + "%3C/text%3E%3C/svg%3E";
                }}
              />
              
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-[#000000]/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Text Content */}
              <div className="absolute bottom-0 left-0 p-[24px] flex flex-col gap-2">
                <h3 className="text-white text-[24px] font-medium leading-none">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-[#EC1C24] font-medium text-[16px] transition-transform duration-300 transform translate-y-0 group-hover:translate-x-2">
                  <span>Explore</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

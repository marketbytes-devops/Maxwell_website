"use client";
import { useRef, useState, useEffect } from "react";

export default function WhatAreYouLookingFor() {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const categories = [
    { title: "Commercial Kitchen", active: false, image: "/images/commercial_kitchen.webp" },
    { title: "Bakery", active: true, image: "/images/bakery.webp" },
    { title: "refrigeration", active: false, image: "/images/refrigeration.webp" },
    { title: "Coffee & Cafe", active: false, image: "/images/coffee.webp" },
    { title: "Supermarket", active: false, image: "/images/supermarket.webp" },
    { title: "Other", active: false, image: "/images/other.webp" }
  ];

  const scrollLeftBtn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -309, behavior: 'smooth' });
    }
  };

  const scrollRightBtn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 309, behavior: 'smooth' });
    }
  };

  // Auto-play functionality
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const childWidth = scrollRef.current.children[0]?.offsetWidth || 0;
        const gap = 24;
        let nextIndex = activeIndex + 1;
        if (nextIndex >= categories.length) {
          nextIndex = 0;
        }
        scrollRef.current.scrollTo({ left: nextIndex * (childWidth + gap), behavior: 'smooth' });
      }
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, [activeIndex, categories.length, isHovered]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const childWidth = scrollRef.current.children[0]?.offsetWidth || 0;
      const gap = 24; // gap-6
      if (childWidth > 0) {
        const index = Math.round(scrollPosition / (childWidth + gap));
        setActiveIndex(index);
      }
    }
  };

  const scrollToDot = (index) => {
    if (scrollRef.current) {
      const childWidth = scrollRef.current.children[0]?.offsetWidth || 0;
      const gap = 24;
      scrollRef.current.scrollTo({ left: index * (childWidth + gap), behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full py-20 bg-white font-poppins">
      <div className="container mx-auto px-4 xl:px-[80px] max-w-[1728px]">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-[#0F172A] text-[28px] md:text-[42px] font-semibold leading-none">
              What Are You Looking For?
            </h2>
            <p className="text-[#475569] text-[16px] md:text-[18px] font-normal leading-none">
              Find professional culinary systems instantly.
            </p>
          </div>
          
          {/* Carousel Arrows (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-[8px] w-[128px] h-[60px]">
            <button 
              onClick={scrollLeftBtn}
              className="w-[60px] h-[60px] flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-500 cursor-pointer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button 
              onClick={scrollRightBtn}
              className="w-[60px] h-[60px] flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-500 cursor-pointer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>

        {/* Carousel Cards */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory before:m-auto after:m-auto"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }} 
        >
          {categories.map((cat, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 w-[85vw] sm:w-[285px] h-[310px] rounded-[12px] border-[1px] border-[#E2E8F0] bg-white flex flex-col items-center justify-start p-[15px] pt-[20px] transition-all duration-300 hover:shadow-xl hover:border-[#009EE2] cursor-pointer snap-center"
            >
              {/* Image Area */}
              <div className="w-[239px] h-[194px] flex items-center justify-center mb-[20px] relative overflow-hidden">
                <img 
                  src={cat.image} 
                  alt={cat.title} 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to a gray placeholder if the image file isn't found locally yet
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23f8fafc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14px' fill='%2394a3b8'%3E" + encodeURIComponent(cat.title) + " WebP%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              
              <div className="w-[217px] h-[58px] flex items-center justify-center">
                <h3 className="text-[#0F172A] text-[24px] font-semibold text-center leading-[29px] font-poppins">
                  {cat.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Pagination Dots */}
        <div className="flex md:hidden items-center justify-center gap-2 mt-4">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToDot(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                activeIndex === index ? 'bg-[#E11D48]' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

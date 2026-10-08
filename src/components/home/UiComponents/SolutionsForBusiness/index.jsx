"use client";
import React, { useRef, useEffect, useState } from "react";

export default function SolutionsForBusiness() {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

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
    }
  ];

  // Duplicate the array 3 times for a seamless infinite scroll effect
  const displaySolutions = [...solutions, ...solutions, ...solutions];

  useEffect(() => {
    let animationFrameId;
    const scrollContainer = scrollRef.current;

    const scroll = () => {
      if (scrollContainer && !isHovered) {
        scrollContainer.scrollLeft += 1; // Marquee speed
        
        // When we have scrolled exactly the length of the original list, instantly snap back
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 3) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  return (
    <section className="w-full py-20 bg-white font-poppins">
      <div className="container mx-auto px-4 xl:px-[80px] max-w-[1728px]">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-[50px]">
          <h2 className="font-poppins font-semibold text-[42px] leading-none text-[#0F172A] text-center mb-[16px]">
            Solutions for Your Business
          </h2>
          <p className="font-poppins font-normal text-[18px] leading-[150%] text-[#475569] text-center">
            We don't just sell products — we deliver fully integrated culinary spaces optimized for your business model.
          </p>
        </div>

        {/* Cards Row (Marquee) */}
        <div 
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex overflow-x-auto gap-6 pb-6 w-full scrollbar-hide before:m-auto after:m-auto" 
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {displaySolutions.map((item, index) => (
            <div 
              key={index} 
              className="relative flex-shrink-0 w-[365.75px] h-[320px] rounded-[16px] overflow-hidden group cursor-pointer"
            >
              {/* Background Image */}
              <img 
                src={item.image} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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

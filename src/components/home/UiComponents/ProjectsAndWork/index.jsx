"use client";
import React, { useRef, useEffect, useState } from "react";

export default function ProjectsAndWork() {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const projects = [
    {
      tag: "Hotel Kitchen",
      title: "Grand Plaza Resort",
      location: "Mumbai",
      image: "/projects/card1.webp"
    },
    {
      tag: "Coffee Lab",
      title: "The Daily Brew Cafe",
      location: "Pune",
      image: "/projects/card2.webp"
    },
    {
      tag: "Bakery",
      title: "The Pastry Lounge",
      location: "Bangalore",
      image: "/projects/card3.webp"
    },
    {
      tag: "Ghost Kitchen",
      title: "Bite-Sized Cloud Kitchens",
      location: "Delhi",
      image: "/projects/card4.webp"
    }
  ];

  // Duplicate the array to create a seamless infinite marquee effect
  const displayProjects = [...projects, ...projects, ...projects];

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
        
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-[50px] gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-[#0F172A] text-[42px] font-semibold leading-none">
              Our Projects & Completed Work
            </h2>
            <p className="text-[#475569] text-[18px] font-normal leading-none mt-2">
              See how we empower the top commercial food services across metropolitan areas.
            </p>
          </div>
          
          {/* Top Right Button */}
          <button className="w-[278px] h-[58px] bg-[#FBBF24] hover:bg-[#F59E0B] transition-colors text-[#0F172A] font-medium text-[16px] rounded-[60px] flex items-center justify-center flex-shrink-0">
            View Project Gallery
          </button>
        </div>

        {/* Cards Row (Marquee) */}
        <div 
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex overflow-x-auto gap-[24px] pb-6 w-full scrollbar-hide before:m-auto after:m-auto" 
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {displayProjects.map((item, index) => (
            <div 
              key={index} 
              className="relative flex-shrink-0 w-[374px] h-[400px] rounded-[16px] overflow-hidden group cursor-pointer"
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
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/90 via-[#000000]/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Text Content */}
              <div className="absolute bottom-0 left-0 p-[24px] flex flex-col items-start w-full">
                {/* Tag */}
                <div className="bg-[#EC1C24] px-2.5 py-1 rounded-[4px] text-white text-[12px] font-medium mb-3">
                  {item.tag}
                </div>
                
                {/* Title */}
                <h3 className="text-white text-[22px] font-semibold leading-tight mb-2">
                  {item.title}
                </h3>
                
                {/* Location */}
                <div className="flex items-center gap-1.5 text-gray-300 text-[14px]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EC1C24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

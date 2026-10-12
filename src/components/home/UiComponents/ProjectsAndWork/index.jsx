"use client";
import React, { useRef } from "react";

export default function ProjectsAndWork() {
  const scrollRef = useRef(null);

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
    },
    {
      tag: "Fine Dining",
      title: "Azure Coastal Bistro",
      location: "Goa",
      image: "/projects/card1.webp"
    },
    {
      tag: "Banquet Hall",
      title: "Imperial Crown Regency",
      location: "Hyderabad",
      image: "/projects/card2.webp"
    },
    {
      tag: "Patisserie",
      title: "Artisanal Crust Lab",
      location: "Chennai",
      image: "/projects/card3.webp"
    },
    {
      tag: "QSR Chain",
      title: "Urban Express Kitchens",
      location: "Kolkata",
      image: "/projects/card4.webp"
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
          <div className="flex flex-col gap-3">
            <h2 className="text-[#0F172A] text-[28px] md:text-[42px] font-semibold leading-none">
              Our Projects & Completed Work
            </h2>
            <p className="text-[#475569] text-[16px] md:text-[18px] font-normal leading-none mt-2">
              See how we empower the top commercial food services across metropolitan areas.
            </p>
          </div>
          
          {/* Controls: Arrows + Button */}
          <div className="flex flex-wrap items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-[8px]">
              <button 
                onClick={scrollLeftBtn}
                aria-label="Previous projects"
                className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-500 cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button 
                onClick={scrollRightBtn}
                aria-label="Next projects"
                className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-500 cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>

            <button className="bg-[#FBBF24] hover:bg-[#F59E0B] transition-colors text-[#0F172A] font-medium px-8 py-3 rounded-full h-[48px] md:h-[58px] flex items-center justify-center whitespace-nowrap w-full sm:w-auto">
              View Project Gallery
            </button>
          </div>
        </div>

        {/* Cards Row (4 cards at a time on desktop) */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-6 w-full scrollbar-hide snap-x snap-mandatory" 
          style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
          {projects.map((item, index) => (
            <div 
              key={index} 
              className="relative flex-shrink-0 w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc((100%-72px)/4)] h-[400px] rounded-[16px] overflow-hidden group cursor-pointer snap-start"
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

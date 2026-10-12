"use client";
import { useRef, useState } from "react";

export default function ProductCategories() {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const categories = [
    {
      title: "Commercial Ranges",
      desc: "High-power gas and induction cooking systems engineered for fast-paced service.",
      image: "/products/commercial_ranges.webp"
    },
    {
      title: "Preparation Systems",
      desc: "Commercial mixers, food processors, and prep tables to optimize kitchen workflow.",
      image: "/products/preparation_systems.webp"
    },
    {
      title: "Professional Refrigeration",
      desc: "Reach-in freezers, chiller drawers, and walk-ins maintaining precise temperature zones.",
      image: "/products/professional_refrigeration.webp"
    },
    {
      title: "Bakery & Ovens",
      desc: "Convection, deck, and rotary combi ovens ensuring perfectly consistent baking environments.",
      image: "/products/bakery_and_ovens.webp"
    },
    {
      title: "Dishwashing Systems",
      desc: "High-temperature undercounter and flight-type dishwashers for ultimate hygiene.",
      image: "/products/dishwash.webp"
    }
  ];

  const scrollLeftBtn = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const child = container.children[0];
      const scrollAmount = child ? child.offsetWidth + 24 : 390;
      if (container.scrollLeft <= 10) {
        container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const scrollRightBtn = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const child = container.children[0];
      const scrollAmount = child ? child.offsetWidth + 24 : 390;
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

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
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-[#0F172A] text-[28px] md:text-[42px] font-semibold leading-none">
              Our Product Categories
            </h2>
            <p className="text-[#475569] text-[16px] md:text-[18px] font-normal leading-none mt-2">
              Explore our wide range of world-class kitchen and food preparation equipment.
            </p>
          </div>
          
          {/* Controls: Arrows + Button */}
          <div className="flex flex-wrap items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-[8px]">
              <button 
                onClick={scrollLeftBtn}
                aria-label="Previous category"
                className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-500 cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <button 
                onClick={scrollRightBtn}
                aria-label="Next category"
                className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-500 cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
            
            <button className="bg-[#FBBF24] hover:bg-[#F59E0B] transition-colors text-[#0F172A] font-medium px-8 py-3 rounded-full h-[48px] flex items-center justify-center whitespace-nowrap w-full sm:w-auto">
              View all Product
            </button>
          </div>
        </div>

        {/* Carousel Cards */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x snap-mandatory before:m-auto after:m-auto"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {categories.map((cat, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc((100%-72px)/4)] rounded-[16px] border border-gray-200 bg-white flex flex-col overflow-hidden transition-all hover:shadow-lg hover:border-gray-300 snap-start"
            >
              {/* Image Area */}
              <div className="w-full h-[200px] bg-gray-50 relative">
                <img 
                  src={cat.image} 
                  alt={cat.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23f8fafc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14px' fill='%2394a3b8'%3E" + encodeURIComponent(cat.title) + " WebP%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              
              {/* Text Area */}
              <div className="p-[15px] flex flex-col flex-grow">
                <h3 className="text-[#0F172A] text-[20px] font-semibold mb-2">
                  {cat.title}
                </h3>
                <p className="text-[#64748B] text-[14px] leading-relaxed mb-6 flex-grow">
                  {cat.desc}
                </p>
                
                {/* Buttons */}
                <div className="flex items-center gap-[9px] mt-auto">
                  <button className="w-[164px] h-[42px] bg-[#04940B] hover:bg-[#037A09] text-white font-medium rounded-[60px] transition-colors flex items-center justify-center">
                    Enquiry
                  </button>
                  <button className="w-[164px] h-[42px] bg-[#EDEDED] hover:bg-[#E2E8F0] text-[#0F172A] font-medium rounded-[60px] transition-colors flex items-center justify-center">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Pagination Dots */}
        <div className="flex lg:hidden items-center justify-center gap-2 mt-4">
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

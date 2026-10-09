"use client";
import { useRef, useEffect, useState } from "react";

export default function PremiumBrands() {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const brands = [
    "/brands/1.webp",
    "/brands/2.webp",
    "/brands/3.webp",
    "/brands/4.webp",
    "/brands/5.webp",
    "/brands/6.webp",
    "/brands/7.webp",
    "/brands/8.webp",
  ];

  // Duplicate brands to create a seamless infinite marquee effect
  const displayBrands = [...brands, ...brands, ...brands];

  useEffect(() => {
    let animationFrameId;
    const scrollContainer = scrollRef.current;

    const scroll = () => {
      if (scrollContainer && !isHovered) {
        scrollContainer.scrollLeft += 1; // Marquee speed
        
        // Infinite scroll logic: when we scroll past the first set, reset to 0
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
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-4 xl:px-[80px] max-w-[1728px] flex flex-col items-center">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-[50px]">
          <h2 className="font-poppins font-semibold text-[46px] leading-none text-[#050505] tracking-[0.015em] text-center mb-[16px]">
            Premium Global Brands We Deal With
          </h2>
          <p className="font-inter font-light text-[18px] leading-[150%] text-[#475569] text-center">
            Global brands, trusted performance
          </p>
        </div>

        {/* Brands Container (Marquee) */}
        <div className="w-full flex justify-center">
          <div 
            ref={scrollRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex gap-[26px] overflow-x-auto scrollbar-hide max-w-full pb-4" 
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {displayBrands.map((brand, i) => (
              <div 
                key={i} 
                className="w-[233px] h-[144px] flex-shrink-0 border-[1px] border-[#E2E8F0] rounded-[12px] flex items-center justify-center p-[20px] bg-white transition-all hover:shadow-md hover:border-[#009EE2] cursor-pointer"
              >
                <img 
                  src={brand} 
                  alt={`Premium Brand`} 
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

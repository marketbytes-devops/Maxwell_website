import React from "react";
import Image from "next/image";

export default function Insights() {
  const articles = [
    {
      title: "Planning Commercial Kitchen Ventilation Rates Correctly",
      date: "Oct 12, 2026",
      readTime: "6 Min Read",
      image: "/insights/ventilation.webp",
      link: "#"
    },
    {
      title: "5 Crucial Maintenance Steps for Commercial Steam Ovens",
      date: "Sep 28, 2026",
      readTime: "4 Min Read",
      image: "/insights/rename.webp",
      link: "#"
    },
    {
      title: "Eco-Design: Planning Food Prep Areas for Less Waste",
      date: "Sep 15, 2026",
      readTime: "8 Min Read",
      image: "/insights/eco_design.webp",
      link: "#"
    }
  ];

  return (
    <section className="w-full py-20 bg-white font-poppins">
      <div className="container mx-auto px-4 xl:px-[80px] max-w-[1728px]">
        
        {/* Header Section */}
        <div className="flex flex-col mb-[60px]">
          <h2 className="font-poppins font-semibold text-[42px] leading-[120%] text-[#0F172A] mb-[12px]">
            Culinary Insights & Engineering Guides
          </h2>
          <p className="font-poppins font-normal text-[18px] leading-[150%] text-[#475569]">
            Keep up to date with smart kitchen maintenance rules, safety compliance tips, and layout planning.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] w-full">
            {articles.map((article, index) => (
              <div 
                key={index} 
                className="w-full h-[572px] rounded-[16px] border-[1px] border-[#E2E8F0] bg-white flex flex-col overflow-hidden group cursor-pointer"
              >
                {/* Article Image */}
                <div className="w-full h-[388px] overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Article Content */}
                <div className="flex flex-col p-[24px] flex-grow">
                  {/* Meta */}
                  <div className="flex items-center gap-[8px] text-[12px] font-medium mb-[12px]">
                    <span className="text-[#EC1C24]">{article.date}</span>
                    <span className="text-[#CBD5E1]">•</span>
                    <span className="text-[#94A3B8]">{article.readTime}</span>
                  </div>
                  
                  {/* Title */}
                  <h3 
                    className="font-bold text-[18px] leading-[140%] text-[#0F172A] line-clamp-2"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    {article.title}
                  </h3>
                  
                  {/* Read Article Link */}
                  <div className="mt-auto flex items-center gap-[6px] text-[#EC1C24] font-medium text-[14px]">
                    Read Article 
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"/>
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

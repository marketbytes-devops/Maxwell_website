import React from "react";
import Image from "next/image";
import logoImage from "@/assets/logo/Artboard 1.webp";

export default function AboutBrand() {
  return (
    <section className="w-full py-20 bg-white font-poppins">
      <div className="container mx-auto px-4 xl:px-[80px] max-w-[1728px]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-[40px] xl:gap-[80px]">
          
          {/* Left Side: Logo Box */}
          <div className="flex-shrink-0 w-full max-w-[612px] h-[583px] border border-[#000000] rounded-[12px] flex items-center justify-center bg-white">
            <Image 
              src={logoImage} 
              alt="Maxsel Agencies Logo" 
              className="w-[403px] h-auto object-contain"
            />
          </div>

          {/* Right Side: Text Content */}
          <div className="flex flex-col flex-grow max-w-[840px]">
            <h2 className="font-poppins font-semibold text-[46px] leading-[59px] tracking-[-0.01em] text-[#292D77] mb-8">
              Commercial Kitchen & Refrigeration<br />
              Equipment <span className="text-[#EC1C24]">Solutions in Kerala</span>
            </h2>
            
            <p className="font-poppins font-normal text-[18px] leading-[29px] tracking-[0.015em] text-[#000000] text-justify mb-[40px]">
              Maxsel Agencies provides professional equipment solutions for hotels, restaurants, bakeries, cafés, supermarkets and other food businesses. With a wide range of commercial kitchen, bakery, refrigeration and professional coffee equipment from leading brands, we help businesses find the right equipment for their specific requirements. Our product range is designed to support businesses with reliable, efficient and practical equipment solutions for professional foodservice operations. From individual equipment needs to larger business requirements, Maxsel focuses on delivering suitable products and solutions based on each customer’s needs.
            </p>
            
            <button className="w-[278px] h-[58px] bg-[#FBBF24] hover:bg-[#F59E0B] transition-colors text-[#0F172A] font-medium text-[16px] rounded-[60px] flex items-center justify-center">
              View Project Gallery
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
}

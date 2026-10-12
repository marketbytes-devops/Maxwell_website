import React from "react";

export default function AboutBrand() {
  return (
    <section className="w-full py-20 bg-white font-poppins">
      <div className="container mx-auto px-4 xl:px-[80px] max-w-[1728px]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-[40px] xl:gap-[80px]">
          
          {/* Left Side: Video Showcase */}
          <div className="w-full lg:w-[612px] h-[320px] sm:h-[420px] md:h-[583px] rounded-[16px] overflow-hidden border border-gray-200 shadow-xl bg-black relative flex items-center justify-center">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            >
              <source 
                src="https://res.cloudinary.com/mbz958a7/video/upload/q_auto,f_auto/v1791791653/WhatsApp_Video_2026-10-12_at_12.12.25_PM.mp4" 
                type="video/mp4" 
              />
            </video>
          </div>

          {/* Right Side: Text Content */}
          <div className="flex flex-col flex-grow max-w-[840px] text-center lg:text-left">
            <h2 className="font-poppins font-semibold text-[28px] md:text-[46px] leading-[1.3] md:leading-[59px] tracking-[-0.01em] text-[#292D77] mb-6 md:mb-8">
              Commercial Kitchen & Refrigeration<br className="hidden md:block" />
              Equipment <span className="text-[#EC1C24]">Solutions in Kerala</span>
            </h2>
            
            <p className="font-poppins font-normal text-[16px] md:text-[18px] leading-[1.6] md:leading-[29px] tracking-[0.015em] text-[#000000] text-justify mb-[30px] md:mb-[40px]">
              Maxsel Agencies provides professional equipment solutions for hotels, restaurants, bakeries, cafés, supermarkets and other food businesses. With a wide range of commercial kitchen, bakery, refrigeration and professional coffee equipment from leading brands, we help businesses find the right equipment for their specific requirements. Our product range is designed to support businesses with reliable, efficient and practical equipment solutions for professional foodservice operations. From individual equipment needs to larger business requirements, Maxsel focuses on delivering suitable products and solutions based on each customer’s needs.
            </p>
            
            <button className="w-full sm:w-[278px] h-[58px] bg-[#FBBF24] hover:bg-[#F59E0B] transition-colors text-[#0F172A] font-medium text-[16px] rounded-[60px] flex items-center justify-center mx-auto lg:mx-0">
              View Project Gallery
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
}

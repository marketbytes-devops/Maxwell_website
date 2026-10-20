import React from "react";

export default function CommercialCTA({ onRequestQuote }) {
  return (
    <section className="relative w-full bg-[#121F28] font-poppins overflow-hidden flex items-center min-h-[506px]">
      
      {/* Right Background Image */}
      <div className="absolute right-0 top-0 w-full lg:w-[635px] h-full z-0 opacity-30 lg:opacity-100">
        <img 
          src="/images/hero.webp" 
          alt="Commercial Kitchen" 
          className="w-full h-full object-cover" 
        />
        {/* Gradient Overlay for seamless blending */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(270deg, #121F28 0%, rgba(18, 31, 40, 0.54) 16.92%, rgba(18, 31, 40, 0) 40.44%, rgba(18, 31, 40, 0) 60.42%, rgba(18, 31, 40, 0.74) 86.98%, #121F28 100%)'
          }}
        />
      </div>

      <div className="container mx-auto px-4 xl:px-[80px] max-w-[1728px] relative z-10 flex items-center justify-between py-[60px] lg:py-0 h-full">
        
        {/* Left Content */}
        <div className="flex flex-col max-w-[705px]">
          <h2 className="font-poppins font-semibold text-[36px] md:text-[46px] leading-[120%] text-white mb-[16px]">
            Planning a New<br />Commercial Kitchen?
          </h2>
          <p className="font-poppins font-normal text-[16px] md:text-[18px] leading-[150%] text-[#CBD5E1] mb-[40px]">
            Get complete architectural 2D drafts, custom load calculations, and energy integration specs from our heavy-duty layout engineers.
          </p>

          <div className="flex flex-wrap gap-[16px]">
            {/* Request a Quote Button */}
            <button 
              type="button"
              onClick={onRequestQuote}
              className="flex items-center gap-[12px] w-full sm:w-[327px] h-[58px] bg-white rounded-[59px] text-[#0F172A] font-semibold text-[16px] hover:bg-gray-100 transition-colors pl-[10px] pr-[24px] cursor-pointer"
            >
              <span className="w-[42px] h-[42px] bg-[#121F28] rounded-full flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </span>
              <span className="mx-auto">Request a Quote</span>
            </button>

            {/* WhatsApp Us Button */}
            <button className="flex items-center gap-[12px] w-full sm:w-[262px] h-[58px] bg-white rounded-[70px] text-[#0F172A] font-semibold text-[16px] hover:bg-gray-100 transition-colors pl-[10px] pr-[24px]">
              <span className="w-[42px] h-[42px] bg-[#121F28] rounded-full flex items-center justify-center flex-shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </span>
              <span className="mx-auto">WhatsApp Us</span>
            </button>
          </div>
        </div>

        {/* Right Floating Text */}
        <div 
          className="absolute right-[5%] lg:right-[80px] top-[50%] text-white text-[32px] md:text-[38px] leading-[110%] z-20 hidden md:block select-none pointer-events-none"
          style={{
            fontFamily: "'Handlee', cursive",
            transform: "translateY(-50%) rotate(-15deg)", 
          }}
        >
          Built for<br />Professional<br />Performance
        </div>

      </div>
    </section>
  );
}

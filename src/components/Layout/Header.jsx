"use client";

import Link from "next/link";
import Image from "next/image";
import logoImage from "@/assets/logo/Artboard 1.webp";

export default function Header() {
  return (
    <header className="w-full bg-white flex justify-center border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="w-full max-w-[1728px] h-[100px] px-[44px] flex items-center justify-between">
        
        {/* Left Side: Logo & Navigation */}
        <div className="flex items-center xl:gap-[200px] lg:gap-[100px]">
          {/* Logo */}
          <Link href="/">
            <Image 
              src={logoImage} 
              alt="Maxsel Agencies Logo" 
              width={140} 
              height={63} 
              className="w-[140px] h-[63px] object-contain"
              priority
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-[32px] font-poppins mt-2">
            <Link 
              href="/" 
              className="relative text-[#EC1C24] hover:text-[#EC1C24] transition-colors text-[18px] font-medium leading-none flex flex-col items-center"
              style={{ width: '54px' }}
            >
              <span>Home</span>
              <span className="absolute -bottom-2 w-[35px] h-[2px] bg-[#0F172A] rounded-full left-0"></span>
            </Link>
          <Link 
            href="/products" 
            className="text-[#0F172A] hover:text-[#EC1C24] transition-colors text-[18px] font-normal leading-none"
            style={{ width: '80px' }}
          >
            Products
          </Link>
          <Link 
            href="/solutions" 
            className="text-[#0F172A] hover:text-[#EC1C24] transition-colors text-[18px] font-normal leading-none"
            style={{ width: '82px' }}
          >
            Solutions
          </Link>
          <Link 
            href="/industries" 
            className="text-[#0F172A] hover:text-[#EC1C24] transition-colors text-[18px] font-normal leading-none"
            style={{ width: '88px' }}
          >
            Industries
          </Link>
          <Link 
            href="/brands" 
            className="text-[#0F172A] hover:text-[#EC1C24] transition-colors text-[18px] font-normal leading-none"
            style={{ width: '63px' }}
          >
            Brands
          </Link>
          <Link 
            href="/about" 
            className="text-[#0F172A] hover:text-[#EC1C24] transition-colors text-[18px] font-normal leading-none whitespace-nowrap"
            style={{ width: '81px' }}
          >
            About Us
          </Link>
          </nav>
        </div>

        {/* Right side: Search Box and Menu Icon */}
        <div className="flex items-center gap-[49px]">
          {/* Search Box */}
          <div className="flex items-center gap-[12px] w-[241px] h-[56px] border border-[#E2E8F0] rounded-[8px] p-[16px] bg-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full outline-none text-[#0F172A] font-poppins bg-transparent placeholder-[#94A3B8]" 
            />
          </div>

          {/* Right Icon (Menu/Filter) */}
          <button className="w-[30px] h-[30px] flex flex-col justify-center gap-1.5 cursor-pointer">
            <span className="block w-full h-[3px] bg-black rounded-full"></span>
            <span className="block w-[20px] h-[3px] bg-black rounded-full ml-auto"></span>
            <span className="block w-full h-[3px] bg-black rounded-full"></span>
          </button>
        </div>

      </div>
    </header>
  );
}

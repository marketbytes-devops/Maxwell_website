"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logoImage from "@/assets/logo/Artboard 1.webp";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Solutions", href: "/solutions" },
    { name: "Industries", href: "/industries" },
    { name: "Brands", href: "/brands" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="w-full bg-white flex justify-center border-b border-gray-100 shadow-xs sticky top-0 z-50">
      <div className="w-full max-w-[1728px] h-[100px] px-6 sm:px-10 lg:px-[44px] flex items-center justify-between">
        
        {/* Left Side: Logo & Navigation */}
        <div className="flex items-center gap-8 xl:gap-[60px] 2xl:gap-[100px]">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image 
              src={logoImage} 
              alt="Maxsel Agencies Logo" 
              width={140} 
              height={63} 
              className="w-[120px] sm:w-[140px] h-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-[24px] xl:gap-[32px] font-poppins mt-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative hover:text-[#EC1C24] transition-colors text-[17px] xl:text-[18px] leading-none flex flex-col items-center py-2 ${
                    isActive
                      ? "text-[#EC1C24] font-medium"
                      : "text-[#0F172A] font-normal"
                  }`}
                >
                  <span className="whitespace-nowrap">{link.name}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 w-[32px] h-[2px] bg-[#0F172A] rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side: Search Box and Menu Icon */}
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-[36px]">
          {/* Search Box */}
          <div className="hidden sm:flex items-center gap-[12px] w-[200px] xl:w-[241px] h-[52px] xl:h-[56px] border border-[#E2E8F0] rounded-[8px] p-[16px] bg-white transition focus-within:border-[#04940B]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full outline-none text-[#0F172A] text-sm font-poppins bg-transparent placeholder-[#94A3B8]" 
            />
          </div>

          {/* Mobile / Tablet Menu Button */}
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-[36px] h-[36px] flex flex-col justify-center gap-1.5 cursor-pointer lg:hidden p-1 rounded-md hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            <span className={`block w-full h-[2.5px] bg-black rounded-full transition-transform ${mobileMenuOpen ? "rotate-45 translate-y-[6px]" : ""}`}></span>
            <span className={`block w-[20px] h-[2.5px] bg-black rounded-full ml-auto transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`}></span>
            <span className={`block w-full h-[2.5px] bg-black rounded-full transition-transform ${mobileMenuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`}></span>
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-[100px] left-0 w-full bg-white border-b border-gray-200 shadow-lg px-6 py-5 z-50 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4 font-poppins">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-[17px] py-1 border-b border-gray-50 flex items-center justify-between ${
                    isActive
                      ? "text-[#EC1C24] font-semibold"
                      : "text-[#0F172A] hover:text-[#EC1C24]"
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#EC1C24]"></span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

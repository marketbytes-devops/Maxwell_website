"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logoImage from "@/assets/logo/Artboard 1.webp";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          if (isLoginPage) {
            router.push("/admin");
          }
        } else {
          if (!isLoginPage) {
            router.push("/admin/login");
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        if (!isLoginPage) {
          router.push("/admin/login");
        }
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setUser(null);
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-[#FBBF24] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-300 font-poppins">Loading Maxsel Admin...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-poppins text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col flex-shrink-0 min-h-screen sticky top-0 shadow-xl z-20">
        {/* Brand Header */}
        <div className="p-6 border-b border-gray-800 flex flex-col items-start bg-[#0B132B]">
          <Link href="/" className="mb-2">
            <div className="bg-white p-2 rounded-lg inline-block">
              <Image 
                src={logoImage} 
                alt="Maxsel Logo" 
                width={110} 
                height={50} 
                className="w-[110px] h-auto object-contain"
              />
            </div>
          </Link>
          <span className="text-[12px] uppercase tracking-wider text-amber-400 font-semibold">
            Admin Management
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-grow p-4 space-y-1.5">
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              pathname === "/admin"
                ? "bg-[#FBBF24] text-[#0F172A] font-semibold shadow-md"
                : "text-gray-300 hover:bg-gray-800/80 hover:text-white"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Dashboard
          </Link>

          <Link
            href="/admin/products/add"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              pathname === "/admin/products/add"
                ? "bg-[#FBBF24] text-[#0F172A] font-semibold shadow-md"
                : "text-gray-300 hover:bg-gray-800/80 hover:text-white"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Add Product
          </Link>

          <Link
            href="/admin/categories"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              pathname === "/admin/categories"
                ? "bg-[#FBBF24] text-[#0F172A] font-semibold shadow-md"
                : "text-gray-300 hover:bg-gray-800/80 hover:text-white"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            Categories
          </Link>

          <Link
            href="/admin/brands"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              pathname === "/admin/brands"
                ? "bg-[#FBBF24] text-[#0F172A] font-semibold shadow-md"
                : "text-gray-300 hover:bg-gray-800/80 hover:text-white"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
            Brands
          </Link>
        </nav>

        {/* User Info & Logout Footer */}
        <div className="p-4 border-t border-gray-800 bg-[#0B132B]">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-[#04940B] text-white flex items-center justify-center font-bold text-sm">
              {user?.name ? user.name[0].toUpperCase() : "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.name || "Admin"}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email || "admin@maxsel.in"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-red-400 bg-red-950/30 hover:bg-red-900/50 rounded-lg transition-colors border border-red-800/40 cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-xs">
          <div>
            <h1 className="text-xl font-bold text-[#0F172A]">
              {pathname === "/admin"
                ? "Product Dashboard"
                : pathname === "/admin/products/add"
                ? "Add Product"
                : pathname === "/admin/categories"
                ? "Categories Management"
                : pathname === "/admin/brands"
                ? "Brands Management"
                : "Admin Panel"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {pathname !== "/admin/products/add" && (
              <Link
                href="/admin/products/add"
                className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F172A] font-semibold text-sm px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xs transition-all hover:scale-105"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Product
              </Link>
            )}
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-8 flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logoImage from "@/assets/logo/Artboard 1.webp";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="w-full bg-white font-poppins pt-16 mt-16 border-t border-gray-50">
      <div className="container mx-auto px-4 xl:px-[80px] max-w-[1728px]">
        
        {/* Top Section - Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-200 mb-16">
          <a 
            href="https://www.google.com/maps?sca_esv=b9aa9d5decff392c&biw=1536&bih=730&sxsrf=APpeQnv5jHZj380DoYtyC1xn-zx2xmzt9Q:1792473962669&uact=5&gs_lp=Egxnd3Mtd2l6LXNlcnAiFG1heHNlbCBhZ2VuY3kga29sbGFtMg0QLhiABBgNGMcBGK8BMgUQABjvBTIIEAAYiQUYogQyBRAAGO8FMggQABiABBiiBEiHD1DNA1jGDHABeACQAQCYAcABoAHECKoBAzAuN7gBA8gBAPgBAZgCCKAC9AnCAggQABjvBRiwA8ICCxAAGIAEGKIEGLADwgILEAAYiQUYogQYsAPCAgQQIxgnwgIGEAAYFhgemAMAiAYBkAYFkgcFMS42LjGgB6cesgcFMC42LjG4B94JwgcFMi0zLjXIB0GACAE&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KZVkbczZ_QU7MeVIUrkSn6Du&daddr=ST+THOMAS+SHOPPING+COMPLEX,+near+Jawahar+Balabhavan,+Kadapakkada,+Kollam,+Keralam+691001"
            target="_blank"
            rel="noopener noreferrer"
            className="p-8 border-b md:border-b-0 md:border-r border-gray-200 hover:bg-gray-50/70 transition-colors group block"
            title="Open Kollam showroom in Google Maps"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[25px] font-medium text-[#0F172A] font-poppins leading-[150%] group-hover:text-[#04940B] transition-colors">Kollam</h3>
              <span className="text-[12px] font-semibold text-[#04940B] opacity-0 group-hover:opacity-100 transition-opacity">View Map ↗</span>
            </div>
            <p className="text-[18px] font-normal font-poppins text-[#475569] leading-[150%]">
              ST THOMAS SHOPPING COMPLEX, near Jawahar<br/>Balabhavan, Kadapakkada, Kollam, Kerala<br/>691001
            </p>
          </a>
          <a 
            href="https://www.google.com/maps?sca_esv=b9aa9d5decff392c&biw=1536&bih=730&sxsrf=APpeQnvNDNdp3GympD8XkA-LG-LFixurvw:1792474081487&uact=5&gs_lp=Egxnd3Mtd2l6LXNlcnAiGG1heHNlbCBhZ2VuY3kgVHJpdmFuZHJ1bTIGEAAYFhgeMgsQABiABBiKBRiGAzIIEAAYgAQYogQyCBAAGIkFGKIEMggQABiJBRiiBDIIEAAYgAQYogRIhiZQ2QNY_R9wAXgAkAEAmAH2AqAByhiqAQcwLjMuNC41uAEDyAEA-AEBmAIMoAKMGMICChAjGLACGLADGCfCAhAQLhiABBgNGMcBGK8BGLADwgIIEAAY7wUYsAPCAgsQABiJBRiiBBiwA8ICCxAAGIAEGKIEGLADwgIEECMYJ8ICBRAAGO8FmAMA4gMFEgExIECIBgGQBgaSBwcxLjEuNS41oAfTMLIHBzAuMS41LjW4B4YYwgcFMC42LjbIByqACAE&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KVe_t4y9uwU7MTHUOIbk64p9&daddr=Aaliya+Tower,+New,+Karakkamandapam,+Nemom,+Thiruvananthapuram,+Keralam+695020"
            target="_blank"
            rel="noopener noreferrer"
            className="p-8 border-b md:border-b-0 md:border-r border-gray-200 hover:bg-gray-50/70 transition-colors group block"
            title="Open Trivandrum showroom in Google Maps"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[25px] font-medium text-[#0F172A] font-poppins leading-[150%] group-hover:text-[#04940B] transition-colors">Trivandrum</h3>
              <span className="text-[12px] font-semibold text-[#04940B] opacity-0 group-hover:opacity-100 transition-opacity">View Map ↗</span>
            </div>
            <p className="text-[18px] font-normal font-poppins text-[#475569] leading-[150%]">
              Aaliya Tower, New, Karakkamandapam, Nemom,<br/>Thiruvananthapuram, Kerala 695020
            </p>
          </a>
          <a 
            href="https://www.google.com/maps/dir/Edapally+Metro+Station,+Edappally,+Kochi,+Ernakulam,+Keralam+682024/Maxsel+Agencies+Kochi,+Kolappilly+Velleparambil+House,+Sastha+Temple+Rd,+Kaloor,+Ernakulam,+Keralam+682017/@10.0097809,76.2795939,14z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x3b080db0ffffffff:0xe9cf5831273cce6!2m2!1d76.3083641!2d10.025263!1m5!1m1!1s0x3b080d444cfc451b:0x4243dd2c4cc4b36b!2m2!1d76.2905556!2d9.9967666?entry=ttu&g_ep=EgoyMDI2MTAxNC4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="p-8 hover:bg-gray-50/70 transition-colors group block"
            title="Open Kochi showroom in Google Maps"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[25px] font-medium text-[#0F172A] font-poppins leading-[150%] group-hover:text-[#04940B] transition-colors">Kochi</h3>
              <span className="text-[12px] font-semibold text-[#04940B] opacity-0 group-hover:opacity-100 transition-opacity">View Map ↗</span>
            </div>
            <p className="text-[18px] font-normal font-poppins text-[#475569] leading-[150%]">
              Velleparambil House<br/>Sastha Temple Road, Ernakulam - 682017, Kerala
            </p>
          </a>
        </div>

        {/* Middle Section - Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          {/* Logo and Info */}
          <div className="md:col-span-12 lg:col-span-4 pr-0 lg:pr-12">
            <div className="mb-6">
              <Link href="/">
                <Image 
                  src={logoImage} 
                  alt="Maxsel Agencies Logo" 
                  width={140} 
                  height={63} 
                  className="w-[140px] h-[63px] object-contain"
                />
              </Link>
            </div>
            <p className="text-[14px] text-[#475569] leading-[24px] mb-8 font-poppins">
              Premium-grade commercial kitchen systems engineered for reliability, safety, and operational excellence. Over a decade of layout and equipment design.
            </p>
            <div className="flex gap-4">
              {/* Social Icons */}
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>

          {/* Equipment Catalog */}
          <div className="md:col-span-4 lg:col-span-2 lg:ml-8">
            <h4 className="text-[16px] font-semibold text-[#0F172A] mb-6 font-poppins">Equipment Catalog</h4>
            <ul className="space-y-4 text-[13px] text-[#475569] font-poppins font-medium">
              <li><Link href="#" className="hover:text-red-600 transition">Cooking Ranges</Link></li>
              <li><Link href="#" className="hover:text-red-600 transition">Combi Ovens</Link></li>
              <li><Link href="#" className="hover:text-red-600 transition">Heavy Fryers</Link></li>
              <li><Link href="#" className="hover:text-red-600 transition">Underbar Prep</Link></li>
              <li><Link href="#" className="hover:text-red-600 transition">Industrial Dishwashers</Link></li>
            </ul>
          </div>

          {/* Solutions */}
          <div className="md:col-span-4 lg:col-span-2 lg:ml-8">
            <h4 className="text-[16px] font-semibold text-[#0F172A] mb-6 font-poppins">Solutions</h4>
            <ul className="space-y-4 text-[13px] text-[#475569] font-poppins font-medium">
              <li><Link href="#" className="hover:text-red-600 transition">Hotels & Banquets</Link></li>
              <li><Link href="#" className="hover:text-red-600 transition">Gourmet Restaurants</Link></li>
              <li><Link href="#" className="hover:text-red-600 transition">Micro-breweries</Link></li>
              <li><Link href="#" className="hover:text-red-600 transition">Quick Service Cafe</Link></li>
              <li><Link href="#" className="hover:text-red-600 transition">Corporate Pantries</Link></li>
            </ul>
          </div>

          {/* Corporate */}
          <div className="md:col-span-4 lg:col-span-2 lg:ml-8">
            <h4 className="text-[16px] font-semibold text-[#0F172A] mb-6 font-poppins">Corporate</h4>
            <ul className="space-y-4 text-[13px] text-[#475569] font-poppins font-medium">
              <li><Link href="#" className="hover:text-red-600 transition">About Our Brand</Link></li>
              <li><Link href="#" className="hover:text-red-600 transition">Completed Projects</Link></li>
              <li><Link href="#" className="hover:text-red-600 transition">Engineering Design Team</Link></li>
              <li><Link href="#" className="hover:text-red-600 transition">Contact Showroom</Link></li>
              <li><Link href="#" className="hover:text-red-600 transition">SLA Repair Request</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 py-6 flex flex-col md:flex-row justify-between items-center text-[12px] text-[#64748B] font-poppins font-medium">
          <p>© 2026 Maxsel agencies. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0 text-[#475569]">
            <Link href="#" className="hover:text-gray-900 transition">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-900 transition">Terms of Use</Link>
            <Link href="#" className="hover:text-gray-900 transition">Compliance certifications</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Image from "next/image";
import RequirementsForm from "@/components/common/RequirementsForm";

export default function ContactPage() {

  const locations = [
    {
      city: "Kollam",
      address: "ST THOMAS SHOPPING COMPLEX, near Jawahar Balabhavan, Kadapakkada, Kollam, Kerala 691001",
      phone: "+91 98472 72004",
      mapImg: "/images/maps/kollam_map.png",
      mapUrl: "https://www.google.com/maps?sca_esv=b9aa9d5decff392c&biw=1536&bih=730&sxsrf=APpeQnv5jHZj380DoYtyC1xn-zx2xmzt9Q:1792473962669&uact=5&gs_lp=Egxnd3Mtd2l6LXNlcnAiFG1heHNlbCBhZ2VuY3kga29sbGFtMg0QLhiABBgNGMcBGK8BMgUQABjvBTIIEAAYiQUYogQyBRAAGO8FMggQABiABBiiBEiHD1DNA1jGDHABeACQAQCYAcABoAHECKoBAzAuN7gBA8gBAPgBAZgCCKAC9AnCAggQABjvBRiwA8ICCxAAGIAEGKIEGLADwgILEAAYiQUYogQYsAPCAgQQIxgnwgIGEAAYFhgemAMAiAYBkAYFkgcFMS42LjGgB6cesgcFMC42LjG4B94JwgcFMi0zLjXIB0GACAE&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KZVkbczZ_QU7MeVIUrkSn6Du&daddr=ST+THOMAS+SHOPPING+COMPLEX,+near+Jawahar+Balabhavan,+Kadapakkada,+Kollam,+Keralam+691001",
    },
    {
      city: "Trivandrum",
      address: "Aaliya Tower, New, Karakkamandapam, Nemom, Thiruvananthapuram, Kerala 695020",
      phone: "+91 98472 70004",
      mapImg: "/images/maps/trivandrum_map.png",
      mapUrl: "https://www.google.com/maps?sca_esv=b9aa9d5decff392c&biw=1536&bih=730&sxsrf=APpeQnvNDNdp3GympD8XkA-LG-LFixurvw:1792474081487&uact=5&gs_lp=Egxnd3Mtd2l6LXNlcnAiGG1heHNlbCBhZ2VuY3kgVHJpdmFuZHJ1bTIGEAAYFhgeMgsQABiABBiKBRiGAzIIEAAYgAQYogQyCBAAGIkFGKIEMggQABiJBRiiBDIIEAAYgAQYogRIhiZQ2QNY_R9wAXgAkAEAmAH2AqAByhiqAQcwLjMuNC41uAEDyAEA-AEBmAIMoAKMGMICChAjGLACGLADGCfCAhAQLhiABBgNGMcBGK8BGLADwgIIEAAY7wUYsAPCAgsQABiJBRiiBBiwA8ICCxAAGIAEGKIEGLADwgIEECMYJ8ICBRAAGO8FmAMA4gMFEgExIECIBgGQBgaSBwcxLjEuNS41oAfTMLIHBzAuMS41LjW4B4YYwgcFMC42LjbIByqACAE&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KVe_t4y9uwU7MTHUOIbk64p9&daddr=Aaliya+Tower,+New,+Karakkamandapam,+Nemom,+Thiruvananthapuram,+Keralam+695020",
    },
    {
      city: "Kochi",
      addressLines: ["Velleparambil House", "Sastha Temple Road, Ernakulam – 682017, Kerala"],
      address: "Velleparambil House, Sastha Temple Road, Ernakulam – 682017, Kerala",
      phone: "+91 81568 70004",
      mapImg: "/images/maps/kochi_map.png",
      mapUrl: "https://www.google.com/maps/dir/Edapally+Metro+Station,+Edappally,+Kochi,+Ernakulam,+Keralam+682024/Maxsel+Agencies+Kochi,+Kolappilly+Velleparambil+House,+Sastha+Temple+Rd,+Kaloor,+Ernakulam,+Keralam+682017/@10.0097809,76.2795939,14z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x3b080db0ffffffff:0xe9cf5831273cce6!2m2!1d76.3083641!2d10.025263!1m5!1m1!1s0x3b080d444cfc451b:0x4243dd2c4cc4b36b!2m2!1d76.2905556!2d9.9967666?entry=ttu&g_ep=EgoyMDI2MTAxNC4wIKXMDSoASAFQAw%3D%3D",
    },
  ];

  return (
    <div className="w-full bg-white font-poppins flex flex-col min-h-screen">
      {/* ========================================================= */}
      {/* 1. TOP HERO BANNER (Exact Figma Measurements & Text)     */}
      {/* Width: 1744.63px, Height: 643.65px, Box: 878px x 139px   */}
      {/* ========================================================= */}
      <section className="w-full flex justify-center bg-[#0C1222] overflow-hidden">
        <div
          className="w-full max-w-[1745px] h-[460px] sm:h-[540px] md:h-[643.65px] relative flex flex-col items-center justify-center bg-cover bg-center overflow-hidden px-4"
          style={{
            backgroundImage: `url('/images/contact_banner.webp'), url('/images/contact_banner.jpg')`,
            backgroundPosition: "center 30%",
          }}
        >
          {/* Dark Contrast Overlay */}
          <div className="absolute inset-0 bg-black/55 backdrop-brightness-85"></div>

          {/* Banner Content Container (Centered) */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-[1000px] mx-auto px-4">
            {/* Heading: Bounding Box 878px x 139px */}
            <div className="w-full max-w-[878px] min-h-[110px] md:min-h-[139px] flex items-center justify-center">
              <h1
                className="text-white text-3xl sm:text-4xl md:text-[46px] lg:text-[50px] font-bold leading-[1.18] tracking-tight drop-shadow-md"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Let’s Find The Right Equipment <br />
                For Your Business
              </h1>
            </div>

            {/* Subtitle matching Figma text */}
            <p
              className="w-full max-w-[878px] text-white/90 text-sm sm:text-base md:text-[18px] leading-relaxed font-normal mt-4 md:mt-5 drop-shadow-xs"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Looking for reliable commercial kitchen, bakery, refrigeration, or foodservice equipment?
              Our team is here to understand your requirements and help you explore the right solutions for your business.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. FORM SECTION (Matching Picture 1 Reference)            */}
      {/* Left: Prefer to Reach Us by Email? | Right: Requirements   */}
      {/* ========================================================= */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-14 sm:py-20">
        <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8">
          
          {/* LEFT CARD: Prefer to Reach Us by Email? */}
          <div className="w-full lg:w-[320px] xl:w-[350px] bg-white rounded-[24px] border border-[#D1D5DB] p-6 sm:p-8 flex flex-col justify-start flex-shrink-0 shadow-2xs">
            <h3
              className="text-[26px] sm:text-[28px] font-bold text-[#1F2937] leading-[1.25]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Prefer to Reach Us <br />
              by Email?
            </h3>

            <p className="text-gray-500 text-[14px] sm:text-[15px] leading-relaxed mt-4 font-normal">
              Have a product enquiry or a specific equipment requirement? Send us an email with your details, and our team can review your enquiry.
            </p>

            <div className="mt-6">
              <a
                href="mailto:maxselagencies2@gmail.com"
                className="block w-full text-center sm:text-left px-4 py-2.5 rounded-[12px] border border-gray-200 text-gray-700 text-[14px] font-medium hover:border-[#04940B] hover:text-[#04940B] transition-colors break-all"
              >
                maxselagencies2@gmail.com
              </a>
            </div>
          </div>

          {/* RIGHT CARD: Tell Us About Your Requirements */}
          <div className="w-full flex-1 bg-white rounded-[24px] border border-[#D1D5DB] p-6 sm:p-8 lg:p-10 shadow-2xs">
            <RequirementsForm />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. CONNECT WITH MAXSEL AGENCIES (Matching Picture 2)       */}
      {/* 3-Column Box with Maps & Branch Details                   */}
      {/* ========================================================= */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pb-20 sm:pb-24">
        {/* Section Heading & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2
            className="text-2xl sm:text-[34px] lg:text-[38px] font-bold text-[#1F2937] tracking-tight leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Connect With Maxsel Agencies
          </h2>
          <p className="text-gray-500 text-[14px] sm:text-[16px] mt-2 leading-relaxed font-normal">
            With offices in Kochi, Trivandrum, and Kollam, connect with our team to discuss your commercial equipment requirements.
          </p>
        </div>

        {/* 3-Column Bordered Container with Maps and Details */}
        <div className="w-full bg-white border border-[#E5E7EB] rounded-none sm:rounded-md overflow-hidden shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E5E7EB]">
            {locations.map((loc) => (
              <div key={loc.city} className="p-6 sm:p-7 lg:p-8 flex flex-col justify-between">
                <div>
                  {/* Top: Location Map Image */}
                  <a
                    href={loc.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block w-full h-[190px] sm:h-[210px] overflow-hidden mb-6 bg-gray-50 border border-gray-100 group cursor-pointer"
                    title={`View ${loc.city} showroom on Google Maps`}
                  >
                    <img
                      src={loc.mapImg}
                      alt={`${loc.city} Showroom Map`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 text-gray-900 text-[12px] font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-[#04940B]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                        </svg>
                        Open in Google Maps ↗
                      </span>
                    </div>
                  </a>

                  {/* City Name & Map Link */}
                  <div className="flex items-center justify-between mb-2.5">
                    <h3
                      className="text-xl sm:text-[22px] font-bold text-gray-900"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {loc.city}
                    </h3>
                    <a
                      href={loc.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[12px] sm:text-[13px] font-semibold text-[#04940B] hover:text-[#037A09] transition-colors"
                    >
                      Get Directions ↗
                    </a>
                  </div>

                  {/* Address */}
                  {loc.addressLines ? (
                    <div className="text-[13px] sm:text-[14px] text-gray-600 leading-relaxed mb-6 font-normal">
                      <p>{loc.addressLines[0]}</p>
                      <p>{loc.addressLines[1]}</p>
                    </div>
                  ) : (
                    <p className="text-[13px] sm:text-[14px] text-gray-600 leading-relaxed mb-6 font-normal">
                      {loc.address}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="pt-2">
                  <p className="text-[13px] sm:text-[14px] font-medium text-gray-900">
                    Phone:{" "}
                    <a
                      href={`tel:${loc.phone.replace(/\s+/g, "")}`}
                      className="hover:text-[#04940B] font-semibold text-gray-900 transition-colors"
                    >
                      {loc.phone}
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

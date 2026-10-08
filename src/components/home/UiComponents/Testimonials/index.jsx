import React from "react";

export default function Testimonials() {
  const reviews = [
    {
      text: `"Maxsel's team turned our blank slate space into a high-capacity chef's playground in record time. Absolute professionals."`,
      name: "Chef Vikram Oberoi",
      title: "Director of Culinary, Oberoi Bistro",
      avatarColor: "bg-blue-100 text-blue-600"
    },
    {
      text: `"The thermal range and temperature holding on their combi-ovens are perfect. We've seen a huge drop in cooking gas usage too."`,
      name: "Chef Ananya Sen",
      title: "Head Pastry Artist, Flour & Co.",
      avatarColor: "bg-pink-100 text-pink-600"
    },
    {
      text: `"Emergency customer service is where they truly shine. They solved our cold storage compressor failure within 4 hours."`,
      name: "Mr. Rohan Choksi",
      title: "General Manager, Prime Hospitality",
      avatarColor: "bg-emerald-100 text-emerald-600"
    }
  ];

  return (
    <section className="w-full py-20 bg-white font-poppins overflow-hidden">
      <div className="container mx-auto px-4 xl:px-[80px] max-w-[1728px]">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-[70px]">
          <h2 className="font-poppins font-semibold text-[42px] leading-none text-[#0F172A] text-center mb-[16px]">
            What Our Clients Say
          </h2>
          <p className="font-poppins font-normal text-[18px] leading-[150%] text-[#475569] text-center">
            Read real stories of kitchens optimized and empowered by Maxsel solutions.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] w-full pb-6">
          {reviews.map((review, index) => (
            <div 
              key={index} 
              className="relative w-full h-[204px] rounded-[16px] border-[1px] border-[#E2E8F0] bg-white p-[32px] flex flex-col justify-between mt-[30px]"
            >
              {/* Overlapping Quote Icon (Princess Sofia Font) */}
              <span 
                className="absolute text-[#E11D48] bg-white px-2 select-none"
                style={{ 
                  fontFamily: "'Princess Sofia', cursive", 
                  fontSize: '120px',
                  lineHeight: '0',
                  top: '0px',
                  left: '24px',
                }}
              >
                “
              </span>

              {/* Review Text */}
              <p className="font-inter italic font-normal text-[15px] leading-[160%] text-[#475569] mt-4 relative z-10">
                {review.text}
              </p>

              {/* Author Section */}
              <div className="flex items-center gap-[12px] mt-auto">
                {/* Avatar Fallback */}
                <div className={`w-[44px] h-[44px] rounded-full flex items-center justify-center font-bold text-[16px] ${review.avatarColor}`}>
                  {review.name.split(" ").slice(0,2).map(n => n[0]).join("").replace(/[^A-Za-z]/g, "")}
                </div>
                
                <div className="flex flex-col">
                  <h4 className="font-poppins font-semibold text-[15px] text-[#0F172A] leading-tight">
                    {review.name}
                  </h4>
                  <span className="font-poppins font-normal text-[13px] text-[#94A3B8] leading-tight mt-[2px]">
                    {review.title}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

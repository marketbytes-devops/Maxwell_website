import React from "react";

export default function Achievements() {
  const stats = [
    { number: "5,000+", label: "Happy Clients Served" },
    { number: "1,200+", label: "Products Cataloged" },
    { number: "15+", label: "Premium Brands Represented" },
    { number: "10+", label: "Years of Culinary Design" },
  ];

  return (
    <section className="w-full bg-[#0F172A] font-poppins">
      <div className="container mx-auto px-4 xl:px-[80px] py-[64px] max-w-[1728px]">
        <div className="flex flex-wrap lg:flex-nowrap justify-between items-center gap-10">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center text-center gap-4 w-full sm:w-auto">
              <h3 className="text-[#E11D48] text-[50px] font-semibold leading-none">
                {stat.number}
              </h3>
              <p className="text-[#F1F5F9] text-[16px] font-medium leading-none">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import Image from "next/image";

// Import images from assets/About_us
import processTallImg from "@/assets/About_us/a08756ee22d65e324911614da0b6f926fbfd5faf.jpg";
import step1Img from "@/assets/About_us/fc59ac492778bac934eae4ea48ce44e99d92bc6e.jpg";
import step2Img from "@/assets/About_us/a2f7ada7081576db2761fcae84e81b912d37f06e.jpg";
import step3Img from "@/assets/About_us/b19ae4fd222f485fe5a14772f270645265013807.jpg";
import step4Img from "@/assets/About_us/c0129d6daa3791281ded97eb1daf8efefaac56fa.jpg";

const steps = [
  {
    number: "01",
    title: "Understand",
    description:
      "Learn about each business’s needs and operational requirements.",
    image: step1Img,
    alt: "Bakery and cake display refrigeration showcase - Understand needs",
  },
  {
    number: "02",
    title: "Explore",
    description: "Identify relevant equipment options from our product range.",
    image: step2Img,
    alt: "Curved glass refrigerated showcase unit - Explore options",
  },
  {
    number: "03",
    title: "Find Solutions",
    description:
      "Explore options suited to the business and its intended application.",
    image: step3Img,
    alt: "Commercial bakery display shelves and bakery equipment - Find solutions",
  },
  {
    number: "04",
    title: "Build Relationships",
    description:
      "Put customer focus, professionalism and reliability at the centre of our approach.",
    image: step4Img,
    alt: "Professional chef plating dishes in commercial kitchen - Build relationships",
  },
];

export default function AboutApproach() {
  return (
    <section className="w-full flex justify-center bg-white py-14 sm:py-20 lg:py-[90px] px-6 sm:px-12 md:px-16 xl:px-[80px] font-poppins">
      <div className="w-full max-w-[1568px] flex flex-col gap-12 sm:gap-14 lg:gap-[60px]">
        {/* Top Header Block: Width: 1067px, Height: 219px, Gap: 12px, Border bottom: 0.5px */}
        <div className="w-full max-w-[1067px] flex flex-col gap-3 pb-8 sm:pb-10 border-b border-[#E2E8F0]">
          <span
            className="font-semibold text-xs sm:text-sm tracking-wider uppercase"
            style={{ color: "#E11D48" }}
          >
            OUR APPROACH
          </span>

          <h2 className="text-[#0F172A] font-bold text-3xl sm:text-4xl lg:text-[42px] leading-[1.2] tracking-tight">
            More Than Equipment. Solutions for Your Business.
          </h2>

          <div className="flex flex-col gap-2.5 text-[#475569] text-sm sm:text-[15.5px] leading-[1.65] font-normal pt-1">
            <p>
              We understand that selecting commercial equipment involves more
              than choosing a product. Businesses need to consider their
              operational requirements, available space, capacity and intended
              use.
            </p>
            <p>
              Our approach begins with understanding those requirements and
              helping customers explore relevant equipment options across our
              product categories
            </p>
          </div>
        </div>

        {/* Main Cards Block: Width: 1568px, Height: 952px, Gap: 80px */}
        <div className="w-full flex flex-col lg:flex-row items-stretch gap-10 lg:gap-[80px]">
          {/* Left Column: Tall Showcase Display Card with Bottom Gradient Overlay */}
          <div className="w-full lg:w-[480px] xl:w-[500px] shrink-0 h-[520px] sm:h-[650px] lg:h-[952px] relative rounded-[8px] overflow-hidden bg-gray-100 group shadow-sm">
            <Image
              src={processTallImg}
              alt="Maxsel commercial food display showcasing bakery items"
              fill
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover w-full h-full select-none transition-transform duration-700 group-hover:scale-105"
            />

            {/* Bottom Dark Gradient Overlay for Our Process */}
            <div className="absolute inset-x-0 bottom-0 pt-28 pb-8 px-6 sm:px-8 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-2.5 z-10">
              <span
                className="font-semibold text-xs sm:text-sm tracking-wider uppercase"
                style={{ color: "#E11D48" }}
              >
                OUR PROCESS
              </span>
              <h3 className="text-white font-semibold text-xl sm:text-2xl lg:text-[25px] leading-[1.3]">
                Clarity at every step, from need to solution.
              </h3>
            </div>
          </div>

          {/* Right Column: 2x2 Grid of Step Cards (01, 02, 03, 04) */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 lg:gap-x-10 gap-y-10 lg:gap-y-12">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col gap-4 group">
                {/* Image Container with bold white step number */}
                <div className="w-full h-[250px] sm:h-[280px] lg:h-[310px] xl:h-[320px] relative rounded-[8px] overflow-hidden bg-gray-100 shadow-sm">
                  {/* Subtle top vignette so the white number is always crisp */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/10 z-10 pointer-events-none" />

                  {/* Overlaid bold white number */}
                  <span className="absolute top-4 left-5 z-20 text-white font-bold text-3xl sm:text-[34px] tracking-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] select-none">
                    {step.number}
                  </span>

                  <Image
                    src={step.image}
                    alt={step.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 480px"
                    className="object-cover w-full h-full select-none transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Card Text Content */}
                <div className="flex flex-col gap-1.5 pt-0.5">
                  <h4
                    className="font-semibold text-lg sm:text-[19px] leading-snug"
                    style={{ color: "#E11D48" }}
                  >
                    {step.title}
                  </h4>
                  <p className="text-[#475569] text-sm sm:text-[14.5px] leading-[1.6] font-normal">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

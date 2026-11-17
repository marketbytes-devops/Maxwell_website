"use client";

import React from "react";
import AboutBanner from "@/components/about/AboutBanner";
import AboutStory from "@/components/about/AboutStory";
import AboutApproach from "@/components/about/AboutApproach";
import AboutVisionMission from "@/components/about/AboutVisionMission";
import AboutPrinciples from "@/components/about/AboutPrinciples";
import AboutIndustries from "@/components/about/AboutIndustries";
import AboutBrands from "@/components/about/AboutBrands";
import AboutCTA from "@/components/about/AboutCTA";

export default function AboutPage() {
  return (
    <main className="w-full bg-white min-h-screen font-poppins">
      {/* 1. About Us Banner (1728px x 672px, Content: 800px x 359px) */}
      <AboutBanner />

      {/* 2. Our Story Section (1568px x 624px, Image: 737px x 624px, Red Card: 215px x 178px, Content: 751px x 624px) */}
      <AboutStory />

      {/* 3. Our Approach & Process Section (Header: 1067px x 219px, Main: 1568px x 952px) */}
      <AboutApproach />

      {/* 4. Our Vision & Mission Section (1568px x 743px, Gap: 24px) */}
      <AboutVisionMission />

      {/* 5. Values & Principles Section (1728px x 933px, Padding: 80px, Gap: 32px, #FFEBEB) */}
      <AboutPrinciples />

      {/* 6. Industries We Serve (3628px row, Gap: 16px) */}
      <AboutIndustries />

      {/* 7. Premium Global Brands We Deal With */}
      <AboutBrands />

      {/* 8. Final Call to Action Section (1067px x 291px, Centered) */}
      <AboutCTA />
    </main>
  );
}

"use client";

import HeroBanner from "./UiComponents/Hero";
import PremiumBrands from "./UiComponents/PremiumBrands";
import ProductCategories from "./UiComponents/ProductCategories";
import WhatAreYouLookingFor from "./UiComponents/WhatAreYouLookingFor";
import SolutionsForBusiness from "./UiComponents/SolutionsForBusiness";
import ProjectsAndWork from "./UiComponents/ProjectsAndWork";
import Achievements from "./UiComponents/Achievements";
import AboutBrand from "./UiComponents/AboutBrand";
import Testimonials from "./UiComponents/Testimonials";
import Insights from "./UiComponents/Insights";
import CommercialCTA from "./UiComponents/CommercialCTA";

export default function HomeClient() {
  const heroFeatures = [
    {
      text: "Premium Brands",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="M9 12l2 2 4-4"></path>
        </svg>
      )
    },
    {
      text: "Wide Product Range",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      )
    },
    {
      text: "Complete Business Solutions",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    }
  ];

  return (
    <main>
      {/* Reusable HeroBanner Section */}
      <HeroBanner 
        badge="Trusted Professional Brands"
        title={
          <>
            Complete Commercial Kitchen <br/> Refrigeration
          </>
        }
        highlightedText="Solutions"
        subtitle="Professional equipment for hotels, restaurants, bakeries, cafés, supermarkets and food businesses from leading brands, all in one place."
        primaryButtonText="Explore Products"
        secondaryButtonText="Request a Quote"
        bgImage="/bannerimage.webp"
        bgVideo="https://res.cloudinary.com/mbz958a7/video/upload/q_auto,f_auto/v1791791658/WhatsApp_Video_2026-10-12_at_12.03.25_PM.mp4"
        features={heroFeatures}
        stamp={{
          width: '300px',
          height: '159px',
          bottom: '120px',
          right: '80px',
          angle: '-19.01deg',
          content: (
            <div 
              style={{
                fontFamily: "'Handlee', cursive",
                fontWeight: 400,
                fontSize: '40px',
                color: '#FFFFFF',
                textAlign: 'center',
                lineHeight: '110%'
              }}
            >
              Built for<br/>Professional<br/>Performance
            </div>
          )
        }}
      />

      {/* Modular Home Page Sections */}
      <WhatAreYouLookingFor />
      <ProductCategories />
      <PremiumBrands /> 
      <SolutionsForBusiness />
      <ProjectsAndWork />
      <Achievements />
      <AboutBrand />
      <Testimonials />
      <Insights />
      <CommercialCTA />
    </main>
  );
}

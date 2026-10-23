"use client";

import React from "react";
import BrandsBanner from "@/components/brands/BrandsBanner";
import PremiumBrands from "@/components/home/UiComponents/PremiumBrands";
import BrandCategoriesList from "@/components/brands/BrandCategoriesList";

export default function BrandsPage() {
  return (
    <main className="w-full bg-white min-h-screen font-poppins">
      {/* 1. Brands Banner Section (1728px x 672px, px-[80px], pt-[80px], content hug 690px x 210px) */}
      <BrandsBanner />

      {/* 2. Premium Global Brands We Deal With (Imported from Home page) */}
      <PremiumBrands />

      {/* 3. Brand Product Categories (Western, Hoshizaki, Trufrost & Butler) */}
      <BrandCategoriesList />
    </main>
  );
}

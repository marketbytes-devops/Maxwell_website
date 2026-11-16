"use client";

import React from "react";
import BrandCategorySection from "./BrandCategorySection";

// Direct imports from E:\Maxsel_website\src\assets\brands
import westernFreezer from "@/assets/brands/3d35bd8416af59577fb1c588ff784797d6dff15f.png";
import westernWaterCooler from "@/assets/brands/8b93b67d96800c7162ff6902ce87f3e2a58f03e9.png";
import westernBackBar from "@/assets/brands/896eb7cf5c651d4972927683915edce21e6f054f.png";

import hoshizakiReachIn from "@/assets/brands/3ed886279de917d94939fc1b02b23836e3ce870d.jpg";
import hoshizakiSushiCase from "@/assets/brands/c0cde237a1915f81f06cab79f5224790e8083d62.jpg";
import hoshizakiDeepFreezer from "@/assets/brands/68d4d096424b6b4989d6115dc6c913df2e3907a2.jpg";

import trufrostPizza from "@/assets/brands/78f209034c8f5e239a523fa0f1ebd545e4b94546.jpg";
import trufrostFries from "@/assets/brands/6bfbb04dbe7d51c66b2b4d253f3309e53e6891ec.jpg";
import trufrostCappuccino from "@/assets/brands/cappuchino.jpg";

const BRAND_CATEGORIES = [
  {
    id: "western",
    heading: "Western Product Categories",
    subHeading:
      "Keep up to date with smart kitchen maintenance rules, safety compliance tips, and layout planning.",
    brandTag: "Western",
    brandLogo: "/brands/1.webp",
    cards: [
      {
        title: "Deep Freezer , Combination Freezers",
        image: westernFreezer,
        isCover: false,
      },
      {
        title: "Storage water cooler",
        image: westernWaterCooler,
        isCover: false,
      },
      {
        title: "Back Bar",
        image: westernBackBar,
        isCover: false,
      },
    ],
  },
  {
    id: "hoshizaki",
    heading: "Hoshizaki Product Categories",
    subHeading:
      "Keep up to date with smart kitchen maintenance rules, safety compliance tips, and layout planning.",
    brandTag: "Hoshizaki",
    brandLogo: "/brands/2.webp",
    cards: [
      {
        title: "Reach-in Refrigerator",
        image: hoshizakiReachIn,
        isCover: false,
      },
      {
        title: "Sushi Display Case",
        image: hoshizakiSushiCase,
        isCover: false,
      },
      {
        title: "Deep Freezer , Combination Freezers",
        image: hoshizakiDeepFreezer,
        isCover: false,
      },
    ],
  },
  {
    id: "trufrost",
    heading: "Trufrost & Butler Product Categories",
    subHeading:
      "Keep up to date with smart kitchen maintenance rules, safety compliance tips, and layout planning.",
    brandTag: "Trufrost & Butler",
    brandLogo: "/brands/3.webp",
    cards: [
      {
        title: "Pizza",
        image: trufrostPizza,
        isCover: true,
      },
      {
        title: "french fries",
        image: trufrostFries,
        isCover: true,
      },
      {
        title: "cappuccino",
        image: trufrostCappuccino,
        isCover: true,
      },
    ],
  },
];

export default function BrandCategoriesList() {
  return (
    <div className="w-full flex flex-col bg-white">
      {BRAND_CATEGORIES.map((category) => (
        <BrandCategorySection
          key={category.id}
          heading={category.heading}
          subHeading={category.subHeading}
          brandTag={category.brandTag}
          brandLogo={category.brandLogo}
          cards={category.cards}
        />
      ))}
    </div>
  );
}

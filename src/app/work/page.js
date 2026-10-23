"use client";

import React, { useState } from "react";
import WorkBanner from "@/components/work/WorkBanner";
import ProjectsAndWork from "@/components/home/UiComponents/ProjectsAndWork";
import WorkInsights from "@/components/work/WorkInsights";
import RequestQuoteModal from "@/components/common/RequestQuoteModal";

export default function WorkPage() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  return (
    <main className="w-full bg-[#FAFAFA] min-h-screen font-poppins">
      {/* 1. Work Banner Section matching exact Figma measurements (1728px x 672px, px-[80px], pt-[80px], gap: 35px) */}
      <WorkBanner />

      {/* 2. Our Projects & Completed Work (imported from Home page component) */}
      <ProjectsAndWork />

      {/* 3. Culinary Insights & Engineering Guides (3 Cards, 1573px total, 24px gap, 508.33px x 572px cards, 388px images) */}
      <WorkInsights />



      {/* Reusable Request Quote Modal */}
      <RequestQuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </main>
  );
}

"use client";

import { useState } from "react";
import SolutionsBanner from "@/components/solutions/SolutionsBanner";
import RequestQuoteModal from "@/components/common/RequestQuoteModal";

export default function SolutionsPage() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  return (
    <main className="w-full bg-white min-h-screen">
      {/* Banner Section matching exact measurements and design */}
      <SolutionsBanner onGetStarted={() => setQuoteModalOpen(true)} />

      {/* White background section below banner to host page content and allow badge to rest on white */}
      <div className="w-full min-h-[300px] bg-white relative z-0"></div>

      {/* Reusable Request Quote Modal */}
      <RequestQuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </main>
  );
}

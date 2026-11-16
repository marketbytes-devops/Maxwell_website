"use client";

import { useState } from "react";
import SolutionsBanner from "@/components/solutions/SolutionsBanner";
import SolutionsList from "@/components/solutions/SolutionsList";
import SolutionsCTA from "@/components/solutions/SolutionsCTA";
import RequestQuoteModal from "@/components/common/RequestQuoteModal";

export default function IndustriesPage() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  return (
    <main className="w-full bg-white min-h-screen">
      {/* Industries Banner matching exact measurements and design */}
      <SolutionsBanner onGetStarted={() => setQuoteModalOpen(true)} />

      {/* 6 Alternating Industry Cards with Equipment & Bullets */}
      <SolutionsList />

      {/* Industries CTA Section: Find the Right Equipment for Your Business */}
      <SolutionsCTA onContact={() => setQuoteModalOpen(true)} />

      {/* Reusable Request Quote Modal */}
      <RequestQuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </main>
  );
}

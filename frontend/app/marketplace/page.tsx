"use client";

import Navbar from "@/src/components/Navbar";
import MarketplaceHero from "@/src/components/Marketplace/MarketplaceHero";
import TopCreators from "@/src/components/Marketplace/TopCreators";
import LatestFromCreators from "@/src/components/Marketplace/LatestFromCreators";
import CuratedCollections from "@/src/components/Marketplace/CuratedCollections";
import CreatorInsights from "@/src/components/Marketplace/CreatorInsights";

import "./marketplace-responsive.css";

export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-[#f6f4f1] font-['Figtree',sans-serif]">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <MarketplaceHero />

      {/* Social Proof / Top Creators */}
      <TopCreators />

      {/* Content Feed / Latest from Creators */}
      <LatestFromCreators />

      {/* Discovery / Curated Collections */}
      <CuratedCollections />

      {/* Conversion / Newsletter */}
      <CreatorInsights />
    </main>
  );
}

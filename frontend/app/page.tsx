import Navbar from "../src/components/Navbar";
import Hero from "../src/components/Hero";
import Marquee from "../src/components/Marquee";
import WhatsTrending from "../src/components/WhatsTrending";
import WhyCreatorHub from "../src/components/WhyCreatorHub";
import EmpowerBanner from "../src/components/EmpowerBanner";
import FeaturedCreatorsHeader from "../src/components/FeaturedCreatorsHeader";
import FeaturedCreatorsCarousel from "../src/components/FeaturedCreatorsCarousel";
import CreatorsBanner from "../src/components/CreatorsBanner";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-390px)]">
      <Navbar />
      <Hero />
      <Marquee />
      <WhatsTrending />
      <WhyCreatorHub />
      <EmpowerBanner />
      <FeaturedCreatorsHeader />
      <FeaturedCreatorsCarousel />
      <CreatorsBanner />
    </main>
  );
}

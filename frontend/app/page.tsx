import Navbar from "../src/components/Navbar";
import Hero from "../src/components/Hero";
import Marquee from "../src/components/Marquee";
import WhatsTrending from "../src/components/WhatsTrending";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Marquee />
      <WhatsTrending />
    </main>
  );
}

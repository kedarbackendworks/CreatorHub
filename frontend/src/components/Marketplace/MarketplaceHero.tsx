"use client";

import Image from "next/image";
import { Rocket } from "lucide-react";

const imgBgMap = "/assets/images/marketplace/map_bg.png";
const imgCreator1 = "/assets/images/blogs/blog_3.png"; // Reusing these as they are same in Figma context
const imgCreator2 = "/assets/images/blogs/blog_2.png";
const imgCreator3 = "/assets/images/blogs/blog_1.png";

export default function MarketplaceHero() {
  return (
    <section className="relative w-full min-h-[823px] bg-[#f6f4f1] overflow-hidden">
      {/* Background Map Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={imgBgMap} 
          alt="World Map" 
          fill
          className="object-cover mix-blend-lighten opacity-80" 
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-5 md:px-[64px] pt-[150px] relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
          
          {/* Left Content */}
          <div className="flex flex-col max-w-[580px] mt-[120px]">
            <h1 className="text-[#1a1a1a] text-[48px] md:text-[64px] font-['Fjalla_One',sans-serif] leading-[1.1] tracking-[0.96px] mb-6">
              Discover the World’s Most <span className="text-[#f95c4b]">Inspiring Creators</span>
            </h1>
            <p className="text-[#3a3a3a] text-[19px] font-semibold font-['Figtree',sans-serif] leading-[29.2px] tracking-[0.38px] mb-10 max-w-[480px]">
              Explore a curated marketplace of creators across design, fitness, tech, and more. Unlock exclusive content, learn new skills, and connect directly with experts who are shaping the future.
            </p>
            
            <button className="flex items-center gap-2 bg-gradient-to-br from-[#e14517] to-[#d6361f] text-[#f6f4f1] border border-[#ff9465] px-8 py-3 rounded-full shadow-[8px_8px_20px_0px_rgba(69,9,0,0.35)] hover:scale-105 active:scale-95 transition-transform w-fit">
              <span className="font-['Lexend',sans-serif] font-normal text-[16px]">Explore Creators</span>
              <Rocket size={20} />
            </button>
          </div>

          {/* Right Content - Image Grid */}
          <div className="relative w-full lg:w-[524px] h-[500px] mt-[80px]">
            {/* Primary Large Image */}
            <div className="absolute left-0 top-[26px] w-[252px] h-[440px] rounded-[12px] overflow-hidden shadow-xl">
              <Image src={imgCreator1} alt="Creator 1" fill className="object-cover" />
            </div>
            {/* Small Top Right */}
            <div className="absolute left-[272px] top-0 w-[252px] h-[240px] rounded-[12px] overflow-hidden shadow-xl">
              <Image src={imgCreator2} alt="Creator 2" fill className="object-cover" />
            </div>
            {/* Small Bottom Right */}
            <div className="absolute left-[272px] top-[260px] w-[252px] h-[240px] rounded-[12px] overflow-hidden shadow-xl">
              <Image src={imgCreator3} alt="Creator 3" fill className="object-cover" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

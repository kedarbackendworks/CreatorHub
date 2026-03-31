"use client";

import { Rocket } from "lucide-react";

const imgBgMap = "/assets/images/marketplace/map_bg.png";

export default function CreatorInsights() {
  return (
    <section className="relative w-full h-[547px] bg-[#d8d1c7] overflow-hidden">
      {/* Background Map Image */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img 
          src={imgBgMap} 
          alt="World Map" 
          className="w-full h-full object-cover mix-blend-lighten" 
        />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-5 text-center">
        <div className="max-w-[780px] flex flex-col items-center gap-6">
          <h2 className="text-[#1a1a1a] text-[48px] font-['Fjalla_One',sans-serif] leading-[67.9px] tracking-[0.96px] max-w-[520px]">
            Get Creator Insights Delivered to You
          </h2>
          <p className="text-[#1a1a1a] text-[19px] font-semibold font-['Figtree',sans-serif] leading-[29.2px] tracking-[0.38px] max-w-full">
            Join thousands of learners and stay updated with exclusive content, creator tips, new launches, and special offers directly in your inbox.
          </p>
          
          <div className="bg-[#f6f4f1] p-1 flex items-center rounded-full w-full max-w-[600px] shadow-lg border border-[#d8d1c7] mt-4">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 bg-transparent px-6 py-3 font-['Figtree',sans-serif] text-[16px] text-[#1a1a1a] outline-none placeholder:text-[#9a9a9a]"
            />
            <button className="flex items-center gap-2 bg-gradient-to-br from-[#e14517] to-[#d6361f] text-[#f6f4f1] border border-[#ff9465] px-8 py-3 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform">
              <span className="font-['Lexend',sans-serif] font-normal text-[16px]">Explore Creators</span>
              <Rocket size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

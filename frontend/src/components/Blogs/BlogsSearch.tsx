"use client";

import { Search, ChevronDown } from "lucide-react";

export default function BlogsSearch() {
  return (
    <section className="bg-white py-6 px-5 md:px-[64px] sticky top-0 z-40">
      <div className="flex flex-row items-center gap-4">
        {/* Search Bar */}
        <div className="bg-[#fcfaf7] border border-[#e4ded2] rounded-[32px] flex items-center px-[12px] py-[12px] shadow-[0px_1px_4px_0px_rgba(238,238,238,0.25)] flex-1 max-w-[580px]">
          <div className="flex items-center gap-1">
            <Search size={16} className="text-[#9a9a9a] shrink-0" />
            <input 
              type="text" 
              placeholder="Search for Blogs" 
              className="flex-1 bg-transparent px-1 py-0 text-[11px] leading-[14.8px] font-['Comfortaa',sans-serif] font-normal tracking-[1px] text-[#1a1a1a] outline-none placeholder:text-[#9a9a9a]"
            />
          </div>
        </div>

        {/* Trending Filter */}
        <div className="bg-[#fcfaf7] border border-[#e4ded2] rounded-[32px] flex items-center px-[12px] py-[12px] shadow-[0px_1px_4px_0px_rgba(238,238,238,0.25)] cursor-pointer hover:bg-[#f6efea] transition-colors">
          <div className="flex items-center gap-1">
            <span className="text-[#1a1a1a] text-[11px] leading-[14.8px] font-['Comfortaa',sans-serif] font-normal tracking-[1px]">
              Trending
            </span>
            <ChevronDown size={20} className="text-[#1a1a1a] shrink-0" />
          </div>
        </div>
      </div>
    </section>
  );
}

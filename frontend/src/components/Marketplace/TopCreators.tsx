"use client";

import { ChevronDown, SortDesc } from "lucide-react";
import CreatorCard from "./CreatorCard";

const creators = [
  {
    image: "/assets/images/blogs/blog_4.png",
    name: "Prof. Sarah",
    category: "Education",
    description: "Data science simplified, Tutorials from Zero to Hero",
    subs: "22k subs",
    minPrice: "$15",
  },
  {
    image: "/assets/images/blogs/blog_4.png",
    name: "Prof. Sarah",
    category: "Education",
    description: "Data science simplified, Tutorials from Zero to Hero",
    subs: "22k subs",
    minPrice: "$15",
  },
  {
    image: "/assets/images/blogs/blog_4.png",
    name: "Prof. Sarah",
    category: "Education",
    description: "Data science simplified, Tutorials from Zero to Hero",
    subs: "22k subs",
    minPrice: "$15",
  },
  {
    image: "/assets/images/blogs/blog_4.png",
    name: "Prof. Sarah",
    category: "Education",
    description: "Data science simplified, Tutorials from Zero to Hero",
    subs: "22k subs",
    minPrice: "$15",
  },
];

export default function TopCreators() {
  return (
    <section className="bg-[#f6f4f1] py-20 px-5 md:px-[64px] max-w-[1440px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="flex flex-col gap-4 max-w-[646px]">
          <h2 className="text-[#1a1a1a] text-[40px] font-['Fjalla_One',sans-serif] tracking-[0.8px] leading-[1.2]">
            Top Creators
          </h2>
          <p className="text-[#3a3a3a] text-[19px] font-semibold font-['Figtree',sans-serif] leading-[29.2px] tracking-[0.38px]">
            Find creators based on your interests and start learning from the best in each field.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <div className="bg-[#faf8f5] flex items-center gap-3 px-4 py-3 rounded-[32px] shadow-[0px_2px_2px_0px_rgba(255,179,170,0.2)] border border-[#e4ded2]">
            <SortDesc size={20} className="text-[#1a1a1a]" />
            <span className="text-[#1a1a1a] text-[16px] font-medium font-['Figtree',sans-serif]">
              Sort by: <span className="text-[#1a1a1a]">Trending</span>
            </span>
            <ChevronDown size={16} className="text-[#1a1a1a]" />
          </div>
          <a href="#" className="text-[#f95c4b] text-[19px] font-semibold underline underline-offset-4 font-['Figtree',sans-serif] tracking-[0.38px]">
            View All Creators
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {creators.map((creator, index) => (
          <CreatorCard key={index} {...creator} />
        ))}
      </div>
    </section>
  );
}

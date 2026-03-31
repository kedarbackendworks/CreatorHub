"use client";

import Image from "next/image";

export function FeaturedArticle() {
  return (
    <div className="flex flex-col gap-6 max-w-[644px] w-full group cursor-pointer transition-transform duration-300 hover:scale-[1.01]">
      <div className="relative h-[468px] rounded-[24px] overflow-hidden shadow-lg border border-[#e4ded2]">
        <Image 
          src="/assets/images/blogs/blog_1.png" 
          alt="Featured Article Cover" 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-500" 
        />
      </div>
      
      <div className="flex flex-col gap-4 max-w-[520px]">
        <h3 className="text-[#3a3a3a] text-[23px] font-semibold font-['Figtree',sans-serif] leading-[33.6px] tracking-[0.46px] group-hover:text-[#f95c4b] transition-colors duration-300">
          How I Built a 6-Figure UI/UX Career from Scratch
        </h3>
        <p className="text-[#5a5a5a] text-[16px] font-medium font-['Figtree',sans-serif] leading-[25.8px] tracking-[0.32px]">
          A step-by-step breakdown of my journey, including the tools I used, mistakes I made, and strategies that helped me land high-paying clients globally.
        </p>
      </div>
    </div>
  );
}

interface ArticleListItemProps {
  title: string;
}

export function ArticleListItem({ title }: ArticleListItemProps) {
  return (
    <div className="flex gap-6 items-center w-full group cursor-pointer hover:scale-[1.01] transition-transform duration-300">
      <div className="relative shrink-0 size-[140px] rounded-[24px] overflow-hidden shadow-lg border border-[#e4ded2]">
        <Image 
          src="/assets/images/blogs/blog_2.png" 
          alt="Article List Item Preview" 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-500" 
        />
      </div>
      <div className="flex-1">
        <h4 className="text-[#3a3a3a] text-[23px] font-semibold font-['Figtree',sans-serif] leading-[33.6px] tracking-[0.46px] group-hover:text-[#f95c4b] transition-colors duration-300">
          {title}
        </h4>
      </div>
    </div>
  );
}

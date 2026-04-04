'use client';

import React from 'react';

interface CategoryPillsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CATEGORIES = [
  'All',
  'Comedy',
  'Sports',
  'Fashion',
  'Education',
  'Lifestyle',
  'Art and Design',
  'Business'
];

export default function CategoryPills({ activeCategory, onCategoryChange }: CategoryPillsProps) {
  return (
    <div className="flex flex-col gap-[10px] w-full max-w-[1116px] mt-8 sm:mt-10 md:mt-[48px]">
      <p className="font-[family-name:var(--font-figtree)] font-medium leading-[25.8px] text-[#3a3a3a] text-[16px] tracking-[0.32px]">
        Categories
      </p>
      
      {/* Wrapped row on mobile, horizontal scroller on larger screens */}
      <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center w-full sm:overflow-x-auto pb-1 sm:pb-3 hide-scrollbar sm:snap-x sm:snap-mandatory">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className="bg-[#faf8f5] border border-[#e4ded2] flex items-center justify-center px-4 sm:px-5 py-[7px] rounded-[32px] shadow-[0px_1px_4px_0px_rgba(238,238,238,0.25)] shrink-0 sm:snap-start transition-all duration-200 hover:scale-[1.02]"
            >
              <span className={`font-[family-name:var(--font-figtree)] font-medium leading-[18.3px] text-[13px] tracking-[0.26px] whitespace-nowrap transition-colors ${
                isActive ? 'text-[#f95c4b]' : 'text-[#5a5a5a]'
              }`}>
                {cat}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
}

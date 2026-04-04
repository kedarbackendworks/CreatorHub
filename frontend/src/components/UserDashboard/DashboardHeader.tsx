import React from 'react';

export default function DashboardHeader() {
  return (
    <div className="flex flex-col items-start gap-[4px] w-full max-w-[1116px] pt-4 sm:pt-[42px]">
      <h2 className="font-[family-name:var(--font-fjalla)] font-normal leading-[1.1] sm:leading-[57.6px] text-[#1a1a1a] text-[34px] sm:text-[40px] tracking-[0.8px] w-full break-words">
        Discover Creators
      </h2>
      <p className="font-[family-name:var(--font-fjalla)] font-normal leading-[1.25] sm:leading-[48.6px] text-[#3a3a3a] text-[18px] sm:text-[33px] tracking-[0.4px] sm:tracking-[0.66px] max-w-[760px] w-full break-words">
        Explore top creators across categories and find content that fits your interests.
      </p>
    </div>
  );
}

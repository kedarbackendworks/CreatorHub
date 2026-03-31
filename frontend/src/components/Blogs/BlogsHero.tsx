"use client";

export default function BlogsHero() {
  return (
    <section className="bg-white pt-[100px] pb-[60px] px-5 md:px-[64px]">
      <div className="max-w-[780px] flex flex-col items-start gap-1">
        <h1 className="text-[#1a1a1a] text-[48px] font-['Fjalla_One',sans-serif] leading-[67.9px] tracking-[0.96px]">
          Insights and <span className="text-[#f95c4b]">Articles</span>
        </h1>
        <h3 className="text-[#3a3a3a] text-[33px] font-['Fjalla_One',sans-serif] leading-[48.6px] tracking-[0.66px]">
          Explore tips, stories and experit advice to learn, grow and stay inspired
        </h3>
      </div>
    </section>
  );
}

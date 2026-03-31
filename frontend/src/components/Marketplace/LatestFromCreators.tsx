"use client";

import { FeaturedArticle, ArticleListItem } from "./ArticleComponents";

const articles = [
  "Top 10 Workout Routines for Busy Professionals",
  "Beginner’s Guide to React in 2026",
  "How to Grow on Instagram as a Creator",
];

export default function LatestFromCreators() {
  return (
    <section className="bg-white py-20 px-5 md:px-[64px] max-w-[1440px] mx-auto">
      <div className="flex flex-col gap-4 mb-12 max-w-[646px]">
        <h2 className="text-[#1a1a1a] text-[40px] font-['Fjalla_One',sans-serif] tracking-[0.8px] leading-[1.2]">
          Latest from Creators
        </h2>
        <p className="text-[#3a3a3a] text-[19px] font-semibold font-['Figtree',sans-serif] leading-[29.2px] tracking-[0.38px]">
          Stay updated with fresh content, new launches, and trending topics from creators you follow.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 justify-between items-start">
        {/* Main Featured Article */}
        <FeaturedArticle />

        {/* Sidebar Articles */}
        <div className="flex flex-col gap-6 flex-1 w-full max-w-[576px]">
          {articles.map((title, index) => (
            <ArticleListItem key={index} title={title} />
          ))}
        </div>
      </div>
    </section>
  );
}

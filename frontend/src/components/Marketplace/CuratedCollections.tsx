"use client";

import CollectionCard from "./CollectionCard";

const collections = [
  {
    title: "Expert Design Guides",
    count: "24",
    author: "Alex Rivera",
    avatar: "/assets/images/blogs/blog_1.png",
  },
  {
    title: "Fitness for Beginners",
    count: "18",
    author: "Sarah Chen",
    avatar: "/assets/images/blogs/blog_2.png",
  },
  {
    title: "Tech Stack Mastery",
    count: "32",
    author: "Jordan Smith",
    avatar: "/assets/images/blogs/blog_3.png",
  },
];

export default function CuratedCollections() {
  return (
    <section className="bg-[#f6f4f1] py-20 px-5 md:px-[64px] max-w-[1440px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="flex flex-col gap-4 max-w-[646px]">
          <h2 className="text-[#1a1a1a] text-[40px] font-['Fjalla_One',sans-serif] tracking-[0.8px] leading-[1.2]">
            Curated Collections
          </h2>
          <p className="text-[#3a3a3a] text-[19px] font-semibold font-['Figtree',sans-serif] leading-[29.2px] tracking-[0.38px]">
            Handpicked creators grouped into collections to help you discover content faster.
          </p>
        </div>
        
        <a href="#" className="text-[#f95c4b] text-[19px] font-semibold underline underline-offset-4 font-['Figtree',sans-serif] tracking-[0.38px]">
          View All Collections
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection, index) => (
          <CollectionCard key={index} {...collection} />
        ))}
      </div>
    </section>
  );
}

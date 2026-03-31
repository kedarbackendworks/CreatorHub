"use client";

import { Clock, ThumbsUp, Eye, ArrowUpRight } from "lucide-react";
import Image from "next/image";

interface BlogCardProps {
  image: string;
  title: string;
  readTime: string;
  likes: string;
  views: string;
  description: string;
  date: string;
}

export default function BlogCard({
  image,
  title,
  readTime,
  likes,
  views,
  description,
  date,
}: BlogCardProps) {
  return (
    <div className="flex flex-col gap-5 w-full max-w-[404px] group cursor-pointer transition-transform duration-300 hover:scale-[1.01]">
      {/* Blog Image */}
      <div className="relative h-[482px] w-full rounded-[24px] overflow-hidden shadow-lg border border-[#e4ded2]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Top-Right Arrow Icon */}
        <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md z-10 hover:bg-white transition-colors">
          <ArrowUpRight size={20} className="text-[#1a1a1a]" />
        </div>
      </div>

      {/* Blog Content */}
      <div className="flex flex-col gap-3 px-2">
        <h3 className="text-[#1a1a1a] text-[23px] font-semibold font-['Figtree',sans-serif] leading-[33.6px] tracking-[0.46px] group-hover:text-[#f95c4b] transition-colors duration-300">
          {title}
        </h3>

        {/* Meta Section */}
        <div className="flex items-center gap-4 text-[#5a5a5a] text-[14px] font-medium font-['Figtree'] tracking-[0.28px]">
          <div className="flex items-center gap-1.5">
            <Clock size={16} className="text-[#7a7a7a]" />
            <span>{readTime} read</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ThumbsUp size={16} className="text-[#7a7a7a]" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye size={16} className="text-[#7a7a7a]" />
            <span>{views}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-[#5a5a5a] text-[16px] font-medium font-['Figtree',sans-serif] leading-[25.8px] tracking-[0.32px] line-clamp-3">
          {description}
        </p>

        {/* Footer */}
        <p className="text-[#9a9a9a] text-[14px] font-medium font-['Figtree'] tracking-[0.28px]">
          Published on {date}
        </p>
      </div>
    </div>
  );
}

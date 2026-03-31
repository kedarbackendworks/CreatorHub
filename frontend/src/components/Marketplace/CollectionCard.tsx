"use client";

import Image from "next/image";

const imgFrame1 = "/assets/images/marketplace/coll_1.png";
const imgFrame2 = "/assets/images/marketplace/coll_2.png";
const imgFrame3 = "/assets/images/marketplace/coll_3.png";
const imgFrame4 = "/assets/images/marketplace/coll_4.png";

interface CollectionCardProps {
  title: string;
  count: string;
  author: string;
  avatar: string;
}

export default function CollectionCard({ title, count, author, avatar }: CollectionCardProps) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-[24px] bg-white border border-[#e4ded2] hover:shadow-xl transition-shadow cursor-pointer group">
      {/* Image Grid */}
      <div className="grid grid-cols-[2fr_1fr] gap-2 h-[240px] rounded-[16px] overflow-hidden">
        <div className="relative h-full w-full">
          <Image 
            src={imgFrame1} 
            alt="Collection main" 
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-500" 
          />
        </div>
        <div className="grid grid-rows-3 gap-2">
          <div className="relative h-full w-full">
            <Image 
              src={imgFrame2} 
              alt="Sub 1" 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-500" 
            />
          </div>
          <div className="relative h-full w-full">
            <Image 
              src={imgFrame3} 
              alt="Sub 2" 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-500" 
            />
          </div>
          <div className="relative h-full w-full">
            <Image 
              src={imgFrame4} 
              alt="Sub 3" 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-500" 
            />
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-3 px-1">
        <div className="flex justify-between items-center">
          <h3 className="text-[#1a1a1a] text-[20px] font-bold font-['Figtree',sans-serif] tracking-[0.4px]">
            {title}
          </h3>
          <span className="text-[#f95c4b] text-[14px] font-bold font-['Figtree'] px-3 py-1 bg-[#fff0ed] rounded-full">
            {count} items
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 relative">
             <Image src={avatar} alt={author} fill className="object-cover" />
          </div>
          <span className="text-[#5a5a5a] text-[14px] font-medium font-['Figtree']">
            by <span className="text-[#1a1a1a] font-bold">{author}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

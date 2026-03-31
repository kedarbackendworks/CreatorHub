"use client";

interface CreatorCardProps {
  image: string;
  name: string;
  category: string;
  description: string;
  subs: string;
  minPrice: string;
}

export default function CreatorCard({
  image,
  name,
  category,
  description,
  subs,
  minPrice,
}: CreatorCardProps) {
  return (
    <div className="bg-white flex flex-col items-center justify-between px-4 py-[42px] relative rounded-[24px] shadow-[0px_4px_4px_0px_rgba(255,179,170,0.32)] w-full max-w-[310px] min-h-[401px]">
      <div className="flex flex-col gap-4 items-center w-full">
        <div className="flex flex-col gap-4 items-center w-full">
          <div className="relative rounded-[96px] size-[80px] overflow-hidden">
            <img 
              alt={name} 
              className="absolute inset-0 object-cover size-full" 
              src={image} 
            />
          </div>
          <div className="flex flex-col font-semibold text-[#3a3a3a] text-[19px] text-center tracking-[0.38px]">
            <p className="leading-[29.2px] font-['Figtree',sans-serif]">{name}</p>
          </div>
        </div>
        
        <div className="bg-[#faf8f5] px-2 py-1 rounded-[8px]">
          <p className="font-medium text-[#f95c4b] text-[13px] tracking-[0.26px] font-['Figtree',sans-serif]">
            {category}
          </p>
        </div>
        
        <div className="flex flex-col font-medium text-[#5a5a5a] text-[13px] text-center tracking-[0.26px] max-w-full px-4">
          <p className="leading-[18.3px] font-['Figtree',sans-serif]">
            {description}
          </p>
        </div>
      </div>

      <div className="border-[#e4ded2] border-t flex items-center justify-between py-3 text-[#3a3a3a] text-[16px] tracking-[0.32px] w-full mt-6">
        <p className="font-medium font-['Figtree',sans-serif]">{subs}</p>
        <p className="font-bold font-['Figtree',sans-serif]">From {minPrice}/month</p>
      </div>
    </div>
  );
}

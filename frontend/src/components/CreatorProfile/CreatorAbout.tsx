export default function CreatorAbout({ creator }: { creator: any }) {
  return (
    <div className="flex flex-col gap-[8px] items-start w-full max-w-[1116px]">
      
      {/* Bio Section */}
      <div className="bg-[#fcfaf7] border-[0.5px] border-[#e4ded2] flex flex-col gap-[12px] items-start justify-center p-[24px] rounded-[12px] w-full">
        <h3 className="font-['Figtree',sans-serif] font-semibold leading-[29.2px] text-[#1a1a1a] text-[19px] tracking-[0.38px]">
          Bio
        </h3>
        <p className="font-['Figtree',sans-serif] font-medium leading-[25.8px] text-[#5a5a5a] text-[16px] tracking-[0.32px] w-full">
          {creator?.bio || "This creator hasn't shared a biography yet."}
        </p>
      </div>

      {/* Expertise Section */}
      <div className="bg-[#fcfaf7] border-[0.5px] border-[#e4ded2] flex flex-col gap-[12px] items-start justify-center p-[24px] rounded-[12px] w-full">
        <h3 className="font-['Figtree',sans-serif] font-semibold leading-[29.2px] text-[#1a1a1a] text-[19px] tracking-[0.38px]">
          Expertise
        </h3>
        <div className="flex flex-wrap gap-2">
           {(creator?.category || 'General Content').split(',').map((cat: string, index: number) => (
             <span key={index} className="px-4 py-2 bg-white border border-[#e4ded2] rounded-full text-sm font-medium text-[#5a5a5a]">
               {cat.trim()}
             </span>
           ))}
        </div>
      </div>

      {/* Platform Stats Section */}
      <div className="bg-[#fcfaf7] border-[0.5px] border-[#e4ded2] flex flex-col gap-[12px] items-start justify-center p-[24px] rounded-[12px] w-full">
        <h3 className="font-['Figtree',sans-serif] font-semibold leading-[29.2px] text-[#1a1a1a] text-[19px] tracking-[0.38px]">
          Platform Activity
        </h3>
        <ul className="list-disc font-['Figtree',sans-serif] font-medium text-[#5a5a5a] text-[16px] tracking-[0.32px]">
          <li className="ml-[24px]">
            <span className="leading-[25.8px]">Active since {new Date(creator?.createdAt).toLocaleDateString()}</span>
          </li>
          <li className="ml-[24px]">
            <span className="leading-[25.8px]">{creator?.subscribers?.length || 0} Members Following</span>
          </li>
        </ul>
      </div>

    </div>
  );
}

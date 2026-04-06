import Link from 'next/link';

interface PostMetadataProps {
  postId?: string;
  creatorName?: string;
  category?: string;
  price?: number;
  likes?: number;
  comments?: number;
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
}

export default function PostMetadata({ 
  postId, 
  creatorName, 
  category, 
  price, 
  likes, 
  comments, 
  isFavorited = false, 
  onFavoriteToggle 
}: PostMetadataProps) {
  return (
    <div className="flex justify-between items-start w-full max-w-[1119px] shrink-0 mt-[20px]">
      
      {/* Left side text stats */}
      <div className="flex flex-col font-['Figtree',sans-serif] font-medium gap-[8px] items-start justify-center text-[16px] tracking-[0.32px] w-[612px]">
        
        <p className="text-[#5a5a5a] w-full">
          Creator : {creatorName || "Riya’s Fitness"}
        </p>
        
        <div className="flex gap-[16px] items-start w-full whitespace-nowrap">
          <p className="text-[#5a5a5a]">Likes : {likes !== undefined ? likes : "4.8K"}</p>
          <span className="text-[#9a9a9a]">|</span>
          <p className="text-[#5a5a5a]">Comments : {comments !== undefined ? comments : "320"}</p>
          <span className="text-[#9a9a9a]">|</span>
          <p className="text-[#5a5a5a]">Category : {category || "Fitness"}</p>
        </div>
        
        <div className="flex gap-[16px] items-start w-full whitespace-nowrap">
          <p className="text-[#5a5a5a]">Price : {price !== undefined ? `$${price}` : "Free"}</p>
          <span className="text-[#9a9a9a]">|</span>
          <p className="text-[#5a5a5a]">Language : English, hindi</p>
          <span className="text-[#9a9a9a]">|</span>
          <p className="text-[#5a5a5a]">Star date : 4 June, 2026</p>
        </div>
        
        <p className="text-[#5a5a5a] w-full">
          Content type : Video/livestream/pdf files
        </p>
        
      </div>

      {/* Right side Action Buttons */}
      <div className="flex gap-[8px] items-center shrink-0">
        
        {/* Wishlist Button */}
        <button 
          onClick={onFavoriteToggle}
          className={`${isFavorited ? 'bg-[#fff5f5] border-[#fecaca]' : 'bg-[#faf8f5] border-[#d8d1c7]'} hover:opacity-80 transition-all flex gap-[4px] h-[44px] items-center justify-center p-[12px] rounded-[36px]`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorited ? "#F95C4B" : "none"} xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M12.62 20.8101C12.28 20.9301 11.72 20.9301 11.38 20.8101C8.48 19.8201 2 15.6901 2 8.6901C2 5.6001 4.49 3.1001 7.56 3.1001C9.38 3.1001 10.99 3.9801 12 5.3401C13.01 3.9801 14.63 3.1001 16.44 3.1001C19.51 3.1001 22 5.6001 22 8.6901C22 15.6901 15.52 19.8201 12.62 20.8101Z" 
              stroke={isFavorited ? "#F95C4B" : "#1A1A1A"} 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <span className={`font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[13px] tracking-[0.26px] ${isFavorited ? 'text-[#f95c4b]' : 'text-[#1a1a1a]'}`}>
            {isFavorited ? 'Favorited' : 'Add to Favourites'}
          </span>
        </button>

        {/* Membership Button */}
        <button className="bg-[#faf8f5] border border-[#d8d1c7] hover:bg-[#f6f4f1] transition-colors flex gap-[4px] h-[44px] items-center justify-center p-[12px] rounded-[36px]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M18.3333 11.0504L13.7501 17.5004L6.25008 17.5004L1.66675 11.0504M18.3333 11.0504L11.5334 2.50035L8.46675 2.50035L1.66675 11.0504" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.25008 17.5004L8.46675 2.50035M13.7501 17.5004L11.5334 2.50035" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.3333 11.0504L1.66675 11.0504" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[#1a1a1a] text-[13px] tracking-[0.26px]">
            Membership
          </span>
        </button>

        {/* Enroll Now Button */}
        <Link href="/user/creator/post/checkout" className="bg-[#f95c4b] hover:bg-[#e04a39] transition-colors flex gap-[4px] h-[44px] items-center justify-center p-[12px] rounded-[36px]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M14.1666 17.5C14.1666 16.125 15.2916 15 16.6666 15C18.0416 15 19.1666 16.125 19.1666 17.5C19.1666 18.875 18.0416 20 16.6666 20C15.2916 20 14.1666 18.875 14.1666 17.5Z" stroke="#F6F4F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17.4999 15L17.4999 18.3333" stroke="#F6F4F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.1666 16.6667L15.8333 16.6667" stroke="#F6F4F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.1667 5.83333V9.16667M10.8333 7.5H17.5" stroke="#F6F4F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1.66675 4.16667V13.3333C1.66675 16.6667 3.33341 18.3333 6.66675 18.3333H11.6667" stroke="#F6F4F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.66675 1.66667H11.6667" stroke="#F6F4F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.1667 2.08333C13.5251 1.83333 12.6751 1.66667 11.6667 1.66667C8.33342 1.66667 6.66675 3.33333 6.66675 6.66667V13.3333C6.66675 16.6667 8.33342 18.3333 11.6667 18.3333C12.6751 18.3333 13.5251 18.1667 14.1667 17.9167" stroke="#F6F4F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[#f6f4f1] text-[13px] tracking-[0.26px]">
            Enroll Now
          </span>
        </Link>

      </div>
    </div>
  );
}

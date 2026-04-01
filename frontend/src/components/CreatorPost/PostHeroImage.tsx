import Image from 'next/image';
import { Lock } from 'lucide-react';

interface PostHeroImageProps {
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  thumbnailUrl?: string;
  isExclusive?: boolean;
  hasAccess?: boolean;
  onUnlockClick?: () => void;
}

export default function PostHeroImage({ 
  mediaUrl, 
  mediaType = 'image',
  thumbnailUrl,
  isExclusive = false, 
  hasAccess = true,
  onUnlockClick
}: PostHeroImageProps) {
  const isLocked = isExclusive && !hasAccess;

  const renderMedia = () => {
    if (mediaType === 'video' && !isLocked) {
      return (
        <video 
          src={mediaUrl} 
          controls 
          poster={thumbnailUrl} 
          className="max-h-full max-w-full rounded-[16px] object-cover"
        />
      );
    }

    return (
      <Image 
        src={thumbnailUrl || mediaUrl || "/assets/creator/thumbnail.png"} 
        alt="Post Cover Image" 
        fill 
        className={`object-cover transition-all duration-500 ${isLocked ? 'blur-[12px] scale-105 opacity-60' : 'opacity-80'}`} 
      />
    );
  };

  return (
    <div className="h-[340px] relative rounded-[16px] w-full max-w-[1119px] shrink-0 mt-[20px] overflow-hidden group bg-black flex items-center justify-center">
      {renderMedia()}
      
      {/* Dark overlay for contrast */}
      <div className={`absolute inset-0 bg-black/20 rounded-[16px] transition-opacity ${isLocked ? 'opacity-100' : 'opacity-100 group-hover:opacity-40'}`} />

      {/* Locked Content Overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6 text-center">
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-full mb-4 border border-white/30 shadow-xl">
            <Lock className="text-white size-[32px]" strokeWidth={2.5} />
          </div>
          <h3 className="text-white font-['Figtree',sans-serif] text-xl font-bold mb-2 drop-shadow-md">
            Exclusive Content
          </h3>
          <p className="text-white/90 font-['Figtree',sans-serif] text-sm mb-6 max-w-[300px] drop-shadow-sm">
            Join the creator's membership to unlock this post and all other premium content.
          </p>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onUnlockClick?.();
            }}
            className="bg-[#f95c4b] hover:bg-[#ff7a6c] text-white px-8 py-3 rounded-full font-bold text-[14px] shadow-lg transition-all active:scale-95 border border-white/20"
          >
            Join Membership to Unlock
          </button>
        </div>
      )}
    </div>
  );
}

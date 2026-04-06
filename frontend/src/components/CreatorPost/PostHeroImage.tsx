"use client";

import Image from 'next/image';
import { Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ReportModal } from '@/Moderation/components/ReportModal';

const DEFAULT_THUMBNAIL = '/assets/creator/thumbnail.png';
const KNOWN_BROKEN_ASSETS = ['photo-1572044162444-ad60f128bde3', 'sample_video1.mp4'];

const pickImageSource = (mediaType: 'image' | 'video', thumbnailUrl?: string, mediaUrl?: string) => {
  const candidate = mediaType === 'video'
    ? (thumbnailUrl || DEFAULT_THUMBNAIL)
    : (thumbnailUrl || mediaUrl || DEFAULT_THUMBNAIL);

  if (KNOWN_BROKEN_ASSETS.some((asset) => candidate.includes(asset))) {
    return DEFAULT_THUMBNAIL;
  }

  return candidate;
};

interface PostHeroImageProps {
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  thumbnailUrl?: string;
  isExclusive?: boolean;
  accessTier?: 'everyone' | 'members_only' | 'exclusive_paid';
  price?: number;
  hasAccess?: boolean;
  onUnlockClick?: () => void;
  unlockDisabled?: boolean;
  unlockDisabledReason?: string;
  targetId?: string;
  targetType?: 'post' | 'user' | 'dm';
  showReportButton?: boolean;
}

export default function PostHeroImage({ 
  mediaUrl, 
  mediaType = 'image',
  thumbnailUrl,
  isExclusive = false, 
  accessTier = 'members_only',
  price = 0,
  hasAccess = true,
  onUnlockClick,
  unlockDisabled = false,
  unlockDisabledReason,
  targetId,
  targetType = 'post',
  showReportButton = false,
}: PostHeroImageProps) {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(() => pickImageSource(mediaType, thumbnailUrl, mediaUrl));
  const isLocked = isExclusive && !hasAccess;

  useEffect(() => {
    setImageSrc(pickImageSource(mediaType, thumbnailUrl, mediaUrl));
  }, [mediaType, thumbnailUrl, mediaUrl]);

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
        src={imageSrc}
        alt="Post Cover Image" 
        fill 
        sizes="(max-width: 768px) 100vw, 1119px"
        onError={() => {
          if (imageSrc !== DEFAULT_THUMBNAIL) {
            setImageSrc(DEFAULT_THUMBNAIL);
          }
        }}
        className={`object-cover transition-all duration-500 ${isLocked ? 'blur-[12px] scale-105 opacity-60' : 'opacity-80'}`} 
      />
    );
  };

  return (
    <div className="h-[340px] relative rounded-[16px] w-full max-w-[1119px] shrink-0 mt-[20px] overflow-hidden group bg-black flex items-center justify-center">
      {renderMedia()}

      {showReportButton && targetId ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsReportOpen(true);
          }}
          className="absolute top-4 right-4 z-20 rounded-full bg-black/55 text-white text-xs px-3 py-1.5 hover:bg-black/70"
        >
          Report
        </button>
      ) : null}
      
      {/* Dark overlay for contrast */}
      <div className={`absolute inset-0 bg-black/20 rounded-[16px] transition-opacity ${isLocked ? 'opacity-100' : 'opacity-100 group-hover:opacity-40'}`} />

      {/* Locked Content Overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6 text-center">
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-full mb-4 border border-white/30 shadow-xl">
            <Lock className="text-white size-[32px]" strokeWidth={2.5} />
          </div>
          <h3 className="text-white font-['Figtree',sans-serif] text-xl font-bold mb-2 drop-shadow-md">
            {accessTier === 'exclusive_paid' ? 'Exclusive Paid Content' : 'Members-Only Content'}
          </h3>
          <p className="text-white/90 font-['Figtree',sans-serif] text-sm mb-6 max-w-[300px] drop-shadow-sm">
            {accessTier === 'exclusive_paid'
              ? (unlockDisabledReason || `Purchase this post for $${Number(price || 0).toFixed(2)} to unlock access.`)
              : "Join the creator's membership to unlock this post and all other premium content."}
          </p>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onUnlockClick?.();
            }}
            disabled={unlockDisabled}
            className={`bg-[#f95c4b] text-white px-8 py-3 rounded-full font-bold text-[14px] shadow-lg transition-all active:scale-95 border border-white/20 ${unlockDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#ff7a6c]'}`}
          >
            {accessTier === 'exclusive_paid'
              ? (unlockDisabled ? 'Currently Unavailable' : `Buy for $${Number(price || 0).toFixed(2)}`)
              : 'Join Membership to Unlock'}
          </button>
        </div>
      )}

      {isReportOpen && targetId ? (
        <ReportModal targetId={targetId} targetType={targetType} onClose={() => setIsReportOpen(false)} />
      ) : null}
    </div>
  );
}

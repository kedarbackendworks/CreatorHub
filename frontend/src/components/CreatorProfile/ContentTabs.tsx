'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface ContentCounts {
  posts?: number;
  videos?: number;
  livestreams?: number;
  reviews?: number;
}

export default function ContentTabs({ 
  defaultTab = 'posts', 
  creatorId: propCreatorId,
  contentCounts
}: { 
  defaultTab?: string, 
  creatorId?: string,
  contentCounts?: ContentCounts
}) {
  const params = useParams();
  const router = useRouter();
  const creatorId = propCreatorId || params?.id || 'default';

  const TABS = [
    { id: 'posts', label: 'Posts', icon: '/assets/creator/gallery.svg', href: `/user/creators/${creatorId}` },
    { id: 'videos', label: 'Videos', icon: '/assets/creator/video-circle.svg', href: `/user/creators/${creatorId}?tab=videos` },
    { id: 'livestreams', label: 'Livestreams', icon: '/assets/creator/video.svg', href: `/livestream/${creatorId}` },
    { id: 'reviews', label: 'Reviews', icon: '/assets/creator/message.svg', href: `/user/creators/${creatorId}/reviews` },
    { id: 'about', label: 'About', icon: '/assets/creator/info-circle.svg', href: `/user/creators/${creatorId}/about` },
  ];

  const handleTabClick = (e: React.MouseEvent, tab: any) => {
    // If we have counts and the count for this tab is 0, show popup
    if (contentCounts) {
      const count = contentCounts[tab.id as keyof ContentCounts];
      
      // We don't check "about" as it's always accessible
      if (tab.id !== 'about' && count === 0) {
        e.preventDefault();
        toast.error(`Oops! The creator hasn't uploaded the ${tab.label.toLowerCase()} yet.`, {
          icon: '🔍',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        return;
      }
    }
  };

  return (
    <div className="flex gap-[12px] items-center border-b border-[#e4ded2] w-full shrink-0">
      {TABS.map((tab) => {
        const isActive = defaultTab === tab.id;

        // If onTabChange is provided, use client-side tab switching
        if (onTabChange) {
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex gap-[8px] items-center justify-center p-[12px] cursor-pointer transition-colors relative 
                ${isActive ? 'border-b-2 border-[#f95c4b]' : 'border-b-2 border-transparent hover:bg-black/5'}
              `}
              style={{ marginBottom: '-1px' }}
            >
              <Image 
                src={tab.icon} 
                alt={tab.label} 
                width={20} 
                height={20} 
                className={`shrink-0 size-[20px] ${isActive ? '' : 'opacity-70'}`} 
              />
              <span 
                className={`font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[13px] tracking-[0.26px] whitespace-nowrap
                  ${isActive ? 'text-[#f95c4b]' : 'text-[#3a3a3a]'}
                `}
              >
                {tab.label}
              </span>
            </button>
          );
        }

        // Default: use Link navigation
        return (
          <Link
            href={tab.href}
            scroll={false}
            key={tab.id}
            onClick={(e) => handleTabClick(e, tab)}
            className={`flex gap-[8px] items-center justify-center p-[12px] cursor-pointer transition-colors relative 
              ${isActive ? 'border-b-2 border-[#f95c4b]' : 'border-b-2 border-transparent hover:bg-black/5'}
            `}
            style={{ marginBottom: '-1px' }} 
          >
            <Image 
              src={tab.icon} 
              alt={tab.label} 
              width={20} 
              height={20} 
              className={`shrink-0 size-[20px] ${isActive ? '' : 'opacity-70'}`} 
            />
            <span 
              className={`font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[13px] tracking-[0.26px] whitespace-nowrap
                ${isActive ? 'text-[#f95c4b]' : 'text-[#3a3a3a]'}
              `}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}


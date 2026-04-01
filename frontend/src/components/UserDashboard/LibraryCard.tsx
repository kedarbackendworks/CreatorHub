import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Lock } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  description: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  mediaType?: 'image' | 'video' | 'link' | 'file' | 'livestream';
  creatorId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  likes: number;
  comments: number;
  createdAt: string;
  isExclusive?: boolean;
}

export default function LibraryCard({ post }: { post: Post }) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const getThumbnailSrc = () => {
    if (post.mediaType === 'video') {
      if (post.thumbnailUrl) return post.thumbnailUrl;

      if (post.mediaUrl?.includes('cloudinary.com')) {
        return post.mediaUrl
          .replace('/video/upload/', '/video/upload/so_0/')
          .replace(/\.[^/.]+$/, '.jpg');
      }
    }

    return post.thumbnailUrl || post.mediaUrl;
  };

  return (
    <Link
      href={`/user/posts/${post._id}`}
      className="block bg-[#fcfaf7] border-[0.5px] border-[#e4ded2] rounded-[12px] shadow-[0px_4px_4px_0px_rgba(228,222,210,0.25)] w-full hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col gap-[12px] p-[12px]">
      
      {/* Header */}
      <div className="flex items-start gap-[12px] w-full">
        <div className="flex flex-1 items-start gap-[8px]">
          <div className="relative rounded-[32px] size-[40px] overflow-hidden shrink-0 bg-slate-200">
            {post.creatorId?.avatar ? (
              <Image src={post.creatorId.avatar} alt={post.creatorId.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">
                {post.creatorId?.name?.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="font-[family-name:var(--font-figtree)] font-medium text-[13px] leading-[18.3px] tracking-[0.26px] text-[#1a1a1a]">
              {post.creatorId?.name || 'Unknown Creator'}
            </p>
            <p className="font-[family-name:var(--font-figtree)] font-medium text-[13px] leading-[18.3px] tracking-[0.26px] text-[#5a5a5a]">
              {formattedDate}
            </p>
          </div>
        </div>
        <div className="relative size-[40px] shrink-0 flex justify-center items-center">
          <div className="relative size-[24px]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="#F95C4B"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Image */}
        <div className="flex flex-col h-[200px] justify-end p-[12px] relative rounded-[12px] overflow-hidden w-full cursor-pointer group">
          <Image src={getThumbnailSrc()} alt={post.title} fill className="object-cover transition-transform group-hover:scale-105" />
          {post.isExclusive && (
            <div className="bg-[rgba(26,26,26,0.5)] flex items-center justify-center px-[8px] py-[4px] gap-[4px] relative rounded-[32px] shrink-0 self-start z-10 backdrop-blur-sm">
              <Lock className="size-[12px] text-white" strokeWidth={3} />
              <p className="font-[family-name:var(--font-comfortaa),sans-serif] font-semibold text-[11px] leading-[18.3px] tracking-[0.22px] text-white">
                Exclusive
              </p>
            </div>
          )}
        </div>

      {/* Details Footer */}
      <div className="flex flex-col gap-[8px] w-full">
        <div className="flex flex-col gap-[4px] w-full">
          <p className="font-[family-name:var(--font-figtree)] font-bold text-[14px] leading-[1.2] tracking-[0.26px] text-[#1e1e1e] line-clamp-1">
            {post.title}
          </p>
          <p className="font-[family-name:var(--font-figtree)] font-medium text-[13px] leading-[1.4] tracking-[0.26px] text-[#5a5a5a] line-clamp-2">
            {post.description}
          </p>
        </div>
        <div className="flex items-center gap-[12px] mt-1">
          <div className="flex items-center gap-[4px] justify-center">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9a9a9a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            <p className="font-[family-name:var(--font-figtree)] font-medium text-[13px] tracking-[0.26px] text-[#9a9a9a]">
              {post.likes || 0}
            </p>
          </div>
          <div className="flex items-center gap-[4px] justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9a9a9a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            <p className="font-[family-name:var(--font-figtree)] font-medium text-[13px] tracking-[0.26px] text-[#9a9a9a]">
              {post.comments || 0}
            </p>
          </div>
        </div>
      </div>
      </div>
    </Link>
  );
}

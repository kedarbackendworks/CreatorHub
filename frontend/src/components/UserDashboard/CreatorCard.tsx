import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Post {
  _id: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  mediaType: string;
  title: string;
}

interface Creator {
  _id: string;
  name: string;
  username: string;
  avatar: string;
  category?: string;
  posts: Post[];
}

interface CreatorCardProps {
  creator: Creator;
}

export default function CreatorCard({ creator }: CreatorCardProps) {
  const SERVICES = ['Videos', 'Posts', 'Memberships', 'Subscriptions', 'Livestream'];

  return (
    <Link href={`/user/creators/${creator._id}`} className="block w-full transition-transform hover:scale-[1.01]">
      <div className="bg-[#fcfaf7] border-[0.5px] border-[#e4ded2] flex flex-col gap-[12px] p-[16px] rounded-[12px] shadow-[0px_4px_4px_0px_rgba(228,222,210,0.25)] w-full relative z-10">
        {/* Header Info */}
        <div className="flex items-start gap-[12px]">
          <div className="relative rounded-[8px] size-[60px] overflow-hidden bg-white shrink-0 shadow-sm">
            <Image 
              src={creator.avatar || "/assets/dashboard/avatar1.png"} 
              alt={creator.name} 
              fill 
              className="object-cover" 
            />
          </div>
          <div className="flex flex-col gap-[4px] mt-1">
            <p className="font-[family-name:var(--font-figtree)] font-medium leading-[25.8px] text-[#1a1a1a] text-[16px] tracking-[0.32px]">
              {creator.name}
            </p>
            <p className="font-[family-name:var(--font-figtree)] font-medium leading-[18.3px] text-[#3a3a3a] text-[13px] tracking-[0.26px]">
              {creator.category || 'Content Creator'}
            </p>
          </div>
        </div>

        {/* Services Sub-tags */}
        <div className="flex flex-col gap-[8px] mt-2">
          <p className="font-[family-name:var(--font-comfortaa)] font-semibold leading-[18.3px] text-[#3a3a3a] text-[13px] tracking-[0.26px]">
            Services
          </p>
          <div className="flex gap-[8px] flex-wrap">
            {SERVICES.map((srv, idx) => (
              <div key={idx} className="bg-[#faf8f5] border border-[#e4ded2] flex items-center justify-center px-[12px] py-[4px] rounded-[32px] shadow-[0px_1px_4px_0px_rgba(238,238,238,0.25)]">
                 <span className="font-[family-name:var(--font-comfortaa)] font-normal text-[#5a5a5a] text-[11px] tracking-[0.22px]">
                   {srv}
                 </span>
              </div>
            ))}
          </div>
        </div>

        {/* Post Image Previews */}
        <div className="flex gap-[12px] overflow-x-auto pb-2 mt-2 hide-scrollbar w-full relative">
          {creator.posts && creator.posts.length > 0 ? (
            creator.posts.map((post, i) => (
              <div key={post._id} className="relative h-[140px] w-[200px] shrink-0 rounded-[8px] overflow-hidden bg-white shadow-sm hover:opacity-90 transition-opacity cursor-pointer">
                <Image src={post.thumbnailUrl || post.mediaUrl} alt={post.title} fill className="object-cover" sizes="200px" />
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-[140px] w-full text-zinc-400 text-sm italic font-light">
              No recent published posts
            </div>
          )}
        </div>

      </div>
    </Link>
  );
}

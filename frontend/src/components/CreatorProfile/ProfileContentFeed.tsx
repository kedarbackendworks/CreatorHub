import Image from 'next/image';
import Link from 'next/link';

import React, { useEffect, useState } from 'react';
import api from '@/src/lib/api';

interface ProfileContentFeedProps {
  creatorId: string;
}

export default function ProfileContentFeed({ creatorId }: ProfileContentFeedProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get(`/user/creators/${creatorId}/posts`);
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching creator posts:", err);
      } finally {
        setLoading(false);
      }
    };
    if (creatorId) fetchPosts();
  }, [creatorId]);

  if (loading) return <div className="p-10 text-center w-full">Loading posts...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px] w-full max-w-full">
      {posts.map((post) => (
        <Link href={`/user/posts/${post._id}`} key={post._id} className="flex flex-col gap-[12px] items-start shrink-0">
          
          <div className="flex flex-col h-[200px] items-start justify-end overflow-hidden p-[12px] relative rounded-[12px] w-full">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[12px]">
              <div className="absolute bg-[#ebebeb] inset-0 rounded-[12px]" />
              <Image 
                src={post.thumbnailUrl || post.mediaUrl || '/assets/creator/thumbnail.png'} 
                alt={post.title} 
                fill 
                className="object-cover" 
              />
            </div>
            
            {post.isExclusive && (
              <div className="bg-[rgba(26,26,26,0.5)] flex gap-[4px] items-center justify-center px-[8px] py-[4px] relative rounded-[32px] shrink-0 backdrop-blur-sm">
                <Image src="/assets/creator/lock.svg" alt="Locked" width={16} height={16} className="shrink-0 size-[16px]" />
                <p className="font-['Comfortaa',sans-serif] font-semibold leading-[18.3px] text-[11px] text-white tracking-[0.22px] whitespace-nowrap">
                  Locked
                </p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-[4px] items-start justify-end w-full">
            <div className="flex items-center w-full">
              <p className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[#3a3a3a] text-[13px] tracking-[0.26px] whitespace-nowrap truncate w-full">
                {post.title}
              </p>
            </div>
            
            <div className="flex gap-[12px] items-center text-[#9a9a9a]">
              <div className="flex items-center">
                <p className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[13px] tracking-[0.26px] whitespace-nowrap">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-[4px] items-center justify-center">
                <Image src="/assets/creator/like.svg" alt="Like" width={20} height={20} className="shrink-0 size-[20px]" />
                <p className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[13px] tracking-[0.26px] whitespace-nowrap">
                  {post.likes}
                </p>
              </div>
              <div className="flex gap-[4px] items-center justify-center">
                <Image src="/assets/creator/comment.svg" alt="Comment" width={20} height={20} className="shrink-0 size-[20px]" />
                <p className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[13px] tracking-[0.26px] whitespace-nowrap">
                  {post.comments}
                </p>
              </div>
            </div>
            
          </div>
          
        </Link>
      ))}
      {posts.length === 0 && <div className="col-span-full p-20 text-center italic text-zinc-500">No posts shared yet.</div>}
    </div>
  );
}

'use client';

import React, { useEffect, useState, use } from 'react';
import DashboardSidebar from '@/src/components/UserDashboard/DashboardSidebar';
import PostHeader from '@/src/components/CreatorPost/PostHeader';
import PostHeroImage from '@/src/components/CreatorPost/PostHeroImage';
import PostMetadata from '@/src/components/CreatorPost/PostMetadata';
import PostDetails from '@/src/components/CreatorPost/PostDetails';
import InteractionBar from '@/src/components/CreatorPost/InteractionBar';
import CommentsSection from '@/src/components/CreatorPost/CommentsSection';
import RelatedCreators from '@/src/components/CreatorPost/RelatedCreators';
import api from '@/src/lib/api';

export default function UserPostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/user/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#f6f4f1] flex items-center justify-center">Loading...</div>;
  if (!post) return <div className="min-h-screen bg-[#f6f4f1] flex items-center justify-center">Post not found.</div>;

  return (
    <div className="flex min-h-screen bg-[#f6f4f1] w-full">
      {/* Fixed Sidebar */}
      <DashboardSidebar />

      {/* Main Layout Area - Offset by Sidebar width */}
      <main className="flex-1 flex flex-col pl-[240px] relative w-full overflow-x-hidden min-h-screen">
        
        {/* Padded Container for all the Post elements */}
        <div className="px-[42px] pt-[42px] pb-[64px] flex flex-col items-start w-[calc(100%-240px)] max-w-[1400px]">
          
          <PostHeader 
            title={post.title} 
            creatorId={post.creatorId?._id || post.creatorId} 
          />
          
          <PostHeroImage 
            mediaUrl={post.mediaUrl} 
            mediaType={post.mediaType} 
            thumbnailUrl={post.thumbnailUrl} 
          />
          
          <PostMetadata 
            creatorName={post.creatorId?.name || "Creator"}
            category={post.category}
            price={post.price}
            likes={post.likes}
            comments={post.comments}
          />
          
          <PostDetails description={post.description} />
          
          <InteractionBar 
            postId={post._id} 
            initialLikes={post.likes} 
            initialDislikes={post.dislikes} 
            initialUserReaction={post.userReaction} 
          />

          <CommentsSection postId={post._id} />
          
          <RelatedCreators />
          
        </div>
        
      </main>
    </div>
  );
}

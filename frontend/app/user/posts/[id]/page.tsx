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
import MembershipModal from '@/src/components/CreatorProfile/MembershipModal';
import api from '@/src/lib/api';
import toast from 'react-hot-toast';

export default function UserPostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMemModalOpen, setIsMemModalOpen] = useState(false);

  const handleFavoriteToggle = async () => {
    try {
      const res = await api.post(`/user/posts/${id}/favorite`);
      setPost((prev: any) => ({ ...prev, isFavorited: res.data.isFavorited }));
      toast.success(res.data.isFavorited ? 'Added to library' : 'Removed from library');
    } catch (err) {
      toast.error('Failed to update favorite status');
    }
  };

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

  const handleUnlockSuccess = () => {
    // Re-fetch post to update access status
    const fetchPost = async () => {
        try {
          const res = await api.get(`/user/posts/${id}`);
          setPost(res.data);
        } catch (err) {}
      };
      fetchPost();
  };

  const handleUnlockClick = async () => {
    if (post.accessTier === 'members_only') {
      setIsMemModalOpen(true);
      return;
    }

    if (post.accessTier === 'exclusive_paid') {
      const creatorNameForPrompt = post.creatorId?.name || 'this creator';
      const message = `Do you want to purchase ${creatorNameForPrompt} exclusive content?`;
      const accepted = window.confirm(message);
      if (!accepted) return;

      try {
        await api.post(`/user/posts/${id}/purchase-exclusive`);
        toast.success('Exclusive content unlocked successfully');
        handleUnlockSuccess();
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Unable to purchase exclusive content');
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-[#f6f4f1] flex items-center justify-center">Loading...</div>;
  if (!post) return <div className="min-h-screen bg-[#f6f4f1] flex items-center justify-center">Post not found.</div>;

  const creatorId = post.creatorId?._id || post.creatorId;
  const creatorName = post.creatorId?.name || "Creator";

  return (
    <div className="flex min-h-screen bg-[#f6f4f1] w-full">
      {/* Fixed Sidebar */}
      <DashboardSidebar />

      {/* Main Layout Area - Offset by Sidebar width */}
      <main className="flex-1 flex flex-col md:pl-[240px] pt-20 md:pt-0 relative w-full overflow-x-hidden min-h-screen">
        
        {/* Padded Container for all the Post elements */}
        <div className="px-4 sm:px-6 md:px-[42px] pt-20 md:pt-[42px] pb-[64px] flex flex-col items-start w-full md:w-[calc(100%-240px)] max-w-[1400px]">
          
          <PostHeader 
            title={post.title} 
            creatorId={creatorId} 
          />
          
          <PostHeroImage 
            mediaUrl={post.mediaUrl} 
            mediaType={post.mediaType} 
            thumbnailUrl={post.thumbnailUrl} 
            isExclusive={post.isExclusive}
            accessTier={post.accessTier}
            price={post.price}
            hasAccess={post.hasAccess}
            onUnlockClick={handleUnlockClick}
            targetId={post._id}
            targetType="post"
            showReportButton
          />
          
          <PostMetadata 
            postId={post._id}
            creatorName={creatorName}
            category={post.category}
            price={post.price}
            likes={post.likes}
            comments={post.comments}
            isFavorited={post.isFavorited}
            onFavoriteToggle={handleFavoriteToggle}
          />
          
          <PostDetails
            description={
              post.hasAccess
                ? post.description
                : post.accessTier === 'exclusive_paid'
                  ? 'This is exclusive paid content. Purchase to unlock and view the full post.'
                  : 'This content is available to members only. Join membership to unlock.'
            }
          />
          
          
          {post.hasAccess && (
            <InteractionBar 
              postId={post._id} 
              initialLikes={post.likes} 
              initialDislikes={post.dislikes} 
              initialUserReaction={post.userReaction} 
              isFavorited={post.isFavorited}
              onFavoriteToggle={handleFavoriteToggle}
            />
          )}

          <CommentsSection postId={post._id} />
          
          <RelatedCreators />
          
        </div>
        
        {/* Membership Modal */}
        <MembershipModal
          isOpen={isMemModalOpen}
          onClose={() => setIsMemModalOpen(false)}
          creatorName={creatorName}
          creatorId={creatorId}
          price={post.creatorId?.subscriptionPrice || 4.99}
          onSuccess={handleUnlockSuccess}
        />
      </main>
    </div>
  );
}

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
  const [unavailableMessage, setUnavailableMessage] = useState('');
  const [isMemModalOpen, setIsMemModalOpen] = useState(false);
  const [contentLockEnabled, setContentLockEnabled] = useState<boolean | null>(null);

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
        setUnavailableMessage('');
      } catch (err: any) {
        console.error("Error fetching post:", err);
        setPost(null);
        setUnavailableMessage(err?.response?.data?.message || 'Post not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    let mounted = true;

    api.get('/user/features')
      .then((res) => {
        if (!mounted) return;
        setContentLockEnabled(res?.data?.toggles?.contentLock !== false);
      })
      .catch(() => {
        if (mounted) setContentLockEnabled(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

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
      if (contentLockEnabled === false) {
        toast.error('Paid content purchases are currently unavailable by platform settings');
        return;
      }

      const creatorNameForPrompt = post.creatorId?.name || 'this creator';
      const message = `Do you want to purchase ${creatorNameForPrompt} exclusive content?`;
      const accepted = window.confirm(message);
      if (!accepted) return;

      try {
        await api.post(`/user/posts/${id}/purchase-exclusive`);
        toast.success('Exclusive content unlocked successfully');
        handleUnlockSuccess();
      } catch (err: any) {
        if (err?.response?.status === 403 && err?.response?.data?.error === 'FeatureDisabled') {
          setContentLockEnabled(false);
          toast.error('Paid content purchases are currently unavailable by platform settings');
        } else {
          toast.error(err?.response?.data?.message || 'Unable to purchase exclusive content');
        }
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-[#f6f4f1] flex items-center justify-center">Loading...</div>;
  if (!post) {
    return (
      <div className="min-h-screen bg-[#f6f4f1] flex items-center justify-center p-6">
        <div className="max-w-xl w-full rounded-2xl border border-[#e4ded2] bg-white/80 backdrop-blur-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Post unavailable</h2>
          <p className="text-[#5a5a5a]">{unavailableMessage || 'Post not found.'}</p>
        </div>
      </div>
    );
  }

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
            unlockDisabled={post.accessTier === 'exclusive_paid' && contentLockEnabled === false}
            unlockDisabledReason={post.accessTier === 'exclusive_paid' && contentLockEnabled === false ? 'Paid content purchases are temporarily unavailable by platform settings.' : undefined}
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
                  ? (contentLockEnabled === false
                      ? 'This paid post is temporarily unavailable because one-time purchase access is disabled by the platform administrator.'
                      : 'This is exclusive paid content. Purchase to unlock and view the full post.')
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

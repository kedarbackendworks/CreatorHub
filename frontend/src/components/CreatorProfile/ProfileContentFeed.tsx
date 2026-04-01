"use client";

import Image from 'next/image';
import Link from 'next/link';

import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, MessageCircle, Pencil, Send, ThumbsDown, ThumbsUp, Trash2, X } from 'lucide-react';
import api from '@/src/lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/src/store/useAuthStore';

type ReactionType = 'like' | 'dislike' | null;

interface FeedPost {
  _id: string;
  title: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  mediaType?: string;
  isExclusive?: boolean;
  createdAt: string;
  likes: number;
  dislikes: number;
  comments: number;
  userReaction?: ReactionType;
}

interface CommentUser {
  _id: string;
  name: string;
  avatar?: string;
}

interface PostComment {
  _id: string;
  user: CommentUser;
  content: string;
  createdAt: string;
  parentComment?: string | null;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string; error?: string } } }).response;
    return response?.data?.message || response?.data?.error || fallback;
  }

  return fallback;
};

const getRelativeTime = (dateString: string) => {
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const date = new Date(dateString).getTime();
  const now = Date.now();
  const diffInMinutes = Math.round((date - now) / (1000 * 60));

  if (Math.abs(diffInMinutes) < 60) {
    return formatter.format(diffInMinutes, 'minute');
  }

  const diffInHours = Math.round(diffInMinutes / 60);
  if (Math.abs(diffInHours) < 24) {
    return formatter.format(diffInHours, 'hour');
  }

  const diffInDays = Math.round(diffInHours / 24);
  return formatter.format(diffInDays, 'day');
};

const getInitials = (name?: string) => {
  if (!name) {
    return 'U';
  }

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

  return initials || 'U';
};

const collectCommentTreeIds = (commentId: string, commentList: PostComment[]) => {
  const ids = new Set<string>([commentId]);
  let changed = true;

  while (changed) {
    changed = false;
    commentList.forEach((comment) => {
      if (comment.parentComment && ids.has(comment.parentComment) && !ids.has(comment._id)) {
        ids.add(comment._id);
        changed = true;
      }
    });
  }

  return ids;
};

interface ProfileContentFeedProps {
  creatorId: string;
}

export default function ProfileContentFeed({ creatorId }: ProfileContentFeedProps) {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [reactingKey, setReactingKey] = useState<string | null>(null);

  const [activePost, setActivePost] = useState<FeedPost | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [savingCommentId, setSavingCommentId] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get(`/user/creators/${creatorId}/posts`);
        const postList: FeedPost[] = Array.isArray(res.data)
          ? res.data.map((post: FeedPost) => ({
              ...post,
              likes: Number(post.likes || 0),
              dislikes: Number(post.dislikes || 0),
              comments: Number(post.comments || 0),
              userReaction: post.userReaction || null,
            }))
          : [];

        setPosts(postList);
      } catch (err) {
        console.error('Error fetching creator posts:', err);
        toast.error('Could not load posts');
      } finally {
        setLoading(false);
      }
    };
    if (creatorId) fetchPosts();
  }, [creatorId]);

  const commentsByParent = useMemo(() => {
    const grouped: Record<string, PostComment[]> = {};

    comments.forEach((comment) => {
      const parentKey = comment.parentComment || 'root';
      if (!grouped[parentKey]) {
        grouped[parentKey] = [];
      }
      grouped[parentKey].push(comment);
    });

    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    });

    return grouped;
  }, [comments]);

  const updatePostCounters = (postId: string, data: Partial<Pick<FeedPost, 'likes' | 'dislikes' | 'comments' | 'userReaction'>>) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              ...data,
            }
          : post
      )
    );

    setActivePost((currentPost) =>
      currentPost && currentPost._id === postId
        ? {
            ...currentPost,
            ...data,
          }
        : currentPost
    );
  };

  const fetchPostComments = async (postId: string) => {
    setCommentsLoading(true);
    try {
      const res = await api.get(`/user/posts/${postId}/comments`);
      const list: PostComment[] = Array.isArray(res.data) ? res.data : [];
      setComments(list);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load comments'));
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const openCommentsModal = (post: FeedPost) => {
    setActivePost(post);
    setComments([]);
    setNewComment('');
    setEditingCommentId(null);
    setEditingCommentText('');
    void fetchPostComments(post._id);
  };

  const closeCommentsModal = () => {
    setActivePost(null);
    setComments([]);
    setNewComment('');
    setEditingCommentId(null);
    setEditingCommentText('');
    setSavingCommentId(null);
    setDeletingCommentId(null);
  };

  const handleReaction = async (postId: string, type: 'like' | 'dislike') => {
    if (!token) {
      toast.error('Please login to react');
      return;
    }

    const actionKey = `${postId}-${type}`;
    setReactingKey(actionKey);

    try {
      const res = await api.post(`/user/posts/${postId}/react`, { type });
      updatePostCounters(postId, {
        likes: Number(res.data?.likes || 0),
        dislikes: Number(res.data?.dislikes || 0),
        userReaction: (res.data?.userReaction as ReactionType) || null,
      });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update reaction'));
    } finally {
      setReactingKey(null);
    }
  };

  const handleCreateComment = async () => {
    if (!activePost) {
      return;
    }

    if (!token) {
      toast.error('Please login to comment');
      return;
    }

    const content = newComment.trim();
    if (!content) {
      return;
    }

    setSubmittingComment(true);
    try {
      const res = await api.post(`/user/posts/${activePost._id}/comments`, { content });
      const createdComment: PostComment = res.data;
      setComments((prevComments) => [...prevComments, createdComment]);
      setNewComment('');
      updatePostCounters(activePost._id, {
        comments: (activePost.comments || 0) + 1,
      });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to add comment'));
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleStartCommentEdit = (comment: PostComment) => {
    setEditingCommentId(comment._id);
    setEditingCommentText(comment.content);
  };

  const handleSaveCommentEdit = async (commentId: string) => {
    const content = editingCommentText.trim();
    if (!content) {
      toast.error('Comment cannot be empty');
      return;
    }

    setSavingCommentId(commentId);
    try {
      const res = await api.put(`/user/comments/${commentId}`, { content });
      const updatedComment: PostComment = res.data;
      setComments((prevComments) =>
        prevComments.map((comment) => (comment._id === commentId ? updatedComment : comment))
      );
      setEditingCommentId(null);
      setEditingCommentText('');
      toast.success('Comment updated');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update comment'));
    } finally {
      setSavingCommentId(null);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!activePost) {
      return;
    }

    const shouldDelete = window.confirm('Delete this comment?');
    if (!shouldDelete) {
      return;
    }

    setDeletingCommentId(commentId);
    try {
      const localIds = collectCommentTreeIds(commentId, comments);
      const localDeletedCount = localIds.size;

      const res = await api.delete(`/user/comments/${commentId}`);
      const serverDeletedCount =
        typeof res.data?.deletedCount === 'number' ? Math.max(1, Number(res.data.deletedCount)) : localDeletedCount;

      setComments((prevComments) => prevComments.filter((comment) => !localIds.has(comment._id)));

      if (editingCommentId && localIds.has(editingCommentId)) {
        setEditingCommentId(null);
        setEditingCommentText('');
      }

      updatePostCounters(activePost._id, {
        comments: Math.max(0, (activePost.comments || 0) - serverDeletedCount),
      });
      toast.success('Comment deleted');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete comment'));
    } finally {
      setDeletingCommentId(null);
    }
  };

  const renderCommentNode = (comment: PostComment, depth = 0): React.ReactNode => {
    const childComments = commentsByParent[comment._id] || [];
    const isOwner = user?._id === comment.user?._id;
    const isEditing = editingCommentId === comment._id;
    const isSaving = savingCommentId === comment._id;
    const isDeleting = deletingCommentId === comment._id;

    return (
      <div key={comment._id} className={`flex flex-col gap-[10px] ${depth > 0 ? 'ml-[16px] pl-[14px] border-l border-[#e4ded2]' : ''}`}>
        <div className="flex gap-[10px] items-start">
          <div className="size-[36px] rounded-full bg-[#ebebeb] overflow-hidden shrink-0 flex items-center justify-center text-[#5a5a5a] text-[12px] font-bold relative">
            {comment.user?.avatar ? (
              <Image src={comment.user.avatar} alt={comment.user.name} fill className="object-cover" />
            ) : (
              getInitials(comment.user?.name)
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-[8px]">
              <p className="font-[family-name:var(--font-figtree)] font-semibold text-[14px] text-[#1a1a1a] truncate">
                {comment.user?.name || 'User'}
              </p>
              <span className="font-[family-name:var(--font-figtree)] text-[12px] text-[#9a9a9a]">
                {getRelativeTime(comment.createdAt)}
              </span>
            </div>

            {isEditing ? (
              <div className="mt-[6px] flex flex-col gap-[8px]">
                <textarea
                  value={editingCommentText}
                  onChange={(event) => setEditingCommentText(event.target.value)}
                  className="w-full min-h-[74px] p-[10px] rounded-[10px] border border-[#d8d1c7] resize-none outline-none focus:border-[#f95c4b] bg-white text-[14px]"
                />
                <div className="flex gap-[8px] justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditingCommentText('');
                    }}
                    className="h-[32px] px-[12px] border border-[#e4ded2] rounded-full text-[12px] font-medium text-[#5a5a5a] hover:bg-[#f6f4f1]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveCommentEdit(comment._id)}
                    disabled={isSaving}
                    className="h-[32px] px-[12px] bg-[#f95c4b] rounded-full text-[12px] font-semibold text-white hover:bg-[#e8503f] disabled:opacity-60"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-[4px] font-[family-name:var(--font-figtree)] text-[14px] leading-[22px] text-[#44403c] whitespace-pre-wrap">
                {comment.content}
              </p>
            )}

            {isOwner && !isEditing && (
              <div className="mt-[7px] flex items-center gap-[12px]">
                <button
                  type="button"
                  onClick={() => handleStartCommentEdit(comment)}
                  className="inline-flex items-center gap-[4px] text-[12px] font-medium text-[#757575] hover:text-[#1a1a1a]"
                >
                  <Pencil className="size-[12px]" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteComment(comment._id)}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-[4px] text-[12px] font-medium text-[#a44d45] hover:text-[#7f352f] disabled:opacity-60"
                >
                  <Trash2 className="size-[12px]" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        </div>

        {childComments.length > 0 && (
          <div className="flex flex-col gap-[10px]">
            {childComments.map((childComment) => renderCommentNode(childComment, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="p-10 text-center w-full">Loading posts...</div>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px] w-full max-w-full">
        {posts.map((post) => {
          const liked = post.userReaction === 'like';
          const disliked = post.userReaction === 'dislike';
          const likeLoading = reactingKey === `${post._id}-like`;
          const dislikeLoading = reactingKey === `${post._id}-dislike`;

          return (
            <div key={post._id} className="flex flex-col gap-[12px] items-start shrink-0">
              <Link href={`/user/posts/${post._id}`} className="w-full">
                <div className="flex flex-col h-[200px] items-start justify-end overflow-hidden p-[12px] relative rounded-[12px] w-full">
                  <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[12px] flex items-center justify-center bg-[#ebebeb]">
                    {post.mediaType === 'file' ? (
                      <div className="text-6xl select-none">📄</div>
                    ) : (
                      <Image
                        src={post.thumbnailUrl || post.mediaUrl || '/assets/creator/thumbnail.png'}
                        alt={post.title}
                        fill
                        className="object-cover rounded-[12px]"
                      />
                    )}
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
              </Link>

              <div className="flex flex-col gap-[4px] items-start justify-end w-full">
                <div className="flex items-center w-full">
                  <Link href={`/user/posts/${post._id}`} className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[#3a3a3a] text-[13px] tracking-[0.26px] whitespace-nowrap truncate w-full hover:text-[#1a1a1a]">
                    {post.title}
                  </Link>
                </div>

                <div className="flex gap-[10px] items-center text-[#9a9a9a] flex-wrap">
                  <div className="flex items-center">
                    <p className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[13px] tracking-[0.26px] whitespace-nowrap">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleReaction(post._id, 'like')}
                    disabled={Boolean(reactingKey)}
                    className={`flex gap-[4px] items-center justify-center transition-colors ${liked ? 'text-[#1a1a1a]' : 'text-[#9a9a9a] hover:text-[#5a5a5a]'}`}
                  >
                    {likeLoading ? <Loader2 className="size-[16px] animate-spin" /> : <ThumbsUp className={`size-[16px] ${liked ? 'fill-current' : ''}`} />}
                    <p className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[13px] tracking-[0.26px] whitespace-nowrap">
                      {post.likes}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReaction(post._id, 'dislike')}
                    disabled={Boolean(reactingKey)}
                    className={`flex gap-[4px] items-center justify-center transition-colors ${disliked ? 'text-[#1a1a1a]' : 'text-[#9a9a9a] hover:text-[#5a5a5a]'}`}
                  >
                    {dislikeLoading ? <Loader2 className="size-[16px] animate-spin" /> : <ThumbsDown className={`size-[16px] ${disliked ? 'fill-current' : ''}`} />}
                    <p className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[13px] tracking-[0.26px] whitespace-nowrap">
                      {post.dislikes || 0}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => openCommentsModal(post)}
                    className="flex gap-[4px] items-center justify-center text-[#9a9a9a] hover:text-[#5a5a5a] transition-colors"
                  >
                    <MessageCircle className="size-[16px]" />
                    <p className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[13px] tracking-[0.26px] whitespace-nowrap">
                      {post.comments}
                    </p>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {posts.length === 0 && <div className="col-span-full p-20 text-center italic text-zinc-500">No posts shared yet.</div>}
      </div>

      {activePost && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          onClick={closeCommentsModal}
        >
          <div
            className="bg-white w-full max-w-[760px] max-h-[88vh] rounded-[28px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="px-[24px] py-[18px] border-b border-[#ece7df] flex items-center justify-between gap-[12px]">
              <div className="min-w-0">
                <p className="font-[family-name:var(--font-fjalla)] text-[28px] leading-[1] text-[#1a1a1a] tracking-[0.4px]">
                  Comments
                </p>
                <p className="font-[family-name:var(--font-figtree)] text-[13px] text-[#757575] mt-[4px] truncate">
                  {activePost.title}
                </p>
              </div>

              <button
                type="button"
                onClick={closeCommentsModal}
                className="size-[34px] rounded-full border border-[#ece7df] flex items-center justify-center text-[#7f7f7f] hover:text-[#3a3a3a] hover:bg-[#f8f6f2]"
              >
                <X className="size-[16px]" />
              </button>
            </div>

            <div className="px-[24px] pt-[16px] pb-[8px] max-h-[58vh] overflow-y-auto">
              {commentsLoading ? (
                <div className="h-[180px] flex items-center justify-center">
                  <Loader2 className="size-[22px] animate-spin text-[#757575]" />
                </div>
              ) : comments.length === 0 ? (
                <div className="h-[160px] flex items-center justify-center text-center text-[#8a8a8a] text-[14px]">
                  No comments yet. Start the conversation.
                </div>
              ) : (
                <div className="flex flex-col gap-[14px]">
                  {(commentsByParent.root || []).map((comment) => renderCommentNode(comment))}
                </div>
              )}
            </div>

            <div className="px-[24px] py-[16px] border-t border-[#ece7df] bg-[#fcfaf7]">
              <div className="flex items-end gap-[10px]">
                <textarea
                  value={newComment}
                  onChange={(event) => setNewComment(event.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 min-h-[76px] max-h-[140px] p-[12px] rounded-[12px] border border-[#d8d1c7] resize-y outline-none focus:border-[#f95c4b] bg-white text-[14px]"
                />
                <button
                  type="button"
                  onClick={handleCreateComment}
                  disabled={submittingComment || !newComment.trim()}
                  className="h-[42px] px-[14px] rounded-full bg-[#f95c4b] text-white text-[13px] font-semibold hover:bg-[#e8503f] disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-[6px]"
                >
                  {submittingComment ? <Loader2 className="size-[14px] animate-spin" /> : <Send className="size-[14px]" />}
                  {submittingComment ? 'Posting' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

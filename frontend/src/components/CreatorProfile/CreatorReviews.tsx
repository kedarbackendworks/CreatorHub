'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ReviewCard from './ReviewCard';
import api from '@/src/lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/src/store/useAuthStore';
import { Star } from 'lucide-react';

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  rating?: number;
  createdAt: string;
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-[4px]">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="p-0.5 transition-transform hover:scale-110"
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            size={20}
            className={`transition-colors ${
              star <= (hovered || value)
                ? 'fill-[#f95c4b] text-[#f95c4b]'
                : 'text-[#d8d1c7]'
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-1 text-[13px] font-semibold text-[#5a5a5a] font-['Figtree',sans-serif]">
          {value}/5
        </span>
      )}
    </div>
  );
}

export default function CreatorReviews({ creatorId }: { creatorId?: string }) {
  const { token } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!creatorId) return;

    const fetchReviews = async () => {
      try {
        const res = await api.get(`/user/creators/${creatorId}/reviews?page=${page}&limit=10`);
        if (page === 1) {
          setReviews(res.data.reviews);
        } else {
          setReviews(prev => [...prev, ...res.data.reviews]);
        }
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.totalCount);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [creatorId, page]);

  const handleSend = async () => {
    if (!token) {
      toast.error('Login to write a review');
      return;
    }
    if (!newReviewText.trim()) {
      toast.error('Please write something in your review');
      return;
    }
    if (newRating === 0) {
      toast.error('Please select a star rating');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/user/creators/${creatorId}/reviews`, {
        content: newReviewText,
        rating: newRating,
      });
      setReviews([res.data, ...reviews]);
      setTotalCount(prev => prev + 1);
      setNewReviewText('');
      setNewRating(0);
      toast.success('Review submitted!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to post review');
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = !submitting && newReviewText.trim().length > 0 && newRating > 0;

  return (
    <div className="bg-[#fcfaf7] border-[0.5px] border-[#e4ded2] flex flex-col gap-[24px] items-start justify-center p-[24px] rounded-[12px] w-full max-w-[1116px]">

      <div className="flex items-center justify-center">
        <h2 className="font-['Figtree',sans-serif] font-semibold leading-[29.2px] text-[#1a1a1a] text-[19px] tracking-[0.38px]">
          Reviews ( {totalCount.toLocaleString()} )
        </h2>
      </div>

      <div className="flex flex-col gap-[24px] items-start w-full">
        {loading && page === 1 ? (
          <p className="text-[#9a9a9a] text-sm">Loading reviews...</p>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard
              key={review._id}
              reviewId={review._id}
              avatarSrc={review.user.avatar || '/assets/creator/ellipse1.png'}
              name={review.user.name}
              reviewText={review.content}
              createdAt={review.createdAt}
              rating={review.rating}
            />
          ))
        ) : (
          <p className="text-[#9a9a9a]">No reviews yet. Be the first to add one!</p>
        )}
      </div>

      {page < totalPages && (
        <div
          onClick={() => setPage(page + 1)}
          className="flex items-center justify-center rounded-[6px] cursor-pointer self-center mt-[12px]"
        >
          <p className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[13px] text-[#3a3a3a] tracking-[0.26px] underline decoration-solid hover:text-[#f95c4b]">
            {loading ? 'Loading...' : 'Load More'}
          </p>
        </div>
      )}

      {/* Write a review */}
      <div className="flex flex-col gap-[10px] w-full mt-[4px]">
        {/* Star rating picker */}
        <div className="flex items-center gap-[8px] px-[4px]">
          <span className="text-[13px] font-semibold text-[#5a5a5a] font-['Figtree',sans-serif]">
            Your rating:
          </span>
          <StarPicker value={newRating} onChange={setNewRating} />
        </div>

        {/* Text + send */}
        <div className="flex gap-[8px] items-center w-full">
          <div className="bg-[#fcfaf7] border border-[#e4ded2] flex flex-1 gap-[12px] h-[40px] items-center px-[16px] py-[12px] rounded-[32px] shadow-[0_1px_4px_0_rgba(238,238,238,0.25)]">
            <Image src="/assets/creator/emoji-happy.svg" alt="Emoji" width={24} height={24} className="shrink-0 size-[24px]" />
            <input
              type="text"
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Write a review about this creator"
              className="flex-1 bg-transparent border-none outline-none font-['Figtree',sans-serif] font-medium leading-[25.8px] text-[#1a1a1a] placeholder:text-[#9a9a9a] text-[16px] tracking-[0.32px]"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!canSubmit}
            className="bg-[#f95c4b] border border-[#e4ded2] flex flex-col h-[40px] items-center justify-center px-[12px] py-[12px] rounded-[32px] shadow-[0_1px_4px_0_rgba(238,238,238,0.25)] shrink-0 cursor-pointer hover:bg-[#eb5242] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-['Figtree',sans-serif] font-bold leading-[25.8px] text-[#faf8f5] text-[16px] text-center tracking-[0.32px] w-[58px]">
              {submitting ? '...' : 'Send'}
            </span>
          </button>
        </div>
      </div>

    </div>
  );
}

import { useState } from 'react';
import Image from 'next/image';
import api from '@/src/lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/src/store/useAuthStore';

interface ReviewReply {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  parentReply?: string | null;
}

const getRelativeTime = (dateString: string) => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const daysDifference = Math.round((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  if (Math.abs(daysDifference) < 1) {
     const hoursDifference = Math.round((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60 * 60));
     if(Math.abs(hoursDifference) < 1) {
         const mins = Math.round((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60));
         return rtf.format(mins, 'minute');
     }
     return rtf.format(hoursDifference, 'hour');
  }
  return rtf.format(daysDifference, 'day');
};

const NestedReply = ({ 
  reply, 
  allReplies, 
  reviewId, 
  onReplyAdded 
}: { 
  reply: ReviewReply, 
  allReplies: ReviewReply[], 
  reviewId: string, 
  onReplyAdded: (r: ReviewReply) => void 
}) => {
  const { token } = useAuthStore();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const childReplies = allReplies.filter(r => r.parentReply === reply._id);

  const handleReplySubmit = async () => {
    if (!token) {
      toast.error('Login to reply');
      return;
    }
    if (!replyText.trim()) return;

    setSubmittingReply(true);
    try {
      const res = await api.post(`/user/reviews/${reviewId}/replies`, { 
        content: replyText,
        parentReplyId: reply._id
      });
      onReplyAdded(res.data);
      setReplyText('');
      setShowReplyInput(false);
      toast.success('Reply added!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to post reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="flex flex-col gap-[4px] items-start w-full relative mt-[8px]">
      {/* Visual thread line container */}
      <div className="flex gap-[8px] items-start w-full">
        <div className="relative size-[28px] shrink-0 rounded-full overflow-hidden bg-[#ebebeb] mt-[4px]">
          <Image src={reply.user?.avatar || "/assets/creator/ellipse1.png"} alt={reply.user?.name || "User"} fill className="object-cover" />
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-[8px] items-center">
            <p className="font-['Figtree',sans-serif] font-bold leading-[25.8px] text-[#3a3a3a] text-[14px] tracking-[0.32px]">
              {reply.user?.name || "Anonymous User"}
            </p>
            <p className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[#9a9a9a] text-[12px]">
              {getRelativeTime(reply.createdAt)}
            </p>
          </div>
          <p className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[#5a5a5a] text-[13px] w-full">
            {reply.content}
          </p>
          
          <div className="flex gap-[15px] items-start mt-[4px]">
            <div 
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center justify-center cursor-pointer hover:underline"
            >
              <p className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[#9a9a9a] text-[12px] tracking-[0.26px]">
                Reply
              </p>
            </div>
          </div>

          {showReplyInput && (
            <div className="flex gap-[8px] items-center w-full mt-[4px]">
              <div className="bg-[#fcfaf7] border border-[#e4ded2] flex flex-1 gap-[12px] h-[32px] items-center px-[12px] py-[6px] rounded-[32px] shadow-[0_1px_2px_0_rgba(238,238,238,0.25)]">
                <input 
                  type="text" 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${reply.user?.name || 'User'}...`}
                  className="flex-1 bg-transparent border-none outline-none font-['Figtree',sans-serif] font-medium leading-[25.8px] text-[#1a1a1a] placeholder:text-[#9a9a9a] text-[13px] tracking-[0.32px]"
                />
              </div>
              <button 
                onClick={handleReplySubmit}
                disabled={submittingReply || !replyText.trim()}
                className="bg-[#f95c4b] border border-[#e4ded2] flex h-[32px] items-center justify-center px-[12px] rounded-[32px] text-white font-['Figtree',sans-serif] text-[12px] font-bold hover:bg-[#eb5242] transition-colors disabled:opacity-50"
              >
                {submittingReply ? '...' : 'Send'}
              </button>
            </div>
          )}

          {/* Children container with left border indent */}
          {childReplies.length > 0 && (
            <div className="flex flex-col w-full border-l-2 border-[#e4ded2] pl-[12px] ml-[4px] mt-[4px]">
              {childReplies.map(child => (
                <NestedReply 
                  key={child._id} 
                  reply={child} 
                  allReplies={allReplies} 
                  reviewId={reviewId} 
                  onReplyAdded={onReplyAdded} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ReviewCardProps {
  reviewId: string;
  avatarSrc: string;
  name: string;
  reviewText: string;
  createdAt: string;
}

export default function ReviewCard({ reviewId, avatarSrc, name, reviewText, createdAt }: ReviewCardProps) {
  const { token } = useAuthStore();
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replies, setReplies] = useState<ReviewReply[]>([]);
  const [repliesLoaded, setRepliesLoaded] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  /*// Simple relative time formatter
  const getRelativeTime = (dateString: string) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const daysDifference = Math.round((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (Math.abs(daysDifference) < 1) {
       const hoursDifference = Math.round((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60 * 60));
       if(Math.abs(hoursDifference) < 1) {
           const mins = Math.round((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60));
           return rtf.format(mins, 'minute');
       }
       return rtf.format(hoursDifference, 'hour');
    }
    return rtf.format(daysDifference, 'day');
  };*/

  const handleViewReplies = async () => {
    if (!showReplies) {
      if (!repliesLoaded) {
        setLoadingReplies(true);
        try {
          const res = await api.get(`/user/reviews/${reviewId}/replies`);
          setReplies(res.data);
          setRepliesLoaded(true);
        } catch (err) {
          console.error("Error fetching replies:", err);
          toast.error("Could not load replies");
        } finally {
          setLoadingReplies(false);
        }
      }
    }
    setShowReplies(!showReplies);
  };

  const handleToggleReplyInput = () => {
    setShowReplyInput(!showReplyInput);
  };

  const handleReplySubmit = async () => {
    if (!token) {
      toast.error('Login to reply');
      return;
    }
    if (!replyText.trim()) return;

    setSubmittingReply(true);
    try {
      const res = await api.post(`/user/reviews/${reviewId}/replies`, { content: replyText });
      setReplies([...replies, res.data]);
      setReplyText('');
      setShowReplyInput(false);
      setShowReplies(true);
      setRepliesLoaded(true);
      toast.success('Reply added!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to post reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="flex flex-col gap-[8px] items-start w-full">
      <div className="flex gap-[8px] items-center">
        <div className="relative size-[40px] shrink-0 rounded-full overflow-hidden bg-[#ebebeb]">
          <Image src={avatarSrc} alt={name} fill className="object-cover" />
        </div>
        <p className="font-['Figtree',sans-serif] font-bold leading-[25.8px] text-[#3a3a3a] text-[16px] tracking-[0.32px]">
          {name}
        </p>
      </div>
      
      <p className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[#5a5a5a] text-[13px] tracking-[0.26px] w-[min-content] min-w-full">
        {reviewText}
      </p>
      
      <div className="flex gap-[15px] items-start">
        <div className="flex items-center justify-center">
          <p className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[#9a9a9a] text-[13px] tracking-[0.26px]">
            {getRelativeTime(createdAt)}
          </p>
        </div>
        
        <div 
          onClick={handleViewReplies}
          className="flex items-center justify-center cursor-pointer hover:underline"
        >
          <p className="font-['Source_Sans_Pro',sans-serif] font-semibold text-[14px] text-[#9a9a9a]">
            {showReplies ? 'Hide replies' : 'View replies'}
          </p>
        </div>
        
        <div 
          onClick={handleToggleReplyInput}
          className="flex items-center justify-center cursor-pointer hover:underline"
        >
          <p className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[#5a5a5a] text-[13px] tracking-[0.26px]">
            Reply
          </p>
        </div>
      </div>

      {showReplyInput && (
        <div className="flex gap-[8px] items-center w-full mt-[4px] pl-[40px]">
          <div className="bg-[#fcfaf7] border border-[#e4ded2] flex flex-1 gap-[12px] h-[36px] items-center px-[12px] py-[8px] rounded-[32px] shadow-[0_1px_2px_0_rgba(238,238,238,0.25)]">
            <input 
              type="text" 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..." 
              className="flex-1 bg-transparent border-none outline-none font-['Figtree',sans-serif] font-medium leading-[25.8px] text-[#1a1a1a] placeholder:text-[#9a9a9a] text-[14px] tracking-[0.32px]"
            />
          </div>
          <button 
            onClick={handleReplySubmit}
            disabled={submittingReply || !replyText.trim()}
            className="bg-[#f95c4b] border border-[#e4ded2] flex h-[36px] items-center justify-center px-[16px] rounded-[32px] text-white font-['Figtree',sans-serif] text-[13px] font-bold hover:bg-[#eb5242] transition-colors disabled:opacity-50"
          >
            {submittingReply ? 'Sending' : 'Send'}
          </button>
        </div>
      )}

      {showReplies && (
        <div className="flex flex-col gap-[12px] w-full pl-[40px] mt-[4px]">
          {loadingReplies ? (
            <p className="text-[#9a9a9a] text-[13px]">Loading replies...</p>
          ) : replies.filter(r => !r.parentReply).length > 0 ? (
            replies.filter(r => !r.parentReply).map(reply => (
              <NestedReply 
                key={reply._id} 
                reply={reply} 
                allReplies={replies} 
                reviewId={reviewId} 
                onReplyAdded={(newReply) => setReplies([...replies, newReply])}
              />
            ))
          ) : (
            <p className="text-[#9a9a9a] text-[13px]">No replies yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

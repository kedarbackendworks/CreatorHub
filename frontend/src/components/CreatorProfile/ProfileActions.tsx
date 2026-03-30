'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import api from '@/src/lib/api';
import toast from 'react-hot-toast';

interface ProfileActionsProps {
  creatorId: string;
  creatorUserId?: string;
}

export default function ProfileActions({ creatorId, creatorUserId }: ProfileActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    setIsSending(true);
    try {
      await api.post('/user/messages', {
        recipientId: creatorUserId,
        text: messageText
      });
      toast.success('Message sent!');
      setIsModalOpen(false);
      setMessageText('');
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="flex gap-[8px] items-center shrink-0">
        <button className="bg-[#faf8f5] border border-[#d8d1c7] flex gap-[4px] items-center justify-center px-[12px] py-[8px] rounded-[36px] hover:bg-white transition-colors cursor-pointer">
          <Image src="/assets/creator/share.svg" alt="Share profile" width={20} height={20} className="w-[20px] h-[20px]" />
          <span className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[#1a1a1a] text-[13px] tracking-[0.26px]">
            Share profile
          </span>
        </button>

        <button className="bg-[#faf8f5] border border-[#d8d1c7] flex gap-[4px] items-center justify-center px-[12px] py-[8px] rounded-[36px] hover:bg-white transition-colors cursor-pointer">
          <Image src="/assets/creator/diamond.svg" alt="Membership" width={20} height={20} className="w-[20px] h-[20px]" />
          <span className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[#1a1a1a] text-[13px] tracking-[0.26px]">
            Membership
          </span>
        </button>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#f95c4b] flex gap-[4px] items-center justify-center px-[12px] py-[8px] border border-transparent rounded-[36px] hover:bg-[#eb5242] transition-colors shadow-sm cursor-pointer"
        >
          <Image src="/assets/creator/envelope.svg" alt="Get in touch" width={20} height={20} className="w-[20px] h-[20px]" />
          <span className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[#f6f4f1] text-[13px] tracking-[0.26px]">
            Get in touch
          </span>
        </button>
      </div>

      {/* Basic Message Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
          <div className="bg-[#fcfaf7] rounded-3xl w-full max-w-[500px] p-8 shadow-2xl border border-[#e4ded2]">
            <h2 className="font-['Figtree',sans-serif] text-2xl font-bold text-[#1a1a1a] mb-6">Send Message</h2>
            <textarea
              className="w-full h-40 bg-white border border-[#d8d1c7] rounded-2xl p-4 font-['Figtree',sans-serif] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#f95c4b]/30 resize-none shadow-sm"
              placeholder="What's on your mind?..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <div className="flex gap-4 mt-8 justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 font-semibold text-[#5a5a5a] text-[14px] hover:text-[#1a1a1a] transition-colors"
                disabled={isSending}
              >
                Cancel
              </button>
              <button 
                onClick={handleSendMessage}
                disabled={isSending || !messageText.trim()}
                className="bg-[#f95c4b] text-white px-10 py-3 rounded-full font-bold text-[14px] hover:bg-[#eb5242] transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {isSending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

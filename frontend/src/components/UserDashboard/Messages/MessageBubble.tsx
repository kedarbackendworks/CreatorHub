import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { MoreHorizontal, Play } from 'lucide-react';
import MessageStatus, { type Status as MessageStatusType } from './MessageStatus';

export interface ChatMessage {
  _id: string;
  id?: string;
  text: string;
  status?: MessageStatusType;
  replyTo?: {
    messageId?: string;
    text?: string;
    senderName?: string;
  };
  encryptedText?: string;
  nonce?: string;
  isEncrypted?: boolean;
  isSender: boolean;
  avatar: string;
  isDeleted?: boolean;
  isEdited?: boolean;
  editedAt?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'file' | 'link';
  thumbnailUrl?: string;
  reactions?: { userId: string; emoji: string }[];
  sender?: any;
  createdAt?: string;
}

interface MessageBubbleProps {
  message: ChatMessage;
  onDelete?: (id: string, deleteType: 'for_me' | 'for_everyone') => void;
  onEdit?: (id: string, currentText: string) => void;
  onReact?: (id: string, emoji: string) => void;
  onBlock?: (userId: string) => void;
  currentUserId?: string;
  onRetry?: (message: ChatMessage) => void;
  onReply?: (message: ChatMessage) => void;
  onScrollToMessage?: (messageId: string) => void;
  onOpenLightbox?: (slides: any[], index: number) => void;
  onReport?: (message: ChatMessage) => void;
}

const EMOJI_OPTIONS = ['❤️', '👍', '😂', '😮', '😢', '😡'];

const getIdValue = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (value._id) return value._id.toString();
  return value.toString();
};

const sanitizeMessageHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    return html;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const allowedTags = new Set(['B', 'STRONG', 'I', 'EM', 'BR', 'P']);

  const sanitizeNode = (node: Node): Node | null => {
    if (node.nodeType === Node.TEXT_NODE) {
      return document.createTextNode(node.textContent || '');
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }

    const element = node as Element;
    const fragment = document.createDocumentFragment();

    element.childNodes.forEach((child) => {
      const cleanChild = sanitizeNode(child);
      if (cleanChild) {
        fragment.appendChild(cleanChild);
      }
    });

    if (!allowedTags.has(element.tagName)) {
      return fragment;
    }

    const cleanElement = document.createElement(element.tagName.toLowerCase());
    cleanElement.appendChild(fragment);
    return cleanElement;
  };

  const cleanRoot = document.createDocumentFragment();
  doc.body.childNodes.forEach((child) => {
    const cleanChild = sanitizeNode(child);
    if (cleanChild) {
      cleanRoot.appendChild(cleanChild);
    }
  });

  const container = document.createElement('div');
  container.appendChild(cleanRoot);
  return container.innerHTML;
};

export default function MessageBubble({
  message,
  onDelete,
  onEdit,
  onReact,
  onBlock,
  currentUserId = '',
  onRetry,
  onReply,
  onScrollToMessage,
  onOpenLightbox,
  onReport
}: MessageBubbleProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [openMenuUpward, setOpenMenuUpward] = useState(false);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const actionButtonRef = useRef<HTMLButtonElement>(null);
  const messageId = message._id || message.id || '';
  const senderId = getIdValue(message.sender);
  const rawMessageText = message.text || '';
  const isRichText = /<\/?[a-z][\s\S]*>/i.test(rawMessageText);
  const safeMessageHtml = useMemo(
    () => sanitizeMessageHtml(rawMessageText),
    [rawMessageText]
  );

  const reactionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (message.reactions || []).forEach((reaction) => {
      counts[reaction.emoji] = (counts[reaction.emoji] || 0) + 1;
    });
    return Object.entries(counts);
  }, [message.reactions]);

  const hasCurrentUserReaction = (emoji: string) => {
    return (message.reactions || []).some((reaction) => {
      return getIdValue(reaction.userId) === currentUserId && reaction.emoji === emoji;
    });
  };

  useEffect(() => {
    if (!showMenu) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [showMenu]);

  const bubbleClass = message.isSender
    ? 'bg-[rgba(249,92,75,0.08)] border border-[#f95c4b]/20 text-[#1a1a1a] rounded-tr-[4px]'
    : 'bg-white border border-[#e4ded2] text-[#1a1a1a] rounded-tl-[4px]';

  const triggerAction = (action: 'reply' | 'react' | 'edit' | 'delete_for_me' | 'delete_for_everyone' | 'block' | 'report') => {
    setShowMenu(false);

    if (action === 'reply') {
      onReply?.(message);
      return;
    }

    if (action === 'react') {
      setShowPicker((prev) => !prev);
      return;
    }

    if (action === 'edit') {
      onEdit?.(messageId, message.text);
      return;
    }

    if (action === 'delete_for_me') {
      onDelete?.(messageId, 'for_me');
      return;
    }

    if (action === 'delete_for_everyone') {
      onDelete?.(messageId, 'for_everyone');
      return;
    }

    if (action === 'block') {
      onBlock?.(senderId);
      return;
    }

    if (action === 'report') {
      onReport?.(message);
    }
  };

  const toggleActionMenu = () => {
    if (!showMenu) {
      const buttonRect = actionButtonRef.current?.getBoundingClientRect();
      const scrollContainer = actionButtonRef.current?.closest('[data-messages-scroll-container]');
      
      // Calculate height based on number of options. Sender has 5 options (~180px), receiver has 3 (~110px). Add safe buffer.
      const estimatedMenuHeight = message.isSender ? 200 : 170;

      if (buttonRect) {
        if (scrollContainer instanceof HTMLElement) {
          const containerRect = scrollContainer.getBoundingClientRect();
          setOpenMenuUpward(buttonRect.bottom + estimatedMenuHeight > containerRect.bottom - 8);
        } else {
          setOpenMenuUpward(buttonRect.bottom + estimatedMenuHeight > window.innerHeight - 8);
        }
      }
    }

    setShowMenu((prev) => !prev);
    setShowPicker(false);
  };

  return (
    <div className={`group flex items-end gap-2 mb-4 w-full ${message.isSender ? 'justify-end' : 'justify-start'}`}>
      {!message.isSender && (
        <div className="relative w-7 h-7 rounded-full border border-[#e4ded2] bg-[#f95c4b]/10 shadow-sm overflow-hidden shrink-0 mb-1">
          <Image src={message.avatar} alt="Avatar" fill className="object-cover" />
        </div>
      )}

      {message.isSender && !message.isDeleted && (
        <div ref={actionMenuRef} className="relative shrink-0 self-center">
          <button
            ref={actionButtonRef}
            type="button"
            onClick={toggleActionMenu}
            className={`w-7 h-7 p-1 rounded-full text-[#aaa] hover:text-[#5a5a5a] hover:bg-[#f0ede9] flex items-center justify-center transition-opacity ${showMenu ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            aria-label="Message options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className={`absolute left-0 z-30 min-w-[132px] rounded-xl border border-[#e4ded2] bg-white shadow-sm overflow-hidden ${openMenuUpward ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
              <button
                type="button"
                onClick={() => triggerAction('reply')}
                className="w-full px-3 py-2 text-[13px] text-left font-[family-name:var(--font-figtree)] text-[#5a5a5a] hover:bg-[#f6f4f1]"
              >
                Reply
              </button>
              <button
                type="button"
                onClick={() => triggerAction('react')}
                className="w-full px-3 py-2 text-[13px] text-left font-[family-name:var(--font-figtree)] text-[#5a5a5a] hover:bg-[#f6f4f1] border-t border-[#e4ded2]"
              >
                React
              </button>

              <button
                type="button"
                onClick={() => triggerAction('edit')}
                className="w-full px-3 py-2 text-[13px] text-left font-[family-name:var(--font-figtree)] text-[#5a5a5a] hover:bg-[#f6f4f1] border-t border-[#e4ded2]"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => triggerAction('delete_for_me')}
                className="w-full px-3 py-2 text-[13px] text-left font-[family-name:var(--font-figtree)] text-[#5a5a5a] hover:bg-[#f6f4f1] border-t border-[#e4ded2]"
              >
                Delete for me
              </button>
              <button
                type="button"
                onClick={() => triggerAction('delete_for_everyone')}
                className="w-full px-3 py-2 text-[13px] text-left font-[family-name:var(--font-figtree)] text-[#f95c4b] font-medium hover:bg-[#fff3f2]"
              >
                Delete for everyone
              </button>
            </div>
          )}
        </div>
      )}

      <div className="relative max-w-[72%]">

        {showPicker && !message.isDeleted && (
          <div className={`absolute -top-12 bg-white border border-[#e4ded2] rounded-xl shadow-md p-2 flex items-center gap-1 z-20 ${message.isSender ? 'right-0' : 'left-0'}`}>
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={`${messageId}-${emoji}`}
                type="button"
                onClick={() => {
                  onReact?.(messageId, emoji);
                  setShowPicker(false);
                }}
                className="w-7 h-7 text-sm hover:bg-[#f6f4f1] rounded-lg flex items-center justify-center"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div data-message-highlight="true" className={`px-5 py-3 rounded-2xl shadow-sm ${message.isDeleted ? 'bg-[#f6f4f1] border border-dashed border-[#e4ded2] text-[#aaa]' : bubbleClass}`}>
          {message.isDeleted ? (
            <p className="font-[family-name:var(--font-figtree)] text-[14px] italic leading-relaxed">This message was deleted</p>
          ) : (
            <>
              {message.replyTo?.messageId && (
                <div
                  className="flex items-start gap-2 mb-2 px-3 py-2 rounded-xl cursor-pointer bg-black/5 hover:bg-black/10 transition-colors"
                  onClick={() => onScrollToMessage?.(message.replyTo?.messageId || '')}
                >
                  <div className="w-[3px] rounded-full bg-[#f95c4b] self-stretch shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-semibold text-[#f95c4b] mb-0.5 truncate">
                      {message.replyTo.senderName}
                    </span>
                    <span className="text-[12px] text-[#5a5a5a] truncate max-w-[260px] italic">
                      {message.replyTo.text}
                    </span>
                  </div>
                </div>
              )}

              {/* Media rendering */}
              {message.mediaUrl && !message.isDeleted && (
                <div className="mb-2">
                  {message.mediaType === 'image' && (
                    <div
                      className="relative rounded-xl overflow-hidden cursor-pointer max-w-[280px] max-h-[280px]"
                      onClick={() => onOpenLightbox?.([{ src: message.mediaUrl }], 0)}
                    >
                      <img
                        src={message.mediaUrl}
                        alt="Shared image"
                        className="w-full h-full object-cover rounded-xl hover:opacity-90 transition-opacity"
                      />
                    </div>
                  )}

                  {message.mediaType === 'video' && (
                    <div
                      className="relative rounded-xl overflow-hidden cursor-pointer max-w-[280px]"
                      onClick={() => onOpenLightbox?.([{
                        type: 'video',
                        width: 1280,
                        height: 720,
                        sources: [{ src: message.mediaUrl || '' }],
                        ...(message.thumbnailUrl ? { poster: message.thumbnailUrl } : {})
                      }], 0)}
                    >
                      {message.thumbnailUrl ? (
                         <img
                           src={message.thumbnailUrl}
                           alt="Video thumbnail"
                           className="w-full h-auto rounded-xl object-cover min-h-[150px]"
                         />
                      ) : (
                        <video
                          src={`${message.mediaUrl}#t=0.1`}
                          className="w-full rounded-xl bg-black/5"
                          preload="metadata"
                          muted
                          playsInline
                        />
                      )}
                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors rounded-xl">
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                          <Play className="w-6 h-6 text-[#1a1a1a] fill-[#1a1a1a] ml-1" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Message text below media (only if text exists) */}
              {message.text && (
                isRichText ? (
                  <div
                    className="font-[family-name:var(--font-figtree)] text-[15px] text-[#1a1a1a] leading-relaxed whitespace-pre-wrap [&_p]:m-0"
                    dangerouslySetInnerHTML={{ __html: safeMessageHtml }}
                  />
                ) : (
                  <p className="font-[family-name:var(--font-figtree)] text-[15px] text-[#1a1a1a] leading-relaxed whitespace-pre-wrap">{message.text}</p>
                )
              )}
              {message.isEdited && (
                <p className="font-[family-name:var(--font-figtree)] text-[11px] text-[#aaa] italic mt-1 text-right">edited</p>
              )}
            </>
          )}
        </div>

        {message.isSender && message.status && !message.isDeleted && (
          <div className="flex justify-end mt-0.5 pr-1 items-center">
            <MessageStatus status={message.status} />
            {message.status === 'failed' && onRetry && (
              <button
                type="button"
                onClick={() => onRetry(message)}
                className="text-[11px] text-[#f95c4b] underline ml-1"
              >
                Tap to retry
              </button>
            )}
          </div>
        )}

        {!message.isDeleted && reactionCounts.length > 0 && (
          <div className={`flex items-center gap-1 mt-1 ${message.isSender ? 'justify-end' : 'justify-start'}`}>
            {reactionCounts.map(([emoji, count]) => {
              const hasReacted = hasCurrentUserReaction(emoji);

              return (
                <button
                  key={`${messageId}-reaction-${emoji}`}
                  type="button"
                  onClick={() => onReact?.(messageId, emoji)}
                  title={hasReacted ? 'Click to remove' : 'Click to react'}
                  className={`text-[13px] font-[family-name:var(--font-figtree)] px-2 py-0.5 rounded-full border ${hasReacted ? 'bg-[#f95c4b]/10 border-[#f95c4b]/30 text-[#f95c4b]' : 'bg-white border-[#e4ded2] text-[#5a5a5a]'}`}
                >
                  {emoji} {count}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {!message.isSender && !message.isDeleted && (
        <div ref={actionMenuRef} className="relative shrink-0 self-center">
          <button
            ref={actionButtonRef}
            type="button"
            onClick={toggleActionMenu}
            className={`w-7 h-7 p-1 rounded-full text-[#aaa] hover:text-[#5a5a5a] hover:bg-[#f0ede9] flex items-center justify-center transition-opacity ${showMenu ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            aria-label="Message options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className={`absolute right-0 z-30 min-w-[132px] rounded-xl border border-[#e4ded2] bg-white shadow-sm overflow-hidden ${openMenuUpward ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
              <button
                type="button"
                onClick={() => triggerAction('reply')}
                className="w-full px-3 py-2 text-[13px] text-left font-[family-name:var(--font-figtree)] text-[#5a5a5a] hover:bg-[#f6f4f1]"
              >
                Reply
              </button>
              <button
                type="button"
                onClick={() => triggerAction('react')}
                className="w-full px-3 py-2 text-[13px] text-left font-[family-name:var(--font-figtree)] text-[#5a5a5a] hover:bg-[#f6f4f1] border-t border-[#e4ded2]"
              >
                React
              </button>
              <button
                type="button"
                onClick={() => triggerAction('delete_for_me')}
                className="w-full px-3 py-2 text-[13px] text-left font-[family-name:var(--font-figtree)] text-[#5a5a5a] hover:bg-[#f6f4f1] border-t border-[#e4ded2]"
              >
                Delete for me
              </button>
              <button
                type="button"
                onClick={() => triggerAction('report')}
                className="w-full px-3 py-2 text-[13px] text-left font-[family-name:var(--font-figtree)] text-[#f95c4b] hover:bg-[#fff3f2] border-t border-[#e4ded2]"
              >
                Report message
              </button>
            </div>
          )}
        </div>
      )}

      {message.isSender && (
        <div className="relative w-7 h-7 rounded-full border border-[#e4ded2] bg-[#f95c4b]/10 shadow-sm overflow-hidden shrink-0 mb-1">
          <Image src={message.avatar} alt="Avatar" fill className="object-cover" />
        </div>
      )}
    </div>
  );
}

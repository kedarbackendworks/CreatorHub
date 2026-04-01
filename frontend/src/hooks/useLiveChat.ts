'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import type { Socket } from 'socket.io-client';

export interface ChatMessage {
  userId: string;
  userName: string;
  avatar: string;
  text: string;
  timestamp: string;
}

/**
 * Hook for real-time live chat during a livestream via Socket.IO.
 * Sends and receives messages, auto-scrolls, and persists to backend.
 */
export function useLiveChat(
  socket: Socket | null,
  streamId: string | null,
  user: { _id: string; name: string; avatar?: string } | null
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesRef = useRef<ChatMessage[]>([]);

  // Listen for incoming chat messages
  useEffect(() => {
    if (!socket || !streamId) return;

    const handleMessage = (message: ChatMessage) => {
      messagesRef.current = [...messagesRef.current, message];
      setMessages([...messagesRef.current]);
    };

    socket.on('chat_message', handleMessage);

    return () => {
      socket.off('chat_message', handleMessage);
    };
  }, [socket, streamId]);

  // Send a chat message
  const sendMessage = useCallback(
    (text: string) => {
      if (!socket || !streamId || !user || !text.trim()) return;

      socket.emit('chat_message', {
        streamId,
        userId: user._id,
        userName: user.name,
        avatar: user.avatar || '',
        text: text.trim(),
      });
    },
    [socket, streamId, user]
  );

  // Clear messages (when leaving stream)
  const clearMessages = useCallback(() => {
    messagesRef.current = [];
    setMessages([]);
  }, []);

  return { messages, sendMessage, clearMessages };
}

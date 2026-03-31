import { useState, useEffect } from 'react';
import api from '@/src/lib/api';

const keyCache: Record<string, string> = {};

export function useConversationKey(conversationId: string | null) {
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {
    if (!conversationId) {
      setKey(null);
      return;
    }

    if (keyCache[conversationId]) {
      setKey(keyCache[conversationId]);
      return;
    }

    api.get(`/auth/conversation-key/${conversationId}`)
      .then((res) => {
        keyCache[conversationId] = res.data.key;
        setKey(res.data.key);
      })
      .catch((error) => {
        console.error(error);
        setKey(null);
      });
  }, [conversationId]);

  return key;
}

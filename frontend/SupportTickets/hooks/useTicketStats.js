"use client";

import { useCallback, useEffect, useState } from 'react';
import api from '@/src/lib/api';

/**
 * Support stats hook.
 */
export function useTicketStats() {
  const [stats, setStats] = useState({ open: 0, inProgress: 0, resolvedToday: 0, highPriority: 0 });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/support/stats');
      setStats({
        open: data?.open || 0,
        inProgress: data?.inProgress || 0,
        resolvedToday: data?.resolvedToday || 0,
        highPriority: data?.highPriority || 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, loading, refresh };
}

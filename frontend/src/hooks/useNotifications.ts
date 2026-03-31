import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import api from '@/src/lib/api';
import { useAuthStore } from '@/src/store/useAuthStore';

interface NotificationLike {
  isRead?: boolean;
}

export function useNotifications(role: 'user' | 'creator') {
  const setUnreadCount = useAuthStore((state) => state.setUnreadCount);
  const token = useAuthStore((state) => state.token);
  const pathname = usePathname();
  const isViewingNotifications = role === 'creator'
    ? pathname === '/creator/notifications'
    : pathname === '/user/notifications';

  const fetchUnreadCount = useCallback(async () => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedToken = localStorage.getItem('token');
    if (!token && !storedToken) {
      setUnreadCount(0);
      return;
    }

    if (isViewingNotifications) {
      return;
    }

    try {
      const endpoint = role === 'creator' ? '/creator/notifications' : '/user/notifications';
      const res = await api.get(endpoint);
      const list: NotificationLike[] = Array.isArray(res.data) ? res.data : [];
      const unread = list.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setUnreadCount(0);
        return;
      }

      console.error('Failed to fetch notification count', err);
    }
  }, [isViewingNotifications, role, setUnreadCount, token]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedToken = localStorage.getItem('token');
    if (!token && !storedToken) {
      setUnreadCount(0);
      return;
    }

    if (isViewingNotifications) {
      return;
    }

    fetchUnreadCount();

    // Poll every 30 seconds (no Socket.io in this project)
    const interval = window.setInterval(fetchUnreadCount, 30000);
    return () => window.clearInterval(interval);
  }, [fetchUnreadCount, isViewingNotifications, setUnreadCount, token]);
}

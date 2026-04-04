"use client";

import React, { useEffect, useMemo, useState } from 'react';
import DashboardSidebar from '@/src/components/UserDashboard/DashboardSidebar';
import api from '@/src/lib/api';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useIsMounted } from '@/src/hooks/useIsMounted';

interface AppNotification {
  _id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string; error?: string } } }).response;
    return response?.data?.message || response?.data?.error || fallback;
  }

  return fallback;
};

const formatDateTime = (dateInput: string, isMounted: boolean) => {
  if (!isMounted) return '';
  const date = new Date(dateInput);
  return `${date.toLocaleDateString()} | ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

export default function NotificationsPage() {
  const isMounted = useIsMounted();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const clearUnread = useAuthStore((state) => state.clearUnread);
  const decrementUnread = useAuthStore((state) => state.decrementUnread);

  useEffect(() => {
    let active = true;

    const fetchNotifications = async () => {
      try {
        const res = await api.get('/user/notifications');
        if (!active) {
          return;
        }

        const list: AppNotification[] = Array.isArray(res.data) ? res.data : [];
        setNotifications(list);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to fetch notifications'));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    clearUnread();
    fetchNotifications();

    return () => {
      active = false;
    };
  }, [clearUnread]);
  const { todayNotifications, yesterdayNotifications, earlierNotifications } = useMemo(() => {
    if (!isMounted) {
      return { todayNotifications: [], yesterdayNotifications: [], earlierNotifications: [] };
    }

    const today = new Date();
    const todayKey = today.toLocaleDateString();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toLocaleDateString();

    const grouped = {
      todayNotifications: [] as AppNotification[],
      yesterdayNotifications: [] as AppNotification[],
      earlierNotifications: [] as AppNotification[],
    };

    notifications.forEach((notification) => {
      const key = new Date(notification.createdAt).toLocaleDateString();
      if (key === todayKey) {
        grouped.todayNotifications.push(notification);
      } else if (key === yesterdayKey) {
        grouped.yesterdayNotifications.push(notification);
      } else {
        grouped.earlierNotifications.push(notification);
      }
    });

    return grouped;
  }, [notifications, isMounted]);

  const markAsRead = async (notification: AppNotification) => {
    if (notification.isRead) {
      return;
    }

    try {
      await api.put(`/user/notifications/${notification._id}/read`);
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id
            ? { ...item, isRead: true }
            : item
        )
      );
      decrementUnread();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to mark notification as read'));
    }
  };

  const markAllAsRead = async () => {
    setMarkingAll(true);
    try {
      await api.put('/user/notifications/mark-all-read');
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      clearUnread();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to mark all notifications as read'));
    } finally {
      setMarkingAll(false);
    }
  };

  const renderSection = (title: string, items: AppNotification[]) => (
    <div className="flex flex-col gap-[8px] w-full">
      <p className="font-[family-name:var(--font-figtree)] font-medium text-[16px] leading-[25.8px] tracking-[0.32px] text-[#3a3a3a] mb-2">
        {title}
      </p>

      {items.length === 0 ? (
        <p className="font-[family-name:var(--font-figtree)] font-medium text-[14px] text-[#757575]">
          No notifications
        </p>
      ) : (
        <div className="flex flex-col gap-[4px] w-full">
          {items.map((notification) => (
            <div
              key={notification._id}
              onClick={() => markAsRead(notification)}
              className="bg-[#fcfaf7] border-[0.5px] border-[#e4ded2] flex items-center p-[12px] rounded-[8px] w-full cursor-pointer hover:bg-[#f6f4f1] transition-colors"
            >
              <div className="flex flex-1 items-start justify-between gap-[8px]">
                <div className="flex items-start gap-[8px] h-full">
                  <span
                    className={`mt-[8px] size-[8px] rounded-full bg-[#f95c4b] ${notification.isRead ? 'opacity-0' : 'opacity-100'}`}
                  />
                  <div className="flex flex-col gap-[4px]">
                    <p className="font-[family-name:var(--font-figtree)] font-medium text-[16px] leading-[25.8px] tracking-[0.32px] text-[#1a1a1a]">
                      {notification.content}
                    </p>
                    <p className="font-[family-name:var(--font-figtree)] font-medium text-[13px] leading-[18.3px] tracking-[0.26px] text-[#5a5a5a]">
                      {formatDateTime(notification.createdAt, isMounted)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg,#f6f4f1)] flex relative overflow-x-hidden">
      <DashboardSidebar />
      
      {/* Main Content Area - Padded left to account for sidebar */}
      <main className="flex-1 md:ml-[240px] px-4 sm:px-6 md:pl-[42px] md:pr-[42px] pt-20 md:pt-[42px] flex flex-col items-start">
        <div className="w-full max-w-[1116px] flex flex-col items-start min-h-screen">
          <div className="flex flex-col sm:flex-row items-start justify-between w-full mb-[24px] sm:mb-[32px] gap-[12px] sm:gap-[16px]">
            <div className="flex flex-col gap-[4px]">
              <h1 className="font-[family-name:var(--font-fjalla)] font-normal text-[34px] sm:text-[40px] text-[var(--heading,#1a1a1a)] tracking-[0.8px] leading-[1.1] sm:leading-[57.6px]">
                Notifications
              </h1>
              <p className="font-[family-name:var(--font-fjalla)] font-normal text-[18px] sm:text-[33px] text-[var(--sub-head,#3a3a3a)] tracking-[0.4px] sm:tracking-[0.66px] leading-[1.25] sm:leading-[48.6px] max-w-[700px]">
                Stay updated with new content, updates, and important activity from creators.
              </p>
            </div>

            <button
              type="button"
              onClick={markAllAsRead}
              disabled={markingAll || notifications.length === 0}
              className="h-[40px] px-[20px] bg-transparent border border-[#e4ded2] rounded-[32px] font-[family-name:var(--font-figtree)] font-semibold text-[14px] text-[#1a1a1a] hover:bg-[#f6f4f1] transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {markingAll ? 'Marking...' : 'Mark all as read'}
            </button>
          </div>

          {loading ? (
            <div className="w-full h-[240px] flex items-center justify-center">
              <Loader2 className="size-[22px] animate-spin text-[#757575]" />
            </div>
          ) : (
            <div className="flex flex-col gap-[16px] w-full mb-[42px]">
              {renderSection('Today', todayNotifications)}

              <div className="mt-4">
                {renderSection('Yesterday', yesterdayNotifications)}
              </div>

              <div className="mt-4">
                {renderSection('Earlier', earlierNotifications)}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}


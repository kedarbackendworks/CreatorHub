"use client"

import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import api from '@/src/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/store/useAuthStore';

interface CreatorNotification {
  _id: string;
  type?: string;
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

export default function NotificationsPage() {
  const router = useRouter();
  const clearUnread = useAuthStore((state) => state.clearUnread);
  const [notifications, setNotifications] = useState<CreatorNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    clearUnread();

    const fetchNotifications = async () => {
      try {
        const res = await api.get('/creator/notifications');
        const list: CreatorNotification[] = Array.isArray(res.data) ? res.data : [];
        setNotifications(list);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [clearUnread]);

  const markAsRead = async (notification: CreatorNotification) => {
    try {
      if (!notification.isRead) {
        await api.put(`/creator/notifications/${notification._id}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n))
        );
      }
      
      if (notification.type === 'message') {
        router.push('/creator/messages');
      } else if (notification.type === 'subscription') {
        // For new subscribers, we could route to an audience page, or do nothing.
      } else if (notification.relatedId) {
        // Fallback for post-related notifications (likes, comments, views, tips, etc.)
        router.push(`/creator/post/${notification.relatedId}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, 'Failed to mark notification as read'));
    }
  };

  const markAllAsRead = async () => {
    setMarkingAll(true);
    try {
      await api.put('/creator/notifications/mark-all-read');
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
      clearUnread();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to mark all notifications as read'));
    } finally {
      setMarkingAll(false);
    }
  };

  const today = new Date().toLocaleDateString();
  const todayNotifications = notifications.filter(n => new Date(n.createdAt).toLocaleDateString() === today);
  const earlierNotifications = notifications.filter(n => new Date(n.createdAt).toLocaleDateString() !== today);

  return (
    <div className="p-12 max-w-6xl w-full mx-auto font-sans bg-[#f9f9f9] min-h-screen">
       <header className="mb-12 flex items-start justify-between gap-6">
          <div>
            <h1 className="text-[44px] font-bold text-[#1c1917] tracking-tight mb-2">Notifications</h1>
            <p className="text-2xl font-bold text-slate-600 tracking-tight leading-tight max-w-4xl">
              Stay updated on activity, engagement, and important updates related to your content.
            </p>
          </div>

          <button
            type="button"
            onClick={markAllAsRead}
            disabled={markingAll || notifications.length === 0}
            className="px-6 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {markingAll ? 'Marking...' : 'Mark all as read'}
          </button>
       </header>

       {loading ? (
         <div className="h-[220px] flex items-center justify-center">
           <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
         </div>
       ) : (
         <div className="space-y-12">

          {/* Today Section */}
          <div>
             <h2 className="text-[13px] font-bold text-slate-400 mb-6 uppercase tracking-widest px-2">Today</h2>
             <div className="space-y-3">
                {todayNotifications.map((n) => (
                  <div 
                    key={n._id} 
                    onClick={() => markAsRead(n)}
                    className="bg-white border border-slate-200/60 rounded-2xl p-6 flex justify-between items-center hover:shadow-sm transition-shadow group cursor-pointer"
                  >
                      <div className="flex items-start gap-4">
                         <div className={`w-1.5 h-1.5 rounded-full bg-rose-500 mt-2.5 shrink-0 ${n.isRead ? 'opacity-0' : 'opacity-100'}`}></div>
                         <div>
                            <h3 className="text-base font-bold text-[#1c1917] mb-1">
                              {n.content}
                            </h3>
                            <p className="text-[13px] font-bold text-slate-400">{new Date(n.createdAt).toLocaleDateString()} | {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                         </div>
                      </div>
                      <button className="text-slate-300 hover:text-slate-600 transition-colors">
                         <MoreHorizontal className="w-5 h-5" />
                      </button>
                  </div>
                ))}
                {todayNotifications.length === 0 && <p className="text-sm text-slate-400 px-2">No notifications today.</p>}
             </div>
          </div>

          {/* Earlier Section */}
          <div>
             <h2 className="text-[13px] font-bold text-slate-400 mb-6 uppercase tracking-widest px-2">Earlier</h2>
             <div className="space-y-3">
                 {earlierNotifications.map((n) => (
                  <div 
                    key={n._id} 
                    onClick={() => markAsRead(n)}
                    className="bg-white border border-slate-200/60 rounded-2xl p-6 flex justify-between items-center hover:shadow-sm transition-shadow group cursor-pointer opacity-80 hover:opacity-100"
                  >
                      <div className="flex items-start gap-4">
                         <div className={`w-1.5 h-1.5 rounded-full bg-rose-500 mt-2.5 shrink-0 ${n.isRead ? 'opacity-0' : 'opacity-100'}`}></div>
                         <div>
                            <h3 className="text-base font-bold text-[#1c1917] mb-1">
                              {n.content}
                            </h3>
                            <p className="text-[13px] font-bold text-slate-400">{new Date(n.createdAt).toLocaleDateString()} | {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                         </div>
                      </div>
                      <button className="text-slate-300 hover:text-slate-600 transition-colors">
                         <MoreHorizontal className="w-5 h-5" />
                      </button>
                  </div>
                ))}
                {earlierNotifications.length === 0 && <p className="text-sm text-slate-400 px-2">No earlier notifications.</p>}
             </div>
          </div>

            </div>
           )}
    </div>
  );
}

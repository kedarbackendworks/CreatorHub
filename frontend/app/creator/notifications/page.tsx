"use client"

import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Bell } from 'lucide-react';
import api from '@/src/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/creator/notifications');
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (notification: any) => {
    try {
      if (!notification.isRead) {
        await api.put(`/creator/notifications/${notification._id}/read`);
        setNotifications(notifications.map(n => n._id === notification._id ? { ...n, isRead: true } : n));
      }
      if (notification.relatedId) {
        router.push(`/creator/post/${notification.relatedId}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const today = new Date().toLocaleDateString();
  const todayNotifications = notifications.filter(n => new Date(n.createdAt).toLocaleDateString() === today);
  const earlierNotifications = notifications.filter(n => new Date(n.createdAt).toLocaleDateString() !== today);

  return (
    <div className="p-12 max-w-6xl w-full mx-auto font-sans bg-[#f9f9f9] min-h-screen">
       <header className="mb-12">
          <h1 className="text-[44px] font-bold text-[#1c1917] tracking-tight mb-2">Notifications</h1>
          <p className="text-2xl font-bold text-slate-600 tracking-tight leading-tight max-w-4xl">
            Stay updated on activity, engagement, and important updates related to your content.
          </p>
       </header>

       <div className="space-y-12">
          
          {/* Today Section */}
          <div>
             <h2 className="text-[13px] font-bold text-slate-400 mb-6 uppercase tracking-widest px-2">Today</h2>
             <div className="space-y-3">
                {todayNotifications.map((n, idx) => (
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
    </div>
  );
}

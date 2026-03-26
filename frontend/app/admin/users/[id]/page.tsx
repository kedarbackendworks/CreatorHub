"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronRight, Ban, Trash2, Download, MessageSquare, LogIn, Heart, ShoppingCart, UserPlus } from 'lucide-react';

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/admin/user/${params.id}`);
        if (res.data) {
          setUser(res.data.user);
          setActivities(res.data.activities);
        }
      } catch (error) {
        console.error("Error fetching user detail", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [params.id]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'subscription': return <UserPlus className="w-4 h-4 text-slate-500" />;
      case 'comment': return <MessageSquare className="w-4 h-4 text-slate-500" />;
      case 'login': return <LogIn className="w-4 h-4 text-slate-500" />;
      case 'like': return <Heart className="w-4 h-4 text-slate-500" />;
      case 'purchase': return <ShoppingCart className="w-4 h-4 text-slate-500" />;
      default: return <UserPlus className="w-4 h-4 text-slate-500" />;
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-500">Loading user profile...</div>;
  }

  if (!user) {
    return <div className="p-8 text-slate-500">User not found.</div>;
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto w-full bg-[#f8f9fa] min-h-[calc(100vh-64px)] font-sans">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm font-semibold">
        <a href="/admin/users" className="text-slate-500 hover:text-slate-800">Users</a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800">{user.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Left Column */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div className="bg-white border flex flex-col items-center border-slate-200 rounded-xl p-8 shadow-sm">
            <div className="relative mb-6">
              <img src={user.avatar || 'https://i.pravatar.cc/150'} alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow-sm bg-slate-100" />
              <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">{user.name}</h3>
            <p className="text-xs font-medium text-slate-500 mb-8">{user.email}</p>

            <div className="w-full space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Role</span>
                <span className="text-xs font-medium text-slate-500">{user.role}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Member Since</span>
                <span className="text-xs font-medium text-slate-500">{user.joined}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs font-bold text-slate-800">Status</span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{user.status}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border flex flex-col items-stretch border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-6">Account Actions</h3>
            <button className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 mb-3">
              <Ban className="w-4 h-4" /> Suspend User
            </button>
            <button className="w-full py-3 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
          {/* Tabs */}
          <div className="flex px-8 pt-4 gap-8 text-sm font-bold border-b border-slate-200">
            <button className="text-slate-800 border-b-2 border-slate-800 pb-4">Activity Log</button>
            <button className="text-slate-400 hover:text-slate-600 pb-4 transition-colors">Transactions</button>
            <button className="text-slate-400 hover:text-slate-600 pb-4 transition-colors">Content</button>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-bold text-slate-800">Recent Activities</h3>
              <button className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-800">
                Export Log <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              {activities.map((act) => (
                <div key={act.id} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    {getActivityIcon(act.type)}
                  </div>
                  <div className="flex-1 border-b border-slate-100 pb-6">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-slate-800">{act.action}</h4>
                      <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">{act.time}</span>
                    </div>
                    {act.desc && <p className="text-[11px] text-slate-500 font-medium">{act.desc}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-12 mb-4">
              <button className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors shadow-sm">
                Load Older Activities
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

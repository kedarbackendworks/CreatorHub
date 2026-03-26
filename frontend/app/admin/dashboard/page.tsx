"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/admin/data');
        if (res.data && res.data.dashboard) setData(res.data.dashboard);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading || !data) {
    return <div className="p-8 text-slate-500">Loading dynamic dashboard...</div>;
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6 w-full bg-[#f8f9fa] min-h-[calc(100vh-64px)] font-sans">
      
      {/* Header Titles */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h2>
        <p className="text-sm font-medium text-slate-500 mt-1">Manage platform users, creators, and administrators.</p>
      </div>

      {/* Top 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white border rounded-xl p-5 shadow-sm border-slate-100 flex flex-col h-full">
          <p className="text-sm font-bold text-slate-600 mb-1">Total Users</p>
          <div className="flex items-center gap-3">
            <h3 className="text-3xl font-bold text-slate-800">{data.users.count}</h3>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{data.users.growth}</span>
          </div>
          <div className="h-32 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.users.data} barSize={20} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fontSize: 9, fill: '#64748b'}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 9, fill: '#64748b'}} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} />
                <Bar dataKey="val" fill="#1e293b" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 border-t border-slate-100 pt-3">
             <h4 className="text-xs font-bold text-slate-800 mb-1">Total Users Growth</h4>
             <p className="text-[11px] text-slate-500 leading-tight">How many user using the<br/>website</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border rounded-xl p-5 shadow-sm border-slate-100 flex flex-col h-full">
          <p className="text-sm font-bold text-slate-600 mb-1">Total Creators</p>
          <div className="flex items-center gap-3">
            <h3 className="text-3xl font-bold text-slate-800">{data.creators.count}</h3>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{data.creators.growth}</span>
          </div>
          <div className="h-32 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.creators.data} barSize={20} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fontSize: 9, fill: '#64748b'}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 9, fill: '#64748b'}} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} />
                <Bar dataKey="val" fill="#64748b" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 border-t border-slate-100 pt-3">
             <h4 className="text-xs font-bold text-slate-800 mb-1">Total Creators Growth</h4>
             <p className="text-[11px] text-slate-500 leading-tight">How many Creators using<br/>the website</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border rounded-xl p-5 shadow-sm border-slate-100 flex flex-col h-full">
          <p className="text-sm font-bold text-slate-600 mb-1">Monthly Revenue</p>
          <div className="flex items-center gap-3">
            <h3 className="text-3xl font-bold text-slate-800">{data.revenue.count}</h3>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{data.revenue.growth}</span>
          </div>
          <div className="h-32 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenue.data} barSize={20} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fontSize: 9, fill: '#64748b'}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 9, fill: '#64748b'}} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} />
                <Bar dataKey="val" fill="#334155" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 border-t border-slate-100 pt-3">
             <h4 className="text-xs font-bold text-slate-800 mb-1">Total Monthly Revenue</h4>
             <p className="text-[11px] text-slate-500 leading-tight">Give you the number of<br/>revenue you get</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border rounded-xl p-5 shadow-sm border-slate-100 flex flex-col h-full">
          <p className="text-sm font-bold text-slate-600 mb-1">Active Subscriptions</p>
          <div className="flex items-center gap-3">
            <h3 className="text-3xl font-bold text-slate-800">{data.subscriptions.count}</h3>
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{data.subscriptions.growth}</span>
          </div>
          <div className="h-32 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.subscriptions.data} barSize={20} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fontSize: 9, fill: '#64748b'}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 9, fill: '#64748b'}} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} />
                <Bar dataKey="val" fill="#ea580c" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 border-t border-slate-100 pt-3">
             <h4 className="text-xs font-bold text-slate-800 mb-1">Total Active Subscriptions</h4>
             <p className="text-[11px] text-slate-500 leading-tight">Give us the no of<br/>Subscriptions in website</p>
          </div>
        </div>
      </div>

      {/* Middle 2 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Over Time */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-sm font-bold text-slate-800">Revenue Over Time</h3>
            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Profit</span>
          </div>
          <p className="text-xs text-slate-500 mb-6 font-medium">Showcase the Revenue you got from the website over a period...</p>
          
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data.revenueOverTime} barSize={28} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="name" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                 <YAxis tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} />
                 <Tooltip cursor={{fill: '#f1f5f9'}} />
                 <Bar dataKey="val" radius={[2, 2, 0, 0]}>
                   {data.revenueOverTime.map((entry: any, index: number) => {
                     const colors = ['#e2e8f0','#cbd5e1','#cbd5e1','#f1f5f9','#f1f5f9','#e2e8f0','#e2e8f0','#f1f5f9','#1e293b','#0f172a','#1e293b'];
                     return <Cell key={`cell-${index}`} fill={colors[index] || '#111827'} />;
                   })}
                 </Bar>
               </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-sm font-bold text-slate-800">User Growth</h3>
            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Growth</span>
          </div>
          <p className="text-xs text-slate-500 mb-6 font-medium">Showcase the growth of the users in the website</p>
          
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={data.userGrowth} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="name" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                 <YAxis tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} />
                 <Tooltip />
                 <Line type="linear" dataKey="val" stroke="#334155" strokeWidth={2} dot={{r: 4, fill: '#334155'}} activeDot={{ r: 6 }} />
               </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Bottom 2 Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Alerts */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm h-full flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 mb-6">Recent Alerts</h3>
          <div className="space-y-6 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <p className="text-sm font-bold text-slate-700">5 reports pending review</p>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">2 min ago</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <p className="text-sm font-bold text-slate-700">Server load at 85%</p>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">14 min ago</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                <p className="text-sm font-bold text-slate-700">New creator application</p>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">1 hour ago</span>
            </div>
          </div>
          <button className="w-full mt-6 py-3 bg-[#f8f9fa] border border-slate-100 hover:bg-slate-100 text-xs font-bold text-slate-600 rounded-lg uppercase tracking-wider transition-colors">
            View All Alerts
          </button>
        </div>

        {/* Support & Moderation */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm h-full flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 mb-6">Support & Moderation</h3>
          
          <div className="mb-6">
             <div className="flex justify-between text-xs font-medium text-slate-700 mb-2">
               <span>Moderation Queue</span>
               <span>12 Items</span>
             </div>
             <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
               <div className="bg-slate-800 h-full" style={{ width: '60%' }}></div>
             </div>
          </div>

          <p className="text-xs font-medium text-slate-700 mb-3">Support Tickets Status</p>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 bg-[#f8f9fa] border border-slate-100 rounded-xl p-4">
              <p className="text-xs font-medium text-slate-500 mb-1">Open</p>
              <h4 className="text-lg font-bold text-slate-800">12</h4>
            </div>
            <div className="flex-1 bg-[#f8f9fa] border border-slate-100 rounded-xl p-4">
               <p className="text-xs font-medium text-slate-500 mb-1">In Progress</p>
               <h4 className="text-lg font-bold text-slate-800">05</h4>
            </div>
          </div>

          <div className="flex gap-4 mt-auto">
             <button className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm">
               Review Queue
             </button>
             <button className="flex-1 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg transition-colors shadow-sm">
               Support Desk
             </button>
          </div>
        </div>

      </div>
    
    </div>
  );
}

"use client"
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import api from '@/src/lib/api';
import { Search, ChevronDown, MoreVertical, Download, Users, TrendingUp, Eye, Link as LinkIcon, ShoppingBag, CreditCard, BarChart2, Video, Radio, FileText, Play, Trash2, Edit3, ExternalLink } from 'lucide-react';

export default function InsightsPage() {
   const [activeTab, setActiveTab] = useState('Audience');
   const [activeMenu, setActiveMenu] = React.useState<React.Key | null>(null);
   const [data, setData] = useState<any>(null);

   useEffect(() => {
      const fetchInsights = async () => {
         try {
            const [dashRes, insightRes] = await Promise.all([
               api.get('/creator/dashboard'),
               api.get('/creator/insights')
            ]);
            setData({ ...dashRes.data, ...insightRes.data });
         } catch (err) {
            console.error("Error fetching insights:", err);
         }
      };
      fetchInsights();
   }, []);

   const audienceData = (data?.subscribers || []).map((user: any) => ({
      id: user._id,
      name: user.name || 'Anonymous Fan',
      email: user.email || 'No email provided',
      tier: 'Standard',
      joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
      endDate: 'N/A',
      img: user.avatar || `https://i.pravatar.cc/150?u=${user._id}`
   }));

   const topSelling = (data?.postRevenueBreakdown || []).sort((a: any, b: any) => b.total - a.total).slice(0, 7).map((post: any) => ({
      title: post.title,
      price: `Type: ${post.type}`,
      published: `Published: ${new Date(post.date).toLocaleDateString()}`,
      revenue: `$ ${post.total || 0}`,
      subText: 'Total Revenue Generated',
      img: post.thumbnailUrl || (post.type === 'image' ? post.mediaUrl : 'https://via.placeholder.com/600x400')
   }));

   const salesData = (data?.revenueChart || []).map((sale: any, i: number) => ({
      id: `sale-${i}`,
      name: `User ${i + 1}`,
      product: sale.title || 'Post Access',
      date: new Date(sale.date).toLocaleDateString(),
      price: `$ ${sale.revenue || 0}`,
      img: `https://i.pravatar.cc/150?u=sale-${i}`
   }));

   const postPerformance = (data?.postRevenueBreakdown || []).map((post: any) => ({
      id: post.id,
      title: post.title,
      renown: post.views || 0,
      other: Math.floor((post.views || 0) * 0.2),
      img: post.thumbnailUrl || (post.type === 'image' ? post.mediaUrl : 'https://via.placeholder.com/600x400')
   }));

   const toggleMenu = (id: React.Key | null | undefined, e: React.MouseEvent) => {
      if (!id) return;
      e.stopPropagation();
      setActiveMenu(activeMenu === id ? null : id);
   };

   const PostMenu = () => (
      <div className="absolute right-0 top-10 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-[100] animate-in fade-in zoom-in duration-200 origin-top-right font-sans">
         <button className="w-full px-6 py-3 text-left text-sm font-bold text-[#1c1917] hover:bg-slate-50 flex items-center gap-3 transition-colors">
            View post
         </button>
         <button className="w-full px-6 py-3 text-left text-sm font-bold text-[#1c1917] hover:bg-slate-50 flex items-center gap-3 transition-colors">
            Edit post
         </button>
         <button className="w-full px-6 py-3 text-left text-sm font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-3 transition-colors">
            Delete post
         </button>
      </div>
   );

   return (
      <div className="p-12 max-w-7xl w-full mx-auto bg-[#f9f9f9] min-h-screen font-sans" onClick={() => setActiveMenu(null)}>

         <header className="mb-12 flex justify-between items-start">
            <div>
               <h1 className="text-[52px] font-black text-[#1c1917] tracking-tighter mb-2 font-['Fjalla One'] uppercase">Insights</h1>
               <p className="text-3xl font-bold text-slate-800 tracking-tight leading-tight max-w-2xl">
                  Track your audience, memberships, and content performance with real-time metrics.
               </p>
            </div>
            <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-[13px] font-bold rounded-full hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2 mt-4">
               Download report <Download className="w-4 h-4 text-slate-400" />
            </button>
         </header>

         <div className="flex gap-10 border-b border-slate-200/60 mb-10">
            {['Audience', 'Sales', 'Memberships', 'Posts'].map((tab) => (
               <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[13px] font-black uppercase tracking-widest pb-4 border-b-2 transition-all duration-200 ${activeTab === tab ? 'text-rose-500 border-rose-500' : 'text-slate-400 hover:text-slate-600 border-transparent'}`}
               >
                  {tab}
               </button>
            ))}
         </div>

         <div className="space-y-10">

            {activeTab === 'Audience' && (
               <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                     {[
                        { label: 'Total subscribers', value: data?.audienceStats?.totalUsers ?? '0', icon: Users },
                        { label: 'Active members', value: data?.audienceStats?.activeUsers ?? '0', icon: TrendingUp },
                        { label: 'Visits via Renown', value: data?.audienceStats?.profileVisitsRenown ?? '0', icon: Eye },
                        { label: 'Visits via Links', value: data?.audienceStats?.profileVisitsDirect ?? '0', icon: LinkIcon }
                     ].map((stat, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                           <p className="text-[28px] font-black text-[#1c1917] mb-1 font-['Fjalla One']">{stat.value}</p>
                           <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        </div>
                     ))}
                  </div>

                  <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                     <table className="w-full text-left">
                        <thead className="bg-[#fafafa] border-b border-slate-200">
                           <tr>
                              <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Subscriber</th>
                              <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Email</th>
                              <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Current tier</th>
                              <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Join date</th>
                              <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/80">
                           {audienceData.map((user: any) => (
                              <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                 <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                       <img src={user.img} className="w-9 h-9 rounded-full border border-slate-200" alt="Avatar" />
                                       <span className="text-[14px] font-black text-[#1c1917] group-hover:text-rose-500 transition-colors uppercase font-['Fjalla One']">{user.name}</span>
                                    </div>
                                 </td>
                                 <td className="px-8 py-5 text-[14px] font-medium text-slate-500">{user.email}</td>
                                 <td className="px-8 py-5 text-[14px] font-black text-rose-500 uppercase text-[11px]">{user.tier}</td>
                                 <td className="px-8 py-5 text-[14px] font-medium text-slate-500">{user.joinDate}</td>
                                 <td className="px-8 py-5 text-right relative">
                                    <button onClick={(e) => toggleMenu(user.id, e)} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                       <MoreVertical className="w-5 h-5" />
                                    </button>
                                    {activeMenu === user.id && <PostMenu />}
                                 </td>
                              </tr>
                           ))}
                           {audienceData.length === 0 && (
                              <tr>
                                 <td colSpan={5} className="px-8 py-20 text-center text-slate-300 text-sm font-black uppercase tracking-widest">No subscribers found yet</td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </>
            )}

            {activeTab === 'Sales' && (
               <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                     <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <p className="text-[28px] font-black text-[#1c1917] mb-1 font-['Fjalla One']">{data?.salesStats?.totalSales ?? '0'}</p>
                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Total Sales Count</p>
                     </div>
                     <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <p className="text-[28px] font-black text-[#1c1917] mb-1 font-['Fjalla One']">{data?.salesStats?.conversionRate ?? '0%'}</p>
                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Conversion rate</p>
                     </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                     <table className="w-full text-left">
                        <thead className="bg-[#fafafa] border-b border-slate-200">
                           <tr>
                              <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                              <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Product</th>
                              <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Date purchased</th>
                              <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right pr-12">Price</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/80">
                           {salesData.map((sale: any) => (
                              <tr key={sale.id} className="hover:bg-slate-50 transition-all group">
                                 <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                       <img src={sale.img} className="w-9 h-9 rounded-full border border-slate-200" alt="Avatar" />
                                       <span className="text-[14px] font-black text-[#1c1917] group-hover:text-rose-500 transition-colors uppercase font-['Fjalla One']">{sale.name}</span>
                                    </div>
                                 </td>
                                 <td className="px-8 py-5 text-[14px] font-medium text-slate-500">{sale.product}</td>
                                 <td className="px-8 py-5 text-[14px] font-medium text-slate-500">{sale.date}</td>
                                 <td className="px-8 py-5 text-[16px] font-black text-[#1c1917] font-['Fjalla One'] text-right pr-12">{sale.price}</td>
                              </tr>
                           ))}
                           {salesData.length === 0 && (
                              <tr>
                                 <td colSpan={4} className="px-8 py-20 text-center text-slate-300 text-sm font-black uppercase tracking-widest">No sales recorded yet</td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                  </div>

                  <div className="space-y-6 pt-6">
                     <h2 className="text-[28px] font-black text-[#111827] tracking-tight font-['Fjalla One'] uppercase">Top Earning Content</h2>
                     <div className="grid grid-cols-1 gap-4">
                        {topSelling.map((item: any, i: number) => (
                           <div key={i} className="bg-white border border-slate-200/60 rounded-3xl p-6 flex justify-between items-center hover:shadow-md transition-all group">
                              <div className="flex items-center gap-5">
                                 <img src={item.img} className="w-20 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm" alt="Thumbnail" />
                                 <div>
                                    <p className="text-[17px] font-black text-[#111827] group-hover:text-rose-500 transition-colors font-['Fjalla One'] uppercase">{item.title}</p>
                                    <div className="flex gap-4 mt-1">
                                       <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{item.price}</p>
                                       <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{item.published}</p>
                                    </div>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-[24px] font-black text-emerald-600 leading-tight font-['Fjalla One']">{item.revenue}</p>
                                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Net Revenue</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </>
            )}

            {activeTab === 'Memberships' && (
               <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                     {[
                        { label: 'Active memberships', value: data?.membershipStats?.totalMemberships ?? '0' },
                        { label: 'Total members', value: data?.membershipStats?.totalMembershipMembers ?? '0' },
                        { label: 'Recent cancellations', value: data?.membershipStats?.cancelledMembers ?? '0' },
                        { label: 'Lead conversion', value: data?.membershipStats?.conversionRate ?? '0%' }
                     ].map((stat, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                           <p className="text-[28px] font-black text-[#1c1917] mb-1 font-['Fjalla One']">{stat.value}</p>
                           <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        </div>
                     ))}
                  </div>

                  <div className="bg-white border border-slate-200 rounded-[48px] p-16 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                     <BarChart2 className="w-16 h-16 text-slate-200 mb-6" />
                     <h3 className="text-xl font-black text-slate-300 uppercase tracking-[0.2em]">Membership Charts</h3>
                     <p className="text-sm font-bold text-slate-300 uppercase mt-4">Generating visual reports as data accrues</p>
                  </div>
               </div>
            )}

            {activeTab === 'Posts' && (
               <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <p className="text-[28px] font-black text-[#1c1917] mb-1 font-['Fjalla One']">{data?.engagement?.totalViews ?? '0'}</p>
                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Total Impressions</p>
                     </div>
                     <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <p className="text-[28px] font-black text-[#1c1917] mb-1 font-['Fjalla One']">{data?.engagement?.totalLikes ?? '0'}</p>
                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Net Social Likes</p>
                     </div>
                     <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <p className="text-[28px] font-black text-[#1c1917] mb-1 font-['Fjalla One']">{data?.engagement?.totalComments ?? '0'}</p>
                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Active Discussion Threads</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h2 className="text-[28px] font-black text-[#111827] tracking-tight font-['Fjalla One'] uppercase">Per post performance</h2>
                     <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                           <thead className="bg-[#fafafa] border-b border-slate-200">
                              <tr>
                                 <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 w-1/3">Post Title</th>
                                 <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Reach (Renown)</th>
                                 <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">External Views</th>
                                 <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right pr-12">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100/80">
                              {postPerformance.map((post: any) => (
                                 <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-8 py-4">
                                       <div className="flex items-center gap-4">
                                          <img src={post.img} className="w-12 h-12 rounded-xl object-cover border border-slate-100" alt="Post" />
                                          <span className="text-[14px] font-black text-[#1c1917] font-['Fjalla One'] uppercase">{post.title}</span>
                                       </div>
                                    </td>
                                    <td className="px-8 py-4 text-[16px] font-black text-slate-700 font-['Fjalla One']">{post.renown}</td>
                                    <td className="px-8 py-4 text-[16px] font-black text-slate-400 font-['Fjalla One']">{post.other}</td>
                                    <td className="px-8 py-4 text-right pr-8 relative">
                                       <button onClick={(e) => toggleMenu(post.id, e)} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                          <MoreVertical className="w-5 h-5" />
                                       </button>
                                       {activeMenu === post.id && <PostMenu />}
                                    </td>
                                 </tr>
                              ))}
                              {postPerformance.length === 0 && (
                                 <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center text-slate-300 text-sm font-black uppercase tracking-widest">No published posts found</td>
                                 </tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}

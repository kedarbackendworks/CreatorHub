"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronDown, MoreVertical, Download, Users, TrendingUp, Eye, Link as LinkIcon, ShoppingBag, CreditCard, BarChart2, Video, Radio, FileText, Play, Trash2, Edit3, ExternalLink } from 'lucide-react';

export default function InsightsPage() {
   const [activeTab, setActiveTab] = useState('Audience');
   const [activeMenu, setActiveMenu] = useState<string | null>(null);
   const [data, setData] = useState<any>(null);

   useEffect(() => {
      const fetchInsights = async () => {
         try {
            const res = await axios.get('http://localhost:5001/api/creator/insights');
            setData(res.data);
         } catch (err) {
            console.error("Error fetching insights:", err);
         }
      };
      fetchInsights();
   }, []);

   const audienceData = Array(10).fill(null).map((_, i) => ({
      id: `aud-${i}`,
      name: 'Khushi',
      email: 'dmkhushi21@gmail.com',
      tier: 'Free',
      joinDate: '12Aug, 2025 at 2:00pm',
      endDate: '12Aug, 2025 at 2:00pm',
      img: 'https://i.pravatar.cc/150?u=khushi'
   }));

   const salesData = Array(8).fill(null).map((_, i) => ({
      id: `sale-${i}`,
      name: 'Khushi',
      product: 'Membership',
      date: '12Aug, 2025 at 2:00pm',
      price: '$ 700',
      img: 'https://i.pravatar.cc/150?u=khushi'
   }));

   const topSelling = Array(5).fill(null).map((_, i) => ({
      title: '50 members have enrolled into this',
      price: 'Set price : $ 400',
      published: 'published on : 23 Jan, 2025 | 3 : 25 pm',
      revenue: '$ 1500',
      subText: 'Generated revenue',
      img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80'
   }));

   const postPerformance = Array(7).fill(null).map((_, i) => ({
      id: `post-${i}`,
      title: 'post name',
      renown: '40',
      other: '100',
      plays: '120',
      img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80'
   }));

   const liveInsights = Array(7).fill(null).map((_, i) => ({
      id: `live-${i}`,
      title: 'post name',
      date: '12 aug, 2026',
      joins: '100',
      viewTime: '10 mins',
      img: 'https://images.unsplash.com/photo-1527433270417-66d3b4040b12?w=100&q=80'
   }));

   const toggleMenu = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setActiveMenu(activeMenu === id ? null : id);
   };

   const PostMenu = () => (
      <div className="absolute right-0 top-10 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-[100] animate-in fade-in zoom-in duration-200 origin-top-right font-[var(--font-figtree)]">
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
      <div className="p-12 max-w-7xl w-full mx-auto bg-[#f9f9f9] min-h-screen font-[var(--font-figtree)]" onClick={() => setActiveMenu(null)}>

         <header className="mb-12 flex justify-between items-start">
            <div>
               <h1 className="text-[52px] font-black text-[#1c1917] tracking-tighter mb-2 font-['Fjalla_One']">Insights</h1>
               <p className="text-3xl font-bold text-slate-800 tracking-tight leading-tight max-w-5xl">
                  Track your audience, memberships, posts, and sales performance in one place.
               </p>
            </div>
            <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-[13px] font-bold rounded-full hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2 mt-4">
               Download report <Download className="w-4 h-4 text-slate-400" />
            </button>
         </header>

         {/* Tabs */}
         <div className="flex gap-10 border-b border-slate-200/60 mb-10">
            {['Audience', 'Sales', 'Memberships', 'Posts'].map((tab) => (
               <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[13px] font-bold pb-4 border-b-2 transition-all duration-200 ${activeTab === tab ? 'text-rose-500 border-rose-500' : 'text-slate-400 hover:text-slate-600 border-transparent'}`}
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
                        { label: 'Total users', value: data?.audienceStats?.totalUsers || '200', icon: Users },
                        { label: 'Active users', value: data?.audienceStats?.activeUsers || '4,000', icon: TrendingUp },
                        { label: 'Profile visits', value: data?.audienceStats?.profileVisitsRenown || '1,500', sub: 'Via renown', icon: Eye },
                        { label: 'Profile visits', value: data?.audienceStats?.profileVisitsDirect || '1,500', sub: 'Via direct Links', icon: LinkIcon }
                     ].map((stat, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                           <p className="text-[28px] font-black text-[#1c1917] mb-1 font-['Fjalla_One']">{stat.value}</p>
                           <p className="text-[13px] font-bold text-slate-400 mb-1">{stat.label}</p>
                           {stat.sub && <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{stat.sub}</p>}
                        </div>
                     ))}
                  </div>

                  <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                     <table className="w-full text-left">
                        <thead className="bg-[#fafafa] border-b border-slate-200">
                           <tr>
                              <th className="px-8 py-6 text-sm font-bold w-1/4">Name</th>
                              <th className="px-8 py-6 text-sm font-bold">Email</th>
                              <th className="px-8 py-6 text-sm font-bold">Current tier</th>
                              <th className="px-8 py-6 text-sm font-bold">Join date</th>
                              <th className="px-8 py-6 text-sm font-bold">End date</th>
                              <th className="px-8 py-6 text-sm font-bold text-right">Edit</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/80">
                           {audienceData.map((user) => (
                              <tr key={user.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                                 <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                       <img src={user.img} className="w-9 h-9 rounded-full border border-slate-200" alt="Avatar" />
                                       <span className="text-[14px] font-bold text-[#1c1917] group-hover:text-rose-500 transition-colors uppercase font-['Fjalla_One']">{user.name}</span>
                                    </div>
                                 </td>
                                 <td className="px-8 py-5 text-[14px] font-medium text-slate-500">{user.email}</td>
                                 <td className="px-8 py-5 text-[14px] font-medium text-slate-500">{user.tier}</td>
                                 <td className="px-8 py-5 text-[14px] font-medium text-slate-500">{user.joinDate}</td>
                                 <td className="px-8 py-5 text-[14px] font-medium text-slate-500">{user.endDate}</td>
                                 <td className="px-8 py-5 text-right relative">
                                    <button onClick={(e) => toggleMenu(user.id, e)} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                       <MoreVertical className="w-5 h-5" />
                                    </button>
                                    {activeMenu === user.id && <PostMenu />}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </>
            )}

            {activeTab === 'Sales' && (
               <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl font-['Fjalla_One']">
                     <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <p className="text-[28px] font-black text-[#1c1917] mb-1">{data?.salesStats?.totalSales || '200'}</p>
                        <p className="text-[13px] font-bold text-slate-400 uppercase">Total Sales</p>
                     </div>
                     <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <p className="text-[28px] font-black text-[#1c1917] mb-1">{data?.salesStats?.conversionRate || '4,000'}</p>
                        <p className="text-[13px] font-bold text-slate-400 uppercase">Conversion rate</p>
                     </div>
                  </div>

                  <div className="flex gap-4 items-center">
                     <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Search" className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-rose-200" />
                     </div>
                     <div className="relative w-64">
                        <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-600 appearance-none outline-none cursor-pointer">
                           <option>Past 30 days</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
                     </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                     <table className="w-full text-left">
                        <thead className="bg-[#fafafa] border-b border-slate-200">
                           <tr>
                              <th className="px-8 py-6 text-sm font-bold">Name</th>
                              <th className="px-8 py-6 text-sm font-bold">Product</th>
                              <th className="px-8 py-6 text-sm font-bold">Date purchased</th>
                              <th className="px-8 py-6 text-sm font-bold">Price</th>
                              <th className="px-8 py-6 text-sm font-bold text-right pr-12">Edit</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/80">
                           {salesData.map((sale) => (
                              <tr key={sale.id} className="hover:bg-slate-50 transition-all cursor-pointer group">
                                 <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                       <img src={sale.img} className="w-9 h-9 rounded-full border border-slate-200" alt="Avatar" />
                                       <span className="text-[14px] font-bold text-[#1c1917] group-hover:text-rose-500 transition-colors uppercase font-['Fjalla_One']">{sale.name}</span>
                                    </div>
                                 </td>
                                 <td className="px-8 py-5 text-[14px] font-medium text-slate-500">{sale.product}</td>
                                 <td className="px-8 py-5 text-[14px] font-medium text-slate-500">{sale.date}</td>
                                 <td className="px-8 py-5 text-[14px] font-black text-[#1c1917] font-['Fjalla_One']">{sale.price}</td>
                                 <td className="px-8 py-5 text-right relative pr-8">
                                    <button onClick={(e) => toggleMenu(sale.id, e)} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                       <MoreVertical className="w-5 h-5" />
                                    </button>
                                    {activeMenu === sale.id && <PostMenu />}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>

                  <div className="space-y-6 pt-6">
                     <h2 className="text-[32px] font-black text-[#111827] tracking-tight font-['Fjalla_One']">Top selling</h2>
                     <div className="space-y-3">
                        {topSelling.map((item, i) => (
                           <div key={i} className="bg-white border border-slate-200/60 rounded-3xl p-6 flex justify-between items-center hover:shadow-sm transition-all group cursor-pointer">
                              <div className="flex items-center gap-5">
                                 <img src={item.img} className="w-16 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm" alt="Thumbnail" />
                                 <div>
                                    <p className="text-[17px] font-black text-[#111827] group-hover:text-rose-500 transition-colors font-['Fjalla_One']">{item.title}</p>
                                    <div className="flex gap-4 mt-1">
                                       <p className="text-[12px] font-bold text-slate-400 uppercase tracking-tighter">{item.price}</p>
                                       <p className="text-[12px] font-bold text-slate-400 uppercase tracking-tighter">{item.published}</p>
                                    </div>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-[20px] font-black text-emerald-600 leading-tight font-['Fjalla_One']">{item.revenue}</p>
                                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{item.subText}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </>
            )}

            {activeTab === 'Memberships' && (
               <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-['Fjalla_One']">
                     {[
                        { label: 'Total memberships', value: data?.membershipStats?.totalMemberships || '200' },
                        { label: 'Total Membership members', value: data?.membershipStats?.totalMembershipMembers || '200' },
                        { label: 'Cancelled members', value: data?.membershipStats?.cancelledMembers || '4,000' },
                        { label: 'Conversion through memeberships', value: data?.membershipStats?.conversionRate || '4,000' }
                     ].map((stat, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                           <p className="text-[28px] font-black text-[#1c1917] mb-1">{stat.value}</p>
                           <p className="text-[13px] font-bold text-slate-400 uppercase">{stat.label}</p>
                        </div>
                     ))}
                  </div>

                  <div className="bg-white border border-slate-200 rounded-[48px] p-10 shadow-sm overflow-hidden">
                     <div className="flex justify-between items-end mb-12">
                        <div>
                           <h2 className="text-3xl font-black text-[#111827] mb-1 font-['Fjalla_One']">Revenue Through Offers</h2>
                           <p className="text-sm font-bold text-slate-400 capitalize">subheading</p>
                        </div>
                        <div className="relative">
                           <select className="bg-[#f5f5f4] border border-slate-100 rounded-xl pl-4 pr-10 py-3 text-sm font-bold text-slate-600 appearance-none outline-none cursor-pointer">
                              <option>Daily</option>
                           </select>
                           <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                     </div>

                     <div className="h-80 w-full relative group">
                        <div className="absolute inset-0 border-b border-slate-200/60 flex items-end justify-between px-4 pb-2">
                           {[20, 21, 22, 23, 24, 25, 26, 27].map((d) => (
                              <span key={d} className={`text-[13px] font-black font-['Fjalla_One'] ${d === 24 ? 'text-emerald-600' : 'text-slate-400'}`}>{d}</span>
                           ))}
                        </div>
                        <div className="absolute left-0 bottom-8 text-[13px] font-bold text-slate-400 px-4 uppercase tracking-widest">March</div>

                        <div className="absolute inset-0 grid grid-cols-8 divide-x divide-slate-100/60 opacity-30 pointer-events-none">
                           {Array(8).fill(0).map((_, i) => <div key={i}></div>)}
                        </div>
                        <div className="absolute inset-0 grid grid-rows-4 divide-y divide-slate-100/60 opacity-30 pointer-events-none">
                           {Array(4).fill(0).map((_, i) => <div key={i}></div>)}
                        </div>

                        <div className="absolute left-[58%] top-0 bottom-0 w-px bg-rose-500 z-10 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                        <div className="absolute left-[60%] top-1/2 -translate-y-1/2 bg-[#d94828] text-white p-6 rounded-[32px] shadow-2xl z-20 min-w-[220px] border border-white/20">
                           <p className="text-[13px] font-bold opacity-80 mb-2 font-['Fjalla_One']">20 March, 2026</p>
                           <p className="text-lg font-black mb-1 leading-tight font-['Fjalla_One']">Membership name</p>
                           <p className="text-sm font-bold opacity-90 mb-0.5">Free : 30 members</p>
                           <p className="text-sm font-bold opacity-90 mb-2">membership : 10 members</p>
                           <p className="text-xl font-black font-['Fjalla_One']">Revenue : $600</p>
                        </div>
                     </div>
                  </div>
               </>
            )}

            {activeTab === 'Posts' && (
               <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-['Fjalla_One']">
                     <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <p className="text-[13px] font-bold text-slate-400 mb-2 uppercase tracking-tighter">7 seen</p>
                        <p className="text-[28px] font-black text-[#1c1917] mb-1">200</p>
                        <p className="text-[13px] font-bold text-slate-400 uppercase">Total posts reach</p>
                     </div>
                     <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <p className="text-[13px] font-bold text-slate-400 mb-2 uppercase tracking-tighter">12 new members . 5 purchases</p>
                        <p className="text-[28px] font-black text-[#1c1917] mb-1">4,000</p>
                        <p className="text-[13px] font-bold text-slate-400 uppercase">Conversion through posts</p>
                     </div>
                     <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <p className="text-[13px] font-bold text-slate-400 mb-2 uppercase tracking-tighter">5 saved . 10 shared</p>
                        <p className="text-[28px] font-black text-[#1c1917] mb-1">200</p>
                        <p className="text-[13px] font-bold text-slate-400 uppercase">Total post posted</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h2 className="text-[32px] font-black text-[#111827] tracking-tight font-['Fjalla_One']">Per post performnace</h2>
                     <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                           <thead className="bg-[#fafafa] border-b border-slate-200">
                              <tr>
                                 <th className="px-8 py-5 text-sm font-bold w-1/3">Latest posts</th>
                                 <th className="px-8 py-5 text-sm font-bold">Seen on renown</th>
                                 <th className="px-8 py-5 text-sm font-bold">Seen on other platforms</th>
                                 <th className="px-8 py-5 text-sm font-bold text-right pr-12">Edit</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100/80">
                              {postPerformance.map((post) => (
                                 <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-8 py-4">
                                       <div className="flex items-center gap-4">
                                          <img src={post.img} className="w-10 h-10 rounded-xl object-cover" alt="Post" />
                                          <span className="text-sm font-bold text-[#1c1917] font-['Fjalla_One'] uppercase">{post.title}</span>
                                       </div>
                                    </td>
                                    <td className="px-8 py-4 text-sm font-bold text-slate-500">{post.renown}</td>
                                    <td className="px-8 py-4 text-sm font-bold text-slate-500">{post.other}</td>
                                    <td className="px-8 py-4 text-right pr-8 relative">
                                       <button onClick={(e) => toggleMenu(post.id, e)} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                          <MoreVertical className="w-5 h-5" />
                                       </button>
                                       {activeMenu === post.id && <PostMenu />}
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                     <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm uppercase tracking-widest">
                        Download report
                     </button>
                  </div>

                  <div className="space-y-6 pt-6 text-slate-800">
                     <h2 className="text-[32px] font-black text-[#111827] tracking-tight font-['Fjalla_One']">Live event insights</h2>
                     <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                           <thead className="bg-[#fafafa] border-b border-slate-200">
                              <tr>
                                 <th className="px-8 py-5 text-sm font-bold w-1/3">Latest broadcasts</th>
                                 <th className="px-8 py-5 text-sm font-bold">Date</th>
                                 <th className="px-8 py-5 text-sm font-bold">Total joins</th>
                                 <th className="px-8 py-5 text-sm font-bold text-right pr-12">Edit</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100/80">
                              {liveInsights.map((live) => (
                                 <tr key={live.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-8 py-4">
                                       <div className="flex items-center gap-4">
                                          <img src={live.img} className="w-10 h-10 rounded-xl object-cover" alt="Broadcast" />
                                          <span className="text-sm font-bold text-[#1c1917] font-['Fjalla_One'] uppercase">{live.title}</span>
                                       </div>
                                    </td>
                                    <td className="px-8 py-4 text-sm font-bold text-slate-500">{live.date}</td>
                                    <td className="px-8 py-4 text-sm font-bold text-slate-500">{live.joins}</td>
                                    <td className="px-8 py-4 text-right pr-8 relative">
                                       <button onClick={(e) => toggleMenu(live.id, e)} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                          <MoreVertical className="w-5 h-5" />
                                       </button>
                                       {activeMenu === live.id && <PostMenu />}
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                     <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm uppercase tracking-widest">
                        Download report
                     </button>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}

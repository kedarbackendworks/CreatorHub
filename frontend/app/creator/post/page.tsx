"use client"

import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Paperclip, X, Eye, Save, Globe, Lock, Shield, User, Clock, Bell, Mail, MessageSquare, Plus, Smartphone, Monitor, ChevronDown, Heart, Diamond, Zap, Trash2, FileText, LayoutTemplate } from 'lucide-react';
import api from '@/src/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CreatePostPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Upload images, videos, audio');
   const [audience, setAudience] = useState<'everyone' | 'members_only' | 'exclusive_paid'>('everyone');
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
   const [sellingPrice, setSellingPrice] = useState('');
  const [publishing, setPublishing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/')) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handlePublish = async () => {
    if (!title || !description) {
      toast.error("Title and description are required");
      return;
    }

      if (audience === 'exclusive_paid' && (!sellingPrice || Number(sellingPrice) <= 0)) {
         toast.error('Enter a valid selling price for exclusive content');
         return;
      }

    setPublishing(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);

      let mediaType = 'image';
      if (activeTab === 'Link') {
        mediaType = 'link';
        formData.append('mediaUrl', linkUrl);
      } else if (activeTab === 'Attachments') {
        mediaType = 'file';
        if (file) formData.append('file', file);
      } else if (file) {
        mediaType = file.type.startsWith('video/') ? 'video' : 'image';
        formData.append('file', file);
      }

      formData.append('mediaType', mediaType);
      formData.append('accessTier', audience);
      formData.append('isExclusive', String(audience !== 'everyone'));
      formData.append('price', audience === 'exclusive_paid' ? String(Number(sellingPrice)) : '0');

      await api.post('/creator/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Post published successfully!");
      router.push('/creator');
    } catch (err: any) {
      console.error("Error publishing post:", err);
      toast.error(err.response?.data?.error || "Failed to publish post");
    } finally {
      setPublishing(false);
    }
  };

  return (
   <div className="flex flex-col xl:flex-row bg-[#f9f9f9] min-h-screen font-sans">
      
      {/* Left Form Column */}
      <div className="flex-1 p-4 sm:p-6 lg:p-12 max-w-5xl border-r border-slate-200/60 overflow-y-auto">
         <header className="mb-12">
            <h1 className="text-[44px] font-bold text-[#1c1917] tracking-tight mb-2">Create a post</h1>
            <p className="text-2xl font-bold text-slate-600 tracking-tight leading-tight">Share new content, set pricing, and publish it for your audience.</p>
         </header>

         {/* Content Form */}
         <div className="space-y-12">
            
            {/* Media Upload Tabs */}
            <div className="space-y-6">
               <div className="flex gap-8 border-b border-slate-200/60">
                  {['Upload images, videos, audio', 'Link', 'Attachments'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-[13px] font-bold pb-4 border-b-2 transition-all duration-200 ${activeTab === tab ? 'text-rose-500 border-rose-500' : 'text-slate-400 hover:text-slate-600 border-transparent'}`}
                    >
                      {tab}
                    </button>
                  ))}
               </div>

                {activeTab === 'Upload images, videos, audio' && (
                  <div 
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="bg-white border-2 border-dashed border-slate-200 rounded-[32px] p-16 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors shadow-sm relative overflow-hidden group"
                  >
                     {previewUrl ? (
                         file?.type.startsWith('video/') ? (
                             <video src={previewUrl} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" />
                         ) : (
                             <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" alt="Preview" />
                         )
                     ) : (
                         <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                            <Upload className="w-6 h-6 text-slate-400" />
                         </div>
                     )}
                     
                     <div className="relative z-10">
                        <p className="text-[14px] font-bold text-slate-500 mb-6 max-w-xs">{file ? `Selected: ${file.name}` : 'Recommended: 1280x720px (16:9 aspect ratio)'}</p>
                        
                        <input 
                            type="file" 
                            id="file-upload" 
                            className="hidden" 
                            onChange={handleFileChange}
                            accept="image/*,video/*,audio/*"
                        />
                        <span className="px-6 py-2.5 bg-white border border-slate-200 text-[#111827] text-xs font-bold rounded-full hover:bg-slate-50 transition-colors shadow-sm">
                            {file ? 'Change File' : 'Choose File'}
                        </span>
                     </div>
                  </div>
               )}

               {activeTab === 'Link' && (
                  <div className="bg-white border-2 border-dashed border-slate-200 rounded-[32px] p-16 flex items-center justify-center shadow-sm">
                     <div className="w-full max-w-2xl bg-[#fafafa] border border-slate-200 rounded-2xl p-5 flex items-center gap-4 transition-all focus-within:border-rose-300 focus-within:ring-1 focus-within:ring-rose-200">
                        <input 
                          type="text" 
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                          placeholder="Type or paste any URL" 
                          className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none" 
                        />
                     </div>
                  </div>
               )}

               {activeTab === 'Attachments' && (
                  <div className="bg-white border-2 border-dashed border-slate-200 rounded-[32px] p-16 flex flex-col items-center justify-center shadow-sm">
                     <div className="w-full max-w-2xl space-y-4 mb-8">
                        <div className="bg-[#fafafa] border border-slate-200 rounded-2xl p-4 flex items-center justify-between group">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-md">
                                 <FileText className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-[14px] font-bold text-[#1c1917]">File name</span>
                           </div>
                           <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                     <input 
                        type="file" 
                        id="attachment-upload" 
                        className="hidden" 
                        onChange={handleFileChange}
                      />
                      <label 
                        htmlFor="attachment-upload"
                        className="px-6 py-2.5 bg-[#f5f5f4] border border-slate-200 text-[#111827] text-xs font-bold rounded-full hover:bg-white transition-all shadow-sm cursor-pointer"
                      >
                        {activeTab === 'Attachments' && file ? file.name : 'Upload more'}
                      </label>
                  </div>
               )}
            </div>

            {/* Inputs */}
            <div className="space-y-10">
               <div>
                  <label className="block text-[13px] font-bold text-[#111827] mb-3.5 ml-1">Title *</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Advanced React Patterns" 
                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-rose-200 focus:border-rose-300 shadow-sm" 
                  />
               </div>
               <div>
                  <label className="block text-[13px] font-bold text-[#111827] mb-3.5 ml-1 text-sm">Body *</label>
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                     <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe" rows={14} className="w-full bg-transparent p-6 text-sm font-medium focus:outline-none resize-none min-h-[400px]" 
                     />
                  </div>
               </div>
            </div>

         </div>
      </div>

      {/* Right Sidebar */}
      <aside className="hidden xl:block w-[380px] p-8 bg-white overflow-y-auto shrink-0 border-l border-slate-200/60 h-screen sticky top-0 shadow-sm">
         
         <div className="flex gap-3 mb-10">
            <button onClick={() => setPreviewOpen(true)} className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-full hover:bg-slate-50 transition-colors shadow-sm">
               Preview
            </button>
            <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-full hover:bg-slate-50 transition-colors shadow-sm">
               Save draft
            </button>
            <button 
               onClick={handlePublish}
               disabled={publishing}
               className="flex-1 py-3 bg-rose-500 text-white text-xs font-bold rounded-full hover:bg-rose-600 transition-colors shadow-sm disabled:opacity-50"
            >
               {publishing ? 'Publishing...' : 'Publish'}
            </button>
         </div>

         <div className="space-y-10">
            {/* Audience Section */}
            <div>
               <h4 className="text-sm font-bold text-[#111827] border-b border-slate-100 pb-5 mb-5">Audience</h4>
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-5 ml-1">Free access</p>
               
               <div className="space-y-2.5">
                  {[
                              { id: 'everyone', label: 'Everyone', desc: 'Free to access for all users' },
                              { id: 'members_only', label: 'Members only', desc: 'Only paid channel members can access' },
                              { id: 'exclusive_paid', label: 'Exclusive content', desc: 'All users must pay separately to access' }
                  ].map((opt) => (
                    <div 
                      key={opt.id} 
                                 onClick={() => setAudience(opt.id as 'everyone' | 'members_only' | 'exclusive_paid')}
                      className={`flex items-start gap-4 p-4.5 rounded-2xl border cursor-pointer transition-all ${audience === opt.id ? 'border-rose-500 bg-rose-50/20' : 'border-slate-100 bg-[#fbfbfb] hover:bg-slate-50'}`}
                    >
                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 shrink-0 ${audience === opt.id ? 'border-rose-500' : 'border-slate-300'}`}>
                          {audience === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>}
                       </div>
                       <div>
                          <p className="text-[13px] font-bold text-[#111827]">{opt.label}</p>
                          <p className="text-[11px] font-medium text-slate-400">{opt.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
               
               <div className="mt-5">
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-[14px] font-bold text-slate-400">$</span>
                              <input
                                 type="number"
                                 min="0"
                                 step="0.01"
                                 value={sellingPrice}
                                 onChange={(e) => setSellingPrice(e.target.value)}
                                 disabled={audience !== 'exclusive_paid'}
                                 placeholder={audience === 'exclusive_paid' ? 'Enter selling price' : 'Price enabled for Exclusive content'}
                                 className="w-full bg-[#fcfcfc] border border-slate-100 rounded-xl pl-10 pr-4 py-3.5 text-[14px] font-bold text-[#111827] focus:outline-none focus:ring-1 focus:ring-rose-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                              />
                  </div>
               </div>
            </div>

            {/* Publishing Options */}
            <div>
               <h4 className="text-sm font-bold text-[#111827] border-b border-slate-100 pb-5 mb-5">Publishing options</h4>
               <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 bg-[#fbfbfb] cursor-pointer hover:bg-slate-50 mb-5 transition-all">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 mt-1 shrink-0"></div>
                  <p className="text-[13px] font-bold text-[#111827]">Make this a drop</p>
               </div>
               
               <div className="bg-slate-900 rounded-[28px] overflow-hidden mb-6 relative aspect-video shadow-lg">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80" className="opacity-40 w-full h-full object-cover" alt="Drop preview" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <div className="flex gap-4">
                        {['02', '02', '02', '02'].map((v, i) => (
                           <div key={i} className="flex flex-col items-center">
                              <span className="text-2xl font-black text-white tracking-tighter">{v}</span>
                              <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">{['Days', 'Hours', 'Minutes', 'Seconds'][i]}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                     <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">Date</p>
                     <p className="text-[14px] font-bold text-[#111827]">1 march, 2026</p>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                     <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">Time</p>
                     <p className="text-[14px] font-bold text-[#111827]">10 : 00 am</p>
                  </div>
               </div>

               <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 bg-[#fbfbfb] cursor-pointer hover:bg-slate-50 transition-all group">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 mt-1 shrink-0 group-hover:border-rose-300"></div>
                  <p className="text-[13px] font-bold text-[#111827] flex items-center gap-2">Schedule for later <Clock className="w-3.5 h-3.5 text-slate-400" /></p>
               </div>
            </div>
         </div>
      </aside>

      {/* Preview Modal (Image 5 Style) */}
      {previewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
           {/* Modal Close */}
           <button onClick={() => setPreviewOpen(false)} className="absolute right-10 top-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl text-slate-400 hover:text-rose-500 transition-all z-20">
              <X className="w-6 h-6" />
           </button>

           <div className="bg-white w-full max-w-[900px] h-[90vh] rounded-[40px] shadow-2xl overflow-y-auto relative flex flex-col pt-12">
              
              <div className="px-12 mb-10">
                 <h2 className="text-[40px] font-bold text-[#1c1917] leading-[1.1] tracking-tight mb-8">
                    Transform your body in just 30 days with simple home workouts and a guided nutrition plan.
                 </h2>
                 
                 <div className="rounded-[32px] overflow-hidden shadow-2xl mb-12 relative aspect-[21/9]">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&q=80" className="w-full h-full object-cover" alt="Preview content" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                 </div>

                 <div className="flex flex-wrap items-center justify-between gap-8 mb-12">
                    <div className="space-y-4">
                       <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                         Creator : <span className="text-[#be185d]">Creator name</span>
                       </div>
                       <div className="flex items-center gap-8 text-[15px] font-bold text-[#1c1917]">
                         <span className="flex items-center gap-2">Starts in : <span className="text-slate-500 font-medium">4Hours</span></span>
                         <span className="flex items-center gap-2">Rating : <span className="text-slate-500 font-medium">3.2/5</span></span>
                         <span className="flex items-center gap-2">Enrolled : <span className="text-slate-500 font-medium">200 Users</span></span>
                       </div>
                       <div className="flex items-center gap-8 text-[15px] font-bold text-[#1c1917]">
                         <span className="flex items-center gap-2">Duration : <span className="text-slate-500 font-medium">1Hour 30Min</span></span>
                         <span className="flex items-center gap-2">Language : <span className="text-slate-500 font-medium">English, hindi</span></span>
                         <span className="flex items-center gap-2">Star date : <span className="text-slate-500 font-medium">4 June, 2026</span></span>
                       </div>
                       <p className="text-[15px] font-bold text-[#1c1917]">Content type : <span className="text-slate-500 font-medium px-2">Video/livestream/pdf files</span></p>
                    </div>

                    <div className="flex items-center gap-3">
                       <button className="flex items-center gap-2 px-5 py-3 border border-slate-200 rounded-full text-sm font-bold text-slate-700 hover:bg-slate-50">
                          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Add to wishlist
                       </button>
                       <button className="flex items-center gap-2 px-5 py-3 border border-slate-200 rounded-full text-sm font-bold text-slate-700 hover:bg-slate-50">
                          <Diamond className="w-4 h-4 text-slate-700" /> Membership
                       </button>
                       <button className="flex items-center gap-2 px-8 py-3 bg-[#f87171] text-white rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all">
                          <Zap className="w-4 h-4 fill-white" /> Enroll Now
                       </button>
                    </div>
                 </div>

                 <div className="space-y-12 pb-20">
                    <div>
                       <h4 className="text-[15px] font-bold text-[#be185d] mb-1">Early Join Bonus</h4>
                       <p className="text-[15px] font-bold text-[#be185d]">Enroll before March 28 and get a free personalized diet checklist.</p>
                    </div>

                    <div>
                       <h3 className="text-2xl font-bold text-[#1c1917] mb-6">About The Event</h3>
                       <p className="text-base font-medium text-slate-600 leading-relaxed mb-6">
                          If you've been trying to lose weight but keep falling off track, this challenge is designed to finally make things simple, structured, and achievable.
                       </p>
                       <p className="text-base font-medium text-slate-600 leading-relaxed">
                          The 30-Day Home Fat Loss Challenge is a complete transformation program built for beginners, working professionals, and anyone who wants results without complicated gym routines or strict dieting.
                       </p>
                    </div>

                    <div>
                       <h3 className="text-2xl font-bold text-[#1c1917] mb-6">Who This Is For</h3>
                       <ul className="list-disc list-inside space-y-3 text-base font-medium text-slate-600 pl-4">
                          <li>Beginners who don't know where to start</li>
                          <li>People who prefer home workouts</li>
                          <li>Busy individuals with limited time</li>
                          <li>Anyone struggling with consistency and motivation</li>
                       </ul>
                    </div>

                    <div>
                       <h3 className="text-2xl font-bold text-[#1c1917] mb-6">What You'll Get</h3>
                       <ul className="list-disc list-inside space-y-3 text-base font-medium text-slate-600 pl-4">
                          <li>30 days of guided workout videos (20-30 mins each)</li>
                          <li>Beginner-friendly diet plans (veg & non-veg)</li>
                          <li>Weekly live Q&A sessions with the coach</li>
                          <li>Downloadable progress tracker</li>
                          <li>Access to private community group</li>
                       </ul>
                    </div>
                 </div>
              </div>

           </div>
        </div>
      )}

    </div>
  );
}

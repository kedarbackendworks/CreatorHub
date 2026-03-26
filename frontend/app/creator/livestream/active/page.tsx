"use client"

import React, { useState } from 'react';
import { Camera, Mic, Radio, User, MessageSquare, Send, Smile, MoreVertical, X, Maximize2, Users, Heart, ChevronDown } from 'lucide-react';

export default function ActiveLivestreamPage() {
  const [comment, setComment] = useState('');

  const comments = [
    { name: 'Jane Doe', time: '5 min ago', text: 'I really appreciate the insights and perspective shared in this article. It\'s definitely given me something to think about and has helped me see things from a different angle. Thank you for writing and sharing!', img: 'https://i.pravatar.cc/150?u=jane1' },
    { name: 'Jane Doe', time: '5 min ago', text: 'I really appreciate the insights and perspective shared in this article. Thank you for writing and sharing!', img: 'https://i.pravatar.cc/150?u=jane2', replies: true },
    { name: 'Jane Doe', time: '5 min ago', text: 'I really appreciate the insights and perspective shared in this article. It\'s definitely given me something to think about and has helped me see things from a different angle. Thank you for writing and sharing!', img: 'https://i.pravatar.cc/150?u=jane3' },
    { name: 'Jane Doe', time: '5 min ago', text: 'I really appreciate the insights and perspective shared in this article. It\'s definitely given me something to think about and has helped me see things from a different angle. Thank you for writing and sharing!', img: 'https://i.pravatar.cc/150?u=jane4' },
    { name: 'Jane Doe', time: '5 min ago', text: 'I really appreciate the insights and perspective shared in this article. It\'s definitely given me something to think about and has helped me see things from a different angle. Thank you for writing and sharing!', img: 'https://i.pravatar.cc/150?u=jane5' },
  ];

  return (
    <div className="flex flex-col bg-[#f9f9f9] min-h-screen font-sans pb-20">
      
      {/* Stream Container */}
      <div className="p-12 max-w-6xl w-full mx-auto space-y-12">
         
         {/* Live Video Viewer */}
         <div className="bg-[#a8a29e] rounded-[40px] overflow-hidden shadow-2xl relative aspect-video flex items-center justify-center group">
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&q=80" className="w-full h-full object-cover" alt="Livestream" />
            
            {/* Overlay UI */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 p-10 flex flex-col justify-between pointer-events-none">
               <div className="flex justify-between items-start w-full">
                  <div className="flex items-center gap-4">
                     <img src="https://i.pravatar.cc/150?u=andrea" className="w-12 h-12 rounded-full border-2 border-white shadow-xl" alt="Creator" />
                     <div>
                        <p className="text-white font-black leading-tight text-lg drop-shadow-md">Andrea Nelson</p>
                        <h2 className="text-white/90 text-2xl font-black mt-1 leading-tight tracking-tight drop-shadow-md max-w-2xl">
                           Transform your body in just 30 days with simple home workouts and a guided nutrition plan.
                        </h2>
                     </div>
                  </div>
                  <div className="bg-rose-500 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg flex items-center gap-2 animate-pulse">
                     <div className="w-2 h-2 rounded-full bg-white"></div> Live
                  </div>
               </div>

               <div className="flex justify-between items-end w-full">
                  <div className="flex flex-col gap-2">
                     <p className="text-white/80 text-[13px] font-bold tracking-tight">Viewers</p>
                     <p className="text-white text-xl font-black flex items-center gap-2 drop-shadow-md">
                        <Users className="w-6 h-6" /> 11,520
                     </p>
                  </div>
                  <div className="flex items-center gap-4 pointer-events-auto">
                     <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all shadow-xl">
                        <Camera className="w-5 h-5" />
                     </button>
                     <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all shadow-xl">
                        <Mic className="w-5 h-5" />
                     </button>
                     <div className="bg-white/20 backdrop-blur-md rounded-full px-5 py-2.5 text-white font-bold text-sm shadow-xl">
                        1:00 / 54 : 45
                     </div>
                     <button className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-full text-sm font-black shadow-xl transition-all active:scale-95">
                        End Live
                     </button>
                     <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all shadow-xl">
                        <Maximize2 className="w-5 h-5" />
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Comments Section */}
         <div className="space-y-10">
            <h3 className="text-2xl font-black text-[#1c1917] flex items-center gap-4 tracking-tight">
               <MessageSquare className="w-7 h-7" /> Comments ( 20,000 )
            </h3>

            <div className="space-y-12">
               {comments.map((c, idx) => (
                  <div key={idx} className="space-y-6">
                     <div className="flex items-start gap-5 group">
                        <img src={c.img} className="w-14 h-14 rounded-full border border-slate-200 shadow-md" alt="Avatar" />
                        <div className="flex-1">
                           <div className="flex items-center gap-4 mb-2">
                              <p className="text-[17px] font-black text-[#111827]">{c.name}</p>
                              <p className="text-[13px] font-bold text-slate-400">{c.time}</p>
                           </div>
                           <p className="text-base font-medium text-slate-600 leading-relaxed max-w-4xl">
                              {c.text}
                           </p>
                           <div className="flex items-center gap-8 mt-5">
                              {c.replies && (
                                 <button className="text-[14px] font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2">
                                    View replies ( 20 ) <ChevronDown className="w-4 h-4" />
                                 </button>
                              )}
                              <button className="text-[14px] font-black text-slate-800 hover:text-rose-500 transition-colors">
                                 Reply
                              </button>
                           </div>

                           {/* Nested Replies Mock */}
                           {c.replies && (
                              <div className="ml-10 mt-8 space-y-8 border-l-2 border-slate-100 pl-8">
                                 <div className="flex items-start gap-4">
                                    <img src="https://i.pravatar.cc/150?u=reply1" className="w-10 h-10 rounded-full border border-slate-200" alt="Avatar" />
                                    <div className="flex-1">
                                       <div className="flex items-center gap-4 mb-1.5">
                                          <p className="text-[15px] font-black text-[#111827]">Jane Doe</p>
                                          <p className="text-[12px] font-bold text-slate-400">5 min ago</p>
                                       </div>
                                       <p className="text-sm font-medium text-slate-600 leading-relaxed">
                                          I really appreciate the insights and perspective shared in this article. Thank you for writing and sharing!
                                       </p>
                                       <div className="flex items-center gap-6 mt-3">
                                          <button className="text-[12px] font-bold text-slate-400 hover:text-slate-600">View replies (20)</button>
                                          <button className="text-[12px] font-black text-slate-800">Reply</button>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               ))}
               <button className="text-[15px] font-black text-[#111827] hover:text-rose-500 transition-all border-b-2 border-[#111827] pb-1 uppercase tracking-widest ml-14">
                  Load More
               </button>
            </div>

            {/* Sticky Chat Input */}
            <div className="bg-white border border-slate-200/80 rounded-[28px] p-4 pl-8 flex items-center gap-6 shadow-xl sticky bottom-10 z-20">
               <Smile className="w-6 h-6 text-slate-400 cursor-pointer hover:text-rose-500 transition-colors" />
               <input 
                  type="text" 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Join the conversation ..." 
                  className="flex-1 bg-transparent text-base font-bold text-[#111827] outline-none" 
               />
               <button className="bg-[#f87171] hover:bg-[#ef4444] text-white px-10 py-3.5 rounded-full text-base font-black shadow-lg transition-all active:scale-95">
                  Send
               </button>
            </div>
         </div>

      </div>

    </div>
  );
}

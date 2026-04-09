"use client"
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/src/lib/api';
import { Camera, Edit, Share, Diamond, Zap, MessageSquare, ArrowLeft, Send, CheckCircle2, ChevronDown, Radio, ChevronRight, ChevronLeft } from 'lucide-react';
import BrandLogo from '@/src/components/BrandLogo';

export default function CreatorAboutPage() {
  const [creator, setCreator] = useState<any>(null);

  useEffect(() => {
    const fetchCreator = async () => {
       try {
          const res = await api.get('/creator/dashboard');
          setCreator(res.data.creator);
       } catch (err) {
          console.error("Error fetching creator:", err);
       }
    };
    fetchCreator();
  }, []);

  return (
    <div className="bg-[#fcfbf7] min-h-screen font-sans pb-20">
      
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-28 bg-white/60 backdrop-blur-xl border-b border-white px-12 z-[100] flex items-center justify-between">
         <div className="flex items-center gap-4">
                  <BrandLogo
                     iconSize={28}
                     className="inline-flex items-center gap-3"
                     textClassName="text-[24px] font-bold tracking-tight text-slate-800"
                  />
         </div>
         <div className="flex items-center gap-3">
            <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
               Log In
            </button>
            <Link href="/user/creator/post/checkout/upi" className="px-6 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
               Subscribe
            </Link>
            <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
               Membership
            </button>
            <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
               Chat
            </button>
         </div>
      </nav>

      {/* Main Content Area */}
      <div className="pt-32 p-12 max-w-7xl mx-auto space-y-16">
         
         {/* Hero Image Section */}
         <div className="relative rounded-[48px] overflow-hidden shadow-2xl aspect-[21/9] group">
            <img src={creator?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1600&q=80"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="About Hero" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
         </div>

         <div className="flex flex-col items-center text-center space-y-8">
            <h1 className="text-[100px] font-black text-[#1c1917] tracking-tighter leading-tight drop-shadow-sm flex items-center gap-8">
               <span className="text-[120px]">🎉</span> Hi, I'm {creator?.name?.split(' ')[0] || 'Oned'}
            </h1>
            <p className="text-3xl font-bold text-slate-600 tracking-tight leading-snug max-w-3xl">
               {creator?.bio || 'Welcome to my wonderland. I will be sharing some out of world content in my app. Do watch out for the monthly memberships.'}
            </p>
            <button className="px-12 py-4.5 bg-[#f87171] hover:bg-[#ef4444] text-white text-lg font-black rounded-full shadow-2xl transition-all active:scale-95 border-b-4 border-[#dc2626] tracking-tight">
               Brand Enquiry
            </button>
         </div>

         {/* Let's Connect Section */}
         <div className="bg-white border border-slate-200/50 rounded-[48px] p-12 shadow-2xl relative group">
            <div className="flex items-center justify-between mb-10">
               <h2 className="text-3xl font-black text-[#111827] tracking-tighter">Let's Connect</h2>
               <div className="flex gap-4">
                  <button className="w-10 h-10 border border-slate-200 rounded-full flex items-center justify-center text-slate-300 hover:text-rose-500 hover:border-rose-500 transition-all">
                     <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button className="w-10 h-10 border border-slate-200 rounded-full flex items-center justify-center text-slate-300 hover:text-rose-500 hover:border-rose-500 transition-all">
                     <ChevronRight className="w-6 h-6" />
                  </button>
               </div>
            </div>

            <div className="space-y-8 pb-10">
               <h3 className="text-lg font-black text-[#111827] opacity-80 uppercase tracking-widest leading-none">Transform your body in just 30 days with simple home workouts and a guided nutrition plan.</h3>
               <p className="text-lg font-medium text-slate-500 leading-relaxed max-w-5xl">
                  Build a routine that actually fits into your daily life with quick, effective workouts you can do from home. Each day is planned for you, so you don't have to think about what to do next. Along with workouts, you'll get simple nutrition guidance to help you eat better without strict dieting. The focus is on staying consistent, building healthy habits, and seeing real progress over 30 days. By the end, you'll feel stronger, more confident, and in control of your fitness.
               </p>
               <button className="px-10 py-4 bg-[#f87171] hover:bg-[#ef4444] text-white text-base font-black rounded-full shadow-lg transition-all active:scale-95 border-b-2 border-[#dc2626]">
                  Enroll Now For $ 400
               </button>
            </div>
         </div>

         {/* Memberships Section */}
         <div className="bg-white border border-slate-200/50 rounded-[48px] p-12 shadow-2xl relative group">
            <div className="flex items-center justify-between mb-10">
               <h2 className="text-3xl font-black text-[#111827] tracking-tighter">Memberships</h2>
               <div className="flex gap-4">
                  <button className="w-10 h-10 border border-slate-200 rounded-full flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all">
                     <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button className="w-10 h-10 border border-slate-200 rounded-full flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all">
                     <ChevronRight className="w-6 h-6" />
                  </button>
               </div>
            </div>

            <div className="space-y-8">
               <h3 className="text-lg font-black text-[#111827] opacity-80 uppercase tracking-widest leading-none">The Premium Club</h3>
               <p className="text-lg font-medium text-slate-500 leading-relaxed max-w-5xl">
                  Take your fitness journey to the next level with a more personalized and immersive experience. The Premium Membership is designed for those who want deeper guidance, consistent support, and faster results. Along with exclusive content, you'll get direct access to the creator through live sessions and priority support. Stay accountable with structured plans, regular check-ins, and a community that keeps you motivated. This is more than just access - it's a complete system to help you stay committed and see real progress.
               </p>
               
               <div className="py-6 space-y-4">
                  <h4 className="text-[17px] font-black text-[#1c1917] tracking-tight">Key Highlights / Benefits</h4>
                  <ul className="space-y-2.5">
                     {[
                       'Exclusive Premium Content – Access workouts and guides not available to regular users',
                       'Weekly Live Sessions – Join interactive sessions with direct guidance',
                       'Priority Support – Get your questions answered faster',
                       'Personal Progress Tracking – Stay on top of your journey with structured check-ins',
                       'Private Community Access – Connect with serious, like-minded members',
                       'Advanced Workout & Diet Plans – More detailed and result-focused guidance',
                       'Goal-Based Programs – Tailored plans for fat loss, strength, or endurance',
                       'Regular Content Updates – Fresh workouts and new challenges added frequently'
                     ].map((item, i) => (
                       <li key={i} className="flex items-start gap-3 text-[15px] font-bold text-slate-600">
                          <span className="text-rose-500 mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          <span>{item}</span>
                       </li>
                     ))}
                  </ul>
               </div>

               <button className="px-10 py-4 bg-[#f87171] hover:bg-[#ef4444] text-white text-base font-black rounded-full shadow-lg transition-all active:scale-95 border-b-2 border-[#dc2626]">
                  Buy Now For $ 1500
               </button>
            </div>
         </div>

      </div>

    </div>
  );
}

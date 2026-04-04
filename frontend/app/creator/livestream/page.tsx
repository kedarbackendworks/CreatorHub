"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Video, Camera, Mic, MicOff, CameraOff, User, Shield, MessageSquare, Bell, ShieldCheck, Upload } from 'lucide-react';
import api from '@/src/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CreateLivestreamPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Go live now');
  const [audience, setAudience] = useState('All members');
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  // Camera preview
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  // Start camera preview on mount
  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setCameraStream(stream);
        setCameraAllowed(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        setCameraError(true);
        setCameraAllowed(false);
      }
    };
    startCamera();

    return () => {
      stream?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // Bind stream to video element
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.type.startsWith('image/')) {
        toast.error('Thumbnail must be an image file');
        return;
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleStartLive = async () => {
    if (!title) return toast.error("Title is required");
    if (!file) return toast.error("Thumbnail image is required");
    
    setPublishing(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('audience', audience);
      formData.append('status', activeTab === 'Go live now' ? 'live' : 'scheduled');
      formData.append('scheduledTime', activeTab === 'Go live now' ? new Date().toISOString() : new Date(Date.now() + 86400000).toISOString());
      formData.append('file', file);

      const res = await api.post('/creator/livestreams', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Stop camera preview before navigating
      cameraStream?.getTracks().forEach(t => t.stop());

      toast.success("Livestream created!");

      if (activeTab === 'Go live now') {
        // Navigate to the active broadcast page
        router.push(`/creator/livestream/active?streamId=${res.data._id}&title=${encodeURIComponent(title)}`);
      } else {
        router.push('/creator');
      }
    } catch (err: any) {
      console.error("Livestream creation error:", err?.response?.data || err?.message || err);
      toast.error(err?.response?.data?.error || "Failed to start live.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row bg-[#f9f9f9] min-h-screen font-sans">
      
      {/* Left Column: Camera Preview */}
      <div className="flex-1 p-4 sm:p-6 lg:p-12 max-w-5xl border-r border-slate-200/60 overflow-y-auto">
         <header className="mb-12">
            <h1 className="text-[44px] font-bold text-[#1c1917] tracking-tight mb-2">Create a livestream</h1>
            <p className="text-2xl font-bold text-slate-600 tracking-tight leading-tight">
               Set up and schedule live sessions to connect with your audience in real time.
            </p>
         </header>

         {/* Camera Preview Container */}
         <div className="space-y-12">
            <div className="bg-[#1a1a1a] rounded-[32px] overflow-hidden shadow-2xl aspect-[16/9] relative flex flex-col items-center justify-center text-white/80 group">
               {cameraAllowed ? (
                 <video
                   ref={videoRef}
                   autoPlay
                   playsInline
                   muted
                   className="absolute inset-0 w-full h-full object-cover mirror"
                   style={{ transform: 'scaleX(-1)' }}
                 />
               ) : (
                 <>
                   <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
                      <CameraOff className="w-8 h-8 text-white" />
                   </div>
                   <p className="text-lg font-bold text-white mb-2 leading-relaxed max-w-sm text-center">
                      {cameraError ? 'Camera access denied' : 'Requesting camera access...'}
                   </p>
                   <p className="text-sm font-medium text-white/60 leading-relaxed max-w-xs text-center">
                      {cameraError ? 'Go to your browser settings to allow camera permissions.' : 'Please allow camera access when prompted.'}
                   </p>
                 </>
               )}
               
               {/* Camera/Mic control buttons */}
               <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-10">
                  <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1c1917] shadow-xl hover:scale-105 active:scale-95 transition-all">
                    <Camera className="w-5 h-5" />
                  </button>
                  <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1c1917] shadow-xl hover:scale-105 active:scale-95 transition-all">
                    <Mic className="w-5 h-5" />
                  </button>
               </div>

               {/* Live preview badge */}
               {cameraAllowed && (
                 <div className="absolute top-6 right-6 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                   Preview
                 </div>
               )}
            </div>
         </div>
      </div>

      {/* Right Column: Settings */}
      <aside className="hidden xl:block w-[380px] p-8 bg-white overflow-y-auto shrink-0 border-l border-slate-200/60 h-screen sticky top-0 shadow-sm">
         
         <button 
           onClick={handleStartLive}
           disabled={publishing}
           className="w-full py-4.5 bg-[#f87171] hover:bg-[#ef4444] text-white text-base font-black rounded-2xl shadow-xl transition-all mb-10 border-b-4 border-[#dc2626] disabled:opacity-50"
         >
            {publishing ? 'Starting...' : activeTab === 'Go live now' ? '🔴 Go Live Now' : 'Schedule Stream'}
         </button>

         <div className="space-y-10 pb-20">
            
            {/* Time Settings */}
            <div>
               <h4 className="text-sm font-bold text-[#111827] border-b border-slate-100 pb-5 mb-5 uppercase tracking-widest text-[11px] opacity-60">Choose a time</h4>
               <div className="space-y-3">
                  {['Go live now', 'Schedule for later'].map((t) => (
                    <div 
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${activeTab === t ? 'border-rose-500 bg-rose-50/20' : 'border-slate-100 bg-[#fbfbfb] hover:bg-slate-50'}`}
                    >
                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${activeTab === t ? 'border-rose-500' : 'border-slate-300'}`}>
                          {activeTab === t && <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>}
                       </div>
                       <span className="text-[13px] font-bold text-[#111827]">{t}</span>
                    </div>
                  ))}
               </div>

               {activeTab === 'Schedule for later' && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                     <div className="bg-white border border-slate-100 rounded-xl p-3 px-5 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">Date</p>
                        <p className="text-[14px] font-bold text-[#111827]">1 march, 2026</p>
                     </div>
                     <div className="bg-white border border-slate-100 rounded-xl p-3 px-5 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">Time</p>
                        <p className="text-[14px] font-bold text-[#111827]">10 : 00 am</p>
                     </div>
                  </div>
               )}
            </div>

            {/* Content Details */}
            <div>
               <h4 className="text-sm font-bold text-[#111827] border-b border-slate-100 pb-5 mb-5 uppercase tracking-widest text-[11px] opacity-60">About this live</h4>
               <div className="space-y-3">
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title" 
                    className="w-full bg-[#fbfbfb] border border-slate-100 rounded-xl px-5 py-4 text-[13px] font-bold text-[#111827] focus:outline-none focus:ring-1 focus:ring-rose-200" 
                  />
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description ( optional )" 
                    rows={4} 
                    className="w-full bg-[#fbfbfb] border border-slate-100 rounded-xl px-5 py-4 text-[13px] font-bold text-[#111827] focus:outline-none focus:ring-1 focus:ring-rose-200 resize-none" 
                  />
               </div>
            </div>

            {/* Audience Section */}
            <div>
               <h4 className="text-sm font-bold text-[#111827] border-b border-slate-100 pb-5 mb-5 uppercase tracking-widest text-[11px] opacity-60">Audience</h4>
               <div className="space-y-3">
                  {[
                    { id: 'All members', label: 'All members', icon: User },
                    { id: 'Paid access', label: 'Paid access', icon: Shield }
                  ].map((a) => (
                    <div 
                      key={a.id}
                      onClick={() => setAudience(a.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${audience === a.id ? 'border-rose-500 bg-rose-50/20' : 'border-slate-100 bg-[#fbfbfb] hover:bg-slate-50'}`}
                    >
                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${audience === a.id ? 'border-rose-500' : 'border-slate-300'}`}>
                          {audience === a.id && <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>}
                       </div>
                       <span className="text-[13px] font-bold text-[#111827]">{a.label}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* Thumbnail */}
            <div>
               <h4 className="text-sm font-bold text-[#111827] border-b border-slate-100 pb-5 mb-5 uppercase tracking-widest text-[11px] opacity-60">Add a thumbnail</h4>
               <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm mb-4 relative group cursor-pointer" onClick={() => document.getElementById('thumb-upload')?.click()}>
                  <img src={previewUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80"} className="w-full aspect-video object-cover" alt="Thumbnail preview" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="w-8 h-8 text-white" />
                  </div>
               </div>
               <input id="thumb-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
               <button 
                 onClick={() => document.getElementById('thumb-upload')?.click()}
                 className="w-full py-3 bg-[#fbfbfb] border border-slate-100 rounded-xl text-[13px] font-bold text-[#1c1917] hover:bg-white transition-all shadow-sm"
               >
                  {file ? 'Change Thumbnail' : 'Upload'}
               </button>
               {!file && (
                 <p className="mt-2 text-[11px] font-semibold text-[#ef4444]">Thumbnail is required to start or schedule a livestream.</p>
               )}
            </div>

            {/* Live Settings */}
            <div>
               <h4 className="text-sm font-bold text-[#111827] border-b border-slate-100 pb-5 mb-5 uppercase tracking-widest text-[11px] opacity-60">Live settings</h4>
               <div className="space-y-3">
                  {[
                    { label: 'Display chat', icon: MessageSquare },
                    { label: 'Emails and notifications', desc: 'Notify members via email and app when you schedule and start live', icon: Bell },
                    { label: 'Auto moderation', desc: 'Automatically helps filter spam, abuse and disruptive messages in your chats', icon: ShieldCheck }
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-[#fbfbfb] cursor-pointer hover:bg-slate-50 transition-all">
                       <div className="w-5 h-5 rounded-full border-2 border-slate-300 mt-1 shrink-0"></div>
                       <div>
                          <p className="text-[13px] font-bold text-[#111827]">{s.label}</p>
                          {s.desc && <p className="text-[11px] font-medium text-slate-400 mt-0.5 leading-relaxed">{s.desc}</p>}
                       </div>
                    </div>
                  ))}
               </div>
            </div>

         </div>
      </aside>

    </div>
  );
}

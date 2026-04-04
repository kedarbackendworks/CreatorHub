"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, MicOff, CameraOff, Users, MessageSquare, Send, Smile, Maximize2, AlertCircle } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSocket } from '@/src/hooks/useSocket';
import { useBroadcaster } from '@/src/hooks/useWebRTC';
import { useLiveChat } from '@/src/hooks/useLiveChat';
import { useAuthStore } from '@/src/store/useAuthStore';
import api from '@/src/lib/api';
import toast from 'react-hot-toast';

export default function ActiveLivestreamPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const streamId = searchParams.get('streamId');
  const streamTitle = searchParams.get('title') || 'Untitled Livestream';
  const user = useAuthStore((s) => s.user);

  const { socket, isConnected } = useSocket(streamId);
  const {
    localStream,
    viewerCount,
    isLive,
    isCameraOn,
    isMicOn,
    startBroadcast,
    stopBroadcast,
    toggleCamera,
    toggleMic,
  } = useBroadcaster(socket, streamId);
  const { messages, sendMessage } = useLiveChat(socket, streamId, user);

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [comment, setComment] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Bind local stream to video element
  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Auto-start broadcast when socket is connected
  useEffect(() => {
    if (isConnected && !hasStarted && socket && streamId) {
      startBroadcast()
        .then(() => {
          setHasStarted(true);
          // Update stream status to live via API
          api.put(`/livestream/${streamId}/start`).catch(() => {});
        })
        .catch(() => {
          toast.error('Failed to access camera/microphone');
        });
    }
  }, [isConnected, hasStarted, socket, streamId]);

  // Elapsed time counter
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => setElapsedTime((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const handleEndStream = async () => {
    stopBroadcast();
    try {
      await api.put(`/livestream/${streamId}/end`, { peakViewers: viewerCount });
    } catch {}
    toast.success('Stream ended');
    router.push('/creator');
  };

  const handleSendChat = () => {
    if (!comment.trim()) return;
    sendMessage(comment);
    setComment('');
  };

  if (!streamId) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-72px)] bg-[#f9f9f9]">
        <p className="text-lg font-bold text-slate-500">No stream ID provided. Please create a livestream first.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row bg-[#0f0f0f] min-h-[calc(100vh-72px)] lg:h-[calc(100vh-72px)] font-sans overflow-hidden">
      
      {/* Main Stream Area */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 relative min-w-0">
        
        {/* Connection Warning */}
        {!isConnected && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-amber-950 px-6 py-2 rounded-full font-bold shadow-2xl flex items-center gap-2 animate-bounce">
            <AlertCircle className="w-5 h-5" /> Connecting to server...
          </div>
        )}

        {/* Video Player Container */}
        <div className="relative w-full flex-1 bg-black rounded-[32px] overflow-hidden shadow-2xl group ring-1 ring-white/10">
          
          {localStream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 text-white/50">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <CameraOff className="w-10 h-10" />
              </div>
              <p className="text-xl font-bold tracking-tight">Camera is starting...</p>
            </div>
          )}
          
          {/* Top Gradient Overlay */}
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />
          
          {/* Bottom Gradient Overlay */}
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Top Bar Info */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
            <div className="flex items-center gap-4 bg-black/40 backdrop-blur-xl p-2 pr-6 rounded-full border border-white/10 shadow-2xl">
                <img 
                  src={user?.avatar || 'https://i.pravatar.cc/150?u=creator'} 
                  className="w-12 h-12 rounded-full border-2 border-slate-700/50 object-cover" 
                  alt="Creator" 
                />
                <div>
                  <h2 className="text-white text-base font-black leading-tight drop-shadow-md line-clamp-1 max-w-[200px]">
                      {decodeURIComponent(streamTitle)}
                  </h2>
                  <p className="text-white/60 text-[12px] font-bold tracking-wide mt-0.5">{user?.name || 'Creator'}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl">
                 <Users className="w-4 h-4 text-white/80" />
                 <span className="text-white font-black text-sm">{viewerCount.toLocaleString()}</span>
              </div>
              {isLive ? (
                <div className="bg-[#f95c4b] text-white px-4 py-2 rounded-full text-xs font-black shadow-lg shadow-red-500/20 flex items-center gap-2 uppercase tracking-wider">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" /> Live
                </div>
              ) : (
                <div className="bg-white/20 text-white backdrop-blur-md px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">
                    Starting...
                </div>
              )}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 pointer-events-auto opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-full flex items-center gap-2 shadow-2xl">
              <button 
                onClick={toggleCamera}
                title={isCameraOn ? "Turn off camera" : "Turn on camera"}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isCameraOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500/80 hover:bg-red-500 text-white'}`}
              >
                {isCameraOn ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
              </button>
              
              <button 
                onClick={toggleMic}
                title={isMicOn ? "Mute mic" : "Unmute mic"}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMicOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500/80 hover:bg-red-500 text-white'}`}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
            </div>

            <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-full flex items-center justify-center text-white/90 font-mono font-bold text-sm tracking-widest shadow-2xl min-w-[90px]">
              {formatTime(elapsedTime)}
            </div>

            <button 
              onClick={handleEndStream}
              className="bg-[#f95c4b] hover:bg-[#e04534] text-white px-8 py-3.5 rounded-full text-sm font-black shadow-2xl transition-all active:scale-95 uppercase tracking-wide flex items-center gap-2"
            >
              End Stream
            </button>

          </div>
        </div>
      </div>

      {/* Right Chat Sidebar */}
      <div className="w-full lg:w-[380px] xl:w-[420px] bg-[#141414] border-l border-white/5 flex flex-col shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-10 max-h-[50vh] lg:max-h-none">
         
         <div className="h-[72px] border-b border-white/5 px-6 flex items-center justify-between shrink-0 bg-[#18181b]">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
               <MessageSquare className="w-5 h-5 text-slate-400" /> Live Chat
            </h3>
            <span className="text-xs font-black text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              {messages.length} msgs
            </span>
         </div>

         {/* Chat Messages */}
         <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide flex flex-col relative bg-[#141414]">
            {messages.length === 0 ? (
              <div className="m-auto text-center flex flex-col items-center justify-center text-white/30 space-y-4">
                <MessageSquare className="w-12 h-12 opacity-40" />
                <p className="text-sm font-medium px-8 leading-relaxed">Say hi to your viewers! Messages will appear here.</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className="flex gap-4 animate-in fade-in slide-in-from-bottom-2">
                  <img 
                    src={msg.avatar || 'https://i.pravatar.cc/150?u=' + msg.userId} 
                    className="w-8 h-8 rounded-full border border-white/10 shrink-0 mt-0.5" 
                    alt="User" 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[13px] font-black text-white/90 truncate">{msg.userName}</span>
                      <span className="text-[10px] font-bold text-white/30 shrink-0">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[14px] text-white/70 leading-relaxed font-medium break-words">
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} className="h-4 shrink-0" />
         </div>

         {/* Chat Input */}
         <div className="p-4 bg-[#18181b] border-t border-white/5 shrink-0">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Say something to your viewers..." 
                className="w-full bg-[#202024] text-white text-sm font-medium rounded-2xl pl-12 pr-14 py-4 focus:outline-none focus:ring-1 focus:ring-white/20 border border-white/5 placeholder:text-white/30 transition-shadow transition-colors"
                maxLength={200}
              />
              <Smile className="absolute left-4 w-5 h-5 text-white/40 cursor-pointer hover:text-white transition-colors" />
              <button 
                onClick={handleSendChat}
                disabled={!comment.trim()}
                className="absolute right-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-white/10 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 -ml-0.5" />
              </button>
            </div>
         </div>
         
      </div>

    </div>
  );
}

"use client"
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Heart, MessageSquare, Eye, MoreHorizontal, User, Send, Loader2, Lock, Edit3, Trash2, Reply, X, CornerDownRight } from 'lucide-react';
import api from '@/src/lib/api';
import toast from 'react-hot-toast';

export default function CreatorPostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [allComments, setAllComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState<any>(null); // { id: string, name: string }

  const fetchData = async () => {
    try {
      const [postRes, commentRes] = await Promise.all([
        api.get(`/creator/posts/${id}`),
        api.get(`/user/posts/${id}/comments`)
      ]);
      setPost(postRes.data);
      setAllComments(commentRes.data);
    } catch (err: any) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  // Hierarchal comment sorting
  const threadedComments = useMemo(() => {
     const commentsMap: Record<string, any> = {};
     allComments.forEach(c => {
        commentsMap[c._id] = { ...c, replies: [] };
     });

     const threads: any[] = [];
     allComments.forEach(c => {
        if (c.parentComment && commentsMap[c.parentComment]) {
           commentsMap[c.parentComment].replies.push(commentsMap[c._id]);
        } else {
           threads.push(commentsMap[c._id]);
        }
     });

     return threads;
  }, [allComments]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmittingComment(true);
    try {
      const payload = { 
        content: newComment,
        parentCommentId: replyingTo ? replyingTo.id : null
      };

      const res = await api.post(`/user/posts/${id}/comments`, payload);
      setAllComments(prev => [...prev, res.data]);
      setNewComment('');
      setReplyingTo(null);
      toast.success(replyingTo ? "Reply posted!" : "Comment posted!");
    } catch (err) {
      toast.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
     if (!window.confirm("Delete this post?")) return;
     try {
        await api.delete(`/creator/posts/${id}`);
        toast.success("Post deleted");
        router.push('/creator');
     } catch (err) {
        toast.error("Failed to delete");
     }
  };

  const cancelReply = () => {
     setReplyingTo(null);
     setNewComment('');
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#f9f9f9]"><Loader2 className="w-10 h-10 animate-spin text-rose-500" /></div>;
  if (!post) return <div className="p-20 text-center font-bold text-slate-500 bg-[#f9f9f9] min-h-screen">Post not found.</div>;

  return (
    <div className="bg-[#f9f9f9] min-h-screen font-sans pb-20">
       <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-10">
             <button onClick={() => router.push('/creator')} className="flex items-center gap-2.5 text-sm font-black text-slate-400 hover:text-slate-900 transition-all group font-['Fjalla One'] uppercase tracking-widest">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
             </button>
             <div className="flex gap-3">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all text-slate-600 font-bold text-xs shadow-sm uppercase tracking-widest">
                   <Edit3 className="w-4 h-4" /> Edit Post
                </button>
                <button onClick={handleDelete} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-full hover:bg-rose-50 hover:text-rose-600 transition-all text-slate-500 font-bold text-xs shadow-sm uppercase tracking-widest">
                   <Trash2 className="w-4 h-4" /> Delete
                </button>
             </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
             
             {/* Left: Content Area (Full display of post) */}
             <div className="w-full lg:flex-1 space-y-8">
                <div className="bg-white border border-slate-200/60 rounded-[48px] overflow-hidden shadow-2xl">
                   {/* Media Container */}
                   <div className="relative aspect-video bg-black flex items-center justify-center group">
                      {post.mediaType === 'video' ? (
                        <video src={post.mediaUrl} controls className="w-full h-full object-contain" poster={post.thumbnailUrl} />
                      ) : (
                        <img src={post.mediaUrl} className="w-full h-full object-cover" alt={post.title} />
                      )}
                      
                      {post.isExclusive && (
                        <div className="absolute top-8 left-8 px-5 py-2.5 bg-black/50 backdrop-blur-xl rounded-full text-white text-[10px] font-black uppercase tracking-[3px] border border-white/20 shadow-2xl flex items-center gap-2.5 animate-pulse">
                           <Lock className="w-4 h-4" /> Exclusive Access
                        </div>
                      )}
                   </div>

                   {/* Post Info */}
                   <div className="p-10 md:p-14">
                      <div className="flex items-center gap-2 text-rose-500 font-black text-[12px] uppercase tracking-[4px] mb-6">
                         <span className="w-8 h-px bg-rose-500 rounded-full"></span>
                         {post.mediaType} Release
                      </div>
                      <h1 className="text-[54px] font-black text-[#1c1917] mb-8 font-['Fjalla One'] uppercase leading-[0.9] tracking-tighter whitespace-pre-wrap">{post.title}</h1>
                      
                      <div className="max-w-2xl">
                         <p className="text-[19px] font-medium text-slate-600 leading-relaxed tracking-tight">
                            {post.description || 'No description provided.'}
                         </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-10 mt-14 pt-10 border-t border-slate-100">
                         <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Global Reach</span>
                            <div className="flex items-center gap-2.5 text-[#1c1917] font-black text-2xl font-['Fjalla One']"><Eye className="w-5 h-5 text-rose-500" /> {post.views}</div>
                         </div>
                         <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Fan Affinity</span>
                            <div className="flex items-center gap-2.5 text-[#1c1917] font-black text-2xl font-['Fjalla One']"><Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> {post.likes}</div>
                         </div>
                         <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Conversations</span>
                            <div className="flex items-center gap-2.5 text-[#1c1917] font-black text-2xl font-['Fjalla One']"><MessageSquare className="w-5 h-5 text-rose-500" /> {allComments.length}</div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Performance Analytics Card */}
                <div className="bg-[#1c1917] rounded-[48px] p-10 md:p-14 shadow-2xl text-white relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[100px] rounded-full group-hover:bg-rose-500/20 transition-all duration-700"></div>
                   
                   <div className="relative z-10">
                      <div className="flex items-center justify-between mb-10">
                         <h3 className="text-2xl font-black font-['Fjalla One'] uppercase tracking-widest">Performance Matrix</h3>
                         <div className="px-5 py-2 bg-white/10 rounded-full text-rose-400 text-[10px] font-black tracking-widest uppercase border border-white/10">Live Analytics</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-10">
                         <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Member Conversion</p>
                            <p className="text-5xl font-black font-['Fjalla One'] tracking-tighter">14.8%</p>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                               <div className="w-[14.8%] h-full bg-rose-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.5)]"></div>
                            </div>
                         </div>
                         <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Post Revenue</p>
                            <p className="text-5xl font-black font-['Fjalla One'] tracking-tighter text-emerald-400">${post.revenue?.total || 0}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Direct + Memberships</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Right: Modern Scrollable Engagement Panel */}
             <div className="w-full lg:w-[460px] shrink-0 space-y-6">
                <div className="bg-white border border-slate-200/60 rounded-[48px] shadow-2xl flex flex-col h-[850px] sticky top-8">
                   
                   <div className="px-10 py-10 border-b border-slate-100 flex items-center justify-between">
                      <div className="space-y-1">
                         <h2 className="text-3xl font-black text-[#1c1917] font-['Fjalla One'] uppercase tracking-tight">ENGAGEMENT</h2>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Viewer discussion ({allComments.length})</p>
                      </div>
                   </div>
                   
                   {/* Filtered Threaded Comments */}
                   <div className="flex-1 overflow-y-auto px-10 py-8 space-y-10 scrollbar-hide">
                      {threadedComments.length > 0 ? threadedComments.map((comment: any) => (
                        <div key={comment._id} className="group space-y-4">
                           <div className="flex gap-5">
                              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center font-black text-rose-500 uppercase shrink-0 overflow-hidden shadow-sm">
                                 {comment.user?.avatar ? <img src={comment.user.avatar} className="w-full h-full object-cover" /> : (comment.user?.name?.charAt(0) || 'U')}
                              </div>
                              <div className="flex-1">
                                 <div className="bg-slate-50/70 border border-slate-100 rounded-3xl p-5 hover:bg-white hover:border-rose-100 hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                       <p className="text-sm font-black text-[#111827] uppercase tracking-tight">{comment.user?.name || 'Anonymous'}</p>
                                       <p className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase whitespace-nowrap">{new Date(comment.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <p className="text-[15px] font-medium text-slate-700 leading-snug tracking-tight">{comment.content}</p>
                                    
                                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                                       <button 
                                         onClick={() => { setReplyingTo({ id: comment._id, name: comment.user?.name }); setNewComment(''); }}
                                         className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-rose-500 transition-all uppercase tracking-widest"
                                       >
                                          <Reply className="w-3 h-3" /> Reply
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* Replies Indented */}
                           {comment.replies && comment.replies.length > 0 && (
                             <div className="ml-16 space-y-4">
                                {comment.replies.map((reply: any) => (
                                  <div key={reply._id} className="flex gap-4">
                                     <div className="pt-2"><CornerDownRight className="w-4 h-4 text-slate-200" /></div>
                                     <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-400 text-xs uppercase shrink-0 overflow-hidden">
                                        {reply.user?.avatar ? <img src={reply.user.avatar} className="w-full h-full object-cover" /> : (reply.user?.name?.charAt(0) || 'U')}
                                     </div>
                                     <div className="flex-1">
                                        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                                           <div className="flex items-center justify-between mb-1">
                                              <p className="text-xs font-black text-[#111827] uppercase">{reply.user?.name || 'Anonymous'}</p>
                                              <p className="text-[9px] font-bold text-slate-400 uppercase">{new Date(reply.createdAt).toLocaleDateString()}</p>
                                           </div>
                                           <p className="text-sm font-medium text-slate-600 leading-tight">{reply.content}</p>
                                        </div>
                                     </div>
                                  </div>
                                ))}
                             </div>
                           )}
                        </div>
                      )) : (
                        <div className="text-center py-24 text-slate-300">
                           <MessageSquare className="w-16 h-16 mx-auto mb-6 opacity-5" />
                           <p className="text-sm font-black uppercase tracking-[3px]">Zero Noise Detected</p>
                           <p className="text-[10px] font-bold uppercase mt-2">Start the conversation below</p>
                        </div>
                      )}
                   </div>

                   {/* Floating Reply/Post Input */}
                   <div className="px-10 py-10 border-t border-slate-100 bg-white rounded-b-[48px] relative z-20">
                      
                      {replyingTo && (
                        <div className="flex items-center justify-between bg-rose-50 px-5 py-3 rounded-2xl mb-4 border border-rose-100 animate-in slide-in-from-bottom-2 duration-300">
                           <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>
                              <p className="text-[11px] font-black text-rose-700 uppercase tracking-widest">Replying to <span className="underline decoration-2 underline-offset-4">{replyingTo.name}</span></p>
                           </div>
                           <button onClick={cancelReply} className="p-1 hover:bg-rose-100 rounded-full transition-colors"><X className="w-4 h-4 text-rose-500" /></button>
                        </div>
                      )}

                      <div className="relative">
                         <textarea 
                           value={newComment}
                           onChange={(e) => setNewComment(e.target.value)}
                           placeholder={replyingTo ? "Compose your response..." : "Join the discussion..."}
                           className="w-full bg-[#fcfcfc] border border-slate-200 rounded-[32px] pl-7 pr-20 py-6 text-[15px] font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-300 transition-all resize-none min-h-[72px] max-h-40 shadow-inner placeholder:text-slate-300 placeholder:font-black placeholder:uppercase placeholder:text-[11px] placeholder:tracking-widest"
                         />
                         <button 
                           onClick={handleAddComment}
                           disabled={submittingComment || !newComment.trim()}
                           className="absolute right-3.5 top-3.5 p-4.5 bg-rose-500 hover:bg-rose-600 text-white rounded-3xl shadow-xl shadow-rose-500/20 transition-all active:scale-90 disabled:opacity-50 group flex items-center justify-center p-4.5"
                         >
                            {submittingComment ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
                         </button>
                      </div>
                      <p className="text-[9px] font-black text-slate-300 mt-4 text-center uppercase tracking-[2px]">Posting as {api.defaults.headers.common['Authorization'] ? 'Authenticated Creator' : 'Public user'}</p>
                   </div>
                </div>
             </div>

          </div>
       </div>
    </div>
  );
}

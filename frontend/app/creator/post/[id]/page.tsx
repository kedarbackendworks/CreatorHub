"use client"
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Heart, MessageSquare, Eye, MoreHorizontal, User, Send, Loader2, Lock, Edit3, Trash2, Reply, X, CornerDownRight, Calendar, UserCheck } from 'lucide-react';
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
        if (c.parentComment && typeof c.parentComment === 'string' && commentsMap[c.parentComment]) {
           commentsMap[c.parentComment].replies.push(commentsMap[c._id]);
        } else if (c.parentComment && typeof c.parentComment === 'object' && commentsMap[c.parentComment._id]) {
            commentsMap[c.parentComment._id].replies.push(commentsMap[c._id]);
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

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]"><Loader2 className="w-10 h-10 animate-spin text-rose-500" /></div>;
  if (!post) return <div className="p-20 text-center font-bold text-slate-400 bg-[#f8fafc] min-h-screen">Post not found.</div>;

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-32">
       
       {/* Top Navigation */}
       <div className="bg-white border-b border-slate-200/60 sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
             <button onClick={() => router.push('/creator')} className="flex items-center gap-3 text-[13px] font-black text-slate-400 hover:text-slate-900 transition-all font-['Fjalla One'] uppercase tracking-[0.2em] group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Dashboard
             </button>
             <div className="flex gap-4">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-white transition-all shadow-sm">
                   <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={handleDelete} className="flex items-center gap-2 px-6 py-2.5 bg-rose-50 border border-rose-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-100 transition-all shadow-sm">
                   <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
             </div>
          </div>
       </div>

       <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
          
          {/* Post Content Header Section */}
          <section className="space-y-10">
             <div className="bg-white border border-slate-200/60 rounded-[48px] overflow-hidden shadow-2xl shadow-slate-200/50">
                {/* Media Stage */}
                <div className="relative aspect-video bg-[#0f172a] flex items-center justify-center overflow-hidden">
                   {post.mediaType === 'video' ? (
                     <video src={post.mediaUrl} controls className="w-full h-full object-contain" poster={post.thumbnailUrl} />
                   ) : (
                     <img src={post.mediaUrl} className="w-full h-full object-cover" alt={post.title} />
                   )}
                   
                   {post.isExclusive && (
                     <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-xl px-5 py-2.5 border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-[3px] shadow-2xl flex items-center gap-3">
                        <Lock className="w-4 h-4" /> Member Exclusive
                     </div>
                   )}
                </div>

                <div className="p-12 md:p-20">
                   <div className="flex items-center gap-4 text-rose-500 font-black text-[11px] uppercase tracking-[0.3em] mb-10">
                      <Calendar className="w-4 h-4" /> Released {new Date(post.createdAt).toLocaleDateString()}
                   </div>

                   <h1 className="text-[64px] font-black text-[#1c1917] mb-10 font-['Fjalla One'] uppercase leading-[0.85] tracking-tight whitespace-pre-wrap max-w-3xl">
                      {post.title}
                   </h1>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-slate-100">
                      <div className="md:col-span-2">
                         <p className="text-[20px] font-medium text-slate-600 leading-relaxed font-sans max-w-xl">
                            {post.description || 'No description provided.'}
                         </p>
                      </div>
                      <div className="space-y-8">
                         <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Revenue</span>
                            <span className="text-3xl font-black text-emerald-500 font-['Fjalla One']">${post.revenue?.total || 0}</span>
                         </div>
                         <div className="flex gap-10">
                            <div>
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Impressions</span>
                               <span className="text-2xl font-black text-[#1c1917] font-['Fjalla One'] flex gap-2 items-center"><Eye className="w-4 h-4 text-rose-500" /> {post.views}</span>
                            </div>
                            <div>
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Likes</span>
                               <span className="text-2xl font-black text-[#1c1917] font-['Fjalla One'] flex gap-2 items-center"><Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> {post.likes}</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </section>

          {/* Engagement / Discussion Section BELOW the content */}
          <section className="space-y-12">
             <div className="flex items-center justify-between pl-6">
                <div className="space-y-1">
                   <h2 className="text-[36px] font-black text-[#1c1917] font-['Fjalla One'] uppercase tracking-tight">Viewer Discussion</h2>
                   <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">{allComments.length} Reactions total</p>
                </div>
             </div>

             {/* Threaded Discussion Container */}
             <div className="bg-white border border-slate-200/60 rounded-[48px] shadow-xl overflow-hidden">
                <div className="p-10 md:p-16 space-y-12">
                   
                   {threadedComments.length > 0 ? threadedComments.map((comment: any) => (
                     <div key={comment._id} className="group animate-in fade-in duration-500 slide-in-from-bottom-4">
                        <div className="flex gap-8">
                           <div className="w-16 h-16 rounded-3xl bg-[#fef2f2] border border-rose-100 flex items-center justify-center font-black text-rose-500 text-xl uppercase shrink-0 overflow-hidden shadow-lg shadow-rose-500/5 mt-1">
                              {comment.user?.avatar ? <img src={comment.user.avatar} className="w-full h-full object-cover" alt="U" /> : (comment.user?.name?.charAt(0) || 'U')}
                           </div>
                           <div className="flex-1 space-y-4">
                              <div className="bg-[#f8fafc] border border-slate-100/80 rounded-[32px] p-8 hover:bg-white hover:border-rose-200 hover:shadow-2xl transition-all duration-300 relative">
                                 <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                       <p className="text-base font-black text-[#1c1917] uppercase tracking-tight group-hover:text-rose-500 transition-colors">{comment.user?.name || 'Anonymous Fan'}</p>
                                       {comment.user?._id === post.creatorId?.userId && (
                                         <span className="bg-rose-500 text-white text-[8px] font-black p-1 px-2 rounded-md uppercase tracking-widest shadow-lg shadow-rose-500/30">Creator</span>
                                       )}
                                    </div>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{new Date(comment.createdAt).toLocaleDateString()}</p>
                                 </div>
                                 <p className="text-lg font-medium text-slate-600 leading-snug tracking-tight mb-8">
                                    {comment.content}
                                 </p>
                                 <button 
                                   onClick={() => { 
                                     setReplyingTo({ id: comment._id, name: comment.user?.name });
                                     const input = document.getElementById('comment-input');
                                     input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                     input?.focus();
                                   }}
                                   className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-white border border-slate-200 rounded-full text-[11px] font-black text-slate-500 uppercase tracking-widest hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm"
                                 >
                                    <Reply className="w-3.5 h-3.5" /> Post Reply
                                 </button>
                              </div>

                              {/* Nested Replies */}
                              {comment.replies && comment.replies.length > 0 && (
                                <div className="ml-10 md:ml-20 space-y-8 pt-4 border-l-2 border-slate-100 pl-10 md:pl-12">
                                   {comment.replies.map((reply: any) => (
                                     <div key={reply._id} className="flex gap-6 animate-in slide-in-from-left-4 duration-300">
                                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-300 text-sm uppercase shrink-0 overflow-hidden shadow-sm">
                                           {reply.user?.avatar ? <img src={reply.user.avatar} className="w-full h-full object-cover" /> : (reply.user?.name?.charAt(0) || 'U')}
                                        </div>
                                        <div className="flex-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                           <div className="flex items-center justify-between mb-2">
                                              <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{reply.user?.name || 'Anonymous'}</p>
                                              <p className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{new Date(reply.createdAt).toLocaleDateString()}</p>
                                           </div>
                                           <p className="text-[15px] font-medium text-slate-500 leading-relaxed">{reply.content}</p>
                                        </div>
                                     </div>
                                   ))}
                                </div>
                              )}
                           </div>
                        </div>
                     </div>
                   )) : (
                     <div className="py-32 text-center">
                        <MessageSquare className="w-24 h-24 text-slate-100 mx-auto mb-10" />
                        <h4 className="text-2xl font-black text-slate-200 uppercase tracking-[0.2em]">Broadcast your first reply</h4>
                        <p className="text-slate-300 text-xs font-black uppercase mt-4 tracking-widest">The audience is waiting for your engagement</p>
                     </div>
                   )}
                </div>

                {/* Fixed/Sticky Bottom Reply Bar */}
                <div id="comment-input" className="p-12 md:p-16 border-t border-slate-100 bg-[#fafafa]">
                   {replyingTo && (
                     <div className="flex items-center justify-between bg-rose-500 text-white px-8 py-4 rounded-3xl mb-8 shadow-xl shadow-rose-500/20 animate-in slide-in-from-bottom-8 duration-500">
                        <div className="flex items-center gap-4">
                           <UserCheck className="w-5 h-5" />
                           <p className="text-[13px] font-black uppercase tracking-widest">Compose response to <span className="underline underline-offset-8 decoration-2">{replyingTo.name}</span></p>
                        </div>
                        <button onClick={() => setReplyingTo(null)} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors"><X className="w-4 h-4" /></button>
                     </div>
                   )}

                   <div className="relative">
                      <textarea 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={replyingTo ? "Write your direct reply..." : "Broadcast a new comment..."}
                        className="w-full bg-white border border-slate-200 rounded-[40px] px-10 py-10 text-[18px] font-medium text-slate-800 focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-200 transition-all resize-none shadow-2xl placeholder:text-slate-300 placeholder:font-black placeholder:uppercase placeholder:text-xs placeholder:tracking-[0.4em]"
                        rows={3}
                      />
                      <button 
                        onClick={handleAddComment}
                        disabled={submittingComment || !newComment.trim()}
                        className="absolute bottom-6 right-6 p-6 bg-rose-500 hover:bg-[#c93d1f] text-white rounded-3xl shadow-2xl shadow-rose-500/40 transition-all active:scale-90 disabled:opacity-50 group grow-0"
                      >
                         {submittingComment ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                      </button>
                   </div>
                   <div className="flex justify-center gap-10 mt-8 opacity-40">
                      <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest"><Lock className="w-3 h-3" /> Encrypted Transaction</div>
                      <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest"><User className="w-3 h-3" /> Direct Engagement</div>
                   </div>
                </div>
             </div>
          </section>

       </main>
    </div>
  );
}

"use client"

import React, { useState, useEffect } from 'react';
import { MoreVertical, Search, Filter, Globe, Lock, Clock, FileText, Image as ImageIcon, Video, Radio, Trash2, Edit3, Eye, X, Check } from 'lucide-react';
import api from '@/src/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ContentLibraryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Published');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  const fetchLibrary = async () => {
    try {
      const res = await api.get('/creator/posts');
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching library:", err);
      toast.error("Failed to load library");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const filteredPosts = posts.filter((post: any) => {
    if (activeTab === 'Published') return post.status === 'published' || !post.status;
    if (activeTab === 'Drafts') return post.status === 'draft';
    if (activeTab === 'Scheduled') return post.status === 'scheduled';
    return true;
  });

  const handleDeletePost = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/creator/posts/${id}`);
      setPosts(posts.filter((p: any) => p._id !== id));
      toast.success("Post deleted successfully");
    } catch (err) {
      toast.error("Failed to delete post");
    }
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put(`/creator/posts/${editingPost._id}`, editingPost);
      setPosts(posts.map((p: any) => p._id === res.data._id ? res.data : p));
      toast.success("Post updated!");
      setIsEditing(false);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase() || '') {
      case 'image': return <ImageIcon className="w-4 h-4 text-slate-400" />;
      case 'video': return <Video className="w-4 h-4 text-slate-400" />;
      case 'livestream': return <Radio className="w-4 h-4 text-slate-400" />;
      default: return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };

  return (
    <div className="p-12 max-w-7xl w-full mx-auto font-sans bg-[#f9f9f9] min-h-screen" onClick={() => setActiveMenu(null)}>
      
      <header className="mb-10">
        <h1 className="text-[44px] font-bold text-[#1c1917] tracking-tight mb-2">Content Library</h1>
        <p className="text-2xl font-bold text-slate-600 tracking-tight leading-tight">Manage your published, draft, and scheduled posts in one place.</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-slate-200/60 mb-8">
        {['Published', 'Scheduled', 'Drafts'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-[15px] font-bold pb-4 border-b-2 transition-all duration-200 ${activeTab === tab ? 'text-rose-500 border-rose-500' : 'text-slate-400 hover:text-slate-600 border-transparent'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 font-bold">Loading your library...</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#fafaf9] border-b border-slate-200">
              <tr>
                <th className="px-8 py-6 text-sm font-bold text-[#1c1917] w-1/3">Title</th>
                <th className="px-8 py-6 text-sm font-bold text-[#1c1917]">
                  {activeTab === 'Drafts' ? 'Last edited' : activeTab === 'Scheduled' ? 'Release date' : 'Publish date'}
                </th>
                <th className="px-8 py-6 text-sm font-bold text-[#1c1917]">Access</th>
                <th className="px-8 py-6 text-sm font-bold text-[#1c1917]">Price</th>
                <th className="px-8 py-6 text-sm font-bold text-[#1c1917]">Post type</th>
                <th className="px-8 py-6 text-sm font-bold text-[#1c1917] text-right pr-12">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filteredPosts.map((item: any) => (
                <tr key={item._id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-5">
                      <img src={item.thumbnailUrl || item.mediaUrl || 'https://via.placeholder.com/100'} alt="Post" className="w-14 h-12 object-cover rounded-xl border border-slate-200 shadow-sm" />
                      <span className="text-[15px] font-bold text-[#1c1917] group-hover:text-rose-500 transition-colors leading-tight">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      {!item.isExclusive ? <Globe className="w-4 h-4 text-emerald-500" /> : <Lock className="w-4 h-4 text-rose-400" />}
                      <span className="text-sm font-bold text-slate-700">{item.isExclusive ? 'Paid' : 'Public'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-[#1c1917]">${item.price || 0}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 capitalize">
                      {getTypeIcon(item.mediaType)}
                      <span className="text-sm font-medium text-slate-600">{item.mediaType}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right relative pr-8">
                    <button onClick={(e) => toggleMenu(item._id, e)} className="p-2 text-slate-300 hover:text-slate-800 transition-all hover:scale-110 active:scale-90">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {activeMenu === item._id && (
                       <div className="absolute right-0 top-10 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-[100] animate-in fade-in zoom-in duration-200 origin-top-right">
                          <button 
                            onClick={() => router.push(`/creator/post/${item._id}`)}
                            className="w-full px-6 py-3 text-left text-sm font-bold text-[#1c1917] hover:bg-slate-50 flex items-center gap-3 transition-colors"
                          >
                              View post
                          </button>
                          <button 
                            onClick={() => { setEditingPost(item); setIsEditing(true); }}
                            className="w-full px-6 py-3 text-left text-sm font-bold text-[#1c1917] hover:bg-slate-50 flex items-center gap-3 transition-colors"
                          >
                              Edit post
                          </button>
                          <button 
                            onClick={() => handleDeletePost(item._id)}
                            className="w-full px-6 py-3 text-left text-sm font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-3 transition-colors"
                          >
                              Delete post
                          </button>
                       </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPosts.length === 0 && <div className="py-20 text-center font-bold text-slate-400">No content found in this category.</div>}
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && editingPost && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
           <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
              <header className="px-10 py-8 border-b border-slate-100 flex justify-between items-center">
                 <h2 className="text-2xl font-black text-[#1c1917] tracking-tighter">Edit Post</h2>
                 <button onClick={() => setIsEditing(false)} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </header>
              <form onSubmit={handleUpdatePost} className="p-10 space-y-8">
                 <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Title</label>
                    <input 
                      type="text" 
                      value={editingPost.title}
                      onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                      className="w-full bg-[#fbfbf9] border border-slate-200 rounded-2xl px-6 py-4 text-base font-bold focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Price ($)</label>
                        <input 
                          type="number" 
                          value={editingPost.price}
                          onChange={(e) => setEditingPost({ ...editingPost, price: e.target.value })}
                          className="w-full bg-[#fbfbf9] border border-slate-200 rounded-2xl px-6 py-4 text-base font-bold focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Visibility Status</label>
                        <select 
                          value={editingPost.status}
                          onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value })}
                          className="w-full bg-[#fbfbf9] border border-slate-200 rounded-2xl px-6 py-4 text-base font-bold focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                        >
                           <option value="published">Published</option>
                           <option value="draft">Draft</option>
                           <option value="scheduled">Scheduled</option>
                        </select>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 bg-[#fbfbf9] p-6 rounded-2xl border border-slate-200">
                    <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${editingPost.isExclusive ? 'bg-rose-500' : 'bg-slate-300'}`} onClick={() => setEditingPost({ ...editingPost, isExclusive: !editingPost.isExclusive })}>
                       <div className={`w-4 h-4 bg-white rounded-full transition-transform ${editingPost.isExclusive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                    <div>
                       <p className="text-sm font-bold text-[#1c1917]">Make this content exclusive</p>
                       <p className="text-xs font-bold text-slate-400">Only paid members will see this</p>
                    </div>
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-4.5 bg-slate-100 text-slate-700 text-base font-bold rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
                    <button type="submit" className="flex-1 py-4.5 bg-[#f87171] text-white text-base font-black rounded-2xl shadow-xl border-b-4 border-[#dc2626] hover:bg-[#ef4444] transition-all">Save Changes</button>
                 </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}

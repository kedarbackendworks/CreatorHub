"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit2, Archive, Trash2, Eye, MessageCircle, Heart, Search, Image as ImageIcon, Video, Calendar, MoreVertical, ShieldCheck, FileWarning, ExternalLink, Loader2 } from 'lucide-react';

export default function ManagePosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/admin/posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/admin/posts/${id}`);
      setPosts(posts.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete post');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-64px)]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Manage Posts</h2>
          <p className="text-slate-400 mt-1">Edit your content, track engagement, or delete posts.</p>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full sm:w-72 md:w-64 pl-10 pr-3 py-2 bg-[#111827] border border-slate-800 rounded-xl text-sm placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="text-xs uppercase bg-[#1e293b] text-slate-400 border-b border-slate-800">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Post</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Performance</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-sans">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      <Archive className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>No posts found.</p>
                    </td>
                  </tr>
                ) : filteredPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700">
                          {post.mediaType === 'image' ? (
                            <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
                          ) : (
                            <video src={post.mediaUrl} className="w-full h-full object-cover" />
                          )}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            {post.mediaType === 'video' ? <Video className="w-5 h-5 text-white/80" /> : <ImageIcon className="w-5 h-5 text-white/80" />}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-white text-base max-w-[200px] truncate" title={post.title}>
                            {post.title}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 text-xs font-medium">
                        <div className="flex items-center gap-1.5" title="Views">
                          <Eye className="w-4 h-4 text-blue-400" />
                          <span className="text-slate-300">{(post.views / 1000).toFixed(1)}k</span>
                        </div>
                        <div className="flex items-center gap-1.5" title="Likes">
                          <Heart className="w-4 h-4 text-rose-400" />
                          <span className="text-slate-300">{(post.likes / 1000).toFixed(1)}k</span>
                        </div>
                        <div className="flex items-center gap-1.5" title="Comments">
                          <MessageCircle className="w-4 h-4 text-amber-400" />
                          <span className="text-slate-300">{post.comments}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {post.isExclusive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Exclusive
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <ExternalLink className="w-3.5 h-3.5" />
                          Public
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 bg-slate-800 hover:bg-indigo-500 hover:text-white text-slate-400 rounded-lg transition-colors" title="Edit Post">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(post._id)}
                          className="p-2 bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 rounded-lg transition-colors"
                          title="Delete Post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-500 hover:text-slate-300 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setDeleteId(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4 mx-auto md:mx-0">
              <FileWarning className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-center md:text-left">Delete this post?</h3>
            <p className="text-slate-400 text-sm mb-6 text-center md:text-left">
              This action cannot be undone. This post will be permanently removed from your profile and feed.
            </p>
            <div className="flex flex-col-reverse md:flex-row gap-3 md:justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-rose-500/20"
              >
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client"

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, Image as ImageIcon, Video, X, CheckCircle2, Loader2 } from 'lucide-react';

export default function NewPost() {
  const [postType, setPostType] = useState<'image' | 'video'>('image');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isExclusive, setIsExclusive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('mediaType', postType);
    formData.append('isExclusive', isExclusive.toString());

    try {
      await axios.post('http://localhost:5001/api/admin/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            // limit to 95% until response completes for visual continuity
            setUploadProgress(percentCompleted > 95 ? 95 : percentCompleted);
          }
        }
      });
      setUploadProgress(100);
      alert('Post published successfully!');

      // reset form
      setTitle('');
      setDescription('');
      setFile(null);
      setPreviewUrl(null);
      setUploadProgress(0);
    } catch (err) {
      console.error(err);
      alert('Error publishing post. Check if backend is running.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Create New Post</h2>
        <p className="text-slate-400 mt-1">Share your latest content with your audience.</p>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
        {/* Post Type Selector */}
        <div className="flex p-1 bg-slate-900 rounded-xl mb-8 w-max border border-slate-800">
          <button
            type="button"
            onClick={() => { setPostType('image'); handleRemoveFile(); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${postType === 'image' ? 'bg-[#1e293b] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'} `}
          >
            <ImageIcon className="w-4 h-4" /> Image Post
          </button>
          <button
            type="button"
            onClick={() => { setPostType('video'); handleRemoveFile(); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${postType === 'video' ? 'bg-[#1e293b] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'} `}
          >
            <Video className="w-4 h-4" /> Video Post
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Upload Media</label>

            {!previewUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-indigo-500 hover:bg-slate-800/30 transition-all rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full bg-slate-800 group-hover:bg-indigo-500/20 flex items-center justify-center mb-4 transition-colors">
                  <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-indigo-400" />
                </div>
                <h4 className="text-lg font-medium text-white mb-1">Click to upload</h4>
                <p className="text-sm text-slate-500 text-center">
                  {postType === 'image' ? 'SVG, PNG, JPG or GIF (max. 800x400px)' : 'MP4, WebM or OGG (max. 50MB)'}
                </p>
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept={postType === 'image' ? "image/*" : "video/*"}
                  required
                />
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-900 flex justify-center items-center p-4">
                {postType === 'image' ? (
                  <img src={previewUrl} alt="Preview" className="max-h-[400px] object-contain rounded" />
                ) : (
                  <video src={previewUrl} controls className="max-h-[400px] rounded" />
                )}
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute top-4 right-4 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Post Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Give your post a catchy title"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Tell your fans more about this post..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <input
              type="checkbox"
              id="exclusive"
              checked={isExclusive}
              onChange={e => setIsExclusive(e.target.checked)}
              className="w-5 h-5 rounded border-slate-700 text-indigo-500 focus:ring-indigo-500/50 bg-slate-900 accent-indigo-500"
            />
            <label htmlFor="exclusive" className="text-sm font-medium text-indigo-300 cursor-pointer select-none">
              Make this post exclusive to paying subscribers
            </label>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Uploading to Cloudinary...</span>
                <span className="font-medium text-indigo-400">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 font-sans">
            <button
              type="submit"
              disabled={isUploading || !file}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:shadow-none flex items-center gap-2"
            >
              {isUploading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Publishing...</>
              ) : (
                <><CheckCircle2 className="w-5 h-5" /> Publish Post</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

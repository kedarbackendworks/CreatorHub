"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, Globe, Hash, PlaySquare, Save, Link as LinkIcon, CheckCircle2, Loader2 } from 'lucide-react';

export default function SocialLinks() {
  const [links, setLinks] = useState({
    instagram: '',
    facebook: '',
    twitter: '',
    tiktok: ''
  });

  const [saving, setSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/admin/social-links');
      if (res.data) setLinks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (platform: string) => {
    setSaving(platform);
    try {
      await axios.post('http://localhost:5001/api/admin/social-links', {
        platform,
        url: links[platform as keyof typeof links]
      });
      // Optionally show a toast here
    } catch (err) {
      console.error(err);
      alert('Failed to save link');
    } finally {
      setSaving(null);
    }
  };

  const platforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Camera,
      color: 'from-pink-500 to-orange-400',
      bgColor: 'bg-pink-500/10',
      textColor: 'text-pink-500',
      placeholder: 'https://instagram.com/username'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Globe,
      color: 'from-blue-600 to-blue-400',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-500',
      placeholder: 'https://facebook.com/username'
    },
    {
      id: 'twitter',
      name: 'Twitter (X)',
      icon: Hash,
      color: 'from-slate-800 to-slate-600',
      bgColor: 'bg-slate-500/10',
      textColor: 'text-slate-400',
      placeholder: 'https://twitter.com/username'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: PlaySquare, // Using generic icon
      color: 'from-teal-500 to-rose-500',
      bgColor: 'bg-teal-500/10',
      textColor: 'text-teal-400',
      placeholder: 'https://tiktok.com/@username'
    }
  ];

  if (loading) {
    return <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto flex justify-center items-center h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-64px)]">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Social Links</h2>
        <p className="text-slate-400 mt-1">Connect your other platforms to cross-promote your content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map(platform => {
          const Icon = platform.icon;
          const isSaving = saving === platform.id;
          const hasLink = !!links[platform.id as keyof typeof links];

          return (
            <div key={platform.id} className="bg-[#111827] border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition-colors">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${platform.color} opacity-[0.03] rounded-bl-full group-hover:opacity-[0.08] transition-opacity`}></div>

              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${platform.bgColor} ${platform.textColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {platform.name}
                    {hasLink && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </h3>
                  <p className="text-sm text-slate-500">Link your {platform.name} profile</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-5 w-5 text-slate-600" />
                  </div>
                  <input
                    type="url"
                    value={links[platform.id as keyof typeof links] || ''}
                    onChange={(e) => setLinks({ ...links, [platform.id]: e.target.value })}
                    placeholder={platform.placeholder}
                    className="block w-full pl-10 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all sm:text-sm"
                  />
                </div>

                <div className="flex justify-end pt-2 text-sans font-medium">
                  <button
                    onClick={() => handleSave(platform.id)}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800/50 text-white px-5 py-2.5 rounded-xl text-sm transition-colors"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isSaving ? 'Saving...' : 'Save Link'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

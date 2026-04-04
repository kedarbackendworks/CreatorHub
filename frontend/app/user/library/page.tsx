'use client';

import React, { useEffect, useState } from 'react';
import DashboardSidebar from '@/src/components/UserDashboard/DashboardSidebar';
import LibraryCard from '@/src/components/UserDashboard/LibraryCard';
import api from '@/src/lib/api';
import toast from 'react-hot-toast';

export default function LibraryPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get('/user/favorites');
        setFavorites(res.data);
      } catch (err) {
        console.error("Error fetching library:", err);
        toast.error("Failed to load your library");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg,#f6f4f1)] flex relative overflow-x-hidden">
      <DashboardSidebar />
      
      <main className="flex-1 md:ml-[240px] px-4 sm:px-6 md:pl-[42px] md:pr-[42px] pt-20 md:pt-[42px] flex flex-col items-start">
        <div className="w-full max-w-[1116px] flex flex-col items-start min-h-screen">
          
          <div className="flex flex-col gap-[4px] mb-[32px] w-full">
            <h1 className="font-[family-name:var(--font-fjalla)] font-normal text-[40px] text-[var(--heading,#1a1a1a)] tracking-[0.8px] leading-[57.6px]">
              Your Library
            </h1>
            <div className="flex justify-between items-center w-full">
              <p className="font-[family-name:var(--font-fjalla)] font-normal text-[24px] text-[var(--sub-head,#3a3a3a)] tracking-[0.66px] leading-[1.2]">
                View and access all the posts and content you’ve bookmarked.
              </p>
              <p className="font-[family-name:var(--font-figtree)] text-[#5a5a5a] text-[16px]">
                {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-[300px] w-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F95C4B]"></div>
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] w-full mb-[42px]">
              {favorites.map((post) => (
                <LibraryCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] w-full bg-white rounded-[24px] border border-dashed border-[#e4ded2]">
              <div className="relative size-[64px] mb-4 opacity-20">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="#1a1a1a"/>
                </svg>
              </div>
              <p className="font-[family-name:var(--font-figtree)] text-[18px] font-medium text-[#1a1a1a]">Your library is empty</p>
              <p className="font-[family-name:var(--font-figtree)] text-[#5a5a5a] mt-2 text-center">Start favoriting posts to see them here!</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}


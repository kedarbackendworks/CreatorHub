'use client';

import React, { useEffect, useState } from 'react';
import CreatorCard from './CreatorCard';
import api from '@/src/lib/api';

interface CreatorFeedProps {
  activeCategory: string;
}

export default function CreatorFeed({ activeCategory }: CreatorFeedProps) {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await api.get('/user/creators');
        setCreators(response.data);
      } catch (error) {
        console.error('Error fetching creators:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, []);

  if (loading) {
    return <div className="mt-20 text-center w-full text-zinc-500">Loading creators...</div>;
  }

  const filteredCreators = activeCategory === 'All' 
    ? creators 
    : creators.filter((c: any) => c.category === activeCategory);

  return (
    <div className="flex flex-col gap-[14px] sm:gap-[16px] w-full max-w-[1116px] mt-8 sm:mt-10 md:mt-[48px] pb-[64px]">
      <h3 className="font-[family-name:var(--font-figtree)] font-semibold leading-[29.2px] text-[#3a3a3a] text-[19px] tracking-[0.38px] mb-[4px]">
        {activeCategory === 'All' ? 'All Creators' : `${activeCategory} Creators`}
      </h3>
      
      {filteredCreators.length > 0 ? (
        filteredCreators.map((creator: any) => (
          <CreatorCard key={creator._id} creator={creator} />
        ))
      ) : (
        <div className="bg-[#fcfaf7] border border-dashed border-[#e4ded2] rounded-[12px] p-8 sm:p-14 md:p-20 text-center text-zinc-500">
          No creators found in this category yet.
        </div>
      )}

    </div>
  );
}

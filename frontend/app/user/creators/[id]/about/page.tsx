'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { use } from 'react';
import DashboardSidebar from '@/src/components/UserDashboard/DashboardSidebar';
import ProfileBanner from '@/src/components/CreatorProfile/ProfileBanner';
import ProfileHeader from '@/src/components/CreatorProfile/ProfileHeader';
import ProfileActions from '@/src/components/CreatorProfile/ProfileActions';
import ConnectedLinks from '@/src/components/CreatorProfile/ConnectedLinks';
import ContentTabs from '@/src/components/CreatorProfile/ContentTabs';
import CreatorAbout from '@/src/components/CreatorProfile/CreatorAbout';
import api from '@/src/lib/api';

export default function CreatorAboutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const res = await api.get(`/user/creators/${id}`);
        setCreator(res.data);
      } catch (err) {
        console.error("Error fetching creator:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCreator();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#f6f4f1] flex items-center justify-center">Loading...</div>;
  if (!creator) return <div className="min-h-screen bg-[#f6f4f1] flex items-center justify-center">Creator not found</div>;

  return (
    <div className="flex min-h-screen bg-[#f6f4f1] w-full">
      <DashboardSidebar />

      <main className="flex-1 flex flex-col md:pl-[240px] pt-20 md:pt-0 relative w-full overflow-x-hidden">
        <ProfileBanner bannerUrl={creator.banner || '/assets/creator/banner.png'} />

        <div className="relative px-[42px] pt-[92px] pb-[64px] flex flex-col w-full max-w-[1400px]">
          <div className="absolute left-[42px] top-[-72px] rounded-[68px] w-[140px] h-[140px] border-4 border-[#f6f4f1] shadow-sm z-10 shrink-0 bg-white overflow-hidden">
            <Image 
              src={creator.avatar || "/assets/creator/avatar.png"} 
              alt={creator.name || "Avatar"} 
              fill 
              className="object-cover" 
            />
          </div>

          <div className="flex flex-col items-start w-full relative">
            <div className="absolute right-[42px] top-[-48px]">
              <ProfileActions creatorId={creator._id} creatorUserId={creator.userId} creatorName={creator.name} isInitialSubscribed={creator.isSubscribed} />
            </div>

            <div className="flex flex-col gap-[24px] items-start w-full mt-[16px]">
              <div className="flex flex-col gap-[24px] shrink-0 w-full max-w-[400px]">
                <ProfileHeader 
                  name={creator.name} 
                  bio={creator.bio} 
                  category={creator.category}
                  membersCount={creator.membersCount}
                  postsCount={creator.postsCount}
                  averageRating={creator.averageRating}
                />
                <ConnectedLinks socialLinks={creator.socialLinks} />
              </div>

              <div className="flex flex-col gap-[24px] items-start w-full mt-[24px]">
                <ContentTabs defaultTab="about" creatorId={id as string} />
                <CreatorAbout creator={creator} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { CreatorProfileHeader } from '@/src/components/admin/creators/detail/CreatorProfileHeader';
import { CreatorStatsRow } from '@/src/components/admin/creators/detail/CreatorStatsRow';
import { DetailTabs, type DetailTabId } from '@/src/components/admin/creators/detail/DetailTabs';
import { ProfileSummaryCard } from '@/src/components/admin/creators/detail/ProfileSummaryCard';
import { ContentPerformanceCard } from '@/src/components/admin/creators/detail/ContentPerformanceCard';
import { RecentActivityCard } from '@/src/components/admin/creators/detail/RecentActivityCard';
import { CreatorContentTable } from '@/src/components/admin/creators/detail/CreatorContentTable';
import { CreatorEarningsTable } from '@/src/components/admin/creators/detail/CreatorEarningsTable';
import { CreatorPayoutsTable } from '@/src/components/admin/creators/detail/CreatorPayoutsTable';
import { creatorDetails, activityItems, contentPerformance, creatorContentData, creatorEarningsData, creatorPayoutsData } from '@/src/data/creatorDetailData';

export default function CreatorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const creatorId = Number(params?.id);
  const creator = creatorDetails[creatorId];

  const [activeTab, setActiveTab] = useState<DetailTabId>('overview');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!creator) {
    return (
      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", padding: 'clamp(12px, 2.8vw, 24px)', background: '#F5F5F8', minHeight: 'calc(100vh - 56px)' }}>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <div className="flex flex-col items-center justify-center gap-4" style={{ paddingTop: 120 }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#6B7280' }}>Creator not found</p>
          <button
            onClick={() => router.push('/admin/creators')}
            className="flex items-center gap-2"
            style={{ fontSize: 13, fontWeight: 600, color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <ArrowLeft size={14} /> Back to Creators
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes detailFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .detail-animate { opacity: 0; }
        .detail-animate.visible { animation: detailFadeUp 0.4s ease forwards; }
      `}</style>

      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", padding: 'clamp(12px, 2.8vw, 24px)', background: '#F5F5F8', minHeight: 'calc(100vh - 56px)' }}>

        {/* Back button */}
        <div className={`detail-animate mb-5 ${mounted ? 'visible' : ''}`} style={{ animationDelay: '0s' }}>
          <button
            onClick={() => router.push('/admin/creators')}
            className="flex items-center gap-2"
            style={{
              fontSize: 13, fontWeight: 600, color: '#6B7280', background: 'none',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#111827')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
          >
            <ArrowLeft size={15} /> Back to Creators
          </button>
        </div>

        {/* Profile Header */}
        <div className={`detail-animate ${mounted ? 'visible' : ''}`} style={{ animationDelay: '0.05s' }}>
          <CreatorProfileHeader creator={creator} />
        </div>

        {/* Stats Row */}
        <div className={`detail-animate ${mounted ? 'visible' : ''}`} style={{ animationDelay: '0.1s' }}>
          <CreatorStatsRow creator={creator} />
        </div>

        {/* Tabs */}
        <div className={`detail-animate ${mounted ? 'visible' : ''}`} style={{ animationDelay: '0.15s' }}>
          <DetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className={`grid grid-cols-1 lg:grid-cols-5 gap-5 detail-animate ${mounted ? 'visible' : ''}`} style={{ animationDelay: '0.2s' }}>
            {/* Left column: Profile Summary + Content Performance */}
            <div className="lg:col-span-3">
              <ProfileSummaryCard creator={creator} />
              <ContentPerformanceCard data={contentPerformance} />
            </div>

            {/* Right column: Recent Activity */}
            <div className="lg:col-span-2">
              <RecentActivityCard items={activityItems} />
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className={`detail-animate ${mounted ? 'visible' : ''}`} style={{ animationDelay: '0.2s' }}>
            <CreatorContentTable contentItems={creatorContentData} />
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className={`detail-animate ${mounted ? 'visible' : ''}`} style={{ animationDelay: '0.2s' }}>
            <CreatorEarningsTable earningsItems={creatorEarningsData} />
          </div>
        )}

        {activeTab === 'payouts' && (
          <div className={`detail-animate ${mounted ? 'visible' : ''}`} style={{ animationDelay: '0.2s' }}>
            <CreatorPayoutsTable payoutItems={creatorPayoutsData} />
          </div>
        )}
      </div>
    </>
  );
}

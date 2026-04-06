"use client";

import React, { useState, useMemo } from 'react';
import { BarChartCard } from '@/src/components/admin/creators/BarChartCard';
import { LineChartCard } from '@/src/components/admin/creators/LineChartCard';
import { CreatorGrowthChartCard } from '@/src/components/admin/creators/CreatorGrowthChartCard';
import { EngagementStatsCard } from '@/src/components/admin/creators/EngagementStatsCard';
import { CreatorsTable } from '@/src/components/admin/creators/CreatorsTable';

import {
  totalCreatorsChartData,
  activeCreatorsChartData,
  retentionRateChartData,
  analyticsActiveCreatorsData,
  creatorGrowthData,
  creatorsTableData,
  type TabId,
  type StatusFilter,
  type SortOption,
  type Creator,
} from '@/src/data/creatorsData';

const ROWS_PER_PAGE = 7;

export default function CreatorAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [sortFilter, setSortFilter] = useState<SortOption>('Newest');
  const [currentPage, setCurrentPage] = useState(1);

  const handleTabChange = (tab: TabId) => { setActiveTab(tab); setCurrentPage(1); };
  const handleStatusChange = (s: StatusFilter) => { setStatusFilter(s); setCurrentPage(1); };
  const handleSortChange = (s: SortOption) => { setSortFilter(s); setCurrentPage(1); };

  const filteredCreators = useMemo(() => {
    let data: Creator[] = [...creatorsTableData];

    if (activeTab === 'verified') data = data.filter(c => c.verified);
    else if (activeTab === 'top') data = data.sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    else if (activeTab === 'suspended') data = data.filter(c => c.status === 'Inactive');

    if (statusFilter !== 'All') data = data.filter(c => c.status === statusFilter);

    if (sortFilter === 'Newest') data = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    else if (sortFilter === 'Oldest') data = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    else if (sortFilter === 'Revenue ↑') data = [...data].sort((a, b) => a.revenue - b.revenue);
    else if (sortFilter === 'Revenue ↓') data = [...data].sort((a, b) => b.revenue - a.revenue);

    return data;
  }, [activeTab, statusFilter, sortFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCreators.length / ROWS_PER_PAGE));
  const pagedCreators = filteredCreators.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes cardFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", padding: 'clamp(12px, 2.8vw, 24px)', background: '#F5F5F8', minHeight: 'calc(100vh - 56px)' }}>
        
        {/* Header */}
        <div style={{ animation: 'cardFadeUp 0.6s ease-out 0ms both' }} className="mb-6">
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Creator Analytics
          </h1>
          <p style={{ fontSize: 13, color: '#6B7280' }}>
            Track performance, growth, and engagement of creators across the platform
          </p>
        </div>

        {/* Row 1: Total Revenue and Avg Rev / Creator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <BarChartCard
            label="Total Revenue"
            value="24,580"
            badge="+5%"
            badgeType="positive"
            description="Total Users Growth"
            subDescription="How many user using this website"
            chartData={totalCreatorsChartData}
            barColor="#111827"
            delay={50}
          />
          <LineChartCard
            label="Avg Rev / Creator"
            value="3,120"
            badge="+5%"
            badgeType="positive"
            description="Active Creators"
            subDescription="How many Creators using the website"
            chartData={activeCreatorsChartData}
            delay={100}
          />
        </div>

        {/* Row 2: Retention Rate and Active Creators */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <LineChartCard
            label="Retention Rate"
            value="8,450"
            badge="-5%"
            badgeType="negative"
            description="Pending Payouts"
            subDescription="Give us the no of Subscriptions in website"
            chartData={retentionRateChartData}
            delay={150}
          />
          <BarChartCard
            label="Active Creators"
            value="₹12,40,000"
            badge="+5%"
            badgeType="positive"
            description="Total Monthly Revenue"
            subDescription="Give you the number of revenue you get"
            chartData={analyticsActiveCreatorsData}
            barColor="#111827"
            delay={200}
          />
        </div>

        {/* Row 3: Creator Growth and Engagement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <CreatorGrowthChartCard data={creatorGrowthData} delay={250} />
          <EngagementStatsCard delay={300} />
        </div>

        {/* Creators Table */}
        <div style={{ animation: 'cardFadeUp 0.6s ease-out 350ms both' }}>
          <CreatorsTable
            creators={pagedCreators}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            statusFilter={statusFilter}
            sortFilter={sortFilter}
            onStatusChange={handleStatusChange}
            onSortChange={handleSortChange}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
}

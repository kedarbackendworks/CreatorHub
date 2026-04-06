"use client";

import React, { useState, useMemo } from 'react';
import { CreatorsHeader } from '@/src/components/admin/creators/CreatorsHeader';
import { StatsGrid } from '@/src/components/admin/creators/StatsGrid';
import { BarChartCard } from '@/src/components/admin/creators/BarChartCard';
import { LineChartCard } from '@/src/components/admin/creators/LineChartCard';
import { DualLineChartCard } from '@/src/components/admin/creators/DualLineChartCard';
import { CreatorsTable } from '@/src/components/admin/creators/CreatorsTable';

import {
  totalCreatorsChartData,
  activeCreatorsChartData,
  verifiedCreatorsChartData,
  topRevenueChartData,
  creatorsTableData,
  type TabId,
  type StatusFilter,
  type SortOption,
  type Creator,
} from '@/src/data/creatorsData';

const ROWS_PER_PAGE = 7;

export default function CreatorsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [sortFilter, setSortFilter] = useState<SortOption>('Newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page on filter change
  const handleTabChange = (tab: TabId) => { setActiveTab(tab); setCurrentPage(1); };
  const handleStatusChange = (s: StatusFilter) => { setStatusFilter(s); setCurrentPage(1); };
  const handleSortChange = (s: SortOption) => { setSortFilter(s); setCurrentPage(1); };

  // Filtering & sorting logic — single source of truth
  const filteredCreators = useMemo(() => {
    let data: Creator[] = [...creatorsTableData];

    // Tab filtering
    switch (activeTab) {
      case 'verified':
        data = data.filter(c => c.verified);
        break;
      case 'top':
        data = data.sort((a, b) => b.revenue - a.revenue).slice(0, 5);
        break;
      case 'suspended':
        data = data.filter(c => c.status === 'Inactive');
        break;
      default:
        break;
    }

    // Status dropdown filtering
    if (statusFilter !== 'All') {
      data = data.filter(c => c.status === statusFilter);
    }

    // Sorting
    switch (sortFilter) {
      case 'Newest':
        data = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'Oldest':
        data = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'Revenue ↑':
        data = [...data].sort((a, b) => a.revenue - b.revenue);
        break;
      case 'Revenue ↓':
        data = [...data].sort((a, b) => b.revenue - a.revenue);
        break;
    }

    return data;
  }, [activeTab, statusFilter, sortFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredCreators.length / ROWS_PER_PAGE));
  const pagedCreators = filteredCreators.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", padding: 'clamp(12px, 2.8vw, 24px)', background: '#F5F5F8', minHeight: 'calc(100vh - 56px)' }}>
        <CreatorsHeader />

        {/* Row 1: Total Creators + Active Creators */}
        <StatsGrid>
          <BarChartCard
            label="Total Creators"
            value="24,580"
            badge="+5%"
            badgeType="positive"
            description="Total Users Growth"
            subDescription="How many user using the website"
            chartData={totalCreatorsChartData}
            barColor="#374151"
            delay={0}
          />
          <LineChartCard
            label="Active Creators"
            value="3,120"
            badge="+5%"
            badgeType="positive"
            description="Active Creators"
            subDescription="How many Creators using the website"
            chartData={activeCreatorsChartData}
            delay={80}
          />
        </StatsGrid>

        {/* Row 2: Verified Creators + Top Revenue */}
        <StatsGrid>
          <DualLineChartCard
            label="Verified Creators"
            value="850"
            badge="+5%"
            badgeType="positive"
            description="Total Monthly Revenue"
            subDescription="Give you the number of revenue you get"
            chartData={verifiedCreatorsChartData}
            delay={160}
          />
          <BarChartCard
            label="Top Revenue Creators"
            value="₹ 15.2M"
            badge="+5%"
            badgeType="positive"
            description="Pending Payouts"
            subDescription="Give us the no of Subscriptions in website"
            chartData={topRevenueChartData}
            barColor="#FB7185"
            delay={240}
          />
        </StatsGrid>

        {/* Creators Table */}
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
    </>
  );
}

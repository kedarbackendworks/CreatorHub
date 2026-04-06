'use client';

import React, { useState, useEffect } from 'react';
import { RevenueStatCard } from '@/src/components/admin/revenue/RevenueStatCard';
import { RevenueTrendChart } from '@/src/components/admin/revenue/RevenueTrendChart';
import { InsightAndActivityCards } from '@/src/components/admin/revenue/InsightAndActivityCards';
import { TransactionsTable } from '@/src/components/admin/revenue/TransactionsTable';
import {
  totalRevenueData,
  platformCommissionData,
  refundAmountData,
  pendingPayoutsData,
  revenueTransactionsData,
} from '@/src/data/revenueData';

export default function RevenuePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes detailFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .detail-animate { opacity: 0; }
        .detail-animate.visible { animation: detailFadeUp 0.6s ease-out forwards; }
      `}</style>

      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", padding: 'clamp(12px, 2.8vw, 24px)', background: '#F5F5F8', minHeight: 'calc(100vh - 56px)' }}>
        
        {/* Header */}
        <div className={`detail-animate mb-6 ${mounted ? 'visible' : ''}`} style={{ animationDelay: '0ms' }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Revenue
          </h1>
          <p style={{ fontSize: 13, color: '#6B7280' }}>
            Track and optimize creator payment streams across your platform.
          </p>
        </div>

        {/* Row 1: Line Charts */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 ${mounted ? 'visible' : 'opacity-0'}`}>
          <RevenueStatCard
            label="Total Revenue"
            value="₹ 4,82,500"
            badge="+5%"
            variant="line"
            chartData={totalRevenueData}
            primaryColor="#FCA5A5" // light pink
            footerText="+12.4% vs last month"
            footerTrend="positive"
            delay={50}
          />
          <RevenueStatCard
            label="Platform Commission"
            value="₹ 48,250"
            badge="+5%"
            variant="line"
            chartData={platformCommissionData}
            primaryColor="#FCA5A5" // light pink
            footerText="+5.2% vs last month"
            footerTrend="positive"
            delay={100}
          />
        </div>

        {/* Row 2: Bar Charts */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 ${mounted ? 'visible' : 'opacity-0'}`}>
          <RevenueStatCard
            label="Refund Amount"
            value="₹ 12,400"
            badge="+5%"
            badgeType="negative"
            variant="bar"
            chartData={refundAmountData}
            primaryColor="#EA580C"
            footerText="-2.1% improvement"
            footerTrend="negative"
            delay={150}
          />
          <RevenueStatCard
            label="Pending Payouts"
            value="₹ 1,20,000"
            badge="+5%"
            variant="bar"
            chartData={pendingPayoutsData}
            primaryColor="#111827"
            footerText="14 Payouts Pending"
            footerTrend="positive"
            delay={200}
          />
        </div>

        {/* Row 3: Revenue Trend */}
        <div className={`mb-4 ${mounted ? 'visible' : 'opacity-0'}`}>
          <RevenueTrendChart data={totalRevenueData} delay={250} />
        </div>

        {/* Row 4: Insight and Activity */}
        <div className={mounted ? 'visible' : 'opacity-0'}>
          <InsightAndActivityCards delay={300} />
        </div>

        {/* Row 5: Transactions */}
        <div className={`mt-4 ${mounted ? 'visible' : 'opacity-0'}`}>
          <TransactionsTable transactions={revenueTransactionsData} delay={400} />
        </div>

      </div>
    </>
  );
}

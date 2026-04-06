"use client"

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Flag, FileCheck, AlertTriangle } from 'lucide-react';
import api from '@/src/lib/api';

/* ───────────────────── UTILS ───────────────────── */

const revenueBarGradient = (index: number, total: number) => {
  const ratio = index / (total - 1);
  const r = Math.round(209 + (31 - 209) * ratio);
  const g = Math.round(213 + (41 - 213) * ratio);
  const b = Math.round(219 + (55 - 219) * ratio);
  return `rgb(${r},${g},${b})`;
};

/* ───────────────────── COMPONENT ───────────────────── */

export default function Dashboard() {
  const [revenuePeriod, setRevenuePeriod] = useState<'monthly' | 'weekly'>('monthly');
  const [alertVisible, setAlertVisible] = useState(true);
  const [alertFading, setAlertFading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mount animation trigger
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Fetch Dashboard API Data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setDashboardData(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const dismissAlert = () => {
    setAlertFading(true);
    setTimeout(() => setAlertVisible(false), 400);
  };

  if (loading) {
    return (
      <div className="p-6 w-full min-h-[calc(100vh-64px)] bg-[#F5F5F8] flex items-center justify-center">
        <p className="text-[#6B7280] font-medium animate-pulse">Loading dashboard data...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6 w-full min-h-[calc(100vh-64px)] bg-[#F5F5F8] flex items-center justify-center">
        <p className="text-[#DC2626] font-medium">Failed to load dashboard data. Please try again later.</p>
      </div>
    );
  }

  // Construct dynamic data structure from API payload
  const statCards = [
    {
      label: 'Total Users',
      value: dashboardData.users?.count || '0',
      badge: dashboardData.users?.growth || '0%',
      badgeType: (dashboardData.users?.growth?.includes('-') ? 'red' : 'green') as 'red' | 'green',
      chartData: dashboardData.users?.data || [],
      barColor: '#F97316',
      title: 'Total Users Growth',
      desc: 'How many user using the website',
    },
    {
      label: 'Active Creators',
      value: dashboardData.creators?.count || '0',
      badge: dashboardData.creators?.growth || '0%',
      badgeType: (dashboardData.creators?.growth?.includes('-') ? 'red' : 'green') as 'red' | 'green',
      chartData: dashboardData.creators?.data || [],
      barColor: '#1F2937',
      title: 'Active Creators',
      desc: 'How many Creators using the website',
    },
    {
      label: 'Monthly Revenue',
      value: dashboardData.revenue?.count || '0',
      badge: dashboardData.revenue?.growth || '0%',
      badgeType: (dashboardData.revenue?.growth?.includes('-') ? 'red' : 'green') as 'red' | 'green',
      chartData: dashboardData.revenue?.data || [],
      barColor: '#1F2937',
      title: 'Total Monthly Revenue',
      desc: 'Give you the number of revenue you get',
    },
    {
      label: 'Pending Payouts',
      value: dashboardData.subscriptions?.count || '0', // Mapping from seed data logic
      badge: dashboardData.subscriptions?.growth || '0%',
      badgeType: (dashboardData.subscriptions?.growth?.includes('-') ? 'red' : 'green') as 'red' | 'green',
      chartData: dashboardData.subscriptions?.data || [],
      barColor: '#F97316',
      title: 'Pending Payouts',
      desc: 'Show case the pending payouts',
    },
  ];

  const revenueData = revenuePeriod === 'monthly' ? (dashboardData.revenueOverTime || []) : (dashboardData.revenueWeekly || []);
  const topCreators = dashboardData.topCreators || [];
  const activities = dashboardData.recentActivities || [];
  const miniStats = dashboardData.miniStats || { flaggedContentCount: 0, verificationRequestsCount: 0 };
  const systemAlert = dashboardData.systemAlert;

  return (
    <>
      {/* Google Font */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <style>{`
        .dashboard-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        .dash-card { transition: box-shadow 0.2s ease, transform 0.2s ease; }
        .dash-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.10); transform: translateY(-2px); }
        .activity-row { transition: background 0.15s ease; }
        .activity-row:hover { background: #F9FAFB; }
        @keyframes dashFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dash-animate { opacity: 0; }
        .dash-animate.visible {
          animation: dashFadeUp 0.4s ease forwards;
        }
      `}</style>

      <div className="dashboard-root p-4 sm:p-6 w-full min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-64px)] bg-[#F5F5F8] overflow-y-auto">

        {/* ── PAGE HEADER ── */}
        <div className={`dash-animate mb-6 ${mounted ? 'visible' : ''}`} style={{ animationDelay: '0s' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>Dashboard</h1>
          <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Manage platform users, creators, and administrators.</p>
        </div>

        {/* ── TOP STATS ROW ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
          {statCards.map((card, idx) => (
            <div
              key={card.label}
              className={`dash-card dash-animate bg-white rounded-xl p-4 sm:p-5 min-w-0 ${mounted ? 'visible' : ''}`}
              style={{
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                animationDelay: `${0.05 * (idx + 1)}s`,
              }}
            >
              <p style={{ fontSize: 14, fontWeight: 500, color: '#6B7280', marginBottom: 4 }}>{card.label}</p>
              <div className="flex items-center gap-3">
                <span style={{ fontSize: 30, fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>{card.value}</span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '2px 10px',
                    borderRadius: 999,
                    background: card.badgeType === 'green' ? '#DCFCE7' : '#FEE2E2',
                    color: card.badgeType === 'green' ? '#16A34A' : '#DC2626',
                  }}
                >
                  {card.badge}
                </span>
              </div>

              {/* Mini bar chart */}
              <div className="min-w-0" style={{ height: 110, marginTop: 12 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={card.chartData} barSize={22} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: '#9CA3AF' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#9CA3AF' }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v: number) => `${v}%`}
                      ticks={[0, 20, 40, 60, 80, 100]}
                      domain={[0, 100]}
                    />
                    <Bar dataKey="val" fill={card.barColor} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 12, marginTop: 8 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 2 }}>{card.title}</h4>
                <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.4 }}>{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── SECOND ROW: Revenue + Top Creators ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4 min-w-0">

          {/* Revenue Distribution (3/5 width) */}
          <div
            className={`dash-card dash-animate bg-white rounded-xl p-4 sm:p-5 lg:col-span-3 min-w-0 ${mounted ? 'visible' : ''}`}
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)', animationDelay: '0.3s' }}
          >
            <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
              <div className="flex items-center gap-3">
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>Revenue Distribution</h3>
                <span style={{ fontSize: 11, fontWeight: 600, background: '#DCFCE7', color: '#16A34A', padding: '2px 10px', borderRadius: 999 }}>
                  Profit
                </span>
              </div>
              <div className="flex rounded-lg overflow-hidden border border-[#E5E7EB]">
                <button
                  onClick={() => setRevenuePeriod('monthly')}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '5px 14px',
                    background: revenuePeriod === 'monthly' ? '#1F2937' : 'white',
                    color: revenuePeriod === 'monthly' ? 'white' : '#6B7280',
                    border: 'none',
                    cursor: 'pointer',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase' as const,
                  }}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setRevenuePeriod('weekly')}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '5px 14px',
                    background: revenuePeriod === 'weekly' ? '#1F2937' : 'white',
                    color: revenuePeriod === 'weekly' ? 'white' : '#6B7280',
                    border: 'none',
                    borderLeft: '1px solid #E5E7EB',
                    cursor: 'pointer',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase' as const,
                  }}
                >
                  Weekly
                </button>
              </div>
            </div>
            <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>Performance across last 6 months</p>

            <div className="min-w-0" style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} barSize={revenuePeriod === 'monthly' ? 24 : 40} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => `${v}%`}
                    ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                    domain={[0, 100]}
                  />
                  <Bar dataKey="val" radius={[3, 3, 0, 0]}>
                    {revenueData.map((_: any, index: number) => {
                      const isHighlight = revenuePeriod === 'monthly' && index === 9; // Oct highlight
                      return (
                        <Cell
                          key={`rev-${index}`}
                          fill={isHighlight ? '#111827' : revenueBarGradient(index, revenueData.length)}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Creators (2/5 width) */}
          <div
            className={`dash-card dash-animate bg-white rounded-xl p-4 sm:p-5 lg:col-span-2 flex flex-col min-w-0 ${mounted ? 'visible' : ''}`}
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)', animationDelay: '0.35s' }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 20 }}>Top Creators</h3>

            <div className="flex-1 space-y-0">
              {topCreators.map((c: any, i: number) => (
                <div
                  key={`${c.initials}-${i}`}
                  className="flex items-center justify-between py-4"
                  style={{ borderBottom: i < topCreators.length - 1 ? '1px solid #F3F4F6' : 'none' }}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: c.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 13,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {c.initials}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{c.name}</p>
                      <p style={{ fontSize: 12, color: '#9CA3AF' }}>{c.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{c.earnings}</p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: c.rank === 1 ? '#16A34A' : '#9CA3AF' }}>
                      Rank #{c.rank}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => console.log('View All Ranking clicked')}
              className="w-full mt-4 py-3 border border-[#E5E7EB] rounded-lg text-center cursor-pointer hover:bg-[#F9FAFB] transition-colors"
              style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', background: 'white', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}
            >
              View All Ranking
            </button>
          </div>
        </div>

        {/* ── THIRD ROW: Activity + Stats + Alert ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 min-w-0">

          {/* Recent Activity (3/5 width) */}
          <div
            className={`dash-card dash-animate bg-white rounded-xl p-4 sm:p-5 lg:col-span-3 flex flex-col min-w-0 ${mounted ? 'visible' : ''}`}
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)', animationDelay: '0.4s' }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 16 }}>Recent Activity</h3>

            <div className="flex-1 space-y-0">
              {activities.map((a: any, i: number) => (
                <div
                  key={i}
                  className="activity-row flex items-start sm:items-center justify-between gap-2 py-4 px-2 rounded-lg cursor-default"
                  style={{ borderBottom: i < activities.length - 1 ? '1px solid #F3F4F6' : 'none' }}
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.dot, flexShrink: 0 }} />
                    <p className="break-words" style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{a.text}</p>
                  </div>
                  <span style={{ fontSize: 12, color: '#9CA3AF', flexShrink: 0, whiteSpace: 'nowrap' }}>{a.time}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => console.log('View All Alerts clicked')}
              className="w-full mt-4 py-3 border border-[#E5E7EB] rounded-lg text-center cursor-pointer hover:bg-[#F9FAFB] transition-colors"
              style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', background: 'white', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}
            >
              View All Alerts
            </button>
          </div>

          {/* Right column: 2 mini stat cards + System alert */}
          <div className={`lg:col-span-2 flex flex-col gap-4 dash-animate min-w-0 ${mounted ? 'visible' : ''}`} style={{ animationDelay: '0.45s' }}>

            {/* Two mini cards row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Flagged Content */}
              <div
                className="dash-card bg-white rounded-xl p-5"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Flag size={14} color="#6B7280" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>Flagged Content</span>
                </div>
                <p style={{ fontSize: 30, fontWeight: 700, color: '#111827', lineHeight: 1 }}>{miniStats.flaggedContentCount}</p>
                <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4, lineHeight: 1.4 }}>Pending review from today</p>
              </div>

              {/* Verification Requests */}
              <div
                className="dash-card bg-white rounded-xl p-5"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <FileCheck size={14} color="#6B7280" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>Verification Requests</span>
                </div>
                <p style={{ fontSize: 30, fontWeight: 700, color: '#111827', lineHeight: 1 }}>{miniStats.verificationRequestsCount}</p>
                <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4, lineHeight: 1.4 }}>Average wait time: 14h</p>
              </div>
            </div>

            {/* System Alert */}
            {systemAlert && systemAlert.isVisible && alertVisible && (
              <div
                className="rounded-xl p-5"
                style={{
                  background: '#FFFBEB',
                  border: '1px solid #FCD34D',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  opacity: alertFading ? 0 : 1,
                  transform: alertFading ? 'translateY(8px)' : 'translateY(0)',
                  transition: 'opacity 0.4s ease, transform 0.4s ease',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} color="#D97706" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#92400E' }}>{systemAlert.type}</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#EA580C', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                    {systemAlert.priority}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.6, marginBottom: 12 }}>
                  {systemAlert.description}
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => console.log('Investigating logs...')}
                    style={{ fontSize: 12, fontWeight: 600, color: '#D97706', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                  >
                    Investigate Log
                  </button>
                  <button
                    onClick={dismissAlert}
                    style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                  >
                    Dismiss Alert
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
}

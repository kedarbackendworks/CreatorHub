'use client';

import React, { useState, useEffect } from 'react';
import { ContentPreviewCard } from '@/src/components/admin/moderation/ContentPreviewCard';
import { ModerationTable } from '@/src/components/admin/moderation/ModerationTable';
import api from '@/src/lib/api';
import { previewData, reportedItemsData, type ReportedItem } from '@/src/data/moderationData';

export default function ModerationPage() {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<ReportedItem[]>(reportedItemsData);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const res = await api.get('/moderation/admin/reports', {
          params: { status: 'pending', page: 1, limit: 50 },
        });

        const list = Array.isArray(res.data?.items) ? res.data.items : [];
        if (!list.length) {
          const fallback = await api.get('/moderation/sample/reports', {
            params: { status: 'pending', page: 1, limit: 50 },
          });
          const fallbackList = Array.isArray(fallback.data?.items) ? fallback.data.items : [];
          if (!fallbackList.length) {
            setItems([]);
            return;
          }

          const mappedFallback: ReportedItem[] = fallbackList.map((row: any) => {
            const rawStatus = String(row?.status || 'pending').toLowerCase();
            const status =
              rawStatus === 'pending'
                ? 'Pending'
                : rawStatus === 'under_review'
                  ? 'Under Review'
                  : 'Approved';

            return {
              id: String(row?._id || ''),
              itemId: String(row?.targetId || '').slice(-6).toUpperCase(),
              title: `${String(row?.targetType || 'content').toUpperCase()} Report`,
              creator: 'Reported User',
              reason: String(row?.reason || 'other').toUpperCase(),
              reports: Number(row?.additionalReportersCount || 0) + 1,
              status,
            };
          });

          setItems(mappedFallback);
          return;
        }

        const mapped: ReportedItem[] = list.map((row: any) => {
          const rawStatus = String(row?.status || 'pending').toLowerCase();
          const status =
            rawStatus === 'pending'
              ? 'Pending'
              : rawStatus === 'under_review'
                ? 'Under Review'
                : 'Approved';

          return {
            id: String(row?._id || ''),
            itemId: String(row?.targetId || '').slice(-6).toUpperCase(),
            title: `${String(row?.targetType || 'content').toUpperCase()} Report`,
            creator: 'Reported User',
            reason: String(row?.reason || 'other').toUpperCase(),
            reports: Number(row?.additionalReportersCount || 0) + 1,
            status,
          };
        });

        setItems(mapped);
      } catch {
        setItems(reportedItemsData);
      }
    };

    loadReports();
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
        .detail-animate { opacity: 0; }
        .detail-animate.visible { animation: detailFadeUp 0.6s ease-out forwards; }
      `}</style>

      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", padding: 'clamp(12px, 2.8vw, 24px)', background: '#F5F5F8', minHeight: 'calc(100vh - 56px)' }}>
        
        {/* Header */}
        <div className={`detail-animate mb-6 ${mounted ? 'visible' : ''}`} style={{ animationDelay: '0ms' }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Moderation
          </h1>
          <p style={{ fontSize: 13, color: '#6B7280' }}>
            Monitor and act on flagged content and creators
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Main Action Card */}
          <div className={mounted ? 'visible' : ''}>
            <ContentPreviewCard data={previewData} delay={50} />
          </div>

          {/* Table */}
          <div className={mounted ? 'visible' : ''}>
            <ModerationTable items={items} delay={150} />
          </div>
        </div>
      </div>
    </>
  );
}

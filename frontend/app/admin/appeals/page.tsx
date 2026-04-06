"use client";

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AlertTriangle, Link as LinkIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/src/lib/api';

type AppealStatus = 'pending' | 'approved' | 'rejected';
type TabKey = AppealStatus | 'all';

type AppealItem = {
  _id: string;
  status: AppealStatus;
  appealType?: 'ban' | 'post_lock';
  reason: string;
  supportingInfo?: string;
  submittedAt: string;
  reviewedAt?: string | null;
  adminNote?: string;
  creatorId?: { _id?: string; name?: string; email?: string; avatar?: string; createdAt?: string };
  banId?: {
    _id?: string;
    reason?: string;
    banType?: 'temporary' | 'permanent';
    startDate?: string;
    endDate?: string | null;
    reportId?: any;
    bannedBy?: { name?: string; email?: string };
  };
  postIds?: Array<{ _id?: string; title?: string; thumbnailUrl?: string; policyViolationLabel?: string; policyViolationLockedAt?: string }>;
};

const statusStyle: Record<AppealStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
};

const formatDate = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

const daysBetween = (start?: string, end?: string | null) => {
  if (!start || !end) return null;
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return Math.max(1, Math.ceil((b - a) / 86400000));
};

export default function AdminAppealsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('pending');
  const [loading, setLoading] = useState(true);
  const [itemsByStatus, setItemsByStatus] = useState<Record<AppealStatus, AppealItem[]>>({
    pending: [], approved: [], rejected: []
  });
  const [counts, setCounts] = useState<Record<AppealStatus, number>>({ pending: 0, approved: 0, rejected: 0 });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selectedAppeal, setSelectedAppeal] = useState<AppealItem | null>(null);

  const [decision, setDecision] = useState<'approve' | 'reject'>('approve');
  const [adminNote, setAdminNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadAppeals = async () => {
    setLoading(true);
    try {
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        api.get('/admin/appeals', { params: { status: 'pending', page: 1, limit: 100 } }),
        api.get('/admin/appeals', { params: { status: 'approved', page: 1, limit: 100 } }),
        api.get('/admin/appeals', { params: { status: 'rejected', page: 1, limit: 100 } }),
      ]);

      setItemsByStatus({
        pending: pendingRes.data?.data || [],
        approved: approvedRes.data?.data || [],
        rejected: rejectedRes.data?.data || [],
      });

      setCounts({
        pending: Number(pendingRes.data?.pagination?.total || 0),
        approved: Number(approvedRes.data?.pagination?.total || 0),
        rejected: Number(rejectedRes.data?.pagination?.total || 0),
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load appeals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppeals();
  }, []);

  const allItems = useMemo(
    () => [...itemsByStatus.pending, ...itemsByStatus.approved, ...itemsByStatus.rejected]
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()),
    [itemsByStatus]
  );

  const visibleItems = useMemo(() => {
    if (activeTab === 'all') return allItems;
    return itemsByStatus[activeTab] || [];
  }, [activeTab, allItems, itemsByStatus]);

  const openDrawer = async (appealId: string) => {
    setDrawerOpen(true);
    setLoadingDetail(true);
    setDecision('approve');
    setAdminNote('');

    try {
      const res = await api.get(`/admin/appeals/${appealId}`);
      setSelectedAppeal(res.data?.appeal || null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load appeal detail');
    } finally {
      setLoadingDetail(false);
    }
  };

  const submitDecision = async () => {
    if (!selectedAppeal) return;
    if (adminNote.trim().length < 10) {
      toast.error('Response must be at least 10 characters');
      return;
    }

    const ok = window.confirm('Are you sure? This decision cannot be undone.');
    if (!ok) return;

    setSubmitting(true);
    try {
      await api.patch(`/admin/appeals/${selectedAppeal._id}/decision`, {
        decision,
        adminNote: adminNote.trim(),
      });
      toast.success('Decision submitted');
      setDrawerOpen(false);
      setSelectedAppeal(null);
      await loadAppeals();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to submit decision');
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { key: 'pending' as const, label: `Pending (${counts.pending})` },
    { key: 'approved' as const, label: 'Approved' },
    { key: 'rejected' as const, label: 'Rejected' },
    { key: 'all' as const, label: `All (${counts.pending + counts.approved + counts.rejected})` },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-slate-900">Appeal Reviews</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-2 rounded-lg text-sm font-semibold border ${activeTab === tab.key ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Creator</th>
              <th className="text-left px-4 py-3">Ban Reason</th>
              <th className="text-left px-4 py-3">Ban Type</th>
              <th className="text-left px-4 py-3">Appeal Submitted</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Loading appeals...</td></tr>
            ) : visibleItems.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No appeals found.</td></tr>
            ) : (
              visibleItems.map((appeal) => {
                const days = daysBetween(appeal.banId?.startDate, appeal.banId?.endDate);
                return (
                  <tr key={appeal._id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{appeal.creatorId?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{appeal.creatorId?.email || '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {appeal.appealType === 'post_lock'
                        ? `Locked posts (${(appeal.postIds || []).length})`
                        : (appeal.banId?.reason || '—')}
                    </td>
                    <td className="px-4 py-3">
                      {appeal.appealType === 'post_lock' ? (
                        <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-700">Post Lock</span>
                      ) : appeal.banId?.banType === 'permanent' ? (
                        <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-red-100 text-red-800">Permanent</span>
                      ) : (
                        <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-800">
                          Temporary {days ? `${days} days` : ''}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(appeal.submittedAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusStyle[appeal.status]}`}>
                        {appeal.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openDrawer(appeal._id)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {drawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/35 z-40" onClick={() => setDrawerOpen(false)} />
          <aside className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-white border-l border-slate-200 z-50 p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900">Appeal #{selectedAppeal?._id?.slice(-6) || ''}</h2>
              <button onClick={() => setDrawerOpen(false)} className="p-1 rounded-md hover:bg-slate-100"><X className="w-4 h-4" /></button>
            </div>

            {loadingDetail || !selectedAppeal ? (
              <p className="text-sm text-slate-500">Loading details...</p>
            ) : (
              <div className="space-y-5 pb-6">
                <section className="rounded-xl border border-slate-200 p-4">
                  <h3 className="font-semibold text-slate-900 mb-3">Creator Info</h3>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                      {selectedAppeal.creatorId?.avatar ? (
                        <Image src={selectedAppeal.creatorId.avatar} alt="Creator avatar" fill className="object-cover" unoptimized />
                      ) : null}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{selectedAppeal.creatorId?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{selectedAppeal.creatorId?.email || '—'}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700"><span className="font-medium">Joined:</span> {formatDate(selectedAppeal.creatorId?.createdAt)}</p>
                </section>

                <section className="rounded-xl border border-slate-200 p-4">
                  <h3 className="font-semibold text-slate-900 mb-3">Ban Details</h3>
                  {selectedAppeal.appealType === 'post_lock' ? (
                    <>
                      <p className="text-sm text-slate-700"><span className="font-medium">Restriction:</span> Locked posts appeal</p>
                      <p className="text-sm text-slate-700 mt-1"><span className="font-medium">Affected posts:</span> {(selectedAppeal.postIds || []).length}</p>
                      {(selectedAppeal.postIds || []).length ? (
                        <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-2 max-h-28 overflow-y-auto text-xs text-slate-700">
                          {(selectedAppeal.postIds || []).map((post) => (
                            <p key={post._id}>• {post.title || 'Untitled post'}</p>
                          ))}
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-slate-700"><span className="font-medium">Reason:</span> {selectedAppeal.banId?.reason || '—'}</p>
                      <p className="text-sm text-slate-700 mt-1"><span className="font-medium">Ban type:</span> {selectedAppeal.banId?.banType || '—'}</p>
                      <p className="text-sm text-slate-700 mt-1"><span className="font-medium">End date:</span> {formatDate(selectedAppeal.banId?.endDate)}</p>
                      <p className="text-sm text-slate-700 mt-1"><span className="font-medium">Banned by:</span> {selectedAppeal.banId?.bannedBy?.name || '—'}</p>
                      <p className="text-sm text-slate-700 mt-2">
                        <span className="font-medium">Original report:</span>{' '}
                        {selectedAppeal.banId?.reportId?._id ? (
                          <a
                            href={`/admin/reports`}
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                          >
                            Open report <LinkIcon className="w-3.5 h-3.5" />
                          </a>
                        ) : 'Not linked'}
                      </p>
                    </>
                  )}
                </section>

                <section className="rounded-xl border border-slate-200 p-4">
                  <h3 className="font-semibold text-slate-900 mb-3">Creator's Appeal</h3>
                  <p className="text-sm text-slate-700"><span className="font-medium">Submitted:</span> {formatDate(selectedAppeal.submittedAt)}</p>
                  <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 max-h-32 overflow-y-auto">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Appeal Reason</p>
                    <p className="text-sm text-slate-800 mt-1 whitespace-pre-wrap">{selectedAppeal.reason}</p>
                  </div>
                  <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 max-h-28 overflow-y-auto">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Supporting Info</p>
                    <p className="text-sm text-slate-800 mt-1 whitespace-pre-wrap">{selectedAppeal.supportingInfo || 'None provided'}</p>
                  </div>
                </section>

                <section className="rounded-xl border border-slate-200 p-4">
                  <h3 className="font-semibold text-slate-900 mb-3">Your Decision</h3>

                  <div className="space-y-2">
                    <button
                      onClick={() => setDecision('approve')}
                      className={`w-full text-left border rounded-lg p-3 ${decision === 'approve' ? 'border-violet-700 bg-violet-50' : 'border-slate-200'}`}
                    >
                      <p className="font-medium text-slate-900">Approve Appeal</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {selectedAppeal.appealType === 'post_lock'
                          ? 'Locked posts will be unlocked immediately.'
                          : 'Ban will be immediately lifted. Creator regains full access.'}
                      </p>
                    </button>
                    <button
                      onClick={() => setDecision('reject')}
                      className={`w-full text-left border rounded-lg p-3 ${decision === 'reject' ? 'border-violet-700 bg-violet-50' : 'border-slate-200'}`}
                    >
                      <p className="font-medium text-slate-900">Reject Appeal</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {selectedAppeal.appealType === 'post_lock' ? 'Locked posts remain restricted.' : 'Ban remains active.'}
                      </p>
                    </button>
                  </div>

                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Write a clear explanation for your decision..."
                    className="w-full mt-3 h-28 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />

                  <button
                    onClick={submitDecision}
                    disabled={submitting}
                    className="w-full mt-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white py-2.5 font-semibold disabled:opacity-60"
                  >
                    {submitting ? 'Submitting...' : 'Submit Decision'}
                  </button>
                </section>

                <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  Confirm decisions carefully. This action is intended to be final.
                </div>
              </div>
            )}
          </aside>
        </>
      )}
    </div>
  );
}

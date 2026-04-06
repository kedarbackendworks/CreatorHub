"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Clock3, Scale, ShieldAlert, Ban } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/src/lib/api';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useBanStore } from '@/src/store/useBanStore';
import CreatorLayout from '@/app/creator/layout';
import DashboardSidebar from '@/src/components/UserDashboard/DashboardSidebar';

type AppealResponse = {
  appeal: {
    _id: string;
    status: 'pending' | 'approved' | 'rejected';
    appealType?: 'ban' | 'post_lock';
    reason: string;
    supportingInfo: string;
    attachments?: Array<{ url: string; type: 'image' | 'video' | 'file'; filename: string; sizeBytes: number }>;
    posts?: Array<{ _id: string; title: string; thumbnailUrl?: string; policyViolationLabel?: string }>;
    supportTicketId?: string;
    submittedAt: string;
    reviewedAt: string | null;
    adminNote: string;
    ban: {
      reason: string;
      banType: 'temporary' | 'permanent';
      startDate: string;
      endDate: string | null;
    } | null;
  } | null;
  banAppeal?: {
    _id: string;
    status: 'pending' | 'approved' | 'rejected';
    appealType?: 'ban';
    reason: string;
    supportingInfo: string;
    attachments?: Array<{ url: string; type: 'image' | 'video' | 'file'; filename: string; sizeBytes: number }>;
    supportTicketId?: string;
    submittedAt: string;
    reviewedAt: string | null;
    adminNote: string;
    ban: {
      reason: string;
      banType: 'temporary' | 'permanent';
      startDate: string;
      endDate: string | null;
    } | null;
  } | null;
  postLockAppeals?: Array<{
    _id: string;
    status: 'pending' | 'approved' | 'rejected';
    appealType?: 'post_lock';
    reason: string;
    supportingInfo: string;
    attachments?: Array<{ url: string; type: 'image' | 'video' | 'file'; filename: string; sizeBytes: number }>;
    posts?: Array<{ _id: string; title: string; thumbnailUrl?: string; policyViolationLabel?: string }>;
    supportTicketId?: string;
    submittedAt: string;
    reviewedAt: string | null;
    adminNote: string;
  }>;
  activeBan: {
    isActive: boolean;
    banType: 'temporary' | 'permanent';
    reason: string;
    endDate: string | null;
    remainingDays: number | null;
  } | null;
  lockedPosts?: Array<{
    _id: string;
    title: string;
    thumbnailUrl?: string;
    policyViolationLabel?: string;
    policyViolationLockedAt?: string;
    appealStatus?: 'pending' | 'approved' | 'rejected' | null;
    appealId?: string | null;
    supportTicketId?: string;
  }>;
  hasLockedRestrictions?: boolean;
};

const formatDate = (iso?: string | null) => {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

const reasonLabel = (value?: string) => {
  if (!value) return 'Policy violation';
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

function AppealContent() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setBanData = useBanStore((state) => state.setBanData);
  const clearBanState = useBanStore((state) => state.clearBanState);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<AppealResponse | null>(null);
  const [reason, setReason] = useState('');
  const [supportingInfo, setSupportingInfo] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectedPostId, setSelectedPostId] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get<AppealResponse>('/appeals/my-appeal');
      setData(res.data);
      setBanData({ activeBan: res.data.activeBan, appeal: res.data.appeal });
    } catch (error: any) {
      setData({ appeal: null, activeBan: null });
      setBanData({ activeBan: null, appeal: null });
      if (error?.response?.status !== 401) {
        toast.error(error?.response?.data?.message || 'Failed to load appeal data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const eligibleLockedPosts = (data?.lockedPosts || []).filter(
      (post) => post.appealStatus !== 'pending' && post.appealStatus !== 'rejected'
    );

    if (eligibleLockedPosts.length > 0) {
      setSelectedPostId((prev) => {
        if (prev && eligibleLockedPosts.some((post) => post._id === prev)) return prev;
        return eligibleLockedPosts[0]._id;
      });
    } else {
      setSelectedPostId('');
    }
  }, [data?.lockedPosts]);

  const hasActiveBan = Boolean(data?.activeBan?.isActive);
  const banAppeal = data?.banAppeal || null;
  const hasLockedRestrictions = Boolean(data?.hasLockedRestrictions) || (data?.lockedPosts?.length || 0) > 0;
  const hasAnyRestriction = hasActiveBan || hasLockedRestrictions;
  const eligibleLockedPosts = (data?.lockedPosts || []).filter(
    (post) => post.appealStatus !== 'pending' && post.appealStatus !== 'rejected'
  );

  const canAppealBan = hasActiveBan && (!banAppeal || banAppeal.status === 'approved');
  const canAppealPostLock = !hasActiveBan && hasLockedRestrictions && eligibleLockedPosts.length > 0;
  const canAppeal = canAppealBan || canAppealPostLock;
  const showBanPending = hasActiveBan && banAppeal?.status === 'pending';
  const showBanRejected = hasActiveBan && banAppeal?.status === 'rejected';
  const showBanApproved = hasActiveBan && banAppeal?.status === 'approved';
  const reasonCount = reason.length;
  const infoCount = supportingInfo.length;
  const reasonValid = reason.trim().length >= 50;

  const banDurationText = useMemo(() => {
    if (!data?.activeBan) return '';
    if (data.activeBan.banType === 'permanent') return 'Permanent';
    const end = formatDate(data.activeBan.endDate);
    return `Temporary · Ends ${end || '—'}`;
  }, [data?.activeBan]);

  const submitAppeal = async () => {
    if (!reasonValid) return;

    setSubmitting(true);
    try {
      const form = new FormData();
      form.append('reason', reason.trim());
      form.append('supportingInfo', supportingInfo.trim());
      if (!hasActiveBan) {
        if (!selectedPostId) {
          toast.error('Please select a locked post to appeal');
          setSubmitting(false);
          return;
        }
        form.append('postId', selectedPostId);
      }
      attachments.forEach((file) => form.append('attachments', file));

      await api.post('/appeals', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Appeal submitted successfully');
      setReason('');
      setSupportingInfo('');
      setAttachments([]);
      await load();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to submit appeal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoDashboard = () => {
    clearBanState();
    if (user?.role === 'creator') {
      router.push('/creator');
      return;
    }
    router.push('/user');
  };

  if (loading) {
    return <div className="min-h-[70vh] p-8 text-sm text-slate-500">Loading appeal page...</div>;
  }

  if (!hasAnyRestriction) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h1 className="text-2xl font-bold text-emerald-900 mt-4">Your account is in good standing</h1>
          <p className="text-emerald-700 mt-2">You have no active bans or restrictions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
      <div className="flex items-center gap-2 text-slate-500 text-sm">
        <Scale className="w-4 h-4" /> Appeal Center
      </div>

      {canAppeal ? (
        <>
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 border-l-4 border-l-red-500">
            <h2 className="text-lg font-semibold text-red-900 flex items-center gap-2"><Ban className="w-5 h-5" /> Account Suspended</h2>
            {hasActiveBan ? (
              <>
                <p className="text-sm text-red-800 mt-2"><span className="font-semibold">Reason:</span> {reasonLabel(data?.activeBan?.reason)}</p>
                <p className="text-sm text-red-800 mt-1"><span className="font-semibold">Duration:</span> {banDurationText}</p>
              </>
            ) : (
              <>
                <p className="text-sm text-red-800 mt-2"><span className="font-semibold">Reason:</span> One or more posts are locked due to policy violations.</p>
                <p className="text-sm text-red-800 mt-1"><span className="font-semibold">Locked posts:</span> {(data?.lockedPosts || []).length}</p>
              </>
            )}

            {(data?.lockedPosts || []).length > 0 ? (
              <div className="mt-3 rounded-lg bg-white/70 border border-red-100 p-3 space-y-2">
                {(data?.lockedPosts || []).slice(0, 8).map((post) => {
                  const status = post.appealStatus;
                  return (
                    <div key={post._id} className="text-xs text-red-900 flex items-center justify-between gap-3">
                      <p className="truncate">• {post.title || 'Untitled post'}</p>
                      {status ? (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${status === 'pending' ? 'bg-amber-100 text-amber-800' : status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {status}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-emerald-100 text-emerald-700">
                          Ready
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Submit an Appeal</h3>
            <p className="text-sm text-slate-600">
              Explain why you believe this suspension was a mistake. Be clear and specific. Appeals are reviewed within 2–5 business days.
            </p>

            {!hasActiveBan ? (
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Select locked post to appeal</label>
                <div className="space-y-2 max-h-48 overflow-y-auto rounded-xl border border-slate-200 p-3">
                  {eligibleLockedPosts.length === 0 ? (
                    <p className="text-xs text-slate-500">No eligible locked posts available for a new appeal.</p>
                  ) : (
                    eligibleLockedPosts.map((post) => (
                      <label key={post._id} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="selectedLockedPost"
                          value={post._id}
                          checked={selectedPostId === post._id}
                          onChange={(e) => setSelectedPostId(e.target.value)}
                        />
                        <span className="truncate">{post.title || 'Untitled post'}</span>
                      </label>
                    ))
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Each selected post creates a separate unlock appeal and separate support ticket.
                </p>
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Your Appeal Reason</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value.slice(0, 2000))}
                className="w-full h-44 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                placeholder="Please explain in detail why you believe this suspension was incorrect..."
              />
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className={reasonValid ? 'text-slate-500' : 'text-red-600'}>
                  {reasonValid ? '' : 'Minimum 50 characters required'}
                </span>
                <span className="text-slate-500">{reasonCount} / 2000</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Supporting Information (Optional)</label>
              <textarea
                value={supportingInfo}
                onChange={(e) => setSupportingInfo(e.target.value.slice(0, 1000))}
                className="w-full h-32 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                placeholder="Any additional context, links, or evidence..."
              />
              <div className="text-right mt-2 text-xs text-slate-500">{infoCount} / 1000</div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Attachments (Optional)</label>
              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={(e) => setAttachments(Array.from(e.target.files || []).slice(0, 5))}
                className="block w-full text-sm text-slate-600 file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border file:border-slate-200 file:bg-slate-50 file:text-slate-700"
              />
              <p className="text-xs text-slate-500 mt-2">
                Upload legal documents or references (max 5 files).
              </p>
              {attachments.length > 0 ? (
                <ul className="mt-2 text-xs text-slate-600 space-y-1">
                  {attachments.map((file) => (
                    <li key={`${file.name}-${file.size}`} className="truncate">• {file.name}</li>
                  ))}
                </ul>
              ) : null}
            </div>

            <button
              onClick={submitAppeal}
              disabled={!reasonValid || submitting || (!hasActiveBan && !selectedPostId)}
              className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold py-3"
            >
              {submitting ? 'Submitting...' : 'Submit Appeal'}
            </button>
          </div>
        </>
      ) : showBanPending ? (
        <>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-lg font-semibold text-amber-900 flex items-center gap-2"><Clock3 className="w-5 h-5" /> Appeal Under Review</h2>
            <p className="text-sm text-amber-800 mt-2">Submitted on: {formatDate(banAppeal?.submittedAt)}</p>
            <p className="text-sm text-amber-800 mt-1">Expected review: 2–5 business days</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Your Appeal Reason</p>
              <p className="text-sm text-slate-800 mt-1 whitespace-pre-wrap">{banAppeal?.reason}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Supporting Info</p>
              <p className="text-sm text-slate-800 mt-1 whitespace-pre-wrap">{banAppeal?.supportingInfo || 'None provided'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Attachments</p>
              {banAppeal?.attachments?.length ? (
                <ul className="text-sm text-slate-800 mt-1 space-y-1">
                  {banAppeal.attachments.map((item) => (
                    <li key={item.url}>
                      <a href={item.url} target="_blank" rel="noreferrer" className="text-violet-600 hover:underline">
                        {item.filename || 'Attachment'}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-800 mt-1">None provided</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            While your appeal is under review, you can continue browsing content as a viewer. You will be notified of the decision.
          </div>
        </>
      ) : showBanRejected ? (
        <>
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <h2 className="text-lg font-semibold text-red-900 flex items-center gap-2"><ShieldAlert className="w-5 h-5" /> Appeal Rejected</h2>
            <p className="text-sm text-red-800 mt-2">Reviewed on: {formatDate(banAppeal?.reviewedAt)}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs uppercase tracking-wide text-slate-500">Admin&apos;s Note</p>
            <p className="text-sm text-slate-800 mt-2 whitespace-pre-wrap">{banAppeal?.adminNote || 'No note provided.'}</p>
          </div>

          <p className="text-sm text-slate-600">
            If you believe this decision is incorrect, please contact support directly.{' '}
            <a href="mailto:support@platform.com" className="text-violet-600 font-semibold hover:underline">support@platform.com</a>
          </p>
        </>
      ) : !hasActiveBan && hasLockedRestrictions ? (
        <>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-lg font-semibold text-amber-900 flex items-center gap-2"><Clock3 className="w-5 h-5" /> Post-lock appeals already in progress</h2>
            <p className="text-sm text-amber-800 mt-2">All currently locked posts already have pending or rejected appeals.</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
            {(data?.lockedPosts || []).map((post) => (
              <div key={post._id} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                <p className="text-sm text-slate-800 truncate">{post.title || 'Untitled post'}</p>
                <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${post.appealStatus === 'pending' ? 'bg-amber-100 text-amber-800' : post.appealStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                  {post.appealStatus || 'No appeal'}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <h2 className="text-lg font-semibold text-emerald-900 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Appeal Approved</h2>
            <p className="text-sm text-emerald-800 mt-2">Your account has been restored.</p>
            <p className="text-sm text-emerald-800 mt-1">Reviewed on: {formatDate(banAppeal?.reviewedAt || data?.appeal?.reviewedAt)}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs uppercase tracking-wide text-slate-500">Admin&apos;s Note</p>
            <p className="text-sm text-slate-800 mt-2 whitespace-pre-wrap">{banAppeal?.adminNote || data?.appeal?.adminNote || 'No note provided.'}</p>
          </div>

          <button
            onClick={handleGoDashboard}
            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3"
          >
            Go to Dashboard
          </button>
        </>
      )}
    </div>
  );
}

export default function AppealPage() {
  const user = useAuthStore((state) => state.user);

  if (user?.role === 'creator') {
    return (
      <CreatorLayout>
        <AppealContent />
      </CreatorLayout>
    );
  }

  if (user?.role === 'user') {
    return (
      <div className="min-h-screen bg-[var(--bg,#f6f4f1)] flex">
        <DashboardSidebar />
        <main className="flex-1 md:ml-[240px] pt-20 md:pt-0 min-h-screen overflow-y-auto">
          <AppealContent />
        </main>
      </div>
    );
  }

  return <AppealContent />;
}

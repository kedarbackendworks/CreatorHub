"use client";

import { Ban, Clock3, Lock, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useBanStore } from '@/src/store/useBanStore';

const toLabel = (reason: string) =>
  reason
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const formatDate = (iso: string | null) => {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

export default function BanPopup() {
  const router = useRouter();
  const activeBan = useBanStore((state) => state.activeBan);
  const appeal = useBanStore((state) => state.appeal);
  const canAppeal = useBanStore((state) => state.canAppeal);
  const showBanPopup = useBanStore((state) => state.showBanPopup);
  const dismissForViewerSession = useBanStore((state) => state.dismissForViewerSession);

  const reasonLabel = useMemo(() => toLabel(activeBan?.reason || 'policy_violation'), [activeBan?.reason]);
  const liftedOn = formatDate(activeBan?.endDate || null);

  if (!activeBan?.isActive || !showBanPopup) return null;

  const typeLabel = activeBan.banType === 'permanent'
    ? 'Permanent'
    : `Temporary (${activeBan.remainingDays ?? 0} days)`;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-[480px] rounded-2xl bg-[#101216] border border-white/10 shadow-2xl p-7 text-white">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
            <Ban className="w-8 h-8" />
          </div>
        </div>

        <h2 className="text-center text-2xl font-bold">Account Suspended</h2>
        <p className="text-center text-sm text-slate-300 mt-3">
          Your account has been suspended due to a policy violation.
        </p>

        <div className="mt-6 rounded-xl bg-white/5 border border-white/10 p-4 text-sm space-y-2">
          <p><span className="text-slate-400">Reason:</span> <span className="font-semibold text-slate-100">{reasonLabel}</span></p>
          <p><span className="text-slate-400">Type:</span> <span className="font-semibold text-slate-100">{typeLabel}</span></p>
          {activeBan.banType !== 'permanent' && liftedOn ? (
            <p><span className="text-slate-400">Lifted on:</span> <span className="font-semibold text-slate-100">{liftedOn}</span></p>
          ) : null}
        </div>

        <div className="border-t border-white/10 my-6" />

        {canAppeal ? (
          <>
            <p className="text-sm text-slate-300 mb-4">
              You can submit an appeal if you believe this was a mistake.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/appeal')}
                className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 transition-colors"
              >
                Go to Appeal Page
              </button>
              <button
                onClick={dismissForViewerSession}
                className="w-full rounded-xl border border-white/20 text-slate-200 hover:bg-white/5 font-semibold py-3 transition-colors"
              >
                Continue as Viewer
              </button>
            </div>
          </>
        ) : (
          <>
            {appeal?.status === 'pending' ? (
              <p className="text-amber-300 text-sm flex items-center gap-2 mb-4">
                <Clock3 className="w-4 h-4" /> Your appeal is under review
              </p>
            ) : (
              <div className="space-y-2 mb-4">
                <p className="text-red-300 text-sm flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Your appeal was rejected
                </p>
                {appeal?.adminNote ? (
                  <p className="text-xs text-slate-300 bg-white/5 border border-white/10 rounded-lg p-3">
                    {appeal.adminNote}
                  </p>
                ) : null}
              </div>
            )}

            <button
              onClick={() => router.push('/appeal')}
              className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 transition-colors"
            >
              View Appeal Status
            </button>
          </>
        )}

        <p className="text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" /> Restricted actions remain disabled while your suspension is active.
        </p>
      </div>
    </div>
  );
}

'use client';

import { formatBanExpiry } from '../utils/moderationHelpers';

export function BanPopup({ ban, onAppeal }) {
  if (!ban?.isBanned) return null;

  const isPermanent = ban.type === 'permanent' || ban.duration === 'permanent';

  return (
    <div className="fixed inset-0 z-[3000] bg-black/75 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl p-8 shadow-2xl text-center">
        <h2 className="text-2xl font-bold text-slate-900">Account Restricted</h2>
        <p className="text-slate-600 mt-2">
          {isPermanent ? 'Permanent ban' : 'Temporary ban'} · {formatBanExpiry(ban.expiresAt)}
        </p>
        <p className="mt-4 text-sm text-slate-700">Reason: {ban.reason || 'Policy violation'}</p>

        {!isPermanent && ban.appealStatus === 'none' ? (
          <button className="mt-6 px-5 py-2 rounded-lg bg-slate-900 text-white" onClick={onAppeal}>
            Submit appeal
          </button>
        ) : (
          <p className="mt-6 text-sm text-slate-500">For support, contact support@creatorhub.app</p>
        )}
      </div>
    </div>
  );
}

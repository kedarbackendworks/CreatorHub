"use client";

import { BellRing, X } from 'lucide-react';

export default function TicketUpdateBanner({ notification, onDismiss, onViewResponse }) {
  if (!notification) return null;

  const ticketId = notification?.metadata?.ticketId || 'Ticket';
  const title = notification?.title || 'Admin responded to your ticket';

  return (
    <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <BellRing className="mt-0.5 h-4 w-4 text-emerald-700" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">{title}</p>
            <p className="mt-0.5 text-xs text-emerald-700">{ticketId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onViewResponse} className="text-xs font-semibold text-emerald-800 underline underline-offset-2">
            View Response
          </button>
          <button type="button" onClick={onDismiss} className="rounded p-1 text-emerald-700 hover:bg-emerald-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

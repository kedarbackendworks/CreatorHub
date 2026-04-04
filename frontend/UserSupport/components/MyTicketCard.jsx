"use client";

import Link from 'next/link';

function formatDate(dateInput) {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  return `${date.toLocaleDateString()} · ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function toLabel(value = '') {
  return value.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const priorityColor = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-slate-100 text-slate-600',
};

const statusColor = {
  open: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  resolved: 'bg-emerald-100 text-emerald-700',
  dismissed: 'bg-slate-100 text-slate-600',
};

export default function MyTicketCard({ role, ticket, hasNewResponse, onOpenTicket }) {
  const detailHref = role === 'creator' ? `/creator/support/${ticket.ticketId}` : `/user/support/${ticket.ticketId}`;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {hasNewResponse ? (
        <div className="mb-3 rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">New Response</div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-slate-500">{ticket.ticketId}</span>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{toLabel(ticket.tag)}</span>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${priorityColor[ticket.priority] || priorityColor.low}`}>{toLabel(ticket.priority)}</span>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColor[ticket.status] || statusColor.open}`}>{toLabel(ticket.status)}</span>
      </div>

      <h3 className="mt-2 text-base font-semibold text-slate-900">{ticket.heading}</h3>
      <p className="mt-1 text-xs text-slate-500">Submitted {formatDate(ticket.createdAt)}</p>

      {ticket.adminResponse ? (
        <div className="mt-4 border-t border-slate-100 pt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Admin Response</p>
          <p className="mt-1 text-sm text-slate-700">{ticket.adminResponse}</p>
        </div>
      ) : null}

      <div className="mt-4 flex justify-end">
        <Link href={detailHref} onClick={onOpenTicket} className="text-sm font-semibold text-slate-900 hover:underline">
          View →
        </Link>
      </div>
    </article>
  );
}

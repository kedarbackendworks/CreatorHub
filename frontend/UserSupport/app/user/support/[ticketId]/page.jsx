"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DashboardSidebar from '@/src/components/UserDashboard/DashboardSidebar';
import api from '@/src/lib/api';

function formatDate(dateInput) {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  return `${date.toLocaleDateString()} · ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

export default function UserTicketDetailPageModule() {
  const params = useParams();
  const ticketId = params?.ticketId;
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ticketId) return;

    let active = true;
    const run = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/support/user/tickets/${ticketId}`);
        if (!active) return;
        setTicket(data);
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || 'Unable to load ticket.');
      } finally {
        if (active) setLoading(false);
      }
    };

    run();
    return () => {
      active = false;
    };
  }, [ticketId]);

  return (
    <div className="min-h-screen bg-[var(--bg,#f6f4f1)] flex">
      <DashboardSidebar />
      <main className="flex-1 md:ml-[240px] pt-20 md:pt-0 min-h-screen overflow-y-auto px-4 md:px-[42px] py-6">
        <div className="mx-auto w-full max-w-[1116px] rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900">Ticket {ticketId}</h1>
            <Link href="/user/support" className="text-sm font-semibold text-slate-700 hover:underline">← Back</Link>
          </div>

          {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          {ticket ? (
            <div className="space-y-4 text-sm text-slate-700">
              <p><span className="font-semibold">Category:</span> {ticket.tag}</p>
              <p><span className="font-semibold">Status:</span> {ticket.status}</p>
              <p><span className="font-semibold">Priority:</span> {ticket.priority}</p>
              <p><span className="font-semibold">Submitted:</span> {formatDate(ticket.createdAt)}</p>
              <p><span className="font-semibold">Heading:</span> {ticket.heading}</p>
              <p><span className="font-semibold">Description:</span> {ticket.description}</p>
              {ticket.adminResponse ? (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                  <p className="font-semibold text-emerald-800">Admin Response</p>
                  <p className="mt-1">{ticket.adminResponse}</p>
                  <p className="mt-1 text-xs text-emerald-700">Responded at: {formatDate(ticket.respondedAt)}</p>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquarePlus } from 'lucide-react';
import { useMyTickets } from '../hooks/useMyTickets';
import { useNotifications as useModerationNotifications } from '@/Moderation/hooks/useNotifications';
import TicketUpdateBanner from './TicketUpdateBanner';
import MyTicketCard from './MyTicketCard';
import RaiseTicketModal from './RaiseTicketModal';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
];

export default function MyTicketsList({ role }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [dismissedBannerId, setDismissedBannerId] = useState('');
  const { notifications, markRead } = useModerationNotifications();

  const {
    tickets,
    total,
    page,
    totalPages,
    activeTab,
    loading,
    error,
    setActiveTab,
    setPage,
    refresh,
  } = useMyTickets();

  const unreadTicketResponseNotifications = useMemo(
    () =>
      notifications.filter(
        (n) =>
          !n?.isRead &&
          n?.type === 'report_update' &&
          n?.metadata?.event === 'ticket_responded' &&
          n?._id !== dismissedBannerId
      ),
    [notifications, dismissedBannerId]
  );

  const topBannerNotification = unreadTicketResponseNotifications[0] || null;

  const unreadTicketIds = useMemo(() => {
    const map = new Set();
    unreadTicketResponseNotifications.forEach((notification) => {
      if (notification?.metadata?.ticketId) {
        map.add(notification.metadata.ticketId);
      }
    });
    return map;
  }, [unreadTicketResponseNotifications]);

  const detailRoute = (ticketId) => (role === 'creator' ? `/creator/support/${ticketId}` : `/user/support/${ticketId}`);

  const onViewResponseFromBanner = async () => {
    const notification = topBannerNotification;
    if (!notification) return;

    if (notification?._id) {
      await markRead(notification._id);
    }

    const ticketId = notification?.metadata?.ticketId;
    if (ticketId) {
      router.push(detailRoute(ticketId));
    }
  };

  return (
    <div className="w-full">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Support</h1>
          <p className="mt-1 text-sm text-slate-600">Your submitted tickets and their status.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          <MessageSquarePlus className="h-4 w-4" /> Raise a Ticket
        </button>
      </div>

      <TicketUpdateBanner
        notification={topBannerNotification}
        onDismiss={() => setDismissedBannerId(topBannerNotification?._id || '')}
        onViewResponse={onViewResponseFromBanner}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                active ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? <p className="text-sm text-slate-500">Loading tickets...</p> : null}
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

      {!loading && tickets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <p className="text-sm text-slate-600">No tickets yet. Raise one if you need help.</p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Raise a Ticket
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <MyTicketCard
              key={ticket._id}
              role={role}
              ticket={ticket}
              hasNewResponse={Boolean(ticket.adminResponse) && unreadTicketIds.has(ticket.ticketId)}
              onOpenTicket={async () => {
                const notification = unreadTicketResponseNotifications.find((n) => n?.metadata?.ticketId === ticket.ticketId);
                if (notification?._id) {
                  await markRead(notification._id);
                }
              }}
            />
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
        <span>Total: {total}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40"
          >
            ←
          </button>
          <span>{page} / {totalPages}</span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40"
          >
            →
          </button>
        </div>
      </div>

      <RaiseTicketModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitted={refresh}
      />
    </div>
  );
}

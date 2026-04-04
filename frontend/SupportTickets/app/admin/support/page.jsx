"use client";

import { useMemo } from 'react';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useTickets } from '../../../hooks/useTickets';
import { useTicketStats } from '../../../hooks/useTicketStats';
import { useTicketActions } from '../../../hooks/useTicketActions';
import SupportStatsBar from '../../../components/SupportStatsBar';
import TicketTabs from '../../../components/TicketTabs';
import TicketTable from '../../../components/TicketTable';
import TicketDetailDrawer from '../../../components/TicketDetailDrawer';

export default function SupportDashboardPageModule() {
  const user = useAuthStore((s) => s.user);

  const tickets = useTickets();
  const stats = useTicketStats();
  const actions = useTicketActions({ refreshTickets: tickets.refresh, refreshStats: stats.refresh });

  const initials = useMemo(() => {
    const name = user?.name || 'Admin';
    const p = name.split(/\s+/).filter(Boolean);
    return p.length > 1 ? `${p[0][0]}${p[p.length - 1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
  }, [user?.name]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Welcome, {user?.name || 'Admin'}</h2>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">{initials}</div>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Support</h1>
        <p className="mt-1 text-sm text-slate-600">Review flagged content and take action to keep the community safe.</p>
      </div>

      <div className="space-y-5">
        <SupportStatsBar stats={stats.stats} />

        <TicketTabs activeTab={tickets.activeTab} onChange={tickets.setActiveTab} />

        {tickets.error ? <p className="text-sm text-red-600">{tickets.error}</p> : null}

        <TicketTable
          tickets={tickets.tickets}
          loading={tickets.loading || stats.loading || actions.loading}
          activeTab={tickets.activeTab}
          page={tickets.page}
          totalPages={tickets.totalPages}
          setPage={tickets.setPage}
          adminRole={tickets.adminRole}
          onView={actions.viewTicket}
          onAssign={(ticketId) => actions.viewTicket(ticketId)}
          onResolve={(ticketId) => actions.resolveTicket(ticketId)}
          onEscalate={(ticketId) => actions.escalateTicket(ticketId, 'moderator')}
        />
      </div>

      <TicketDetailDrawer
        open={actions.drawerOpen}
        ticket={actions.selectedTicket}
        adminRole={tickets.adminRole}
        onClose={() => actions.setDrawerOpen(false)}
        onAssign={actions.assignTicket}
        onDismiss={actions.dismissTicket}
        onResolve={actions.resolveTicket}
        onEscalate={actions.escalateTicket}
      />
    </div>
  );
}

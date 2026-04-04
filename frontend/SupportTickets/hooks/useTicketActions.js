"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/src/lib/api';

/**
 * Ticket action handlers.
 */
export function useTicketActions({ refreshTickets, refreshStats }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  const syncAll = async () => {
    await Promise.all([refreshTickets(), refreshStats()]);
  };

  const viewTicket = async (ticketId) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/support/tickets/${ticketId}`);
      setSelectedTicket(data);
      setDrawerOpen(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  const assignTicket = async (ticketId, adminId) => {
    try {
      setLoading(true);
      await api.patch(`/support/tickets/${ticketId}/assign`, { assignToAdminId: adminId });
      await syncAll();
      if (selectedTicket?.ticketId === ticketId) {
        await viewTicket(ticketId);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to assign ticket');
    } finally {
      setLoading(false);
    }
  };

  const resolveTicket = async (ticketId, resolutionNote = '') => {
    try {
      setLoading(true);
      await api.patch(`/support/tickets/${ticketId}/status`, { status: 'resolved', resolutionNote });
      setDrawerOpen(false);
      await syncAll();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to resolve ticket');
    } finally {
      setLoading(false);
    }
  };

  const dismissTicket = async (ticketId) => {
    try {
      setLoading(true);
      await api.patch(`/support/tickets/${ticketId}/status`, { status: 'dismissed' });
      setDrawerOpen(false);
      await syncAll();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to dismiss ticket');
    } finally {
      setLoading(false);
    }
  };

  const escalateTicket = async (ticketId, escalateTo) => {
    try {
      setLoading(true);
      await api.patch(`/support/tickets/${ticketId}/escalate`, { escalateTo });
      await syncAll();
      if (selectedTicket?.ticketId === ticketId) {
        await viewTicket(ticketId);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to escalate ticket');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    drawerOpen,
    setDrawerOpen,
    selectedTicket,
    setSelectedTicket,
    viewTicket,
    assignTicket,
    resolveTicket,
    dismissTicket,
    escalateTicket,
  };
}

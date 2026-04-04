"use client";

import { useCallback, useEffect, useState } from 'react';
import api from '@/src/lib/api';

/**
 * Ticket list hook by tab/pagination.
 */
export function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTabState] = useState('open');
  const [adminRole, setAdminRole] = useState('support');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/support/tickets', {
        params: { status: activeTab, page, limit: 10 },
      });
      setTickets(data?.tickets || []);
      setTotal(data?.total || 0);
      setTotalPages(data?.totalPages || 1);
      setAdminRole(data?.adminRole || 'support');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  }, [activeTab, page]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const setActiveTab = (tab) => {
    setPage(1);
    setActiveTabState(tab);
  };

  const refresh = () => fetchTickets();

  return {
    tickets,
    total,
    page,
    totalPages,
    activeTab,
    adminRole,
    loading,
    error,
    setActiveTab,
    setPage,
    refresh,
  };
}

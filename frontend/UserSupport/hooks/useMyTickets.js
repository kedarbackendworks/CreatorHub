"use client";

import { useCallback, useEffect, useState } from 'react';
import api from '@/src/lib/api';

const TAB_TO_STATUS = {
  all: undefined,
  open: 'open',
  in_progress: 'in_progress',
  resolved: 'resolved',
};

export function useMyTickets() {
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTabState] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        limit: 10,
      };

      const status = TAB_TO_STATUS[activeTab];
      if (status) {
        params.status = status;
      }

      const { data } = await api.get('/support/user/tickets', { params });
      setTickets(Array.isArray(data?.tickets) ? data.tickets : []);
      setTotal(data?.total || 0);
      setPage(data?.page || page);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch your tickets.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, page]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const setActiveTab = (status) => {
    setActiveTabState(status);
    setPage(1);
  };

  const refresh = () => fetchTickets();

  return {
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
  };
}

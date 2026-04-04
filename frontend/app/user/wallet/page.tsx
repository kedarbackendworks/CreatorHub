"use client";

import React, { useMemo } from 'react';
import DashboardSidebar from '@/src/components/UserDashboard/DashboardSidebar';
import BalanceCard from '@/src/components/UserDashboard/Wallet/BalanceCard';
import TransactionList from '@/src/components/UserDashboard/Wallet/TransactionList';
import type { Transaction } from '@/src/components/UserDashboard/Wallet/TransactionItem';
import { useWallet } from '@/UserWallet';

type WalletTransaction = {
  _id?: string;
  amount?: number;
  type?: 'credit' | 'debit';
  referenceId?: string;
  createdAt?: string;
};

export default function WalletPage() {
  const { balance, transactions, error } = useWallet();

  const mappedTransactions = useMemo<Transaction[]>(() => {
    if (!transactions?.length) return [];

    return (transactions as WalletTransaction[]).map((tx, idx: number) => {
      const createdAt = tx?.createdAt ? new Date(tx.createdAt) : new Date(0);
      const type = tx?.type === 'credit' ? 'credit' : 'purchase';
      const referenceId = tx?.referenceId ? ` #${tx.referenceId}` : '';

      return {
        id: String(tx?._id || `${createdAt.getTime()}-${idx}`),
        title:
          type === 'credit'
            ? `Credits added to wallet${referenceId}`
            : `Unlocked premium content${referenceId}`,
        date: createdAt.toLocaleDateString('en-GB', {
          timeZone: 'UTC',
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        time: createdAt.toLocaleTimeString('en-US', {
          timeZone: 'UTC',
          hour: 'numeric',
          minute: '2-digit'
        }).toLowerCase(),
        amount: Number(tx?.amount || 0),
        image: '/assets/wallet/event-thumb.png',
        type: type as 'purchase' | 'credit' | 'refund'
      };
    });
  }, [transactions]);

  return (
    <div className="min-h-screen bg-[var(--bg,#f6f4f1)] flex relative overflow-x-hidden">
      <DashboardSidebar />
      
      {/* Main Content Area - Padded left to account for sidebar */}
      <main className="flex-1 md:ml-[240px] px-4 sm:px-6 md:pl-[42px] md:pr-[42px] pt-20 md:pt-[42px] pb-[60px] flex flex-col items-start min-h-screen">
        
        {/* Header Area */}
        <div className="flex flex-col gap-[4px] mb-[42px] mt-1 relative">
          <h1 className="font-[family-name:var(--font-fjalla)] font-normal text-[40px] text-[var(--heading,#1a1a1a)] tracking-[0.8px] leading-[57.6px]">
            My wallet
          </h1>
          <p className="font-[family-name:var(--font-fjalla)] font-normal text-[33px] text-[var(--sub-head,#3a3a3a)] tracking-[0.66px] leading-[48.6px]">
            Add, use, and track your credits for quick and seamless purchases.
          </p>
        </div>

        {error ? (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <BalanceCard balance={balance} />

        <TransactionList transactions={mappedTransactions} />

      </main>
    </div>
  );
}


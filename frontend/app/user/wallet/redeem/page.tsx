import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import DashboardSidebar from '@/src/components/UserDashboard/DashboardSidebar';
import RedeemCodeForm from '@/src/components/UserDashboard/Wallet/RedeemCodeForm';

export default function RedeemCodePage() {
  return (
    <div className="min-h-screen bg-[var(--bg,#f6f4f1)] flex relative overflow-x-hidden">
      <DashboardSidebar />
      
      {/* Main Content Area - Padded left to account for sidebar */}
      <main className="flex-1 md:ml-[240px] px-4 sm:px-6 md:pl-[42px] md:pr-[42px] pt-20 md:pt-[42px] pb-[60px] flex flex-col items-start min-h-screen relative">
        
        {/* Back Button positioned absolute top-left to match Figma */}
        <div className="absolute top-[42px] left-[42px]">
          <Link href="/user/wallet" className="flex items-center gap-[4px] px-[8px] py-[4px] border border-[var(--input-field-border,#d8d1c7)] rounded-[36px] bg-[var(--bg-2,#faf8f5)] hover:bg-[#f0f0f0] transition-colors">
            <ChevronLeft className="size-[20px] text-[var(--heading,#1a1a1a)]" />
            <span className="font-[family-name:var(--font-figtree)] font-medium text-[16px] leading-[25.8px] tracking-[0.32px] text-[var(--heading,#1a1a1a)] pr-2">
              Back
            </span>
          </Link>
        </div>

        {/* Form Area - Aligned left */}
        <div className="w-full flex justify-start mt-[76px] mb-[42px]">
          <RedeemCodeForm />
        </div>

      </main>
    </div>
  );
}


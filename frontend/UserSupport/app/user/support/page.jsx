"use client";

import DashboardSidebar from '@/src/components/UserDashboard/DashboardSidebar';
import MyTicketsList from '../../../components/MyTicketsList';

export default function UserSupportPageModule() {
  return (
    <div className="min-h-screen bg-[var(--bg,#f6f4f1)] flex">
      <DashboardSidebar />
      <main className="flex-1 md:ml-[240px] pt-20 md:pt-0 min-h-screen overflow-y-auto px-4 md:px-[42px] py-6">
        <div className="mx-auto w-full max-w-[1116px]">
          <MyTicketsList role="user" />
        </div>
      </main>
    </div>
  );
}

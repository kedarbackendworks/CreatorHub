'use client';

import React, { useState } from 'react';
import DashboardSidebar from '@/src/components/UserDashboard/DashboardSidebar';
import DashboardHeader from '@/src/components/UserDashboard/DashboardHeader';
import CategoryPills from '@/src/components/UserDashboard/CategoryPills';
import CreatorFeed from '@/src/components/UserDashboard/CreatorFeed';

export default function UserDashboard() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="min-h-screen bg-[var(--bg,#f6f4f1)] flex relative overflow-x-hidden">
      <DashboardSidebar />
      
      {/* Main Content Area - Padded left to account for sidebar */}
      <main className="flex-1 md:ml-[240px] px-3 sm:px-6 md:pl-[42px] md:pr-[42px] pt-20 md:pt-0 flex flex-col items-start">
        <div className="w-full max-w-[1116px] flex flex-col items-start min-h-screen">
          <DashboardHeader />
          <CategoryPills activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
          <CreatorFeed activeCategory={activeCategory} />
        </div>
      </main>
    </div>
  );
}


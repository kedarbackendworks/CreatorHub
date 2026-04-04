"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import SettingsModal from './SettingsModal';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useNotifications } from '@/src/hooks/useNotifications';
import SupportNavItem from '@/UserSupport/components/SupportNavItem';

const NAV_ITEMS = [
  { label: 'Home', icon: '/assets/dashboard/icon-home.svg', href: '/user' },
  { label: 'Notifications', icon: '/assets/dashboard/icon-notification.svg', href: '/user/notifications' },
  { label: 'My library', icon: '/assets/dashboard/icon-heart.svg', href: '/user/library' },
  { label: 'Messages', icon: '/assets/dashboard/icon-chat.svg', href: '/user/messages' },
  { label: 'My wallet', icon: '/assets/dashboard/icon-chat.svg', href: '/user/wallet' },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const unreadCount = useAuthStore((state) => state.unreadCount);

  useNotifications('user');

  const handleNavigate = () => setIsMobileOpen(false);

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <Link
        href="/user"
        onClick={mobile ? handleNavigate : undefined}
        className="flex items-center gap-[12px] px-[24px] py-[24px] w-full shrink-0"
      >
        <div className="relative size-[24px] shrink-0">
          <Image src="/assets/dashboard/icon-logo.svg" alt="Logo" fill />
        </div>
        <p className="font-['Inter:Medium',sans-serif] font-medium text-[#f95c4b] text-[16px] whitespace-nowrap">
          Logo
        </p>
      </Link>

      <nav className="flex flex-col w-full flex-1 mt-4 gap-1">
        {NAV_ITEMS.map((item, index) => {
          const isActive = pathname === item.href;
          const isNotificationsItem = item.label === 'Notifications';
          const showBadge = isNotificationsItem && unreadCount > 0;
          return (
            <Link
              href={item.href}
              key={index}
              onClick={mobile ? handleNavigate : undefined}
              className={`flex items-center gap-[12px] h-[56px] px-[24px] py-[8px] w-full transition-colors cursor-pointer hover:bg-[#f6f4f1] ${
                isActive ? 'border-r-4 border-[#f95c4b] bg-white' : 'border-r-4 border-transparent'
              }`}
            >
              <div className="relative size-[24px] shrink-0">
                <Image src={item.icon} alt={item.label} fill className={isActive ? 'opacity-100' : 'opacity-80'} />
                {showBadge && (
                  <span className="absolute top-0 right-0 bg-[#f95c4b] text-white rounded-full text-[10px] min-w-[16px] h-[16px] flex items-center justify-center leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <p className={`font-[family-name:var(--font-figtree)] font-medium leading-[25.8px] text-[16px] tracking-[0.32px] whitespace-nowrap ${isActive ? 'text-[#3a3a3a]' : 'text-[#5a5a5a]'}`}>
                {item.label}
              </p>
            </Link>
          );
        })}

        <SupportNavItem
          role="user"
          className={`flex items-center gap-[12px] h-[56px] px-[24px] py-[8px] w-full transition-colors cursor-pointer hover:bg-[#f6f4f1] ${
            pathname === '/user/support' || pathname.startsWith('/user/support/')
              ? 'border-r-4 border-[#f95c4b] bg-white'
              : 'border-r-4 border-transparent'
          }`}
          iconClassName="w-[20px] h-[20px] text-[#5a5a5a]"
          labelClassName={`font-[family-name:var(--font-figtree)] font-medium leading-[25.8px] text-[16px] tracking-[0.32px] whitespace-nowrap ${
            pathname === '/user/support' || pathname.startsWith('/user/support/') ? 'text-[#3a3a3a]' : 'text-[#5a5a5a]'
          }`}
        />
      </nav>

      <div className="relative flex flex-col items-start justify-end w-full shrink-0">
        {isSettingsOpen && (
          <SettingsModal onClose={() => setIsSettingsOpen(false)} />
        )}

        <div className="flex items-center gap-[12px] px-[24px] py-[24px] w-full cursor-pointer hover:bg-[#f6f4f1] transition-colors">
          <div className="flex items-center gap-[12px] flex-1">
            <div className="bg-[#9a9a9a] rounded-[32px] size-[32px] flex flex-col items-center justify-center shrink-0">
              <span className="font-[family-name:var(--font-figtree)] font-medium text-[13px] text-white tracking-[0.26px]">
                K
              </span>
            </div>
            <p className="font-[family-name:var(--font-figtree)] font-medium leading-[25.8px] text-[#606060] text-[16px] tracking-[0.32px] whitespace-nowrap">
              Profile
            </p>
          </div>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="relative w-[15px] h-[15px] shrink-0 flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <Image src="/assets/dashboard/icon-other.svg" alt="Options" fill className="object-contain" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#faf8f5] border-b border-[#e4ded2] z-40 px-4 flex items-center justify-between">
        <Link href="/user" className="flex items-center gap-2.5">
          <div className="relative size-5 shrink-0">
            <Image src="/assets/dashboard/icon-logo.svg" alt="Logo" fill />
          </div>
          <p className="font-[family-name:var(--font-figtree)] font-semibold text-[#f95c4b] text-[15px]">
            Logo
          </p>
        </Link>
        <button
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="w-9 h-9 rounded-full border border-[#e4ded2] bg-white text-[#5a5a5a] flex items-center justify-center"
          aria-label="Toggle navigation"
        >
          {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {isMobileOpen && (
        <button
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          aria-label="Close navigation"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`md:hidden fixed left-0 top-0 h-screen w-[240px] bg-[#faf8f5] flex flex-col z-50 overflow-hidden shrink-0 transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent mobile />
      </aside>

      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[240px] bg-[#faf8f5] flex-col z-30 overflow-hidden shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}

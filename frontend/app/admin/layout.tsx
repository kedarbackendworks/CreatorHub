"use client"

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Home, Shield, DollarSign, LayoutGrid, Settings, Search, FileText, UserPlus, HelpCircle, Brush, BarChart3, Monitor, Menu, X, ClipboardList, Scale } from 'lucide-react';
import api from '@/src/lib/api';
import { useAuthStore } from '@/src/store/useAuthStore';
import BrandLogo from '@/src/components/BrandLogo';

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const logout = useAuthStore((state) => state.logout);
  const [authResolved, setAuthResolved] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [moderationCounts, setModerationCounts] = useState({ reportsPending: 0, appealsPending: 0 });

  const redirectToLogin = useMemo(() => {
    const nextPath = encodeURIComponent(pathname || '/admin');
    return `/login?next=${nextPath}`;
  }, [pathname]);

  useEffect(() => {
    let active = true;

    const verifyAdminAccess = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
          router.replace(redirectToLogin);
          return;
        }

        if (user?.role === 'admin') {
          if (active) setAuthResolved(true);
          return;
        }

        const { data } = await api.get('/auth/profile');
        if (data?.role === 'admin') {
          updateUser({
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
            avatar: data.avatar,
            countryOfResidence: data.countryOfResidence,
            token,
          });
          if (active) setAuthResolved(true);
          return;
        }

        logout();
      } catch {
        logout();
      }
    };

    verifyAdminAccess();
    return () => {
      active = false;
    };
  }, [logout, redirectToLogin, router, updateUser, user?.role]);

  useEffect(() => {
    if (!authResolved) return;
    api.patch('/admin-management/me/last-active').catch(() => {});
  }, [authResolved, pathname]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!authResolved) return;

    let cancelled = false;

    const loadModerationCounts = async () => {
      try {
        const [reportsRes, appealsRes] = await Promise.all([
          api.get('/admin/reports', { params: { status: 'pending', page: 1, limit: 1 } }),
          api.get('/admin/appeals', { params: { status: 'pending', page: 1, limit: 1 } }),
        ]);

        if (cancelled) return;

        setModerationCounts({
          reportsPending: Number(reportsRes?.data?.pagination?.total || 0),
          appealsPending: Number(appealsRes?.data?.pagination?.total || 0),
        });
      } catch {
        if (!cancelled) {
          setModerationCounts({ reportsPending: 0, appealsPending: 0 });
        }
      }
    };

    loadModerationCounts();

    return () => {
      cancelled = true;
    };
  }, [authResolved, pathname]);

  if (!authResolved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] text-slate-600">
        <p className="text-sm font-semibold">Checking admin access...</p>
      </div>
    );
  }

  const isActive = (path: string) => {
    return pathname === path 
      ? "flex items-center gap-3 px-3 py-2 bg-slate-200/60 rounded-lg text-sm font-semibold text-slate-800"
      : "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors";
  };

  const mainLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/creators', label: 'Creators', icon: Brush },
    { href: '/admin/creator-analytics', label: 'Creator Analytics', icon: FileText },
    { href: '/admin/moderation', label: 'Moderation', icon: Shield },
    { href: '/admin/sample-moderation', label: 'Sample Moderation', icon: BarChart3 },
    { href: '/admin/revenue', label: 'Revenue', icon: DollarSign },
    { href: '/admin/platform', label: 'Platform', icon: LayoutGrid },
    { href: '/admin/management', label: 'Admin Management', icon: Monitor },
    { href: '/admin/support', label: 'Support', icon: HelpCircle },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const quickAccessLinks = [
    { href: '/admin/moderation', label: 'Content Moderation', icon: FileText },
    { href: '/admin/users', label: 'User Management', icon: UserPlus },
    { href: '/admin/support', label: 'Support Tickets', icon: HelpCircle },
  ];

  const moderationLinks = [
    {
      href: '/admin/reports',
      label: 'Reports',
      icon: ClipboardList,
      count: moderationCounts.reportsPending,
    },
    {
      href: '/admin/appeals',
      label: 'Appeals',
      icon: Scale,
      count: moderationCounts.appealsPending,
    },
  ];

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between gap-2 mb-6 px-2">
        <div className="flex items-center gap-2">
          <BrandLogo
            iconSize={24}
            showTrademark
            textClassName="text-xl font-bold tracking-tight text-slate-800"
            trademarkClassName="text-xs align-top"
          />
        </div>
        <button
          type="button"
          onClick={() => setMobileNavOpen(false)}
          className="md:hidden inline-flex items-center justify-center rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
          />
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {mainLinks.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={isActive(href)}>
            <Icon className="w-4 h-4" /> {label}
          </Link>
        ))}

        <div className="pt-6 pb-2">
          <h3 className="px-3 text-xs font-bold text-slate-800 uppercase tracking-wider">Moderation</h3>
        </div>

        {moderationLinks.map(({ href, label, icon: Icon, count }) => (
          <Link
            key={href}
            href={href}
            className={`${isActive(href)} justify-between`}
          >
            <span className="flex items-center gap-3">
              <Icon className="w-4 h-4" /> {label}
            </span>
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 rounded-full bg-red-100 text-red-700 text-[11px] font-bold px-1.5">
              {count > 99 ? '99+' : count}
            </span>
          </Link>
        ))}

        <div className="pt-6 pb-2">
          <h3 className="px-3 text-xs font-bold text-slate-800 uppercase tracking-wider">Quick Access</h3>
        </div>

        {quickAccessLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={`${href}-${label}`}
            href={href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <Icon className="w-4 h-4" /> {label}
          </Link>
        ))}
      </nav>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] text-slate-800 font-sans">
      <aside className="hidden md:flex md:w-64 bg-[#f8f9fa] flex-col pt-6 pb-6 px-4 h-screen sticky top-0 border-r border-slate-200">
        {sidebarContent}
      </aside>

      <div
        className={`fixed inset-0 z-30 bg-slate-900/40 transition-opacity md:hidden ${mobileNavOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setMobileNavOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 max-w-[85vw] bg-[#f8f9fa] border-r border-slate-200 flex flex-col pt-6 pb-6 px-4 transition-transform duration-200 md:hidden ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-14 md:h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-6 md:px-8 sticky top-0 z-20 w-full">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden inline-flex items-center justify-center rounded-md p-1.5 text-slate-600 hover:bg-slate-100"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-base sm:text-lg font-semibold text-slate-800 truncate">Welcome, James</h2>
          </div>
          <div className="flex items-center shrink-0">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 cursor-pointer">
              AN <span className="ml-1 text-[8px]">▼</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}

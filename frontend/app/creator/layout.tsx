"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Shield, DollarSign, LayoutGrid, MessageSquare, Settings, Search, FileText, UserPlus, HelpCircle } from 'lucide-react';

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path 
      ? "flex items-center gap-3 px-3 py-2 bg-slate-200/60 rounded-lg text-sm font-semibold text-slate-800"
      : "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors";
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] text-slate-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#f8f9fa] flex flex-col pt-6 pb-6 px-4 h-screen sticky top-0 border-r border-slate-200">
        <div className="flex items-center gap-2 mb-6 px-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#1e293b"/>
            <path d="M8 12L12 8L16 12L12 16L8 12Z" fill="white"/>
          </svg>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">logoipsum<span className="text-xs align-top">®</span></h1>
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

        <nav className="flex-1 space-y-1">
          <Link href="/creator/dashboard" className={isActive('/creator/dashboard')}>
            <Home className="w-4 h-4" /> Dashboard
          </Link>
          <Link href="/creator/users" className={isActive('/creator/users')}>
            <Users className="w-4 h-4" /> Users
          </Link>
          <Link href="/creator/moderation" className={isActive('/creator/moderation')}>
            <Shield className="w-4 h-4" /> Moderation
          </Link>
          <Link href="/creator/financial" className={isActive('/creator/financial')}>
            <DollarSign className="w-4 h-4" /> Financial
          </Link>
          <Link href="/creator/platform" className={isActive('/creator/platform')}>
            <LayoutGrid className="w-4 h-4" /> Platform
          </Link>
          <Link href="/creator/support" className={isActive('/creator/support')}>
            <MessageSquare className="w-4 h-4" /> Support
          </Link>
          <Link href="/creator/settings" className={isActive('/creator/settings')}>
            <Settings className="w-4 h-4" /> Settings
          </Link>

          <div className="pt-6 pb-2">
            <h3 className="px-3 text-xs font-bold text-slate-800 uppercase tracking-wider">Quick Access</h3>
          </div>
          <Link href="/creator/moderation" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
            <FileText className="w-4 h-4" /> Content Moderation
          </Link>
          <Link href="/creator/users" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
            <UserPlus className="w-4 h-4" /> User Management
          </Link>
          <Link href="/creator/support" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
            <HelpCircle className="w-4 h-4" /> Support Tickets
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 sticky top-0 z-10 w-full">
          <h2 className="text-lg font-semibold text-slate-800">Welcome , James</h2>
          <div className="flex items-center">
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
